import { getCompanyByTicker } from "@/data/companies";
import { generateOpenAIText } from "@/lib/openai";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function jsonResponse(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  if (!isRecord(body) || !Array.isArray(body.tickers)) {
    return jsonResponse(
      { error: "Select between 2 and 4 companies to compare." },
      400,
    );
  }

  const rawTickers = body.tickers.filter(
    (ticker): ticker is string => typeof ticker === "string",
  );
  if (
    rawTickers.length !== body.tickers.length ||
    rawTickers.length < 2 ||
    rawTickers.length > 4
  ) {
    return jsonResponse(
      { error: "Select between 2 and 4 valid company tickers." },
      400,
    );
  }

  const tickers = rawTickers.map((ticker) => ticker.trim().toUpperCase());
  if (
    tickers.some((ticker) => !ticker || ticker.length > 16) ||
    new Set(tickers).size !== tickers.length
  ) {
    return jsonResponse(
      { error: "Company tickers must be valid and unique." },
      400,
    );
  }

  const selectedCompanies = tickers.map(getCompanyByTicker);
  if (selectedCompanies.some((company) => !company)) {
    return jsonResponse(
      { error: "One or more selected companies were not found." },
      404,
    );
  }

  const companyContext = selectedCompanies
    .filter((company) => company !== undefined)
    .map((company) => ({
      name: company.name,
      ticker: company.ticker,
      industry: company.industry,
      sector: company.sector,
      headquarters: company.headquarters,
      businessModel: company.businessModel,
      financials: company.financials,
      potentialStrengths: company.strengths,
      potentialRisks: company.risks,
      observations: company.observations,
    }));

  const systemPrompt = `You are InvestIQ, a careful financial research educator for beginner investors.

Compare only the companies and information in the supplied catalog. All financial figures are illustrative mock values, not reported or verified results. The profile metrics have no specified reporting period. Historical revenue and net income have year labels, but those values are also mock data. Never present any of these values as actual company performance.

Do not replace null or missing values with zero, calculate ratios that require missing inputs, or imply that unavailable metrics are equal. Explicitly identify missing information and any period or currency comparability limitations. Compare financial figures only when their currency, unit, metric, and period are compatible. Explain the P/E ratio in plain language if useful, and do not treat it alone as evidence that a company is cheap or expensive.

The catalog's generic cashFlow value is not labeled as operating cash flow; do not present it as operating cash flow. Gross profit, operating profit, profitability margins, returns, shareholders' equity, and operating cash flow are unavailable in the current data.

Separate facts supplied by the catalog from your interpretation. You may discuss the catalog's potential strengths and risks as qualitative context, but do not make unsupported conclusions, rank companies as investments, or give personalized buy/sell advice. Include a short educational disclaimer. Use concise headings and bullets, not Markdown tables.

Comparison data:
${JSON.stringify(companyContext)}`;

  const result = await generateOpenAIText({
    systemPrompt,
    messages: [
      {
        role: "user",
        content:
          "Compare the selected companies' available financial performance, valuation, profitability, and financial health. Explain important ratios, point out differences, missing data, incomparable figures, possible strengths and risks, and avoid investment recommendations.",
      },
    ],
    maxOutputTokens: 1200,
  });

  if (!result.ok) {
    return jsonResponse({ error: result.error }, result.status);
  }

  return jsonResponse({ insights: result.answer });
}
