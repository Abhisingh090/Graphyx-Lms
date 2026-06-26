import { supabase } from "@/lib/supabase";
import type {
  Course,
  CourseWithProgress,
  Lesson,
  LessonWithProgress,
  Enrollment,
  Certificate,
  CertificateWithCourse,
  Payment,
  Review,
  Profile,
  DashboardStats,
  AdminStats,
} from "@/types";

// ============================================
// COURSES API
// ============================================

export const coursesApi = {
  // Get all published courses
  async getAll(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Course[];
  },

  // Get featured courses (high rated)
  async getFeatured(limit = 6) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .gte("rating", 4.5)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Course[];
  },

  // Get course by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Course;
  },

  // Get course by slug
  async getBySlug(slug: string): Promise<CourseWithProgress | null> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as CourseWithProgress;
  },

  // Get courses by instructor
  async getByInstructor(instructorId: string) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("instructor_id", instructorId);

    if (error) throw error;
    return data as Course[];
  },

  // Search courses
  async search(query: string) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data as Course[];
  },

  // Create course (admin/instructor)
  async create(course: Omit<Course, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("courses")
      .insert(course)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  // Update course (admin/instructor)
  async update(id: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  },

  // Delete course (admin/instructor)
  async delete(id: string) {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// ============================================
// LESSONS API
// ============================================

export const lessonsApi = {
  // Get all lessons for a course
  async getByCourse(courseId: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("position", { ascending: true });

    if (error) throw error;
    return data as Lesson[];
  },

  // Get lesson by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Lesson;
  },

  // Create lesson (admin/instructor)
  async create(lesson: Omit<Lesson, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("lessons")
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data as Lesson;
  },

  // Update lesson (admin/instructor)
  async update(id: string, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Lesson;
  },

  // Delete lesson (admin/instructor)
  async delete(id: string) {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Reorder lessons
  async reorder(courseId: string, lessonIds: string[]) {
    const updates = lessonIds.map((id, index) => ({
      id,
      position: index,
      updated_at: new Date().toISOString(),
    }));

    for (const update of updates) {
      await supabase
        .from("lessons")
        .update({ position: update.position })
        .eq("id", update.id);
    }
  },
};

// ============================================
// ENROLLMENTS API
// ============================================

export const enrollmentsApi = {
  // Get user's enrollments
  async getMyEnrollments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        *,
        course:courses(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((e: any) => ({
      ...e,
      course: e.course as Course,
    })) as (Enrollment & { course: Course })[];
  },

  // Check if user is enrolled
  async isEnrolled(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Enroll in course (after payment)
  async enroll(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Enrollment;
  },

  // Update progress
  async updateProgress(courseId: string, progress: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const updates: Partial<Enrollment> = { progress };
    if (progress === 100) {
      updates.completed = true;
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("enrollments")
      .update(updates)
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .select()
      .single();

    if (error) throw error;
    return data as Enrollment;
  },

  // Get enrollment for a specific course
  async getEnrollment(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) throw error;
    return data as Enrollment | null;
  },
};

// ============================================
// LESSON PROGRESS API
// ============================================

export const lessonProgressApi = {
  // Get progress for all lessons in a course
  async getByCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get all lessons for the course
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);

    if (!lessons || lessons.length === 0) return [];

    const lessonIds = lessons.map((l) => l.id);

    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    if (error) throw error;
    return data;
  },

  // Mark lesson as complete
  async markComplete(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark lesson as incomplete
  async markIncomplete(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("lesson_progress")
      .update({
        completed: false,
        completed_at: null,
      })
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);

    if (error) throw error;
  },
};

// ============================================
// CERTIFICATES API
// ============================================

export const certificatesApi = {
  // Get user's certificates
  async getMy() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("certificates")
      .select(`
        *,
        course:courses(*)
      `)
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (error) throw error;

    return data.map((c: any) => ({
      ...c,
      course: c.course as Course,
    })) as CertificateWithCourse[];
  },

  // Generate certificate
  async generate(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Check if already exists
    const existing = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing.data) {
      return existing.data as Certificate;
    }

    // Generate certificate URL (simplified - in production, generate actual PDF)
    const certificateUrl = `${window.location.origin}/certificates/${user.id}/${courseId}`;

    const { data, error } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        course_id: courseId,
        certificate_url: certificateUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Certificate;
  },

  // Verify certificate
  async verify(certificateId: string) {
    const { data, error } = await supabase
      .from("certificates")
      .select(`
        *,
        profile:profiles(full_name),
        course:courses(title)
      `)
      .eq("id", certificateId)
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================
// PAYMENTS API
// ============================================

export const paymentsApi = {
  // Create payment record
  async create(courseId: string, amount: number, sessionId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        amount,
        currency: "usd",
        status: "pending",
        stripe_checkout_session_id: sessionId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Get payment by session ID
  async getBySessionId(sessionId: string) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_checkout_session_id", sessionId)
      .maybeSingle();

    if (error) throw error;
    return data as Payment | null;
  },

  // Update payment status
  async updateStatus(paymentId: string, status: Payment["status"], paymentIntentId?: string) {
    const updates: Partial<Payment> = { status };
    if (paymentIntentId) {
      updates.stripe_payment_intent_id = paymentIntentId;
    }

    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  // Get user's payment history
  async getMyPayments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        course:courses(id, title, thumbnail)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

// ============================================
// REVIEWS API
// ============================================

export const reviewsApi = {
  // Get reviews for a course
  async getByCourse(courseId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profile:profiles(full_name, avatar_url)
      `)
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (Review & { profile: { full_name: string | null; avatar_url: string | null } })[];
  },

  // Create or update review
  async createOrUpdate(courseId: string, rating: number, comment?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("reviews")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  // Delete review
  async delete(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (error) throw error;
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  // Get student dashboard stats
  async getStudentStats(): Promise<DashboardStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get enrollments count
    const { count: enrolledCourses } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get completed courses
    const { count: completedCourses } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true);

    // Get certificates count
    const { count: certificatesEarned } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Calculate total hours (simplified)
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("progress, course:courses(duration_hours)")
      .eq("user_id", user.id);

    let totalHoursLearned = 0;
    if (enrollments) {
      for (const e of enrollments) {
        const course = e.course as any;
        if (course?.duration_hours) {
          totalHoursLearned += (course.duration_hours * (e.progress || 0)) / 100;
        }
      }
    }

    return {
      enrolledCourses: enrolledCourses || 0,
      completedCourses: completedCourses || 0,
      certificatesEarned: certificatesEarned || 0,
      totalHoursLearned: Math.round(totalHoursLearned * 10) / 10,
    };
  },

  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    const { count: totalStudents } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    const { count: totalCourses } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    const { data: revenue } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "completed");

    const totalRevenue = revenue?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    const { count: pendingPayments } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return {
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalRevenue,
      pendingPayments: pendingPayments || 0,
    };
  },
};

// ============================================
// PROFILES API (Admin)
// ============================================

export const profilesApi = {
  // Get all profiles (admin)
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Profile[];
  },

  // Get profile by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  // Update profile role (admin)
  async updateRole(id: string, role: Profile["role"]) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },
};
