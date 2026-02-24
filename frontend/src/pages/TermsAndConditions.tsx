import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/misc";

export default function TermsAndConditionsPage() {
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
              Legal
            </Text>
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              Terms and Conditions
            </h1>
            <Text className="text-muted-foreground">
              Effective Date: {new Date().toLocaleDateString()}
            </Text>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-6 md:p-8">
            <section className="space-y-2">
              <Text weight="semibold">1. Acceptance of Terms</Text>
              <Text size="sm" className="text-muted-foreground">
                By accessing or using this system, you agree to comply with
                these terms and all applicable school and legal policies.
              </Text>
            </section>

            <section className="space-y-2">
              <Text weight="semibold">2. Authorized Use</Text>
              <Text size="sm" className="text-muted-foreground">
                Access is limited to authorized users. You must not attempt to
                access accounts, data, or features beyond your assigned role.
              </Text>
            </section>

            <section className="space-y-2">
              <Text weight="semibold">3. Data Responsibility</Text>
              <Text size="sm" className="text-muted-foreground">
                Users must provide accurate information and handle employee and
                school records with confidentiality and care.
              </Text>
            </section>

            <section className="space-y-2">
              <Text weight="semibold">4. Security</Text>
              <Text size="sm" className="text-muted-foreground">
                You are responsible for keeping your credentials secure. Report
                suspected unauthorized access immediately to administrators.
              </Text>
            </section>

            <section className="space-y-2">
              <Text weight="semibold">5. Service Changes</Text>
              <Text size="sm" className="text-muted-foreground">
                The school may update or suspend features as needed for
                operational, security, or policy reasons.
              </Text>
            </section>

            <section className="space-y-2">
              <Text weight="semibold">6. Contact</Text>
              <Text size="sm" className="text-muted-foreground">
                For clarifications regarding these terms, contact the school
                administration or official support channel.
              </Text>
            </section>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
