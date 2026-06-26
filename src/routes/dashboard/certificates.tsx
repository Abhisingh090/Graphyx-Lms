import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, ExternalLink, Calendar } from "lucide-react";
import { certificatesApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/certificates")({
  component: CertificatesPage,
});

function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: certificatesApi.getMy,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
        <p className="text-muted-foreground mt-1">Your earned certificates and achievements</p>
      </div>

      {/* Certificates grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : certificates && certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-xl">
          <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
          <p className="text-muted-foreground">
            Complete a course to earn your first certificate
          </p>
        </div>
      )}
    </div>
  );
}

function CertificateCard({ certificate }: { certificate: any }) {
  const course = certificate.course;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border rounded-xl overflow-hidden">
      {/* Certificate preview */}
      <div className="relative p-6">
        {/* Badge */}
        <div className="absolute top-4 right-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Course thumbnail or placeholder */}
        {course?.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-20 h-20 rounded-lg object-cover mb-4"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Award className="h-10 w-10 text-primary" />
          </div>
        )}

        {/* Course info */}
        <h3 className="font-semibold text-lg line-clamp-2 pr-8">{course?.title}</h3>

        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(certificate.issued_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <a href={`/certificates/${certificate.id}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </a>
        </Button>
        <Button className="flex-1" asChild>
          <a href={`/api/certificates/${certificate.id}/download`} download>
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
