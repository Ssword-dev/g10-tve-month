import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import { AccessibilityIcon, Palette } from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <section className="relative mx-auto w-full max-w-5xl space-y-5">
        <Card className="border-border bg-card/95">
          <CardContent className="space-y-2 p-6 md:p-8">
            <Text className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Settings
            </Text>
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              Settings
            </h1>
            <Text className="text-muted-foreground">
              Manage dashboard preferences for appearance and accessibility.
            </Text>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="size-5 text-primary" />
                <Text weight="semibold">Appearance</Text>
              </div>
              <Text size="sm" className="text-muted-foreground">
                Choose between light mode and dark mode.
              </Text>
            </div>
            <Button asChild>
              <Link to="/dashboard/settings/appearance">Open</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AccessibilityIcon className="size-5 text-primary" />
                <Text weight="semibold">Accessibility</Text>
              </div>
              <Text size="sm" className="text-muted-foreground">
                Configure text size and color contrast for better readability.
              </Text>
            </div>
            <Button asChild>
              <Link to="/dashboard/settings/accessibility">Open</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
