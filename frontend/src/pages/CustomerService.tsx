import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Text from "@/components/Text";

export default function CustomerServicePage() {
  return (
    <main className="relative min-h-full overflow-hidden p-4 md:p-8">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Card className="border-border bg-card/95">
          <CardContent className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-tight md:text-4xl">
              Need Help?
            </h1>
            <Text className="text-muted-foreground">
              For support, please reach out to our customer service contact:
            </Text>
            <div className="flex flex-row items-center gap-2 rounded-lg border border-border/70 bg-muted/30 p-4">
              <Text size="sm" className="text-muted-foreground">
                Customer Service Representative
              </Text>
              <Text weight="semibold">
                <a href="mailto:norielp27@gmail.com">Noriel T. Panis</a>
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
