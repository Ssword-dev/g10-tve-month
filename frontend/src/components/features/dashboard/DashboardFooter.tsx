import { Text } from "@/components/ui/misc";
import { Link } from "react-router-dom";

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="m-0 border-t border-border/70 bg-card px-6 py-10 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_1fr_1fr]">
          <section className="flex flex-col gap-2 space-y-3">
            <Text weight="semibold">
              SPRCNHS School Employee Management System
            </Text>
            <Text size="sm" className="max-w-md text-muted-foreground">
              Centralized school administration platform for employee records,
              staffing visibility, and day-to-day operational support.
            </Text>
          </section>

          <section className="space-y-3">
            <nav className="flex flex-col gap-2">
              <Text
                size="sm"
                weight="semibold"
                className="uppercase tracking-wide"
              >
                Navigation
              </Text>
              <Link
                to="/dashboard/home"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                to="/dashboard/settings"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Settings
              </Link>
              <Link
                to="/dashboard/customer-service"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Customer Service
              </Link>
              <Link
                to="/dashboard/contact-us"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
            </nav>
          </section>

          <section className="space-y-3">
            <nav className="flex flex-col gap-2">
              <Text
                size="sm"
                weight="semibold"
                className="uppercase tracking-wide"
              >
                About Us
              </Text>
              <Link
                to="/dashboard/about/the-school"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                The School
              </Link>
              <Link
                to="/dashboard/about/the-team"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                The Developers
              </Link>
            </nav>
          </section>
        </div>

        <div className="mt-8 border-t border-border/70 pt-4">
          <Text size="sm" className="text-muted-foreground">
            {year} SPRCNHS School Employee Management System. All rights
            reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
