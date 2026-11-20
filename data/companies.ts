export interface CompanyFinancials {
  currency: string;
  amountUnit: string;
  reportingPeriod: string | null;
  marketCap: string;
  revenue: string;
  netIncome: string;
  grossProfit: string | null;
  operatingProfit: string | null;
  peRatio: string;
  totalAssets: string;
  revenueGrowth: string;
  profitGrowth: string;
  grossProfitMargin: string | null;
  operatingProfitMargin: string | null;
  netProfitMargin: string | null;
  returnOnAssets: string | null;
  returnOnEquity: string | null;
  historicalRevenue: {
    year: string;
    revenue: number;
    netIncome: number;
  }[];
  liabilities: string;
  debt: string;
  shareholdersEquity: string | null;
  operatingCashFlow: string | null;
  cashFlow: string;
}

export interface Company {
  name: string;
  ticker: string;
  industry: string;
  sector: string;
  description: string;
  initials: string;
  accent: string;
  whatItDoes: string;
  productsAndServices: string[];
  businessModel: string;
  headquarters: string;
  strengths: string[];
  risks: string[];
  observations: string[];
  financials: CompanyFinancials;
}

export const companies: Company[] = [
  {
    name: "MTN Nigeria",
    ticker: "MTNN",
    industry: "Telecommunications",
    sector: "Mobile network & digital services",
    description:
      "A Nigerian telecommunications company providing mobile voice, data and digital services to consumers and businesses.",
    initials: "MTN",
    accent: "bg-yellow-400 text-slate-950",
    whatItDoes:
      "MTN Nigeria provides connectivity and digital services to individuals, homes and businesses across Nigeria.",
    productsAndServices: [
      "Mobile voice and data",
      "Home broadband",
      "Digital and fintech services",
      "Enterprise connectivity",
    ],
    businessModel:
      "The business earns revenue by providing communication and digital services to consumer and enterprise customers.",
    headquarters: "Lagos, Nigeria",
    strengths: [
      "Operates in an essential communications sector.",
      "Serves both consumer and enterprise markets.",
      "Part of a wider international telecommunications group.",
    ],
    risks: [
      "Telecommunications infrastructure requires ongoing investment.",
      "The business is exposed to currency, energy-cost and regulatory changes.",
      "Competition can affect customer retention and pricing.",
    ],
    observations: [
      "The sample revenue series increases across the displayed years.",
      "Net income and revenue are illustrative values for this interface only.",
    ],
    financials: {
      currency: "NGN",
      amountUnit: "NGN billions",
      reportingPeriod: null,
      marketCap: "₦9,200bn",
      revenue: "₦3,800bn",
      netIncome: "₦400bn",
      grossProfit: null,
      operatingProfit: null,
      peRatio: "11.6x",
      totalAssets: "₦2,800bn",
      revenueGrowth: "18.8%",
      profitGrowth: "29.0%",
      grossProfitMargin: null,
      operatingProfitMargin: null,
      netProfitMargin: null,
      returnOnAssets: null,
      returnOnEquity: null,
      historicalRevenue: [
        { year: "2022", revenue: 2300, netIncome: 190 },
        { year: "2023", revenue: 2600, netIncome: 240 },
        { year: "2024", revenue: 3200, netIncome: 310 },
        { year: "2025", revenue: 3800, netIncome: 400 },
      ],
      liabilities: "₦1,700bn",
      debt: "₦420bn",
      shareholdersEquity: null,
      operatingCashFlow: null,
      cashFlow: "₦760bn",
    },
  },
  {
    name: "Dangote Cement",
    ticker: "DANGCEM",
    industry: "Cement & building materials",
    sector: "Construction materials",
    description:
      "A cement producer serving construction markets in Nigeria and other African countries.",
    initials: "DC",
    accent: "bg-orange-400 text-slate-950",
    whatItDoes:
      "Dangote Cement produces cement and related products used in infrastructure, commercial and residential construction.",
    productsAndServices: [
      "Bagged cement",
      "Bulk cement",
      "Clinker",
      "Logistics and distribution",
    ],
    businessModel:
      "The company manufactures and distributes cement and related materials to distributors, construction firms and other customers.",
    headquarters: "Lagos, Nigeria",
    strengths: [
      "Supplies a core material used in construction.",
      "Serves markets in Nigeria and across the African continent.",
      "A broad distribution network can support product availability.",
    ],
    risks: [
      "Cement production is energy intensive.",
      "Demand is sensitive to construction activity and infrastructure spending.",
      "Input costs, logistics and currency movements may affect operations.",
    ],
    observations: [
      "The sample revenue series increases across the displayed years.",
      "The chart and financial values are fictional examples, not company results.",
    ],
    financials: {
      currency: "NGN",
      amountUnit: "NGN billions",
      reportingPeriod: null,
      marketCap: "₦5,800bn",
      revenue: "₦4,100bn",
      netIncome: "₦540bn",
      grossProfit: null,
      operatingProfit: null,
      peRatio: "9.8x",
      totalAssets: "₦5,200bn",
      revenueGrowth: "10.8%",
      profitGrowth: "17.4%",
      grossProfitMargin: null,
      operatingProfitMargin: null,
      netProfitMargin: null,
      returnOnAssets: null,
      returnOnEquity: null,
      historicalRevenue: [
        { year: "2022", revenue: 2900, netIncome: 300 },
        { year: "2023", revenue: 3400, netIncome: 370 },
        { year: "2024", revenue: 3700, netIncome: 460 },
        { year: "2025", revenue: 4100, netIncome: 540 },
      ],
      liabilities: "₦2,800bn",
      debt: "₦900bn",
      shareholdersEquity: null,
      operatingCashFlow: null,
      cashFlow: "₦990bn",
    },
  },
  {
    name: "GTCO",
    ticker: "GTCO",
    industry: "Financial services",
    sector: "Banking & financial services",
    description:
      "A financial services group offering banking and related services to individuals and businesses.",
    initials: "GT",
    accent: "bg-emerald-400 text-slate-950",
    whatItDoes:
      "Guaranty Trust Holding Company Plc is the parent company of a group with operations in banking and other financial services.",
    productsAndServices: [
      "Retail and commercial banking",
      "Payments and digital banking",
      "Corporate banking",
      "Other financial services",
    ],
    businessModel:
      "The group provides financial products and services to retail, commercial and corporate customers through its subsidiaries.",
    headquarters: "Lagos, Nigeria",
    strengths: [
      "Serves a broad mix of personal and business customers.",
      "Combines banking with other financial services.",
      "Digital channels can extend access to its services.",
    ],
    risks: [
      "Banking is exposed to credit quality and changing interest rates.",
      "Regulatory and capital requirements can affect operations.",
      "Economic conditions may influence customer activity and loan performance.",
    ],
    observations: [
      "The sample series shows an upward path in both lines.",
      "All financial figures and growth rates shown here are illustrative mock data.",
    ],
    financials: {
      currency: "NGN",
      amountUnit: "NGN billions",
      reportingPeriod: null,
      marketCap: "₦12,000bn",
      revenue: "₦1,800bn",
      netIncome: "₦600bn",
      grossProfit: null,
      operatingProfit: null,
      peRatio: "7.4x",
      totalAssets: "₦26,000bn",
      revenueGrowth: "24.1%",
      profitGrowth: "27.7%",
      grossProfitMargin: null,
      operatingProfitMargin: null,
      netProfitMargin: null,
      returnOnAssets: null,
      returnOnEquity: null,
      historicalRevenue: [
        { year: "2022", revenue: 900, netIncome: 250 },
        { year: "2023", revenue: 1100, netIncome: 360 },
        { year: "2024", revenue: 1450, netIncome: 470 },
        { year: "2025", revenue: 1800, netIncome: 600 },
      ],
      liabilities: "₦23,000bn",
      debt: "₦1,300bn",
      shareholdersEquity: null,
      operatingCashFlow: null,
      cashFlow: "₦1,700bn",
    },
  },
];

export function getCompanyByTicker(ticker: string): Company | undefined {
  return companies.find(
    (company) => company.ticker.toLowerCase() === ticker.toLowerCase(),
  );
}
