import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 18500 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 26500 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 28800 },
  { month: "Jul", revenue: 35200 },
  { month: "Aug", revenue: 38900 },
  { month: "Sep", revenue: 42500 },
  { month: "Oct", revenue: 46800 },
  { month: "Nov", revenue: 44200 },
  { month: "Dec", revenue: 51000 },
];

function RevenueChart() {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>Revenue Overview</h3>
          <p>Monthly revenue performance</p>
        </div>

        <select className="chart-select" defaultValue="2026">
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div
            className="chart-container"
           style={{ width: "100%", height: "320px" }}
        >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopOpacity={0.3} />
                <stop offset="100%" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="chart-grid"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="chart-axis"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              className="chart-axis"
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary-color)"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;