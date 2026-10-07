import { Filter, RotateCcw } from "lucide-react";

function FilterBar({
  filters = [],
  values = {},
  onChange,
  onReset,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-heading">
        <Filter size={18} />
        <span>Filters</span>
      </div>

      <div className="filter-options">
        {filters.map((filter) => (
          <select
            key={filter.name}
            value={values[filter.name] || ""}
            onChange={(event) =>
              onChange(filter.name, event.target.value)
            }
          >
            <option value="">{filter.label}</option>

            {filter.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ))}

        <button
          type="button"
          className="reset-filter-button"
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterBar;