import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
