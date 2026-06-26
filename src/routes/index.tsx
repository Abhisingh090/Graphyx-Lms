import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Star,
  Play,
  Award,
  Users,
  Clock,
  GraduationCap,
  Smartphone,
  LayoutDashboard,
  Infinity as InfinityIcon,
  Sparkles,
  Check,
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileText,
  StickyNote,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

import heroDashboard from "@/assets/hero-dashboard.jpg";
import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";
import course4 from "@/assets/course-4.jpg";
import course5 from "@/assets/course-5.jpg";
import course6 from "@/assets/course-6.jpg";
import inst1 from "@/assets/instructor-1.jpg";
import inst2 from "@/assets/instructor-2.jpg";
import inst3 from "@/assets/instructor-3.jpg";
import inst4 from "@/assets/instructor-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Graphyx LMS — Learn Premium Skills Online" },
      {
        name: "description",
        content:
          "Premium online learning platform with expert-led courses, certifications, and a beautiful learning dashboard.",
      },
      { property: "og:title", content: "Graphyx LMS — Learn Premium Skills Online" },
      {
        property: "og:description",
        content: "Master in-demand skills with premium courses and certifications.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCourses />
        <Stats />
        <WhyChoose />
        <PlayerPreview />
        <Testimonials />
        <Instructors />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

/* ───────────────── Navbar ───────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#courses", label: "Courses" },
    { href: "#pricing", label: "Digital Bundles" },
    { href: "#why", label: "About" },
    { href: "#cta", label: "Contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Graphyx</span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Cart"
              className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                3
              </span>
            </button>

            <a
              href="#pricing"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:opacity-90 transition-all hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </a>

            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden h-10 w-10 grid place-items-center rounded-xl hover:bg-muted"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-up">
            <nav className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-3 shadow-card">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#pricing"
                className="mt-1 inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

/* ───────────────── Hero ───────────────── */

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden gradient-hero text-navy-foreground pt-28 pb-24 lg:pt-36 lg:pb-32">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/40 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl animate-blob" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              #1 Premium Learning Platform of 2026
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
              Upgrade Your Skills With{" "}
              <span className="gradient-text">Premium Online Courses</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed">
              Learn anywhere, anytime from world-class instructors. Build real projects,
              earn recognized certificates, and accelerate your career on your schedule.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Explore Courses <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#preview"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl glass-dark text-white font-semibold hover:bg-white/15 transition-all"
              >
                <Play className="h-4 w-4 text-accent" /> Start Learning
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[inst1, inst2, inst3, inst4].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-navy"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-1 text-white text-sm font-semibold">4.9</span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  Trusted by <span className="text-white font-semibold">120,000+</span> students worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Right side — dashboard mock */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl overflow-hidden glass-dark shadow-glow">
              <img
                src={heroDashboard}
                alt="Graphyx learning dashboard preview"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </div>

            {/* Floating cards */}
            <div className="hidden sm:flex absolute -left-4 top-10 glass-card rounded-2xl px-4 py-3 shadow-card items-center gap-3 animate-float">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Certificate earned</p>
                <p className="text-sm font-semibold text-foreground">UI/UX Pro</p>
              </div>
            </div>

            <div className="hidden sm:block absolute -right-4 top-1/2 glass-card rounded-2xl p-4 shadow-card animate-float [animation-delay:600ms]">
              <p className="text-xs text-muted-foreground">Course progress</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">React Mastery</p>
              <div className="mt-2 h-1.5 w-40 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
              <p className="text-xs text-primary font-semibold mt-1">75% complete</p>
            </div>

            <div className="hidden sm:flex absolute -bottom-4 left-1/3 glass-card rounded-2xl px-4 py-3 shadow-card items-center gap-3 animate-float [animation-delay:300ms]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Live students</p>
                <p className="text-sm font-semibold text-foreground">+1,284 today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Featured Courses ───────────────── */

type Course = {
  img: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: string;
};

const courses: Course[] = [
  { img: course1, level: "Beginner", title: "Full-Stack Web Development", instructor: "Sarah Chen", rating: 4.9, reviews: 2410, price: "$49" },
  { img: course2, level: "Intermediate", title: "UI/UX Design Masterclass", instructor: "Marcus Lee", rating: 4.8, reviews: 1820, price: "$59" },
  { img: course3, level: "Advanced", title: "Data Science & Machine Learning", instructor: "Amelia Rodriguez", rating: 4.9, reviews: 3105, price: "$79" },
  { img: course4, level: "Beginner", title: "Digital Marketing Strategy", instructor: "David Park", rating: 4.7, reviews: 1240, price: "$39" },
  { img: course5, level: "Intermediate", title: "Photography Masterclass", instructor: "Sarah Chen", rating: 4.8, reviews: 940, price: "$45" },
  { img: course6, level: "Advanced", title: "Business Strategy & Growth", instructor: "Marcus Lee", rating: 4.9, reviews: 1675, price: "$69" },
];

function levelStyles(l: Course["level"]) {
  if (l === "Beginner") return "bg-primary-soft text-primary";
  if (l === "Intermediate") return "bg-accent/15 text-[color:var(--accent-foreground)]";
  return "bg-navy text-navy-foreground";
}

function FeaturedCourses() {
  return (
    <section id="courses" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Featured Courses"
          title="Hand-picked courses to level up"
          subtitle="Explore best-selling programs taught by industry experts and start building real-world skills today."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <article
              key={c.title}
              className="group relative rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  width={1024}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute top-3 left-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${levelStyles(c.level)}`}
                >
                  {c.level}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 text-accent text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(c.rating) ? "fill-current" : ""}`}
                    />
                  ))}
                  <span className="ml-1 text-foreground font-semibold">{c.rating}</span>
                  <span className="text-muted-foreground">({c.reviews.toLocaleString()})</span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-foreground leading-snug line-clamp-2">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">By {c.instructor}</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-bold gradient-text">{c.price}</span>
                  <button className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Stats ───────────────── */

function useCounter(target: number, ms = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / ms);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, ms]);

  return { val, ref };
}

function StatItem({ value, suffix, label, icon: Icon }: {
  value: number; suffix: string; label: string; icon: typeof Users;
}) {
  const { val, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-accent mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <div className="font-display text-4xl sm:text-5xl font-bold text-white tabular-nums">
        {val.toLocaleString()}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-white/70">{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="relative py-20 gradient-hero overflow-hidden">
      <div className="pointer-events-none absolute -top-20 right-1/3 h-80 w-80 rounded-full bg-primary/40 blur-3xl animate-blob" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          <StatItem value={120} suffix="K+" label="Students enrolled" icon={Users} />
          <StatItem value={850} suffix="+" label="Courses available" icon={BookOpen} />
          <StatItem value={12500} suffix="+" label="Hours of content" icon={Clock} />
          <StatItem value={48} suffix="K+" label="Certificates issued" icon={Award} />
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Why Choose Us ───────────────── */

const features = [
  { icon: Clock, title: "Learn at your own pace", desc: "Self-paced lessons that fit any schedule, on any device." },
  { icon: Award, title: "Certificate on completion", desc: "Earn recognized certificates to showcase your new skills." },
  { icon: GraduationCap, title: "Industry expert instructors", desc: "Learn from practitioners working at top global companies." },
  { icon: Smartphone, title: "Mobile-friendly learning", desc: "Seamless experience across desktop, tablet, and mobile." },
  { icon: LayoutDashboard, title: "Personalized dashboard", desc: "Track progress, streaks, and goals in one beautiful place." },
  { icon: InfinityIcon, title: "Lifetime access", desc: "Buy once, learn forever. Updates included at no extra cost." },
];

function WhyChoose() {
  return (
    <section id="why" className="py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Why Choose Graphyx"
          title="Built for learners who want more"
          subtitle="Everything you need to master new skills — from beautifully crafted lessons to lifetime access."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Course Player Preview ───────────────── */

function PlayerPreview() {
  return (
    <section id="preview" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Course Player"
          title="A learning experience you'll love"
          subtitle="Distraction-free video lessons, curriculum at a glance, notes, and resources — all in one cohesive interface."
        />

        <div className="mt-14 rounded-3xl bg-navy text-navy-foreground p-3 sm:p-5 shadow-glow border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 sm:gap-5">
            {/* Video + controls */}
            <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <div className="relative aspect-video bg-gradient-to-br from-primary/40 via-navy to-black grid place-items-center">
                <button className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </button>
                <span className="absolute bottom-4 left-4 text-xs glass-dark rounded-full px-3 py-1">
                  Lesson 04 · 12:34
                </span>
              </div>

              {/* Progress + tabs */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Building components with React</span>
                  <span>62% complete</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  {[
                    { icon: StickyNote, label: "Notes" },
                    { icon: FileText, label: "Resources" },
                    { icon: Users, label: "Discussion" },
                  ].map((t, i) => (
                    <button
                      key={t.label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "glass-dark text-white/80 hover:text-white"
                      }`}
                    >
                      <t.icon className="h-3.5 w-3.5" /> {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Curriculum sidebar */}
            <aside className="rounded-2xl glass-dark p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Curriculum</h4>
                <span className="text-xs text-white/60">8 lessons</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {[
                  { t: "Intro to the course", d: "04:12", done: true },
                  { t: "Setting up your environment", d: "08:30", done: true },
                  { t: "JSX & components", d: "12:05", done: true },
                  { t: "Building components with React", d: "14:48", active: true },
                  { t: "State & hooks", d: "16:20" },
                  { t: "Data fetching patterns", d: "11:55" },
                  { t: "Routing essentials", d: "09:42" },
                  { t: "Final project walkthrough", d: "22:10" },
                ].map((l, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                      l.active
                        ? "bg-primary/20 border border-primary/40"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${
                        l.done
                          ? "bg-accent text-accent-foreground"
                          : l.active
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/10 text-white/70"
                      }`}
                    >
                      {l.done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className="flex-1 min-w-0 truncate">{l.t}</span>
                    <span className="text-xs text-white/60 shrink-0">{l.d}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Testimonials ───────────────── */

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    avatar: inst3,
    quote:
      "Graphyx completely changed my career. The courses are practical, beautifully produced, and the community is incredibly supportive.",
    rating: 5,
  },
  {
    name: "James O'Connor",
    role: "Product Designer",
    avatar: inst2,
    quote:
      "Best platform I've used. The instructors are world-class and the dashboard makes it ridiculously easy to stay on track.",
    rating: 5,
  },
  {
    name: "Mei Tanaka",
    role: "Data Analyst",
    avatar: inst1,
    quote:
      "I landed my dream job after finishing the Data Science track. Worth every minute — and every dollar.",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Testimonials"
          title="Loved by learners around the world"
          subtitle="Real stories from students who unlocked new opportunities with Graphyx."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-1 text-accent">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Instructors ───────────────── */

const instructors = [
  { img: inst1, name: "Sarah Chen", role: "Senior Frontend Engineer", courses: 12, students: "24K" },
  { img: inst2, name: "Marcus Lee", role: "Product Design Lead", courses: 8, students: "18K" },
  { img: inst3, name: "Amelia Rodriguez", role: "ML Research Scientist", courses: 6, students: "31K" },
  { img: inst4, name: "David Park", role: "Growth Marketing Director", courses: 10, students: "22K" },
];

function Instructors() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Featured Instructors"
          title="Learn from the best in the industry"
          subtitle="Our instructors are practitioners and leaders shaping their fields every day."
        />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((i) => (
            <article
              key={i.name}
              className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={i.img}
                  alt={i.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-foreground">{i.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{i.role}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{i.courses}</span> courses
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{i.students}</span> students
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Pricing ───────────────── */

const plans = [
  {
    name: "Starter",
    price: 19,
    blurb: "Perfect for casual learners getting started.",
    features: ["Access to 50+ free courses", "Community support", "Basic certificates", "Mobile app access"],
    highlight: false,
  },
  {
    name: "Pro",
    price: 49,
    blurb: "Most popular — for serious skill builders.",
    features: ["Everything in Starter", "Unlimited course access", "Verified certificates", "Downloadable resources", "1:1 mentor sessions"],
    highlight: true,
  },
  {
    name: "Premium",
    price: 99,
    blurb: "For teams and career-focused professionals.",
    features: ["Everything in Pro", "Career coaching", "Live workshops", "Team analytics", "Priority support"],
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Digital Bundles"
          title="Simple pricing, premium value"
          subtitle="Pick the plan that fits where you are today — upgrade anytime."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 border transition-all ${
                p.highlight
                  ? "bg-navy text-navy-foreground border-primary/40 shadow-glow lg:-translate-y-4"
                  : "bg-card border-border shadow-card hover:-translate-y-1"
              }`}
            >
              {p.highlight && (
                <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-[11px] font-bold px-3 py-1">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}

              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                {p.blurb}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">${p.price}</span>
                <span className={p.highlight ? "text-white/60" : "text-muted-foreground"}>/mo</span>
              </div>

              <ul className="mt-7 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                        p.highlight ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span className={p.highlight ? "text-white/90" : "text-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full inline-flex items-center justify-center gap-1.5 h-12 rounded-2xl font-semibold transition-all ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                Get {p.name} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── CTA Banner ───────────────── */

function CtaBanner() {
  return (
    <section id="cta" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 sm:p-16 text-center shadow-glow">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[40rem] rounded-full bg-primary/40 blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-20 right-10 h-60 w-60 rounded-full bg-accent/30 blur-3xl animate-blob" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Limited-time offer · 30% off Pro
            </span>
            <h2 className="mt-6 font-display text-3xl sm:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight">
              Start Learning Today
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-white/70">
              Join 120,000+ learners building skills that matter. Your future self will thank you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Join Now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl glass-dark text-white font-semibold hover:bg-white/15 transition-all"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Footer ───────────────── */

function Footer() {
  const cols = [
    {
      title: "Platform",
      links: ["Courses", "Digital Bundles", "Instructors", "Pricing", "Certificates"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: ["Help center", "Community", "Partners", "Affiliates", "Status"],
    },
  ];
  return (
    <footer className="bg-navy text-navy-foreground pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] gap-10">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">Graphyx</span>
            </a>
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              Premium online learning for the curious. Build skills that move you forward.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 hover:bg-primary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold">Get our newsletter</h4>
            <p className="mt-3 text-sm text-white/60">
              Fresh courses, learning tips, and exclusive offers — every week.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2 rounded-2xl glass-dark p-1.5"
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none"
              />
              <button className="inline-flex items-center gap-1 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Subscribe <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Graphyx LMS. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/50">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────── Shared ───────────────── */

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-xs font-semibold">
        <Sparkles className="h-3 w-3" /> {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">{subtitle}</p>
    </div>
  );
}

// keep unused import to satisfy potential future use
void Search;
