import {
  DollarSign,
  CalendarCheck,
  Users,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

function DashboardStats() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹4,82,500",
      change: "+12.5%",
      icon: DollarSign,
      className: "revenue",
    },
    {
      title: "Total Bookings",
      value: "1,248",
      change: "+8.2%",
      icon: CalendarCheck,
      className: "bookings",
    },
    {
      title: "Total Customers",
      value: "856",
      change: "+10.4%",
      icon: Users,
      className: "customers",
    },
    {
      title: "Destinations",
      value: "48",
      change: "+4.6%",
      icon: MapPin,
      className: "destinations",
    },
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            className={`dashboard-stat-card ${stat.className}`}
            key={stat.title}
          >
            <div className="stat-card-top">
              <div className="stat-icon">
                <Icon size={20} />
              </div>

              <span className="stat-change">
                <ArrowUpRight size={14} />
                {stat.change}
              </span>
            </div>

            <div className="stat-card-content">
              <span className="stat-title">{stat.title}</span>
              <h3>{stat.value}</h3>
            </div>

            <div className="stat-card-footer">
              <span>Compared to last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;