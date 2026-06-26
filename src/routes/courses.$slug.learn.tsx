import { createFileRoute, Link, useParams, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
  Check,
  Clock,
  ArrowLeft,
  Menu as MenuIcon,
  X,
  FileText,
  ChevronRight,
} from "lucide-react";
import { coursesApi, lessonsApi, lessonProgressApi, enrollmentsApi } from "@/services/api";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { Lesson } from "@/types";

export const Route = createFileRoute("/courses/$slug/learn")({
  component: CourseLearnPage,
  validateSearch: (search) => ({
    lesson: search.lesson as string | undefined,
  }),
});

function CourseLearnPage() {
  const { slug } = useParams({ from: "/courses/$slug/learn" });
  const search = useSearch({ from: "/courses/$slug/learn" });
  const isAuthenticated = useIsAuthenticated();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    enabled: !!course?.id,
  });

  // Fetch lesson progress
  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", course?.id],
    queryFn: () => lessonProgressApi.getByCourse(course?.id || ""),
    enabled: !!course?.id && !!enrollment,
  });

  // Mark complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: lessonProgressApi.markComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", course?.id] });
      toast.success("Lesson marked as complete!");
    },
  });

  // Set initial lesson
  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLessonId) {
      // Try to find incomplete lesson or first lesson
      const incompleteLesson = lessons.find(
        (l) => !progress?.some((p) => p.lesson_id === l.id && p.completed)
      );
      setCurrentLessonId(search.lesson || incompleteLesson?.id || lessons[0].id);
    }
  }, [lessons, progress, search.lesson, currentLessonId]);

  const currentLesson = lessons?.find((l) => l.id === currentLessonId);
  const currentLessonIndex = lessons?.findIndex((l) => l.id === currentLessonId) ?? 0;
  const completedCount = lessons?.filter((l) =>
    progress?.some((p) => p.lesson_id === l.id && p.completed)
  ).length || 0;

  const isLessonCompleted = (lessonId: string) =>
    progress?.some((p) => p.lesson_id === lessonId && p.completed) || false;

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLessonId(lesson.id);
    setSidebarOpen(false);
    setVideoPlaying(false);
  };

  const handleMarkComplete = () => {
    if (currentLessonId) {
      markCompleteMutation.mutate(currentLessonId);
    }
  };

  const handleNextLesson = () => {
    if (!lessons) return;
    const nextIdx = currentLessonIndex + 1;
    if (nextIdx < lessons.length) {
      setCurrentLessonId(lessons[nextIdx].id);
      setVideoPlaying(false);
    }
  };

  const handlePrevLesson = () => {
    if (!lessons) return;
    const prevIdx = currentLessonIndex - 1;
    if (prevIdx >= 0) {
      setCurrentLessonId(lessons[prevIdx].id);
      setVideoPlaying(false);
    }
  };

  // Redirect if not enrolled
  if (!isAuthenticated || (enrollment !== undefined && !enrollment)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need to enroll in this course to access the lessons.
          </p>
          <Link to={`/courses/${slug}`}>
            <Button>Go to Course Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-4xl p-8">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!course || !lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border overflow-y-auto transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold line-clamp-1">{course.title}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{completedCount}/{lessons.length} completed</span>
            <span>{Math.round((completedCount / lessons.length) * 100)}%</span>
          </div>
          <Progress
            value={(completedCount / lessons.length) * 100}
            className="h-2 mt-2"
          />
        </div>

        <div className="p-2">
          {lessons.map((lesson, idx) => {
            const completed = isLessonCompleted(lesson.id);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                  isCurrent
                    ? "bg-primary/10 border-l-2 border-primary"
                    : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-medium ${
                    completed
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {completed ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium line-clamp-2 ${
                      completed ? "text-muted-foreground" : ""
                    }`}
                  >
                    {lesson.title}
                  </p>
                  {lesson.duration_minutes && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lesson.duration_minutes}m
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-muted"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <Link
                to={`/courses/${slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to course
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {currentLesson && (
                <span className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Video player */}
        <main className="p-4 lg:p-6">
          {currentLesson ? (
            <div className="space-y-6">
              {/* Video container */}
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                {currentLesson.video_url ? (
                  <video
                    ref={videoRef}
                    src={currentLesson.video_url}
                    className="w-full h-full"
                    controls
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Play className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg opacity-70">Video coming soon</p>
                    <p className="text-sm opacity-50">
                      Lesson content will be available shortly
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson info */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                  {currentLesson.description && (
                    <p className="text-muted-foreground mt-2">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex === 0}
                  >
                    <SkipBack className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {isLessonCompleted(currentLessonId) ? (
                    <Button
                      variant="outline"
                      className="bg-green-500/10 text-green-600 border-green-500/20"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  ) : (
                    <Button onClick={handleMarkComplete}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex >= lessons.length - 1}
                  >
                    Next
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Resources section */}
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lesson Resources
                </h2>
                <div className="bg-muted/40 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    No additional resources for this lesson.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Select a lesson to start learning</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
