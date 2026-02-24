import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
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
  eyebrow: "The School",
  title: "San Pedro Relocation Center National High School",
  description:
    "San Pedro Relocation Center National High School (SPRCNHS) is a public secondary school in San Pedro City, Laguna, serving learners in the local community.",
};

const heroMetrics: HeroMetric[] = [
  { label: "School Type", value: "Public Secondary" },
  { label: "City", value: "San Pedro" },
  { label: "Province", value: "Laguna" },
  { label: "Region", value: "CALABARZON (IV-A)" },
];

const valueCards: ValueCardContent[] = [
  {
    icon: Building2,
    title: "School Profile",
    description:
      "SPRCNHS is listed under the Schools Division Office of San Pedro City as a recognized public high school.",
  },
  {
    icon: ShieldCheck,
    title: "DepEd Recognition",
    description:
      "The school appears in DepEd references, including ALS-EST implementing school listings for Region IV-A.",
  },
  {
    icon: Sparkles,
    title: "Historical Note",
    description:
      "A known Cuyab annex of SPRCNHS was legislatively referenced and later established as Cuyab National High School.",
  },
];

const audienceBlocks: AudienceContent[] = [
  {
    icon: Users,
    title: "Who The School Serves",
    description:
      "The school supports learners and families in the relocation communities of San Pedro through public secondary education services.",
  },
];

const serviceLinks: ServiceLinkContent[] = [
  {
    title: "Meet The Team",
    description:
      "Learn more about the people behind this platform and the contributors who built it.",
    ctaLabel: "Go to The Team",
    to: "/dashboard/about/the-team",
  },
  {
    title: "Need Assistance?",
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

export default function TheSchoolPage() {
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
