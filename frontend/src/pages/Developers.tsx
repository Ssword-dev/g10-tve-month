import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Text from "@/components/Text";

type Developer = {
  name: string;
  role: string;
  contact: string;
  email?: string;
  github?: string;
  notes?: string;
};

const developers: Developer[] = [
  {
    name: "Robby A. Quejada",
    role: "Lead Developer",
    contact: "+639326995427",
    email: "ssword.dev@gmail.com",
    github: "https://github.com/Ssword-dev",
    notes:
      "The Lead Developer, tasked to coordinate the other developers, and build the core functionality of the website.",
  },
  {
    name: "Noriel T. Panis",
    role: "Backend Developer",
    contact: "N/A",
    email: "norielp27@gmail.com",
    github: "https://github.com/NorielPanis",
    notes: "A Backend Developer tasked to do the login api endpoint.",
  },
  {
    name: "Godfrey M. Padilla",
    role: "Backend Developer",
    contact: "N/A",
    email: "padillagodfrey53@gmail.com",
    github: "N/A",
    notes: "A Backend Developer tasked to do the sign up api endpoint.",
  },
  {
    name: "Kevin F. Fernandez",
    role: "Frontend Developer",
    contact: "+639322595618",
    email: "kevfernandez056@gmail.com",
    github: "N/A",
    notes: "A Frontend Developer tasked to design and build the landing page.",
  },
  {
    name: "Ma. Joanna F. Olimpo",
    role: "Frontend Developer",
    contact: "+639852747104",
    email: "majoannafolimpo@gmail.com",
    github: "N/A",
    notes: "A Frontend Developer tasked to design and build the sign up page.",
  },
  {
    name: "Rhenoa Lumberio",
    role: "Frontend Developer",
    contact: "+639637146824",
    email: "lumberiorhenoa765@gmail.com",
    github: "N/A",
    notes: "A Frontend Developer tasked to design and build the log in page.",
  },
  {
    name: "Avril Dhaine I. Beralde",
    role: "Frontend Developer",
    contact: "+639637324941",
    email: "avrilberalde15@gmail.com",
    github: "N/A",
    notes: "A Frontend Developer tasked to design and build the about us page.",
  },
];

function Field({ label, value }: { label: string; value?: string }) {
  if (!value || value.trim() === "") {
    return null;
  }

  const isLink = value.startsWith("http://") || value.startsWith("https://");
  const isEmail = value.includes("@") && !value.startsWith("http");
  const href = isLink ? value : isEmail ? `mailto:${value}` : null;

  return (
    <div className="flex flex-row gap-2 space-y-1">
      <Text size="sm" className="text-muted-foreground">
        {label}
      </Text>
      {href ? (
        <a
          href={href}
          target={isLink ? "_blank" : undefined}
          rel={isLink ? "noreferrer" : undefined}
          className="text-sm font-medium text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <Text size="sm" weight="medium">
          {value}
        </Text>
      )}
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-14 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl space-y-5">
        <Card className="border-border bg-card/95">
          <CardContent className="space-y-2 p-6 md:p-8">
            <Text className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              The Developers
            </Text>
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              The Developers
            </h1>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {developers.map((developer) => (
            <Card
              key={`${developer.name}-${developer.contact}`}
              className="border-border bg-card"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-row gap-2 items-center space-y-1">
                  <Text size="xl" weight="semibold">
                    {developer.name}
                  </Text>
                  <Text size="sm" className="text-muted-foreground">
                    ({developer.role})
                  </Text>
                </div>

                <div className="grid gap-3">
                  <Field label="Contact" value={developer.contact} />
                  <Field label="Email" value={developer.email} />
                  <Field label="GitHub" value={developer.github} />
                  <Field label="Notes" value={developer.notes} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
