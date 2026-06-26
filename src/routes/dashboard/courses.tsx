import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Play, Award, CircleCheck as CheckCircle, Clock } from "lucide-react";
import { enrollmentsApi, lessonsApi, lessonProgressApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/courses")({
  component: MyCoursesPage,
});

function MyCoursesPage() {
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: enrollmentsApi.getMyEnrollments,
  });

  const filteredEnrollments = enrollments?.filter((e) => {
    if (filter === "completed") return e.completed;
    if (filter === "in-progress") return !e.completed && e.progress > 0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-muted/40 p-1 rounded-lg">
          {(["all", "in-progress", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "in-progress" ? "In Progress" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Courses list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredEnrollments && filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              course={enrollment.course}
              enrollment={enrollment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-xl">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === "all"
              ? "You haven't enrolled in any courses yet."
              : filter === "completed"
                ? "You haven't completed any courses yet."
                : "No courses in progress."}
          </p>
          {filter === "all" && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground font-medium"
            >
              Browse Courses
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, enrollment }: { course: any; enrollment: any }) {
  const [showLessons, setShowLessons] = useState(false);

  const { data: lessons } = useQuery({
    queryKey: ["course-lessons", course.id],
    queryFn: () => lessonsApi.getByCourse(course.id),
    enabled: showLessons,
  });

  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", course.id],
    queryFn: () => lessonProgressApi.getByCourse(course.id),
    enabled: showLessons,
  });

  const completedLessons = lessons?.filter((l) =>
    progress?.some((p) => p.lesson_id === l.id && p.completed)
  ).length || 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group">
      {/* Thumbnail */}
      <Link to={`/courses/${course.slug}`} className="block relative aspect-video overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <BookOpen className="h-14 w-14 text-muted-foreground" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Play className="h-6 w-6 ml-0.5" />
          </div>
        </div>

        {/* Status badge */}
        {enrollment.completed && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              course.level === "beginner"
                ? "bg-primary-soft text-primary"
                : course.level === "intermediate"
                  ? "bg-accent/15 text-[color:var(--accent-foreground)]"
                  : "bg-navy text-navy-foreground"
            }`}
          >
            {course.level}
          </span>
          {course.duration_hours && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {course.duration_hours}h
            </span>
          )}
        </div>

        <Link to={`/courses/${course.slug}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mt-1">By {course.instructor_name}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(enrollment.progress)}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-2" />
        </div>

        {/* Lesson toggle */}
        <button
          onClick={() => setShowLessons(!showLessons)}
          className="w-full mt-4 text-sm text-primary font-medium hover:underline"
        >
          {showLessons ? "Hide lessons" : "View lessons"}
        </button>

        {/* Lessons list */}
        {showLessons && lessons && (
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {lessons.map((lesson, idx) => {
              const isCompleted = progress?.some(
                (p) => p.lesson_id === lesson.id && p.completed
              );

              return (
                <Link
                  key={lesson.id}
                  to={`/courses/${course.slug}/lessons/${lesson.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div
                    className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className={`flex-1 text-sm truncate ${isCompleted ? "text-muted-foreground" : ""}`}>
                    {lesson.title}
                  </span>
                  {lesson.duration_minutes && (
                    <span className="text-xs text-muted-foreground">
                      {lesson.duration_minutes}m
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Certificate button */}
        {enrollment.completed && (
          <Link
            to="/certificates/$courseId"
            params={{ courseId: course.id }}
            className="flex items-center justify-center gap-2 w-full mt-4 h-10 rounded-lg bg-accent/15 text-accent font-medium hover:bg-accent/25 transition-colors"
          >
            <Award className="h-4 w-4" /> View Certificate
          </Link>
        )}
      </div>
    </div>
  );
}
