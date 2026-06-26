import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex items-center justify-center bg-primary text-white p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Graphyx LMS</h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Learn Without Limits
          </h2>

          <p className="text-lg opacity-90">
            Access premium courses, track your progress,
            and grow your skills with industry experts.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl">

          <h2 className="text-3xl font-bold mb-2">
            Welcome Back
          </h2>

          <p className="text-muted-foreground mb-8">
            Login to continue learning
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full h-12 rounded-xl border border-border bg-background px-4 pr-12 outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER */}
          <div className="flex items-center justify-between mb-6">

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-primary text-sm font-medium"
            >
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN BUTTON */}
          <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            Login
          </button>

          {/* GOOGLE */}
          <button className="w-full h-12 rounded-xl border border-border mt-4 font-semibold hover:bg-muted transition">
            Continue with Google
          </button>

          {/* SIGNUP */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don’t have an account?{" "}

            <Link
              to="/signup"
              className="text-primary font-semibold"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}