import type { Company } from "@/data/companies";

const demoNotice =
  "These examples use illustrative InvestIQ catalog data, not verified results or live market information.";

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function createDemoAssistantResponse(
  company: Company,
  question: string,
) {
  const prompt = question.toLowerCase();
  const { financials } = company;

  if (/risk|challenge|threat|concern/.test(prompt)) {
    return `Potential risks to consider for ${company.name}:\n${list(company.risks)}\n\n${demoNotice}`;
  }

  if (/what does|what is|business|product|service|company do/.test(prompt)) {
    return `${company.name} (${company.ticker}) operates in ${company.industry}. ${company.whatItDoes}\n\nProducts and services include ${company.productsAndServices.join(", ")}. ${company.businessModel}\n\n${demoNotice}`;
  }

  if (/revenue|growth|performance/.test(prompt)) {
    const history = financials.historicalRevenue
      .slice(-3)
      .map(({ year, revenue }) => `${year}: ₦${revenue}bn`)
      .join("; ");
    return `${company.name}'s sample profile lists revenue of ${financials.revenue} and revenue growth of ${financials.revenueGrowth}. Its illustrative historical series includes ${history}. The reporting period for the profile growth figure is not specified, so treat it as a UI example rather than a verified trend.\n\n${demoNotice}`;
  }

  if (/profit|income|profitable|margin/.test(prompt)) {
    return `The sample profile lists net income of ${financials.netIncome} and revenue of ${financials.revenue}. Net income is the amount left after a company's expenses and other costs are accounted for. Profitability margins are not available in this demo dataset, so I cannot compare profit to revenue here.\n\n${demoNotice}`;
  }

  if (/p\/?e|valuation|cheap|expensive/.test(prompt)) {
    return `${company.name}'s illustrative profile lists a P/E ratio of ${financials.peRatio}. A P/E ratio compares a share price with earnings per share; it is only one measure and cannot establish whether a company is cheap or expensive by itself. The sample profile does not specify a reporting period.\n\n${demoNotice}`;
  }

  if (/cash flow|cashflow|debt|liabilit|asset|financial health/.test(prompt)) {
    return `The illustrative profile lists total assets of ${financials.totalAssets}, liabilities of ${financials.liabilities}, debt of ${financials.debt}, and cash flow of ${financials.cashFlow}. The cash-flow figure is not labeled by activity type, and some balance-sheet details are unavailable. Do not treat these examples as verified financial statements.\n\n${demoNotice}`;
  }

  return `I can help explain ${company.name}'s business, sample financial performance, valuation terminology, or potential risks. Try one of the suggested questions to explore this demo profile.\n\n${demoNotice}`;
}

export function createDemoComparisonResponse(companies: Company[]) {
  const companyLines = companies.map(
    ({ name, ticker, financials }) =>
      `- ${name} (${ticker}): sample revenue ${financials.revenue}, net income ${financials.netIncome}, P/E ${financials.peRatio}.`,
  );
  const missingMetrics = [
    "gross profit",
    "profitability margins",
    "return on assets",
    "return on equity",
    "shareholders' equity",
    "operating cash flow",
  ];

  return [
    "Simulated demo insights — generated locally, not by a live AI model.",
    "",
    "Available illustrative catalog values:",
    ...companyLines,
    "",
    `The current dataset does not provide ${missingMetrics.join(", ")} for comparison. Profile metrics also have no reporting period, so treat them as display examples rather than comparable financial results.`,
    "",
    demoNotice,
  ].join("\n");
}
