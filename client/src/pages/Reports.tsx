import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import ReportForm from "@/components/ReportForm";

export default function Reports() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();

  const { data: reports, isLoading } = trpc.reports.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      resolved: "bg-green-500/20 text-green-300 border-green-500/50",
      closed: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-500/20 text-blue-300",
      medium: "bg-yellow-500/20 text-yellow-300",
      high: "bg-orange-500/20 text-orange-300",
      critical: "bg-red-500/20 text-red-300",
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      infrastructure: "Infrastructure",
      utilities: "Utilities",
      environment: "Environment",
      safety: "Safety",
      sanitation: "Sanitation",
      transport: "Transport",
      other: "Other",
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Civic Reports</h1>
          <p className="text-muted-foreground">
            Submit and track civic issues in your community
          </p>
        </div>
        {isAuthenticated && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Report
          </Button>
        )}
      </div>

      {showForm && isAuthenticated && (
        <div className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Submit a New Report</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <ReportForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {!isAuthenticated && (
        <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
          <p className="text-muted-foreground mb-4">
            Log in to submit a civic report
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
          >
            Log In to Report
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-cyan-400">{reports?.length || 0}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Open Issues</p>
          <p className="text-2xl font-bold text-orange-400">
            {reports?.filter((r) => r.status === "open").length || 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400">
            {reports?.filter((r) => r.status === "in-progress").length || 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-400">
            {reports?.filter((r) => r.status === "resolved").length || 0}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reports...
          </div>
        ) : reports && reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
              onClick={() =>
                setSelectedReport(
                  selectedReport === report.id ? null : report.id
                )
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{report.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {report.description || "No description provided"}
                  </p>

                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                      {getCategoryLabel(report.category)}
                    </span>
                    {report.ward && (
                      <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                        {report.ward}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      👍 {report.votes || 0}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    selectedReport === report.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {selectedReport === report.id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="text-sm">
                      {report.latitude}, {report.longitude}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Created
                    </p>
                    <p className="text-sm">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {report.resolvedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Resolved
                      </p>
                      <p className="text-sm">
                        {new Date(report.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No reports found</p>
            {isAuthenticated && (
              <Button onClick={() => setShowForm(true)}>
                Submit the first report
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
