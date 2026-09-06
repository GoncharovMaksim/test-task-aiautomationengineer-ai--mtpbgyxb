import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedPlatform: string;
  onPlatformChange: (plat: string) => void;
  sortBy: "metascore" | "userscore" | "date" | "title";
  onSortByChange: (sort: "metascore" | "userscore" | "date" | "title") => void;
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
  totalCount: number;
}

const PLATFORMS = ["All", "PS5", "PC", "Xbox Series X", "Nintendo Switch"];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  totalCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by game title or developer..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="metascore" className="bg-zinc-900 text-zinc-200">
                Metascore
              </option>
              <option value="userscore" className="bg-zinc-900 text-zinc-200">
                User Score
              </option>
              <option value="date" className="bg-zinc-900 text-zinc-200">
                Release Date
              </option>
              <option value="title" className="bg-zinc-900 text-zinc-200">
                Title (A-Z)
              </option>
            </select>
            <button
              onClick={onSortOrderToggle}
              title="Toggle sort direction"
              className="ml-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 px-1 py-0.5 rounded bg-zinc-800"
            >
              {sortOrder === "desc" ? "DESC" : "ASC"}
            </button>
          </div>

          <span className="text-xs font-mono text-zinc-400 border border-zinc-800/80 bg-zinc-900/50 px-2.5 py-2 rounded-lg whitespace-nowrap">
            {totalCount} games
          </span>
        </div>
      </div>

      {/* Platform pill filters */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-zinc-400 mr-1.5">Platform:</span>
        {PLATFORMS.map((plat) => {
          const isActive = selectedPlatform === plat;
          return (
            <button
              key={plat}
              onClick={() => onPlatformChange(plat)}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {plat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
