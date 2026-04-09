import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";

export default function Timeline() {
  const timelineEvents = [
    {
      id: 1,
      title: "Pothole repair completed on 80ft Road",
      category: "Infrastructure",
      status: "resolved",
      time: "2 hours ago",
      description: "Road surface patching completed successfully.",
    },
    {
      id: 2,
      title: "New critical report: Gas leak on Infantry Rd",
      category: "Safety",
      status: "critical",
      time: "5 hours ago",
      description: "Emergency crew dispatched immediately.",
    },
    {
      id: 3,
      title: "Upvote milestone: 200+ on manhole report",
      category: "Safety",
      status: "milestone",
      time: "12 hours ago",
      description: "Community engagement increased significantly.",
    },
    {
      id: 4,
      title: "Water main leak assigned to contractor",
      category: "Utilities",
      status: "in-progress",
      time: "18 hours ago",
      description: "Contractor scheduled for tomorrow morning.",
    },
    {
      id: 5,
      title: "Garbage cleanup drive completed — KR Market",
      category: "Sanitation",
      status: "resolved",
      time: "1 day ago",
      description: "Area cleaned and sanitized.",
    },
    {
      id: 6,
      title: "Traffic signal fixed at MG Road junction",
      category: "Infrastructure",
      status: "resolved",
      time: "2 days ago",
      description: "Signal hardware replaced and recalibrated.",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-6 h-6 text-lime-400" />;
      case "critical":
        return <AlertCircle className="w-6 h-6 text-coral-400" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-cyan-400" />;
      case "milestone":
        return <Zap className="w-6 h-6 text-lime-400" />;
      default:
        return <Clock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-lime-400";
      case "critical":
        return "text-coral-400";
      case "in-progress":
        return "text-cyan-400";
      case "milestone":
        return "text-lime-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case "Infrastructure":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/50";
      case "Safety":
        return "bg-coral-500/20 text-coral-300 border-coral-500/50";
      case "Environment":
        return "bg-lime-500/20 text-lime-300 border-lime-500/50";
      case "Utilities":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "Sanitation":
        return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      default:
        return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold mb-2">Timeline</h1>
        <p className="text-muted-foreground">Real-time activity feed and report updates</p>
      </div>

      {/* Live Activity Feed */}
      <Card className="glass-card p-8 rounded-2xl">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 to-coral-500/50" />

          {/* Timeline events */}
          <div className="space-y-8">
            {timelineEvents.map((event, idx) => (
              <div key={event.id} className="relative pl-24">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  {getStatusIcon(event.status)}
                </div>

                {/* Event card */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <span className={`text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-3">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryBg(event.category)}`}>
                      {event.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Today's Activity</h3>
          <p className="text-3xl font-bold text-cyan-400">12</p>
          <p className="text-xs text-muted-foreground mt-2">Reports updated</p>
        </Card>

        <Card className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">This Week</h3>
          <p className="text-3xl font-bold text-lime-400">47</p>
          <p className="text-xs text-muted-foreground mt-2">Issues resolved</p>
        </Card>

        <Card className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">This Month</h3>
          <p className="text-3xl font-bold text-coral-400">156</p>
          <p className="text-xs text-muted-foreground mt-2">Total reports</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card p-6 rounded-2xl">
        <h2 className="text-lg font-bold mb-4">Filter Timeline</h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Resolved", "In Progress", "Critical", "Infrastructure", "Safety"].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
