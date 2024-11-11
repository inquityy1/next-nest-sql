import { useState, useEffect } from "react";
import { debounce } from "@/utils/debounce/debounce";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounced search function to limit API calls
  const debouncedSearch = debounce(async (query) => {
    onSearch(query); // Calls the parent function with the query
  }, 500);

  // Watch for changes in query and trigger debounced search
  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  // Handle input change and update query state
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search campaigns..."
      className="border rounded px-3 py-2"
    />
  );
};

export default SearchBar;
