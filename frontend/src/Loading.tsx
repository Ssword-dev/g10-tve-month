import Skeleton from "@/components/Skeleton";
import Text from "@/components/Text";

export default function Loading() {
  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span
            className="size-5 animate-spin rounded-full border-2 border-border border-t-primary"
            aria-hidden="true"
          />
          <Text size="sm" className="text-muted-foreground">
            Loading page...
          </Text>
        </div>

        <div className="space-y-3" aria-hidden="true">
          <Skeleton className="h-4 w-2/5 rounded-md" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-3/4 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
