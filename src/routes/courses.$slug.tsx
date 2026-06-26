import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  Users,
  Star,
  Check,
  Lock,
  ArrowRight,
  Award,
  Globe,
} from "lucide-react";
import { coursesApi, lessonsApi, enrollmentsApi, lessonProgressApi, reviewsApi } from "@/services/api";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/stripe";

export const Route = createFileRoute("/courses/$slug")({
  component: CoursePage,
});

function CoursePage() {
  const { slug } = useParams({ from: "/courses/$slug" });
  const isAuthenticated = useIsAuthenticated();
  const [enrolling, setEnrolling] = useState(false);
  const queryClient = useQueryClient();

  // Fetch course
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => coursesApi.getBySlug(slug),
  });

  // Fetch lessons
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["course-lessons", course?.id],
    queryFn: () => lessonsApi.getByCourse(course?.id || ""),
    enabled: !!course?.id,
  });

  // Check enrollment
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment", course?.id],
    queryFn: () => enrollmentsApi.getEnrollment(course?.id || ""),
    enabled: !!course?.id && isAuthenticated,
  });

  // Fetch lesson progress
  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", course?.id],
    queryFn: () => lessonProgressApi.getByCourse(course?.id || ""),
    enabled: !!course?.id && !!enrollment,
  });

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ["reviews", course?.id],
    queryFn: () => reviewsApi.getByCourse(course?.id || ""),
    enabled: !!course?.id,
  });

  const completedLessons = lessons?.filter((l) =>
    progress?.some((p) => p.lesson_id === l.id && p.completed)
  ).length || 0;

  const totalLessons = lessons?.length || 0;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }

    setEnrolling(true);

    try {
      const result = await createCheckoutSession(course!.id);

      if (result.url) {
        window.location.href = result.url;
      } else if (result.sessionId) {
        // For free courses, refresh the page
        queryClient.invalidateQueries({ queryKey: ["enrollment", course?.id] });
        toast.success("Successfully enrolled!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (courseLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 space-y-8 px-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Course not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-navy to-primary/80 text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    course.level === "beginner"
                      ? "bg-white/20"
                      : course.level === "intermediate"
                        ? "bg-accent/30"
                        : "bg-white/30"
                  }`}
                >
                  {course.level}
                </span>
                {course.duration_hours && (
                  <span className="text-sm text-white/70 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {course.duration_hours}h
                  </span>
                )}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-white/80 mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(course.rating) ? "fill-current" : ""}`}
                    />
                  ))}
                  <span className="ml-1 text-white font-semibold">{course.rating}</span>
                </div>
                <span className="text-white/70">
                  ({course.reviews_count} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-8">
                {course.instructor_name && (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{course.instructor_name}</p>
                      <p className="text-sm text-white/60">Instructor</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enroll button */}
              {isEnrolled ? (
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                  >
                    <Link to={`/courses/${slug}/learn`}>
                      Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="text-sm text-white/70">
                    {completedLessons}/{totalLessons} lessons completed
                  </div>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {enrolling ? "Processing..." : course.price === 0 ? "Enroll for Free" : `Enroll for $${course.price}`}
                  {!enrolling && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Course thumbnail */}
            <div className="hidden lg:block">
              {course.thumbnail ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-card text-card-foreground px-4 py-2 rounded-lg font-bold text-2xl">
                    ${course.price}
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-white/10 flex items-center justify-center">
                  <Play className="h-20 w-20 text-white/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course content */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Build real-world applications",
                  "Master modern development practices",
                  "Deploy production-ready code",
                  "Apply industry best practices",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Basic understanding of web technologies</li>
                <li>• A computer with internet access</li>
                <li>• Willingness to learn and practice</li>
              </ul>
            </div>

            {/* Curriculum */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Course Content</h2>
                <span className="text-sm text-muted-foreground">
                  {totalLessons} lessons
                </span>
              </div>

              {lessonsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : lessons && lessons.length > 0 ? (
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const isCompleted = progress?.some(
                      (p) => p.lesson_id === lesson.id && p.completed
                    );
                    const isLocked = !isEnrolled && !lesson.is_preview;

                    return (
                      <Link
                        key={lesson.id}
                        to={isLocked ? "" : `/courses/${slug}/lessons/${lesson.id}`}
                        className={`flex items-center gap-4 p-4 rounded-lg border border-border transition-colors ${
                          isLocked
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-medium ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isLocked
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {isLocked ? <Lock className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span className={`flex-1 ${isLocked ? "text-muted-foreground" : ""}`}>
                          {lesson.title}
                        </span>
                        {lesson.duration_minutes && (
                          <span className="text-sm text-muted-foreground">
                            {lesson.duration_minutes}m
                          </span>
                        )}
                        {lesson.is_preview && !isEnrolled && (
                          <span className="text-xs bg-primary-soft text-primary px-2 py-0.5 rounded">
                            Preview
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No lessons available yet
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress card */}
            {isEnrolled && (
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Your Progress</h3>
                <Progress value={enrollment?.progress || 0} className="h-3" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{completedLessons} completed</span>
                  <span>{totalLessons - completedLessons} remaining</span>
                </div>

                {enrollment?.completed && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg text-sm text-green-600 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Course completed! View your certificate.
                  </div>
                )}

                <Button className="w-full mt-6" asChild>
                  <Link to={`/courses/${slug}/learn`}>
                    Continue Learning
                  </Link>
                </Button>
              </div>
            )}

            {/* Price card */}
            {!isEnrolled && (
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <div className="text-3xl font-bold mb-4">
                  ${course.price}
                  {course.price === 0 && (
                    <span className="text-sm text-muted-foreground font-normal">Free</span>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Processing..." : "Enroll Now"}
                </Button>

                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Access on mobile and desktop
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
