import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateCertificateHTML(
  userName: string,
  courseName: string,
  instructorName: string,
  completionDate: string,
  certificateId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate of Completion</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .certificate {
      background: white;
      width: 800px;
      min-height: 600px;
      padding: 60px;
      border: 8px solid #6C3FF5;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }

    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #EDE9FE;
      pointer-events: none;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      font-size: 40px;
      font-weight: 700;
      color: #6C3FF5;
      font-family: 'Playfair Display', serif;
      margin-bottom: 20px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 14px;
      letter-spacing: 8px;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
    }

    .main-title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .content {
      text-align: center;
      padding: 0 40px;
    }

    .recipient {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }

    .name {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: #1a1a2e;
      margin-bottom: 30px;
      border-bottom: 2px solid #F5A623;
      display: inline-block;
      padding-bottom: 10px;
    }

    .course-label {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }

    .course-name {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 30px;
    }

    .completion-text {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
    }

    .date {
      color: #6C3FF5;
      font-weight: 600;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid #EDE9FE;
    }

    .signature {
      text-align: center;
      width: 200px;
    }

    .signature-line {
      border-top: 2px solid #1a1a2e;
      margin-bottom: 10px;
      padding-top: 20px;
    }

    .signature-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 14px;
    }

    .signature-title {
      font-size: 12px;
      color: #666;
    }

    .certificate-id {
      position: absolute;
      bottom: 20px;
      right: 40px;
      font-size: 10px;
      color: #999;
    }

    .badge {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6C3FF5 0%, #F5A623 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge-inner {
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge-icon {
      font-size: 30px;
      color: #6C3FF5;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="badge">
      <div class="badge-inner">
        <span class="badge-icon">&#127942;</span>
      </div>
    </div>

    <div class="header">
      <div class="logo">Graphyx</div>
      <div class="title">Certificate of Completion</div>
      <div class="main-title">Certificate of Achievement</div>
    </div>

    <div class="content">
      <div class="recipient">This certifies that</div>
      <div class="name">${userName}</div>
      <div class="course-label">has successfully completed</div>
      <div class="course-name">${courseName}</div>
      <div class="completion-text">
        This certifies that the above named individual has completed all requirements for this course,
        demonstrating proficiency and commitment to learning.<br><br>
        <span class="date">Completed on ${completionDate}</span>
        <br><br>
        Instructor: ${instructorName}
      </div>
    </div>

    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-title">Date</div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">Graphyx Academy</div>
        <div class="signature-title">Authorized Signature</div>
      </div>
    </div>

    <div class="certificate-id">Certificate ID: ${certificateId}</div>
  </div>
</body>
</html>
`;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get profile
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=full_name`,
      {
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!profileRes.ok) {
      throw new Error("Failed to fetch profile");
    }

    const profiles = await profileRes.json();
    const profile = profiles[0];
    const userName = profile?.full_name || "Student";

    // Get course
    const courseRes = await fetch(
      `${supabaseUrl}/rest/v1/courses?id=eq.${courseId}&select=title,instructor_name`,
      {
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!courseRes.ok) {
      throw new Error("Failed to fetch course");
    }

    const courses = await courseRes.json();
    const course = courses[0];
    const courseName = course?.title || "Course";
    const instructorName = course?.instructor_name || "Graphyx Instructor";

    // Generate certificate HTML
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = generateCertificateHTML(userName, courseName, instructorName, completionDate, certificateId);

    // Return HTML for client-side PDF generation or display
    return new Response(
      JSON.stringify({
        html,
        certificateId,
        userName,
        courseName,
        completionDate,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Certificate generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
