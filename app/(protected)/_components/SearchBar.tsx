import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialParams?: URLSearchParams;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialParams }) => {
  const [query, setQuery] = useState(initialParams?.get("jobId") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search invoices..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      <button
        type="submit"
        className="p-2 bg-primary text-primary-foreground rounded-md"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchBar;
