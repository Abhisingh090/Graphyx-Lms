import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  DollarSign,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { dashboardApi, profilesApi, coursesApi, paymentsApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: dashboardApi.getAdminStats,
  });

  // Fetch recent students
  const { data: recentStudents } = useQuery({
    queryKey: ["recent-students"],
    queryFn: () => profilesApi.getAll(5),
  });

  // Fetch recent courses
  const { data: recentCourses } = useQuery({
    queryKey: ["recent-courses-admin"],
    queryFn: () => coursesApi.getAll(5),
  });

  // Fetch recent payments
  const { data: recentPayments } = useQuery({
    queryKey: ["recent-payments-admin"],
    queryFn: () => paymentsApi.getMyPayments,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          icon={Users}
          label="Total Students"
          value={stats?.totalStudents || 0}
          loading={statsLoading}
          color="primary"
        />
        <AdminStatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats?.totalCourses || 0}
          loading={statsLoading}
          color="accent"
        />
        <AdminStatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          loading={statsLoading}
          color="green"
        />
        <AdminStatCard
          icon={Clock}
          label="Pending Payments"
          value={stats?.pendingPayments || 0}
          loading={statsLoading}
          color="orange"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={BookOpen}
          label="Manage Courses"
          href="/admin/courses"
          count={stats?.totalCourses}
        />
        <QuickActionCard
          icon={Users}
          label="Manage Students"
          href="/admin/students"
          count={stats?.totalStudents}
        />
        <QuickActionCard
          icon={DollarSign}
          label="View Payments"
          href="/admin/payments"
          count={stats?.pendingPayments}
        />
        <QuickActionCard
          icon={FileText}
          label="Manage Lessons"
          href="/admin/lessons"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Students</h2>
          <div className="space-y-3">
            {recentStudents?.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                  {student.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{student.role}</p>
                </div>
              </div>
            ))}
            {(!recentStudents || recentStudents.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No students yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Courses</h2>
          <div className="space-y-3">
            {recentCourses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    ${course.price} · {course.level}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    course.is_published
                      ? "bg-green-500/10 text-green-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}
                >
                  {course.is_published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
            {(!recentCourses || recentCourses.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No courses yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({
  icon: Icon,
  label,
  value,
  loading,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  loading?: boolean;
  color: "primary" | "accent" | "green" | "orange";
}) {
  const colorStyles = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent/15 text-[color:var(--accent-foreground)]",
    green: "bg-green-500/15 text-green-600",
    orange: "bg-orange-500/15 text-orange-600",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className={`grid h-12 w-12 place-items-center rounded-lg ${colorStyles[color]} mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20 mb-1" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  href,
  count,
}: {
  icon: typeof BookOpen;
  label: string;
  href: string;
  count?: number;
}) {
  return (
    <Link
      to={href}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        {count !== undefined && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {count}
          </span>
        )}
      </div>
      <p className="font-medium mt-4">{label}</p>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-1" />
    </Link>
  );
}

import React from "react";
