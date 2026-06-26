import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CircleCheck as CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { verifyPayment } from "@/services/stripe";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/payment/success")({
  component: PaymentSuccessPage,
  validateSearch: (search) => ({
    session_id: search.session_id as string | undefined,
    course_id: search.course_id as string | undefined,
  }),
});

function PaymentSuccessPage() {
  const search = useSearch({ from: "/payment/success" });
  const queryClient = useQueryClient();

  // Verify payment
  const { data: result, isLoading } = useQuery({
    queryKey: ["verify-payment", search.session_id],
    queryFn: () => {
      if (search.session_id) {
        return verifyPayment(search.session_id);
      }
      return null;
    },
    enabled: !!search.session_id,
  });

  useEffect(() => {
    if (result?.success && result.courseId) {
      queryClient.invalidateQueries({ queryKey: ["enrollment", result.courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      toast.success("Successfully enrolled in the course!");
    }
  }, [result, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {result?.success ? (
          <>
            <div className="mx-auto h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-8">
              You have been enrolled in the course. Start learning now!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={`/courses/${search.course_id || ""}/learn`}>
                <Button size="lg">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto h-24 w-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Processed
            </h1>
            <p className="text-muted-foreground mb-8">
              Your payment is being processed. You'll receive a confirmation email shortly.
            </p>
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
