import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Collapsible from "@/components/Collapsible";
import CollapsibleContent from "@/components/CollapsibleContent";
import CollapsibleTrigger from "@/components/CollapsibleTrigger";
import Text from "@/components/Text";
import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import landingPageHeroBannerImageSource from "../assets/landing_page_hero_banner_image.png";
import { cn } from "@_ssword/classes";
import { Menu, Navigation, X, type Hamburger } from "lucide-react";

type MotionDivProps = React.ComponentProps<typeof motion.div>;

const animationPresets = {
  fadeUp: ({
    y = 20,
    duration = 0.6,
    delay = 0,
    once = true,
  }: {
    y?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
  } = {}): MotionDivProps => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once },
    transition: { duration, delay, ease: "easeOut" },
  }),

  slideInX: ({
    x = -100,
    duration = 0.75,
    delay = 0,
    once = true,
    amount = 0.2,
  }: {
    x?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    amount?: number;
  } = {}): MotionDivProps => ({
    initial: { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once, amount },
    transition: { duration, delay, ease: "easeOut" },
  }),

  staggerContainer: ({
    stagger = 0.12,
    once = true,
    amount = 0.2,
  }: {
    stagger?: number;
    once?: boolean;
    amount?: number;
  } = {}): MotionDivProps => ({
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
    variants: {
      hidden: {},
      visible: {
        transition: { staggerChildren: stagger },
      },
    },
  }),

  staggerItem: ({
    y = 24,
    duration = 0.55,
  }: {
    y?: number;
    duration?: number;
  } = {}): MotionDivProps => ({
    variants: {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0 },
    },
    transition: { duration, ease: "easeOut" },
  }),
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "workflow", label: "Workflow" },
  { id: "modules", label: "Modules" },
  { id: "impact", label: "Outcomes" },
  { id: "security", label: "Security" },
  { id: "faq", label: "FAQ" },
];

const quickStats = [
  { value: "500+", label: " Schools can onboard quickly" },
  { value: "40%", label: " Reduction in repetitive administrative work" },
  { value: "99.9%", label: " Platform reliability" },
  { value: "1 day", label: " Typical initial setup time" },
];

const features = [
  {
    title: "Complete Staff Profiles",
    description:
      "Keep every employee detail in one place, from qualifications to contracts and department roles.",
    points: [
      "Certification and license tracking",
      "Contract and role history timeline",
      "Emergency and compliance details",
      "Central profile view for administrators",
    ],
  },
  {
    title: "Smart Daily Operations",
    description:
      "Handle attendance, substitutions, workload balancing, and approvals from one dashboard.",
    points: [
      "Real-time attendance and leave status",
      "Substitution and duty assignment support",
      "Approval workflows for admin requests",
      "Operational alerts for urgent staffing gaps",
    ],
  },
  {
    title: "Secure Role-Based Access",
    description:
      "Control who can see or edit each part of the system with clear role and department permissions.",
    points: [
      "Fine-grained access per module",
      "Audit trail for key record changes",
      "Secure login and permission controls",
      "Separation of HR and academic access",
    ],
  },
];

const workflowSteps = [
  {
    title: "Configure your campus",
    description:
      "Set departments, grade levels, staff roles, and governance rules in a guided onboarding flow.",
    points: [
      "Define school structure and teams",
      "Configure custom policies and rules",
      "Assign permissions by responsibility",
    ],
  },
  {
    title: "Build your staff directory",
    description:
      "Import records or add staff manually with validation that keeps data clean and consistent.",
    points: [
      "Bulk import with validation checks",
      "Profile completion and missing-field alerts",
      "Standardized records for all departments",
    ],
  },
  {
    title: "Run daily management",
    description:
      "Track tasks, assignments, feedback, and development plans without fragmented spreadsheets.",
    points: [
      "Daily staffing and workload visibility",
      "Performance tracking and note history",
      "Professional development planning",
    ],
  },
  {
    title: "Monitor and improve",
    description:
      "Use reports and trends to improve staffing quality, policy compliance, and response time.",
    points: [
      "Monthly and term-based summaries",
      "Department performance visibility",
      "Actionable insights for leadership meetings",
    ],
  },
];

