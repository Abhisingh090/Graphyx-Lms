import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { enrollmentsApi, dashboardApi, certificatesApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { initialize } = useAuthStore();

  // Initialize auth on mount
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStudentStats,
  });

  // Fetch enrolled courses
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: enrollmentsApi.getMyEnrollments,
  });

  // Fetch certificates
  const { data: certificates } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: certificatesApi.getMy,
  });

  const recentCourses = enrollments?.slice(0, 3);
  const totalHours = stats?.totalHoursLearned || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">Continue your learning journey</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Enrolled Courses"
          value={stats?.enrolledCourses || 0}
          loading={statsLoading}
          color="primary"
        />
        <StatCard
          icon={Award}
          label="Completed"
          value={stats?.completedCourses || 0}
          loading={statsLoading}
          color="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Certificates"
          value={stats?.certificatesEarned || 0}
          loading={statsLoading}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Hours Learned"
          value={totalHours}
          suffix="h"
          loading={statsLoading}
          color="blue"
        />
      </div>

      {/* Continue learning */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Link
            to="/dashboard/courses"
            className="text-sm text-primary font-medium hover:underline"
          >
            View all
          </Link>
        </div>

        {enrollmentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : recentCourses && recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCourses.map((enrollment) => (
              <CourseProgressCard
                key={enrollment.id}
                course={enrollment.course}
                progress={enrollment.progress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/40 rounded-xl">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your learning journey by enrolling in a course.
            </p>
            <Link to="/#courses">
              <Button>
                Browse Courses <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Recent certificates */}
      {certificates && certificates.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Certificates</h2>
            <Link
              to="/dashboard/certificates"
              className="text-sm text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.slice(0, 3).map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{cert.course?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cert.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  loading,
  color,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
  suffix?: string;
  loading?: boolean;
  color: "primary" | "accent" | "green" | "blue";
}) {
  const colorStyles = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent/15 text-[color:var(--accent-foreground)]",
    green: "bg-green-500/15 text-green-600",
    blue: "bg-blue-500/15 text-blue-600",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-lg ${colorStyles[color]} mb-4`}>
        <Icon className="h-5 w-5" />
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <p className="text-2xl font-bold">
          {value}
          {suffix}
        </p>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Course progress card
function CourseProgressCard({
  course,
  progress,
}: {
  course: any;
  progress: number;
}) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="relative aspect-video">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">By {course.instructor_name}</p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

import React from "react";
