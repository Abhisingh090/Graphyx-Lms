import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* LEFT */}
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
            Reset Your Password
          </h2>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Enter your email and we’ll send you a password reset link.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-foreground">
              Forgot Password
            </h2>

            <p className="mt-2 text-muted-foreground">
              We’ll help you recover your account
            </p>
          </div>

          <form className="space-y-5">

            <div>
              <label className="text-sm font-medium">Email Address</label>

              <div className="mt-2 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-xl border border-border bg-card pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Send Reset Link
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Back to{" "}
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