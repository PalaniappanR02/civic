import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, User, Clock, Moon, Sun } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Insights", href: "/insights" },
  { label: "Live Map", href: "/live-map" },
  { label: "Reports", href: "/reports" },
  { label: "Timeline", href: "/timeline" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
      <Clock className="w-4 h-4 text-cyan-400" />
      <span className="text-muted-foreground">{time || "00:00:00"}</span>
    </div>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
  };

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">◈</span>
              </div>
              <span className="font-bold text-lg hidden sm:inline">CivicConnect</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="hidden lg:block">
              <LiveClock />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
              >
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-md">
            <nav className="container py-4 flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setSidebarOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 block ${
                      isActive(item.href)
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="flex gap-2 mt-4">
                <LiveClock />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm">◈</span>
                CivicConnect
              </h3>
              <p className="text-sm text-muted-foreground">
                Urban governance platform for reporting and tracking civic issues in real-time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                {navigationItems.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className="text-muted-foreground hover:text-cyan-400 transition-colors">
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">More</h4>
              <ul className="space-y-2 text-sm">
                {navigationItems.slice(4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className="text-muted-foreground hover:text-cyan-400 transition-colors">
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Help us improve urban governance. Report issues and stay informed.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 CivicConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
