import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Shield,
  User,
} from "lucide-react";
import { profilesApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile } from "@/types";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);

  // Fetch students
  const { data: students, isLoading } = useQuery({
    queryKey: ["admin-students", roleFilter],
    queryFn: () => profilesApi.getAll(100),
  });

  const filteredStudents = students?.filter((s) => {
    const matchesSearch =
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || s.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const studentsByRole = {
    students: filteredStudents?.filter((s) => s.role === "student") || [],
    admins: filteredStudents?.filter((s) => s.role === "admin") || [],
    instructors: filteredStudents?.filter((s) => s.role === "instructor") || [],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Students</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all registered users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="instructor">Instructors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-soft grid place-items-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentsByRole.students.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/15 grid place-items-center">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentsByRole.instructors.length}</p>
              <p className="text-xs text-muted-foreground">Instructors</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-navy text-navy-foreground grid place-items-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentsByRole.admins.length}</p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredStudents && filteredStudents.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Joined
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {student.full_name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {student.full_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          student.role === "admin"
                            ? "default"
                            : student.role === "instructor"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {student.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-xl">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            {searchQuery || roleFilter !== "all"
              ? "No users match your filters."
              : "No users have registered yet."}
          </p>
        </div>
      )}

      {/* Student detail dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStudent.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {selectedStudent.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-semibold">
                    {selectedStudent.full_name || "Unknown"}
                  </p>
                  <Badge className="mt-1">{selectedStudent.role}</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{selectedStudent.id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span>
                    {new Date(selectedStudent.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {selectedStudent.bio && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">Bio</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.bio}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
