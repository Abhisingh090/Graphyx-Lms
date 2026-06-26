import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Users,
  DollarSign,
  FileText,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore, useProfile, useIsAdmin } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: DollarSign },
  { href: "/admin/lessons", label: "Lessons", icon: FileText },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const profile = useProfile();
  const isAdmin = useIsAdmin();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold">Graphyx</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:bg-primary/10 [&.active]:text-primary"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {/* Switch between admin and student */}
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-border">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Student View
                </Link>
              </div>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-10 w-10 grid place-items-center rounded-xl hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop spacer */}
            <div className="hidden lg:block" />

            {/* Right section */}
            <div className="flex items-center gap-2">
              <button className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
