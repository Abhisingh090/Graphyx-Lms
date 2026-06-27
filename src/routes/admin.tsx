import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout />
    </ProtectedRoute>
  );
}
