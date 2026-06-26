// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id' | 'created_at'>;
        Update: Partial<Omit<Enrollment, 'id' | 'user_id' | 'course_id'>>;
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Omit<LessonProgress, 'id' | 'created_at'>;
        Update: Partial<Omit<LessonProgress, 'id' | 'user_id' | 'lesson_id'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'id' | 'issued_at'>;
        Update: Partial<Omit<Certificate, 'id' | 'user_id' | 'course_id'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'user_id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'user_id' | 'course_id'>>;
      };
    };
  };
}

// Profile types
export type UserRole = 'student' | 'admin' | 'instructor';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Course types
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  level: CourseLevel;
  instructor_id: string | null;
  instructor_name: string | null;
  duration_hours: number | null;
  rating: number;
  reviews_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseWithProgress extends Course {
  enrollment?: Enrollment;
  lessons?: Lesson[];
  progress?: number;
  completed?: boolean;
}

// Lesson types
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  position: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonWithProgress extends Lesson {
  completed?: boolean;
  isLocked?: boolean;
}

// Enrollment types
export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

// Lesson Progress types
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

// Certificate types
export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string | null;
  issued_at: string;
}

export interface CertificateWithCourse extends Certificate {
  course?: Course;
}

// Payment types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  user_id: string;
  course_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Dashboard stats
export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  totalHoursLearned: number;
}

// Admin stats
export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  pendingPayments: number;
}
