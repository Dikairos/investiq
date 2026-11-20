interface HistoricalRevenue {
  year: string;
  revenue: number;
  netIncome: number;
}

interface RevenueChartProps {
  data: HistoricalRevenue[];
}

const chartWidth = 720;
const chartHeight = 280;
const chartPadding = { top: 16, right: 20, bottom: 40, left: 52 };

function formatBillions(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <p className="border border-dashed border-[#DCD6E5] bg-[#FBFAFF] p-6 text-sm text-[#777281]">
        No historical financial data is available for this company.
      </p>
    );
  }

  const maximum = Math.ceil(
    Math.max(...data.map(({ revenue, netIncome }) => Math.max(revenue, netIncome))) /
      100,
  ) * 100;
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const x = (index: number) =>
    chartPadding.left +
    (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const y = (value: number) =>
    chartPadding.top + plotHeight - (value / maximum) * plotHeight;
  const linePath = (key: "revenue" | "netIncome") =>
    data
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${x(index)} ${y(point[key])}`,
      )
      .join(" ");
  const ticks = [0, 1, 2, 3].map((index) => (maximum / 3) * index);

  return (
    <div className="overflow-x-auto">
      <svg
        role="img"
        aria-label="Illustrative historical revenue and net income in Nigerian naira billions"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto min-w-[34rem] w-full"
      >
        {ticks.map((tick) => {
          const tickY = y(tick);

          return (
            <g key={tick}>
              <line
                x1={chartPadding.left}
                x2={chartWidth - chartPadding.right}
                y1={tickY}
                y2={tickY}
                stroke="#E9E5EF"
                strokeDasharray="4 6"
              />
              <text
                x={chartPadding.left - 10}
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

        <path
          d={linePath("revenue")}
          fill="none"
          stroke="#6541C1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path
          d={linePath("netIncome")}
          fill="none"
          stroke="#23966B"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />

        {data.map((point, index) => (
          <g key={point.year}>
            <circle cx={x(index)} cy={y(point.revenue)} r="3.5" fill="#6541C1" />
            <circle
              cx={x(index)}
              cy={y(point.netIncome)}
              r="3.5"
              fill="#23966B"
            />
            <text
              x={x(index)}
              y={chartHeight - 12}
              fill="#96919F"
              fontSize="12"
              textAnchor="middle"
            >
              {point.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
