import { Text } from "@/components/ui/misc";
import { Link } from "react-router-dom";

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-card/70 px-6 py-5 md:px-8 md:py-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Text size="base" className="text-muted-foreground">
          {year} SPRCNHS SEMS. All rights reserved.
        </Text>
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/terms-and-conditions"
            className="text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            to="/dashboard/customer-service"
            className="text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
