import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Circle as XCircle, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment/cancel")({
  component: PaymentCancelPage,
  validateSearch: (search) => ({
    course_id: search.course_id as string | undefined,
  }),
});

function PaymentCancelPage() {
  const search = useSearch({ from: "/payment/cancel" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-8">
          Your payment was cancelled. No charges have been made.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {search.course_id && (
            <Link to={`/courses/$slug`} params={{ slug: search.course_id }}>
              <Button size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          )}
          <Link to="/">
            <Button size="lg" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
