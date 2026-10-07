import { Search, X } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="common-search">
      <Search size={19} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;