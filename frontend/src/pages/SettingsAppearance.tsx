import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import {
  applyThemeMode,
  resolveThemeMode,
  setStoredThemeMode,
  type ThemeMode,
} from "@/domain/theme/settings";
import { MoonStar, Sun } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";

function ThemeOption({
  label,
  description,
  active,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-muted/50"
      }`}
      aria-pressed={active}
    >
      <div className="flex flex-row items-center gap-2">
        <Text weight="semibold">{label}</Text>
        <Text size="sm" className="text-muted-foreground">
          {description}
        </Text>
      </div>
      <div className={active ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </div>
    </button>
  );
}

export default function SettingsAppearancePage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    resolveThemeMode(),
  );

  const setTheme = (nextMode: ThemeMode) => {
    setThemeMode(nextMode);
    applyThemeMode(nextMode);
    setStoredThemeMode(nextMode);
  };

  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <section className="relative mx-auto w-full max-w-5xl space-y-5">
        <Card className="border-border bg-card/95">
          <CardContent className="space-y-2 p-6 md:p-8">
            <Text className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Settings
            </Text>
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              Appearance
            </h1>
            <Text className="text-muted-foreground">
              Choose your preferred theme mode for the dashboard.
            </Text>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="space-y-3 p-5">
            <ThemeOption
              label="Light Mode"
              description="Bright interface with high daylight readability."
              active={themeMode === "light"}
              icon={<Sun className="size-5" />}
              onClick={() => setTheme("light")}
            />

            <ThemeOption
              label="Dark Mode"
              description="Low-glare interface for darker environments."
              active={themeMode === "dark"}
              icon={<MoonStar className="size-5" />}
              onClick={() => setTheme("dark")}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="px-2 py-1" asChild variant="outline">
            <Link to="/dashboard/settings">Back to Settings</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