const modules = [
  {
    title: "HR and Records",
    description: "Manage employee files, contracts, credentials, and status.",
  },
  {
    title: "Attendance and Leave",
    description: "Track attendance, leave balances, and substitution needs.",
  },
  {
    title: "Assignments and Workload",
    description: "Distribute duties fairly and monitor staffing pressure.",
  },
  {
    title: "Professional Development",
    description: "Plan training paths, goals, and growth checkpoints.",
  },
  {
    title: "Policy and Compliance",
    description: "Enforce school standards with clear workflow controls.",
  },
  {
    title: "Reports and Insights",
    description: "Generate reports for leadership, audits, and planning.",
  },
];

const outcomes = [
  {
    label: "Less time spent on manual administration",
    value: "40%",
    points: [
      "Reduced repetitive data entry",
      "Fewer follow-ups for missing information",
      "Faster response to staff-related requests",
    ],
  },
  {
    label: "Faster onboarding for new employees",
    value: "3x",
    points: [
      "Clear onboarding checklist and ownership",
      "Faster readiness for school operations",
      "Consistent first-week setup across departments",
    ],
  },
  {
    label: "Staff records in one trusted source",
    value: "100%",
    points: [
      "Single source for HR and administration",
      "Consistent records across all departments",
      "Less duplication and fewer data conflicts",
    ],
  },
];

const testimonials = [
  {
    quote:
      "Our admin team finally stopped chasing spreadsheets and started focusing on people.",
    person: "School Administrator",
    school: "Regional Secondary Campus",
  },
  {
    quote: "We onboard new teachers faster and with fewer errors than before.",
    person: "HR Lead",
    school: "Multi-Campus School Group",
  },
  {
    quote:
      "Leadership now gets accurate staffing data whenever decisions are needed.",
    person: "Vice Principal",
    school: "Public District School",
  },
];

const faqs = [
  {
    question: "Can we limit access to confidential staff information?",
    answer:
      "Yes. You can assign permissions by role, department, and responsibility.",
    points: [
      "Access by module, action, and department",
      "Visibility rules for sensitive profile fields",
      "Auditable user activity history",
    ],
  },
  {
    question: "Will this work for both small schools and larger institutions?",
    answer:
      "Yes. The system scales from single-campus schools to multi-campus organizations.",
    points: [
      "Works for small teams and large districts",
      "Flexible setup for campus-by-campus growth",
      "Configurable structure for different school models",
    ],
  },
  {
    question: "How quickly can we launch?",
    answer:
      "Most schools complete setup and the first import within one day, then expand modules gradually.",
    points: [
      "Guided onboarding for administrators",
      "Phased rollout without workflow disruption",
      "Simple adoption path for staff users",
    ],
  },
];

