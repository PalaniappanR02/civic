import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, TrendingUp, Users, Zap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-cyan-400" />,
      title: "Live Incident Map",
      description: "Real-time visualization of civic issues with clustered markers and heatmaps.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-lime-400" />,
      title: "Predictive Analytics",
      description: "AI-driven insights for forecasting trends and resolution times.",
    },
    {
      icon: <Users className="w-8 h-8 text-coral-400" />,
      title: "Community Driven",
      description: "Empower citizens to report and upvote issues that matter.",
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Real-time Updates",
      description: "Instant notifications and live activity feed for all reports.",
    },
  ];

  const stats = [
    { label: "Active Reports", value: "1,247", color: "text-cyan-400" },
    { label: "Resolved Issues", value: "892", color: "text-lime-400" },
    { label: "Active Citizens", value: "5,841", color: "text-coral-400" },
    { label: "Coverage Area", value: "16 Wards", color: "text-blue-400" },
  ];

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Urban Governance{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Report, track, and resolve civic issues in real-time with AI-powered insights and community engagement.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button className="gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/reports">
                    <Button variant="outline">Submit Report</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button asChild className="gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30">
                    <a href={getLoginUrl()}>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/about">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-24 h-24 text-cyan-400/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Live Map Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card p-6 rounded-2xl text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make your city smarter and more responsive to citizen needs.
          </p>
        </div>

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
      <Card className="glass-card p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Report", desc: "Submit civic issues with details and location" },
            { step: 2, title: "Track", desc: "Monitor real-time status and updates" },
            { step: 3, title: "Analyze", desc: "Get AI-powered insights and predictions" },
            { step: 4, title: "Resolve", desc: "See issues resolved and improvements made" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6 py-12">
        <h2 className="text-4xl font-bold">Ready to Make a Difference?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of citizens making their cities better, one report at a time.
        </p>
        {isAuthenticated ? (
          <Link href="/reports">
            <Button className="gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30">
              Submit Your First Report
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button asChild className="gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30">
            <a href={getLoginUrl()}>
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Testimonials */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">What Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "CivicConnect made it so easy to report the pothole on my street. It was fixed within days!",
              author: "Priya S.",
              role: "Citizen",
            },
            {
              quote: "The real-time tracking and analytics help us prioritize our maintenance efforts effectively.",
              author: "Rajesh M.",
              role: "Municipal Officer",
            },
            {
              quote: "The predictive insights are incredibly valuable for urban planning and resource allocation.",
              author: "Ananya K.",
              role: "City Planner",
            },
          ].map((testimonial, idx) => (
            <Card key={idx} className="glass-card p-6 rounded-2xl">
              <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold text-cyan-300">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
