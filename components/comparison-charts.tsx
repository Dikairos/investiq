import type { Company } from "@/data/companies";

const seriesColors = ["#6541C1", "#23966B", "#9276C8", "#85808D"];
const chartWidth = 720;
const chartHeight = 280;
const padding = { top: 16, right: 20, bottom: 42, left: 58 };

function formatBillions(value: number) {
  return value >= 1000
    ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
    : `${value}`;
}

function getCommonYears(companies: Company[]) {
  const candidateYears = Array.from(
    new Set(
      companies.flatMap((company) =>
        company.financials.historicalRevenue.map(({ year }) => year),
      ),
    ),
  ).sort((left, right) => Number(left) - Number(right));

  return candidateYears.filter((year) =>
    companies.every((company) =>
      company.financials.historicalRevenue.some(
        (point) => point.year === year,
      ),
    ),
  );
}

function hasCompatibleAmountUnits(companies: Company[]) {
  const firstFinancials = companies[0]?.financials;
  return (
    firstFinancials !== undefined &&
    companies.every(
      (company) =>
        company.financials.currency === firstFinancials.currency &&
        company.financials.amountUnit === firstFinancials.amountUnit,
    )
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-56 items-center justify-center border border-dashed border-[#DCD6E5] bg-[#FBFAFF] p-6 text-center text-sm text-[#777281]">
      {message}
    </div>
  );
}

function ChartLegend({ companies }: { companies: Company[] }) {
  return (
    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
      {companies.map((company, index) => (
        <span
          key={company.ticker}
          className="inline-flex items-center gap-2 text-xs text-[#777281]"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: seriesColors[index] }}
          />
          {company.ticker}
        </span>
      ))}
    </div>
  );
}

export function HistoricalRevenueBars({
  companies,
}: {
  companies: Company[];
}) {
  if (!hasCompatibleAmountUnits(companies)) {
    return (
      <EmptyChart message="Historical revenue cannot be charted until selected companies use the same currency and unit." />
    );
  }

  const years = getCommonYears(companies);
  const values = companies.flatMap((company) =>
    company.financials.historicalRevenue
      .filter((point) => years.includes(point.year))
      .map((point) => point.revenue),
  );

  if (years.length === 0 || values.length === 0) {
    return (
      <EmptyChart message="No shared historical revenue years are available for this selection." />
    );
  }

  const maxValue = Math.ceil(Math.max(...values) / 100) * 100;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const groupWidth = plotWidth / years.length;
  const barGap = 5;
  const barWidth = Math.min(
    34,
    (groupWidth * 0.78 - barGap * (companies.length - 1)) / companies.length,
  );
  const y = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;
  const ticks = [0, 1, 2, 3].map((index) => (maxValue / 3) * index);

  return (
    <>
      <ChartLegend companies={companies} />
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label="Grouped bars comparing illustrative historical revenue in NGN billions for shared years"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto min-w-[34rem] w-full"
        >
          {ticks.map((tick) => {
            const tickY = y(tick);

            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={tickY}
                  y2={tickY}
                  stroke="#E9E5EF"
                  strokeDasharray="4 6"
                />
                <text
                  x={padding.left - 10}
                  y={tickY + 4}
                  fill="#96919F"
                  fontSize="11"
                  textAnchor="end"
                >
                  {formatBillions(tick)}
                </text>
              </g>
            );
          })}

          {years.map((year, yearIndex) => {
            const groupStart =
              padding.left +
              groupWidth * yearIndex +
              (groupWidth -
                (barWidth * companies.length +
                  barGap * (companies.length - 1))) /
                2;

            return (
              <g key={year}>
                {companies.map((company, companyIndex) => {
                  const point = company.financials.historicalRevenue.find(
                    (item) => item.year === year,
                  );
                  if (!point) return null;

                  const barHeight = (point.revenue / maxValue) * plotHeight;
                  return (
                    <rect
                      key={company.ticker}
                      x={groupStart + companyIndex * (barWidth + barGap)}
                      y={y(point.revenue)}
                      width={barWidth}
                      height={barHeight}
                      rx="1"
                      fill={seriesColors[companyIndex]}
                    >
                      <title>
                        {company.name}, {year}: {point.revenue} NGN billions
                      </title>
                    </rect>
                  );
                })}
                <text
                  x={padding.left + groupWidth * yearIndex + groupWidth / 2}
                  y={chartHeight - 12}
                  fill="#94a3b8"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}

export function HistoricalNetIncomeLines({
  companies,
}: {
  companies: Company[];
}) {
  if (!hasCompatibleAmountUnits(companies)) {
    return (
      <EmptyChart message="Historical net income cannot be charted until selected companies use the same currency and unit." />
    );
  }

  const years = getCommonYears(companies);
  const values = companies.flatMap((company) =>
    company.financials.historicalRevenue
      .filter((point) => years.includes(point.year))
      .map((point) => point.netIncome),
  );

  if (years.length === 0 || values.length === 0) {
    return (
      <EmptyChart message="No shared historical net income years are available for this selection." />
    );
  }

  const maxValue = Math.ceil(Math.max(...values) / 100) * 100;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const x = (index: number) =>
    padding.left +
    (years.length === 1 ? plotWidth / 2 : (index / (years.length - 1)) * plotWidth);
  const y = (value: number) =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;
  const ticks = [0, 1, 2, 3].map((index) => (maxValue / 3) * index);

  return (
    <>
      <ChartLegend companies={companies} />
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label="Line chart comparing illustrative historical net income in NGN billions for shared years"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto min-w-[34rem] w-full"
        >
          {ticks.map((tick) => {
            const tickY = y(tick);

            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={tickY}
                  y2={tickY}
                  stroke="#E9E5EF"
                  strokeDasharray="4 6"
                />
                <text
                  x={padding.left - 10}
                  y={tickY + 4}
                  fill="#96919F"
                  fontSize="11"
                  textAnchor="end"
                >
                  {formatBillions(tick)}
                </text>
              </g>
            );
          })}

          {companies.map((company, companyIndex) => {
            const companyPoints = years.map((year) =>
              company.financials.historicalRevenue.find(
                (point) => point.year === year,
              ),
            );
            const path = companyPoints
              .map((point, index) =>
                point
                  ? `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.netIncome)}`
                  : "",
              )
              .filter(Boolean)
              .join(" ");

            return (
              <g key={company.ticker}>
                <path
                  d={path}
                  fill="none"
                  stroke={seriesColors[companyIndex]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                {companyPoints.map(
                  (point, index) =>
                    point && (
                      <circle
                        key={point.year}
                        cx={x(index)}
                        cy={y(point.netIncome)}
                        r="3.5"
                        fill={seriesColors[companyIndex]}
                      >
                        <title>
                          {company.name}, {point.year}: {point.netIncome} NGN
                          billions
                        </title>
                      </circle>
                    ),
                )}
              </g>
            );
          })}

          {years.map((year, index) => (
            <text
              key={year}
              x={x(index)}
              y={chartHeight - 12}
              fill="#96919F"
              fontSize="12"
              textAnchor="middle"
            >
              {year}
            </text>
          ))}
        </svg>
      </div>
    </>
  );
}
