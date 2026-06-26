import { supabase } from "@/lib/supabase";
import { paymentsApi, enrollmentsApi, certificatesApi, lessonsApi } from "./api";

// Stripe checkout session response
interface CheckoutSessionResponse {
  sessionId: string;
  url?: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  courseId: string;
  enrollmentId?: string;
  error?: string;
}

// Create Stripe checkout session via Supabase Edge Function
export async function createCheckoutSession(courseId: string): Promise<CheckoutSessionResponse> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get course details
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, price, slug")
    .eq("id", courseId)
    .single();

  if (courseError || !course) throw new Error("Course not found");

  // Check if already enrolled
  const enrolled = await enrollmentsApi.isEnrolled(courseId);
  if (enrolled) throw new Error("Already enrolled in this course");

  // For free courses, enroll directly
  if (course.price === 0) {
    const enrollment = await enrollmentsApi.enroll(courseId);
    return {
      sessionId: "",
      url: `/courses/${course.slug}?enrolled=true`,
    };
  }

  // Call Supabase Edge Function to create Stripe checkout session
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      courseId,
      courseTitle: course.title,
      price: course.price,
      successUrl: `${window.location.origin}/payment/success?course_id=${courseId}`,
      cancelUrl: `${window.location.origin}/payment/cancel?course_id=${courseId}`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create checkout session");
  }

  const { sessionId } = await response.json();

  // Create pending payment record
  await paymentsApi.create(courseId, course.price, sessionId);

  // Redirect to Stripe Checkout
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  // Load Stripe.js and redirect
  const stripe = await loadStripe(stripePublishableKey);

  if (!stripe) {
    // Return session ID for manual redirect
    return { sessionId };
  }

  // Note: In a real implementation, you'd use Stripe.js to redirect
  // For now, return the session ID
  return { sessionId };
}

// Verify payment after Stripe redirect
export async function verifyPayment(sessionId: string): Promise<PaymentVerificationResponse> {
  const payment = await paymentsApi.getBySessionId(sessionId);

  if (!payment) {
    return { success: false, courseId: "", error: "Payment not found" };
  }

  if (payment.status === "completed") {
    return {
      success: true,
      courseId: payment.course_id || "",
      enrollmentId: payment.id,
    };
  }

  // Verify with Stripe via edge function
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      courseId: payment.course_id || "",
      error: error.message || "Payment verification failed",
    };
  }

  const result = await response.json();

  if (result.paymentStatus === "paid") {
    // Update payment status
    await paymentsApi.updateStatus(payment.id, "completed", result.paymentIntentId);

    // Enroll user
    const enrollment = await enrollmentsApi.enroll(payment.course_id!);

    return {
      success: true,
      courseId: payment.course_id || "",
      enrollmentId: enrollment.id,
    };
  }

  // Update payment as failed
  await paymentsApi.updateStatus(payment.id, "failed");

  return {
    success: false,
    courseId: payment.course_id || "",
    error: "Payment was not completed",
  };
}

// Helper to load Stripe.js
async function loadStripe(publishableKey?: string) {
  if (!publishableKey) return null;

  if (typeof window !== "undefined" && !window.Stripe) {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    document.head.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }

  return window.Stripe ? window.Stripe(publishableKey) : null;
}

// Calculate course progress from lessons
export async function calculateCourseProgress(courseId: string): Promise<number> {
  const lessons = await lessonsApi.getByCourse(courseId);

  if (lessons.length === 0) return 0;

  const progress = await supabase
    .from("lesson_progress")
    .select("*")
    .in("lesson_id", lessons.map((l) => l.id));

  if (!progress.data || progress.data.length === 0) return 0;

  const completedCount = progress.data.filter((p) => p.completed).length;
  const percentage = (completedCount / lessons.length) * 100;

  // Update enrollment progress
  await enrollmentsApi.updateProgress(courseId, Math.round(percentage * 100) / 100);

  // If 100% complete, generate certificate
  if (percentage === 100) {
    await certificatesApi.generate(courseId);
  }

  return Math.round(percentage * 100) / 100;
}

// Extend Window interface for Stripe
declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}