function BulletList({ points }: { points: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="min-h-screen bg-[linear-gradient(135deg,#f8fff9_0%,#eafcf1_52%,#ffffff_100%)]"
    >
      <div className="grid w-full grid-cols-1 items-center lg:grid-cols-2">
        <motion.div
          className="space-y-2 px-6 py-10 md:px-10 lg:px-16"
          {...animationPresets.fadeUp({ y: 28 })}
        >
          <div className="flex flex-col gap-2">
            <Text
              size="2xl"
              className="max-w-2xl text-[clamp(1.0rem,4.0vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.01em] text-emerald-950"
            >
              Smarter School Operations.
              <br />
              Better Staff Management.
            </Text>
            <Text className="max-w-xl text-lg text-muted-foreground">
              A complete system for staff records, daily operations, security,
              and reporting, built for principals, HR teams, and school
              administrators.
            </Text>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              className="px-7 py-3 text-base"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="px-7 py-3 text-base"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Features
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="h-full w-full bg-transparent"
          {...animationPresets.fadeUp({ delay: 0.15 })}
        >
          <img
            className="h-full min-h-[520px] w-full object-cover"
            src={landingPageHeroBannerImageSource}
            alt="School staff management dashboard preview"
          />
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="px-6 py-10 md:px-10 lg:px-16">
      <motion.div
        className="mx-auto grid w-full max-w-7xl gap-4 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm md:grid-cols-2 lg:grid-cols-4"
        {...animationPresets.staggerContainer()}
      >
        {quickStats.map((item) => (
          <motion.div
            key={item.label}
            className="rounded-xl border border-emerald-50 bg-[linear-gradient(180deg,#ffffff_0%,#f1fdf5_100%)] p-4 text-center"
            {...animationPresets.staggerItem({ y: 18 })}
          >
            <Text size="3xl" className="font-bold text-emerald-700">
              {item.value}
            </Text>
            <Text className="text-sm text-muted-foreground">{item.label}</Text>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function PostHeroSection() {
  return (
    <section
      id="features"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#f4fef8_0%,#ffffff_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.slideInX()}
        >
          <Text size="4xl" className="font-bold">
            Core features for modern school operations
          </Text>
          <Text className="text-muted-foreground">
            Built to reduce friction in daily school administration while
            keeping every staff process organized and accountable.
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          {...animationPresets.staggerContainer()}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm transition-shadow hover:shadow-lg">
                <CardHeader className="px-0 pt-0">
                  <CardTitle asChild>
                    <Text size="xl" className="font-semibold">
                      {feature.title}
                    </Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Text className="text-muted-foreground">
                    {feature.description}
                  </Text>
                  <BulletList points={feature.points} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#ffffff_0%,#eefdf4_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.slideInX()}
        >
          <Text size="4xl" className="font-bold">
            How the platform works
          </Text>
          <Text className="text-muted-foreground">
            From setup to reporting, each step is designed for school teams with
            limited time and high standards for accountability.
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          {...animationPresets.staggerContainer()}
        >
          {workflowSteps.map((step, index) => (
            <motion.div key={step.title} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <CardHeader className="px-0 pt-0">
                  <Text className="text-sm text-emerald-700">
                    Step {index + 1}
                  </Text>
                  <CardTitle asChild>
                    <Text size="xl" className="font-semibold">
                      {step.title}
                    </Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Text className="text-muted-foreground">
                    {step.description}
                  </Text>
                  <BulletList points={step.points} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ModulesSection() {
  return (
    <section
      id="modules"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#f7fff9_0%,#ffffff_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.fadeUp()}
        >
          <Text size="4xl" className="font-bold">
            Full module coverage
          </Text>
          <Text className="text-muted-foreground">
            Activate what you need now and expand over time without changing
            your core data model.
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          {...animationPresets.staggerContainer()}
        >
          {modules.map((module) => (
            <motion.div key={module.title} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="px-0 pt-0">
                  <CardTitle asChild>
                    <Text size="lg" className="font-semibold">
                      {module.title}
                    </Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Text className="text-sm text-muted-foreground">
                    {module.description}
                  </Text>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function OutcomesSection() {
  return (
    <section
      id="impact"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#ebfcf2_0%,#ffffff_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.fadeUp()}
        >
          <Text size="4xl" className="font-bold">
            Outcomes schools can measure
          </Text>
          <Text className="text-muted-foreground">
            Improve administrative speed, onboarding quality, and reliability of
            staff decisions with evidence-driven insights.
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          {...animationPresets.staggerContainer()}
        >
          {outcomes.map((item) => (
            <motion.div key={item.label} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-sm">
                <Text size="4xl" className="font-bold text-emerald-700">
                  {item.value}
                </Text>
                <Text className="mt-2 font-medium">{item.label}</Text>
                <BulletList points={item.points} />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section
      id="security"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#ffffff_0%,#effdf5_100%)]"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.fadeUp()}
        >
          <Text size="4xl" className="font-bold">
            Built for secure and dependable school administration
          </Text>
          <Text className="text-muted-foreground">
            Designed for schools that need privacy, accountability, and smooth
            adoption across HR, administration, and academic departments.
          </Text>
          <BulletList
            points={[
              "Role-based permissions and clear access boundaries",
              "Record-level change history for accountability",
              "Data visibility controls for sensitive information",
              "Scalable architecture for growing institutions",
            ]}
          />
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          {...animationPresets.staggerContainer()}
        >
          {[
            "Data Privacy",
            "Compliance-Ready",
            "Audit Logs",
            "Reliable Uptime",
          ].map((item) => (
            <motion.div key={item} {...animationPresets.staggerItem()}>
              <Card className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <Text className="font-semibold">{item}</Text>
                <Text className="mt-2 text-sm text-muted-foreground">
                  Enterprise-grade controls tailored for school environments.
                </Text>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#f8fff9_0%,#ffffff_100%)]">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div
          className="space-y-2 flex flex-col gap-2"
          {...animationPresets.slideInX()}
        >
          <Text size="4xl" className="font-bold">
            What schools are saying
          </Text>
          <Text className="text-muted-foreground">
            Feedback from school leaders using the platform in daily operations.
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          {...animationPresets.staggerContainer()}
        >
          {testimonials.map((item) => (
            <motion.div key={item.person} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <Text className="text-muted-foreground">"{item.quote}"</Text>
                <Text className="mt-5 font-semibold">{item.person}</Text>
                <Text className="text-sm text-muted-foreground">
                  {item.school}
                </Text>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section
      id="faq"
      className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#f4fef8_0%,#ffffff_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <motion.div {...animationPresets.slideInX()}>
          <Text size="4xl" className="font-bold">
            Frequently asked questions
          </Text>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          {...animationPresets.staggerContainer()}
        >
          {faqs.map((item) => (
            <motion.div key={item.question} {...animationPresets.staggerItem()}>
              <Card className="h-full rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <CardHeader className="px-0 pt-0">
                  <CardTitle asChild>
                    <Text size="lg" className="font-semibold">
                      {item.question}
                    </Text>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Text className="text-muted-foreground">{item.answer}</Text>
                  <BulletList points={item.points} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="px-6 py-20 md:px-10 lg:px-16 bg-[linear-gradient(180deg,#ffffff_0%,#eafcf1_100%)]">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg md:p-12"
          {...animationPresets.fadeUp()}
        >
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-2 flex flex-col gap-2">
              <Text size="2xl" className="font-bold">
                Ready to modernize your school management system?
              </Text>
              <Text className="text-muted-foreground">
                Start with staff records and onboarding, then expand into
                operations, compliance, and reporting at your own pace.
              </Text>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="px-8 py-3 text-lg"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>

            <Card className="rounded-xl border border-emerald-100 bg-[linear-gradient(180deg,#f6fff9_0%,#ffffff_100%)] p-6 shadow-sm">
              <Text className="font-semibold">
                Implementation support includes
              </Text>
              <BulletList
                points={[
                  "Guided setup for administrators",
                  "Data import support and validation help",
                  "Role and workflow configuration assistance",
                  "Launch checklist for your first month",
                ]}
              />
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-emerald-100 bg-white/80 px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <Text className="font-semibold">
          SPRCNHS School Employee Management System
        </Text>
        <Text className="text-sm text-muted-foreground">
          Built for schools that want structured operations, secure records, and
          confident leadership decisions.
        </Text>
      </div>
    </footer>
  );
}

function TopRightNavigation() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed right-4 top-4 z-50 left-4 md:left-auto"
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Collapsible
        open={!isCollapsed}
        onOpenChange={(open) => setIsCollapsed(!open)}
        className="flex items-center justify-end gap-2 rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-lg backdrop-blur"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            aria-expanded={!isCollapsed}
            aria-label={
              isCollapsed ? "Expand navigation" : "Collapse navigation"
            }
            className="px-3 text-sm md:px-4 md:text-base"
          >
            {isCollapsed ? <Menu /> : <X />}
          </Button>
        </CollapsibleTrigger>
        <div
          className={`grid min-w-0 transition-[grid-template-columns,opacity] duration-300 ease-out ${
            isCollapsed
              ? "grid-cols-[0fr] opacity-0"
              : "grid-cols-[1fr] opacity-100"
          }`}
        >
          <CollapsibleContent forceMount className="min-w-0 overflow-hidden">
            <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="px-3 text-sm transition-transform duration-200 hover:scale-105 md:px-4 md:text-base"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="px-3 text-sm transition-transform duration-200 hover:scale-105 md:px-4 md:text-base"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="ghost"
                className="px-3 text-sm transition-transform duration-200 hover:scale-105 md:px-4 md:text-base"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.nav>
  );
}

export default function LandingPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="space-y-10 md:space-y-14 overflow-x-hidden bg-[linear-gradient(180deg,#f6fef9_0%,#ffffff_100%)] text-foreground">
      <TopRightNavigation />
      <HeroSection />
      <StatsSection />
      <PostHeroSection />
      <WorkflowSection />
      <ModulesSection />
      <OutcomesSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <CallToAction />
      <FooterSection />
    </main>
  );
}
