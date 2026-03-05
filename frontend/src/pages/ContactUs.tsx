import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/misc";

export default function ContactUsPage() {
  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Card className="border-border bg-card/95">
          <CardContent className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              Contact Us (The Team Behind the System)
            </h1>
            <Text className="text-muted-foreground">
              For inquiries, partnerships, or assistance, please contact the
              system team.
            </Text>
            <div className="flex flex-row gap-2 items-center rounded-lg border border-border/70 bg-muted/30 p-4">
              <Text size="sm" className="text-muted-foreground">
                Please contact:
              </Text>
              <Text
                weight="semibold"
                className="text-foreground italic"
                asChild
              >
                <a href="mailto:norielp27@gmail.com">Our customer support</a>
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
