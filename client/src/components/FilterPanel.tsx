import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  onClose: () => void;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
}

export interface FilterState {
  category: string | null;
  status: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

const CATEGORIES = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "utilities", label: "Utilities" },
  { value: "environment", label: "Environment" },
  { value: "safety", label: "Safety" },
  { value: "sanitation", label: "Sanitation" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
];

const STATUSES = [
  { value: "open", label: "Open", color: "bg-blue-500/20 text-blue-300" },
  { value: "in-progress", label: "In Progress", color: "bg-yellow-500/20 text-yellow-300" },
  { value: "resolved", label: "Resolved", color: "bg-green-500/20 text-green-300" },
  { value: "closed", label: "Closed", color: "bg-gray-500/20 text-gray-300" },
];

export default function FilterPanel({
  onClose,
  onFilterChange,
  isOpen,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    status: null,
    startDate: null,
    endDate: null,
  });

  const handleCategoryChange = (category: string | null) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: string | null) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (type: "start" | "end", date: string) => {
    let dateObj: Date | null = null;
    if (date) {
      // Use local time for the date picker string
      const [year, month, day] = date.split("-").map(Number);
      dateObj = new Date(year, month - 1, day);
      if (type === "end") {
        dateObj.setHours(23, 59, 59, 999);
      } else {
        dateObj.setHours(0, 0, 0, 0);
      }
    }

    const newFilters = {
      ...filters,
      [type === "start" ? "startDate" : "endDate"]: dateObj,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      category: null,
      status: null,
      startDate: null,
      endDate: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-background border-l border-white/10 shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-background/95 backdrop-blur-md">
          <h2 className="font-bold text-lg">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Category
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    handleCategoryChange(
                      filters.category === cat.value ? null : cat.value
                    )
                  }
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    filters.category === cat.value
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Status
            </h3>
            <div className="space-y-2">
              {STATUSES.map((stat) => (
                <button
                  key={stat.value}
                  onClick={() =>
                    handleStatusChange(
                      filters.status === stat.value ? null : stat.value
                    )
                  }
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    filters.status === stat.value
                      ? `${stat.color} border border-current`
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {stat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Date Range
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={
                    filters.startDate
                      ? filters.startDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:border-white/20 focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={
                    filters.endDate
                      ? filters.endDate.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:border-white/20 focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
