import Card from "@/components/Card";
import Button from "@/components/Button";
import CardContent from "@/components/CardContent";
import Text from "@/components/Text";
import { Link } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
};

type HeroMetric = {
  label: string;
  value: string;
};

type ValueCardContent = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type AudienceContent = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type ServiceLinkContent = {
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
};

const heroContent: HeroContent = {
  eyebrow: "About Us",
  title: "School Employee Management System",
  description:
    "We help schools organize employee information with a secure, searchable, and role-based system built for daily operations.",
};

const heroMetrics: HeroMetric[] = [
  { label: "Core Focus", value: "Staff Records" },
  { label: "Security", value: "Role-Based Access" },
  { label: "Workflow", value: "Faster Filtering" },
  { label: "Audience", value: "School Admin Teams" },
];

const valueCards: ValueCardContent[] = [
  {
    icon: Building2,
    title: "Purpose-Built for Schools",
    description:
      "Built around real administrative needs, not generic HR screens.",
  },
  {
    icon: ShieldCheck,
    title: "Safer Data Handling",
    description: "Sensitive information visibility is controlled by user role.",
  },
  {
    icon: Sparkles,
    title: "Practical UX",
    description: "Simple flows for filtering, reviewing, and updating records.",
  },
];

const audienceBlocks: AudienceContent[] = [
  {
    icon: Users,
    title: "Who We Serve",
    description:
      "School leaders, HR personnel, and admin staff who need a reliable and maintainable source of truth for employee data.",
  },
];

const serviceLinks: ServiceLinkContent[] = [
  {
    title: "Customer Service",
    description:
      "For support and assistance, contact our customer service representative Noriel T. (Tud) Panis.",
    ctaLabel: "Go to Customer Service",
    to: "/dashboard/customer-service",
  },
];

function HeroMetricTile({ label, value }: HeroMetric) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/30 p-4">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text weight="semibold" className="mt-1">
        {value}
      </Text>
    </div>
  );
}

function ValueCard({ icon: Icon, title, description }: ValueCardContent) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-2 space-y-3 p-5">
        <Icon className="size-5 text-primary" />
        <Text weight="semibold">{title}</Text>
        <Text size="sm" className="text-muted-foreground">
          {description}
        </Text>
      </CardContent>
    </Card>
  );
}

function AudienceCard({ icon: Icon, title, description }: AudienceContent) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-start gap-3 p-5">
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <Icon className="mt-0.5 size-5 text-primary" />
            <Text size="2xl" weight="semibold">
              {title}
            </Text>
          </div>
          <Text size="sm" className="text-muted-foreground">
            {description}
          </Text>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceLinkCard({
  title,
  description,
  ctaLabel,
  to,
}: ServiceLinkContent) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-3">
        <div className="space-y-1 flex flex-col gap-2">
          <Text weight="semibold">{title}</Text>
          <Text size="sm" className="text-muted-foreground">
            {description}
          </Text>
        </div>
        <Button asChild className="px-2 py-1">
          <Link to={to}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AboutUsPage() {
  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/15 blur-2xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Card className="border-border bg-card/95">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
            <div className="space-y-4">
              <Text className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {heroContent.eyebrow}
              </Text>
              <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
                {heroContent.title}
              </h1>
              <Text className="text-muted-foreground">
                {heroContent.description}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {heroMetrics.map((metric) => (
                <HeroMetricTile
                  key={`${metric.label}-${metric.value}`}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => (
            <ValueCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </section>

        {audienceBlocks.map((block) => (
          <AudienceCard
            key={block.title}
            icon={block.icon}
            title={block.title}
            description={block.description}
          />
        ))}

        {serviceLinks.map((link) => (
          <ServiceLinkCard
            key={link.title}
            title={link.title}
            description={link.description}
            ctaLabel={link.ctaLabel}
            to={link.to}
          />
        ))}
      </div>
    </main>
  );
}
