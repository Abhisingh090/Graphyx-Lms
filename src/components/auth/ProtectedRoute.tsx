import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  requiredRole?: "admin" | "instructor" | "student";
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading, initialized } = useAuthStore();
  const location = useLocation();

  // Wait for initialization
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user || !profile) {
    const redirectParam = encodeURIComponent(location.href);
    return <Navigate to="/login" search={{ redirect: redirectParam }} />;
  }

  // Role check
  if (requiredRole && profile.role !== requiredRole) {
    // Admin can access instructor routes
    if (requiredRole === "instructor" && profile.role === "admin") {
      return <Outlet />;
    }

    // Redirect to dashboard if role doesn't match
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user, initialized } = useAuthStore();
  const location = useLocation();

  // Wait for initialization
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Already authenticated - redirect to dashboard or intended destination
  if (user) {
    const redirect = new URLSearchParams(location.search).get("redirect");
    if (redirect) {
      window.location.href = decodeURIComponent(redirect);
      return null;
    }
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
