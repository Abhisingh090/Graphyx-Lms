import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, GraduationCap, Mail, Lock, Loader as Loader2 } from "lucide-react";
import { useAuthStore, useIsAuthenticated, useIsLoading } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search) => ({
    redirect: search.redirect as string | undefined,
  }),
});

function LoginPage() {
  const search = useSearch({ from: "/login" });
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useIsLoading();
  const { signIn, signInWithGoogle, error, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = search.redirect
        ? decodeURIComponent(search.redirect)
        : "/dashboard";
      navigate({ to: redirect as any });
    }
  }, [isAuthenticated, search.redirect, navigate]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn(email, password, rememberMe);

    setLoading(false);

    if (!result.error) {
      const redirect = search.redirect
        ? decodeURIComponent(search.redirect)
        : "/dashboard";
      navigate({ to: redirect as any });
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    // OAuth will redirect, so we don't need to handle success here
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold">Graphyx</h1>
          </div>

          <h2 className="text-5xl font-extrabold leading-tight">
            Learn Without Limits
          </h2>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Access premium courses, track your progress, and grow your skills with industry experts.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground">
              Welcome Back
            </h2>
            <p className="mt-2 text-muted-foreground">
              Login to continue learning
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <div className="mt-2 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-primary text-sm font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full h-12"
              disabled={loading || authLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                OR
              </span>
            </div>
          </div>

          {/* Google button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Signup link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
