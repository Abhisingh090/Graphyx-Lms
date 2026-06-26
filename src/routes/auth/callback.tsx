import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const { refreshProfile, setSession, setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange auth code for session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          // Update session
          setSession(session);
          setUser(session.user);

          // Fetch and update profile
          await refreshProfile();

          // Redirect to dashboard
          navigate({ to: "/dashboard" });
        } else {
          // No session - redirect to login
          navigate({ to: "/login" });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate({ to: "/login" });
      }
    };

    handleCallback();
  }, [navigate, refreshProfile, setSession, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
