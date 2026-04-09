import { useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import FilterPanel, { FilterState } from "@/components/FilterPanel";

export default function Dashboard() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    status: null,
    startDate: null,
    endDate: null,
  });

  const { data: reports } = trpc.reports.withFilters.useQuery({
    category: filters.category || undefined,
    status: filters.status || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    limit: 1000,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Analytics data can be computed from reports data

  const getRecentReports = () => {
    if (!reports) return [];
    return reports.slice(0, 5);
  };

  const getStatusStats = () => {
    if (!reports) return { open: 0, inProgress: 0, resolved: 0, closed: 0 };
    return {
      open: reports.filter((r) => r.status === "open").length,
      inProgress: reports.filter((r) => r.status === "in-progress").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      closed: reports.filter((r) => r.status === "closed").length,
    };
  };

  const getCategoryStats = () => {
    if (!reports) return {};
    const stats: Record<string, number> = {};
    reports.forEach((r) => {
      stats[r.category] = (stats[r.category] || 0) + 1;
    });
    return stats;
  };

  const getPriorityStats = () => {
    if (!reports) return { low: 0, medium: 0, high: 0, critical: 0 };
    return {
      low: reports.filter((r) => r.priority === "low").length,
      medium: reports.filter((r) => r.priority === "medium").length,
      high: reports.filter((r) => r.priority === "high").length,
      critical: reports.filter((r) => r.priority === "critical").length,
    };
  };

  const statusStats = getStatusStats();
  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityStats();
  const recentReports = getRecentReports();

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of civic reports and community engagement
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterOpen(true)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Reports
              </h3>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-cyan-400">
              {reports?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Community engagement
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-br from-orange-500/10 to-red-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Open Issues
              </h3>
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-orange-400">
              {statusStats.open}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting action
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-br from-yellow-500/10 to-amber-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                In Progress
              </h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {statusStats.inProgress}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Being addressed
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Resolved
              </h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {statusStats.resolved}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Completed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-white/10 bg-white/5">
            <h2 className="text-lg font-bold mb-6">Status Distribution</h2>
            <div className="space-y-4">
              {[
                { label: "Open", value: statusStats.open, color: "bg-blue-500", max: 100 },
                { label: "In Progress", value: statusStats.inProgress, color: "bg-yellow-500", max: 100 },
                { label: "Resolved", value: statusStats.resolved, color: "bg-green-500", max: 100 },
                { label: "Closed", value: statusStats.closed, color: "bg-gray-500", max: 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{
                        width: `${Math.min((item.value / (reports?.length || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-white/5">
            <h2 className="text-lg font-bold mb-6">Priority Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Low", value: priorityStats.low, color: "bg-blue-500" },
                { label: "Medium", value: priorityStats.medium, color: "bg-yellow-500" },
                { label: "High", value: priorityStats.high, color: "bg-orange-500" },
                { label: "Critical", value: priorityStats.critical, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{
                        width: `${Math.min((item.value / (reports?.length || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
          <h2 className="text-lg font-bold mb-6">Reports by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div
                key={category}
                className="p-4 rounded-lg bg-white/5 border border-white/10 text-center"
              >
                <p className="text-2xl font-bold text-cyan-400 mb-1">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {category}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
          <h2 className="text-lg font-bold mb-6">Recent Reports</h2>
          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === "open"
                          ? "bg-blue-500/20 text-blue-300"
                          : report.status === "in-progress"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : report.status === "resolved"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {report.description?.substring(0, 100)}
                    {report.description && report.description.length > 100
                      ? "..."
                      : ""}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reports yet
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-white/10 bg-white/5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Resolution Rate
            </h3>
            <p className="text-3xl font-bold text-green-400">
              {reports && reports.length > 0
                ? Math.round(
                    ((statusStats.resolved + statusStats.closed) /
                      reports.length) *
                      100
                  )
                : 0}
              %
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-white/5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Avg Response Time
            </h3>
            <p className="text-3xl font-bold text-cyan-400">
              24h
            </p>
          </div>

          <div className="p-6 rounded-lg border border-white/10 bg-white/5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Community Votes
            </h3>
            <p className="text-3xl font-bold text-yellow-400">
              {reports?.reduce((sum, r) => sum + (r.votes || 0), 0) || 0}
            </p>
          </div>
        </div>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />
    </ProtectedRoute>
  );
}
