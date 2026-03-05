import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/misc";
import {
  applyContrastLevel,
  applyFontSize,
  resolveContrastLevel,
  resolveFontSize,
  setStoredContrastLevel,
  setStoredFontSize,
  type ContrastLevel,
  type FontSize,
} from "@/domain/theme/settings";
import { type ReactNode, useState } from "react";
import { Link } from "react-router-dom";

function FontSizeOption({
  label,
  description,
  active,
  onClick,
  preview,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
  preview: ReactNode;
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
        {preview}
      </div>
    </button>
  );
}

export default function SettingsAccessibilityPage() {
  const [fontSize, setFontSize] = useState<FontSize>(() => resolveFontSize());
  const [contrastLevel, setContrastLevel] = useState<ContrastLevel>(() =>
    resolveContrastLevel(),
  );

  const setSize = (nextSize: FontSize) => {
    setFontSize(nextSize);
    applyFontSize(nextSize);
    setStoredFontSize(nextSize);
  };

  const setContrast = (nextLevel: ContrastLevel) => {
    setContrastLevel(nextLevel);
    applyContrastLevel(nextLevel);
    setStoredContrastLevel(nextLevel);
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
              Accessibility
            </h1>
            <Text className="text-muted-foreground">
              Adjust text size and contrast for better readability across the
              dashboard.
            </Text>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="space-y-3 p-5">
            <Text weight="semibold" className="text-sm uppercase tracking-wide">
              Text Size
            </Text>
            <FontSizeOption
              label="Small"
              description="Compact text density for more content on screen."
              active={fontSize === "small"}
              onClick={() => setSize("small")}
              preview={<Text size="sm">Aa</Text>}
            />
            <FontSizeOption
              label="Medium"
              description="Balanced default reading size."
              active={fontSize === "medium"}
              onClick={() => setSize("medium")}
              preview={<Text size="base">Aa</Text>}
            />
            <FontSizeOption
              label="Large"
              description="Larger text for improved readability."
              active={fontSize === "large"}
              onClick={() => setSize("large")}
              preview={<Text size="lg">Aa</Text>}
            />

            <div className="pt-3">
              <Text
                weight="semibold"
                className="text-sm uppercase tracking-wide"
              >
                Contrast
              </Text>
            </div>
            <FontSizeOption
              label="Low"
              description="Softer contrast between interface colors."
              active={contrastLevel === "low"}
              onClick={() => setContrast("low")}
              preview={<Text size="sm">◐</Text>}
            />
            <FontSizeOption
              label="Normal"
              description="Default contrast level for balanced visuals."
              active={contrastLevel === "normal"}
              onClick={() => setContrast("normal")}
              preview={<Text size="base">◑</Text>}
            />
            <FontSizeOption
              label="High"
              description="Stronger color separation for visual clarity."
              active={contrastLevel === "high"}
              onClick={() => setContrast("high")}
              preview={<Text size="lg">◕</Text>}
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
