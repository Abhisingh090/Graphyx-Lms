import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Auth methods
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,
      initialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      initialize: async () => {
        const { initialized } = get();
        if (initialized) return;

        set({ loading: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            set({
              user: session.user,
              session,
              profile: profile || null,
              loading: false,
              initialized: true,
            });
          } else {
            set({
              user: null,
              session: null,
              profile: null,
              loading: false,
              initialized: true,
            });
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

              set({
                user: session.user,
                session,
                profile: profile || null,
                loading: false,
              });
            } else if (event === "SIGNED_OUT") {
              set({
                user: null,
                session: null,
                profile: null,
                loading: false,
              });
            } else if (event === "TOKEN_REFRESHED" && session) {
              set({ session });
            }
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({
            loading: false,
            initialized: true,
            error: "Failed to initialize authentication",
          });
        }
      },

      signIn: async (email, password, rememberMe = false) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            set({
              user: data.user,
              session: data.session,
              profile: profile || null,
              loading: false,
            });
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to sign in";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      signUp: async (email, password, fullName) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Profile will be created automatically via database trigger
            // Wait a moment for the trigger to complete
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();

            set({
              user: data.user,
              session: data.session,
              profile: profile || null,
              loading: false,
            });
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create account";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      signInWithGoogle: async () => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;

          // OAuth will redirect, so we don't update state here
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to sign in with Google";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      signOut: async () => {
        set({ loading: true });

        try {
          await supabase.auth.signOut();

          set({
            user: null,
            session: null,
            profile: null,
            loading: false,
          });
        } catch (error) {
          console.error("Sign out error:", error);
          set({ loading: false });
        }
      },

      resetPassword: async (email) => {
        set({ loading: true, error: null });

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) throw error;

          set({ loading: false });
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send reset email";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      updatePassword: async (newPassword) => {
        set({ loading: true, error: null });

        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) throw error;

          set({ loading: false });
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update password";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { error: "Not authenticated" };

        set({ loading: true, error: null });

        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single();

          if (error) throw error;

          set({ profile, loading: false });
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update profile";
          set({ loading: false, error: message });
          return { error: message };
        }
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          set({ profile: profile || null });
        } catch (error) {
          console.error("Failed to refresh profile:", error);
        }
      },
    }),
    {
      name: "graphyx-auth-storage",
      partialize: (state) => ({
        // Don't persist user or session - let Supabase handle that
        // Only persist flags we need
      }),
    }
  )
);

// Utility hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user && !!state.session);
export const useIsLoading = () => useAuthStore((state) => state.loading);
export const useUserRole = (): UserRole | null => useAuthStore((state) => state.profile?.role ?? null);
export const useIsAdmin = () => useAuthStore((state) => state.profile?.role === "admin" || state.profile?.role === "instructor");
