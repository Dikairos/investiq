import { getCompanyByTicker } from "@/data/companies";
import { generateOpenAIText } from "@/lib/openai";

const maxMessages = 12;
const maxMessageLength = 2000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    value.content.trim().length > 0 &&
    value.content.length <= maxMessageLength
  );
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

  if (
    !isRecord(body) ||
    typeof body.ticker !== "string" ||
    !Array.isArray(body.messages)
  ) {
    return jsonResponse(
      { error: "A company ticker and conversation are required." },
      400,
    );
  }

  const ticker = body.ticker.trim();
  if (!ticker || ticker.length > 16) {
    return jsonResponse({ error: "A valid company ticker is required." }, 400);
  }

  const company = getCompanyByTicker(ticker);
  if (!company) {
    return jsonResponse(
      { error: "We don't have a profile for that company ticker." },
      404,
    );
  }

  const messages = body.messages.filter(isChatMessage);
  if (
    body.messages.length === 0 ||
    body.messages.length > maxMessages ||
    messages.length !== body.messages.length
  ) {
    return jsonResponse(
      {
        error: `Send between 1 and ${maxMessages} non-empty messages, each under ${maxMessageLength} characters.`,
      },
      400,
    );
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return jsonResponse(
      { error: "The latest conversation message must be from you." },
      400,
    );
  }

  const companyContext = {
    name: company.name,
    ticker: company.ticker,
    industry: company.industry,
    sector: company.sector,
    description: company.description,
    whatItDoes: company.whatItDoes,
    productsAndServices: company.productsAndServices,
    businessModel: company.businessModel,
    headquarters: company.headquarters,
    financials: company.financials,
    potentialStrengths: company.strengths,
    potentialRisks: company.risks,
    observations: company.observations,
    dataNotice:
      "All financial figures and historical values above are illustrative mock data, not verified company results or live market data.",
  };

  const systemPrompt = `You are InvestIQ, a clear and careful financial education assistant for beginner investors.

The user is asking about ${company.name} (${company.ticker}). Keep this company as the context for follow-up questions unless the user explicitly changes topic.

Use only the company information provided below. The financial figures are illustrative mock data and must never be described as real, current, reported, or verified. Do not invent, estimate, or infer missing financial figures. If a requested fact is not in the context, say it is unavailable in the provided information. You do not have live market data or external research.

Explain financial terminology in plain language. Distinguish information from the supplied company context from your general interpretation. When discussing metrics, use brief labels such as "Provided context" and "Interpretation". Do not give personalized investment advice or tell the user to buy or sell. For investment-oriented questions, include a brief reminder that the response is educational, not investment advice. Use concise headings and bullets when helpful; do not use Markdown tables.

Company context (catalog data):
${JSON.stringify(companyContext)}`;

  const result = await generateOpenAIText({
    systemPrompt,
    messages,
    maxOutputTokens: 900,
  });
  if (!result.ok) return jsonResponse({ error: result.error }, result.status);

  return jsonResponse({ answer: result.answer });
}
