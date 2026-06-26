import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, Plus, CreditCard as Edit, Trash2, Search, Eye, MoveVertical as MoreVertical, EyeOff } from "lucide-react";
import { coursesApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Course } from "@/types";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCoursesPage,
});

function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  // Fetch all courses (including drafts)
  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => coursesApi.getAll(100),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete course");
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      coursesApi.update(id, { is_published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Course updated");
    },
  });

  const filteredCourses = courses?.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (course: Course) => {
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      deleteMutation.mutate(course.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Courses</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your courses
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCourse(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </DialogTrigger>
          <CourseFormDialog
            course={editingCourse}
            onClose={() => {
              setDialogOpen(false);
              setEditingCourse(null);
            }}
          />
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Courses table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Instructor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Level
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-12 w-20 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-20 rounded-md bg-muted flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-xs">{course.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {course.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{course.instructor_name || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          course.level === "beginner"
                            ? "bg-primary-soft text-primary"
                            : course.level === "intermediate"
                              ? "bg-accent/15 text-[color:var(--accent-foreground)]"
                              : "bg-navy text-navy-foreground"
                        }`}
                      >
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">${course.price}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          togglePublishMutation.mutate({
                            id: course.id,
                            is_published: !course.is_published,
                          })
                        }
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          course.is_published
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
                        }`}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCourse(course);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              togglePublishMutation.mutate({
                                id: course.id,
                                is_published: !course.is_published,
                              })
                            }
                          >
                            {course.is_published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(course)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-xl">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No courses match your search."
              : "Get started by creating your first course."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Course form dialog
function CourseFormDialog({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: course?.title || "",
    slug: course?.slug || "",
    description: course?.description || "",
    thumbnail: course?.thumbnail || "",
    price: course?.price.toString() || "0",
    level: course?.level || "beginner",
    instructor_name: course?.instructor_name || "",
    duration_hours: course?.duration_hours?.toString() || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        thumbnail: formData.thumbnail || null,
        price: parseFloat(formData.price) || 0,
        level: formData.level as "beginner" | "intermediate" | "advanced",
        instructor_name: formData.instructor_name,
        duration_hours: formData.duration_hours ? parseFloat(formData.duration_hours) : null,
        is_published: course?.is_published ?? false,
      };

      if (course) {
        await coursesApi.update(course.id, data);
        toast.success("Course updated successfully");
      } else {
        await coursesApi.create(data);
        toast.success("Course created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      onClose();
    } catch (error) {
      toast.error("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{course ? "Edit Course" : "Create New Course"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: prev.slug || generateSlug(e.target.value),
                }));
              }}
              placeholder="Course title"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Slug</label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="course-slug"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Course description"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Thumbnail URL</label>
          <Input
            value={formData.thumbnail || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))
            }
            placeholder="https://..."
            type="url"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Price ($)</label>
            <Input
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Level</label>
            <Select
              value={formData.level}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, level: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Duration (hours)</label>
            <Input
              value={formData.duration_hours || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration_hours: e.target.value }))
              }
              type="number"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Instructor Name</label>
          <Input
            value={formData.instructor_name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, instructor_name: e.target.value }))
            }
            placeholder="John Doe"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
