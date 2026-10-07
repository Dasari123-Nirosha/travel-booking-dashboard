import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const bookingData = [
  { month: "Jan", bookings: 42 },
  { month: "Feb", bookings: 55 },
  { month: "Mar", bookings: 48 },
  { month: "Apr", bookings: 67 },
  { month: "May", bookings: 72 },
  { month: "Jun", bookings: 64 },
  { month: "Jul", bookings: 81 },
  { month: "Aug", bookings: 95 },
  { month: "Sep", bookings: 88 },
  { month: "Oct", bookings: 102 },
  { month: "Nov", bookings: 94 },
  { month: "Dec", bookings: 118 },
];

function BookingChart() {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>Booking Statistics</h3>
          <p>Monthly booking activity</p>
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
          <BarChart
            data={bookingData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
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
              className="chart-axis"
            />

            <Tooltip
              formatter={(value) => [value, "Bookings"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--card-bg)",
                color: "var(--text-primary)",
              }}
            />

            <Bar
              dataKey="bookings"
              fill="var(--primary-color)"
              radius={[5, 5, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BookingChart;