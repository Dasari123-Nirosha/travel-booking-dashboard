import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "positive",
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          <Icon size={22} />
        </div>

        {change && (
          <div className={`stat-change ${changeType}`}>
            {changeType === "positive" ? (
              <ArrowUpRight size={15} />
            ) : (
              <ArrowDownRight size={15} />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="stat-card-content">
        <p>{title}</p>
        <h3>{value}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

export default StatCard;