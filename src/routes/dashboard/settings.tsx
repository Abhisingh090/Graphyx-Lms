import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore, useProfile } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const profile = useProfile();
  const { user, updateProfile, updatePassword, refreshProfile } = useAuthStore();

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: () => updateProfile(profileForm),
    onSuccess: () => {
      refreshProfile();
      toast.success("Profile updated successfully");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (passwordForm.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Verify current password first
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: passwordForm.currentPassword,
      });

      if (verifyError) {
        throw new Error("Current password is incorrect");
      }

      return updatePassword(passwordForm.newPassword);
    },
    onSuccess: () => {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate();
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const initials = profile.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileForm.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1.5 block">
                      Avatar URL
                    </label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileForm.avatar_url}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            avatar_url: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/avatar.jpg"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Full name */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={profileForm.full_name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Bio</label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    New Password
                  </label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Confirm New Password
                  </label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                {changePasswordMutation.isError && (
                  <p className="text-sm text-destructive">
                    {changePasswordMutation.error?.message || "Failed to change password"}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
