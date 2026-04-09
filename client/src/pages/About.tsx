import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, Globe } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      title: "Real-time Tracking",
      description: "Track civic issues in real-time with live map updates and instant notifications.",
    },
    {
      icon: <Users className="w-6 h-6 text-lime-400" />,
      title: "Community Driven",
      description: "Empower citizens to report and upvote issues that matter to their communities.",
    },
    {
      icon: <Zap className="w-6 h-6 text-coral-400" />,
      title: "AI-Powered Insights",
      description: "Get predictive analytics and machine learning insights for better decision making.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-blue-400" />,
      title: "Transparent Resolution",
      description: "Track the complete lifecycle of each report from submission to resolution.",
    },
  ];

  const stats = [
    { label: "Active Reports", value: "1,247", color: "text-cyan-400" },
    { label: "Resolved Issues", value: "892", color: "text-lime-400" },
    { label: "Active Citizens", value: "5,841", color: "text-blue-400" },
    { label: "Coverage Area", value: "16 Wards", color: "text-coral-400" },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">About CivicConnect</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A next-generation urban governance platform for reporting, tracking, and resolving civic issues in real-time.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="glass-card p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              CivicConnect bridges the gap between citizens and municipal authorities by providing a transparent, 
              efficient platform for reporting and resolving urban issues.
            </p>
            <p className="text-muted-foreground">
              We believe that every voice matters and that real-time data can drive better urban governance decisions.
            </p>
          </div>
          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="glass-card p-6 rounded-2xl hover:border-cyan-500/50 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card className="glass-card p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Report", desc: "Citizens report civic issues with details and location" },
            { step: 2, title: "Track", desc: "Real-time tracking of issue status and updates" },
            { step: 3, title: "Analyze", desc: "AI analyzes patterns and predicts resolutions" },
            { step: 4, title: "Resolve", desc: "Authorities resolve issues and close reports" },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[40%] h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Technology Stack */}
      <Card className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Built With Modern Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "tRPC",
            "Google Maps",
            "Recharts",
            "Machine Learning",
            "Real-time Analytics",
          ].map((tech, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <p className="text-sm font-medium text-cyan-300">{tech}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Section */}
      <Card className="glass-card p-8 rounded-2xl bg-gradient-to-br from-lime-500/10 to-cyan-500/10 border-lime-500/30">
        <h2 className="text-3xl font-bold mb-6">Our Team</h2>
        <p className="text-muted-foreground mb-6">
          CivicConnect is built by a dedicated team of engineers, designers, and urban governance experts 
          committed to making cities smarter and more responsive to citizen needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alex Johnson", role: "Lead Developer" },
            { name: "Sarah Chen", role: "Product Manager" },
            { name: "Michael Patel", role: "Data Scientist" },
          ].map((member, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-3" />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Vision Section */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-bold">Our Vision</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We envision a future where every citizen can contribute to making their city better, 
          where data drives decisions, and where urban issues are resolved faster than ever before.
        </p>
      </div>
    </div>
  );
}
