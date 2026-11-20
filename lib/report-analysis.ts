export interface ReportField {
  value: string | null;
  source: string | null;
  interpretation: string | null;
}

export interface ReportInsight {
  text: string;
  source: string | null;
}

export interface ReportAnalysis {
  companyName: ReportField;
  reportingPeriod: ReportField;
  reportingCurrency: ReportField;
  executiveSummary: ReportInsight[];
  keyFinancialMetrics: {
    revenue: ReportField;
    netIncome: ReportField;
    operatingExpenses: ReportField;
    totalAssets: ReportField;
    totalLiabilities: ReportField;
    shareholdersEquity: ReportField;
    cashFlow: ReportField;
    debt: ReportField;
  };
  revenueAndProfitability: ReportInsight[];
  financialPosition: ReportInsight[];
  cashFlowAnalysis: ReportInsight[];
  potentialRisks: ReportInsight[];
  importantObservations: ReportInsight[];
}

const reportFieldSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: ["string", "null"] },
    source: { type: ["string", "null"] },
    interpretation: { type: ["string", "null"] },
  },
  required: ["value", "source", "interpretation"],
};

const insightSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    source: { type: ["string", "null"] },
  },
  required: ["text", "source"],
};

const insightListSchema = {
  type: "array",
  items: insightSchema,
};

export const reportAnalysisSchema = {
  name: "financial_report_analysis",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      companyName: reportFieldSchema,
      reportingPeriod: reportFieldSchema,
      reportingCurrency: reportFieldSchema,
      executiveSummary: insightListSchema,
      keyFinancialMetrics: {
        type: "object",
        additionalProperties: false,
        properties: {
          revenue: reportFieldSchema,
          netIncome: reportFieldSchema,
          operatingExpenses: reportFieldSchema,
          totalAssets: reportFieldSchema,
          totalLiabilities: reportFieldSchema,
          shareholdersEquity: reportFieldSchema,
          cashFlow: reportFieldSchema,
          debt: reportFieldSchema,
        },
        required: [
          "revenue",
          "netIncome",
          "operatingExpenses",
          "totalAssets",
          "totalLiabilities",
          "shareholdersEquity",
          "cashFlow",
          "debt",
        ],
      },
      revenueAndProfitability: insightListSchema,
      financialPosition: insightListSchema,
      cashFlowAnalysis: insightListSchema,
      potentialRisks: insightListSchema,
      importantObservations: insightListSchema,
    },
    required: [
      "companyName",
      "reportingPeriod",
      "reportingCurrency",
      "executiveSummary",
      "keyFinancialMetrics",
      "revenueAndProfitability",
      "financialPosition",
      "cashFlowAnalysis",
      "potentialRisks",
      "importantObservations",
    ],
  },
};
