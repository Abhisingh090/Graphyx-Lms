
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  User,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 p-12 overflow-hidden">

        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h1 className="text-4xl font-bold">Graphyx  </h1>
          </div>

          <h2 className="text-5xl font-extrabold leading-tight">
            Start Your Learning Journey Today
          </h2>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Join thousands of students learning premium skills from top instructors.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground">
              Create Account
            </h2>

            <p className="mt-2 text-muted-foreground">
              Sign up to continue learning
            </p>
          </div>

          {/* GOOGLE BUTTON */}
          <button className="w-full h-12 rounded-xl border border-border bg-card hover:bg-muted transition font-semibold">
            Continue with Google
          </button>

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

          {/* FORM */}
          <form className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <div className="mt-2 relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>

              <div className="mt-2 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary"
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

            {/* BUTTON */}
            <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Create Account
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}