import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/misc";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import websiteIconSource from "@/assets/website_icon.png";
interface LoginFormCardProps {
  depedEmail: string;
  password: string;
  errorText: string;
  isSubmitting: boolean;
  onDepedEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginFormCard({
  depedEmail,
  password,
  errorText,
  isSubmitting,
  onDepedEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormCardProps) {
  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader className="flex flex-col items-center justify-center gap-3 pb-3 pt-4">
        <Link
          to="/dashboard/home"
          className="rounded-xl border border-border/70 bg-background/70 p-2 transition-colors hover:bg-accent/40"
          aria-label="Go to Home"
        >
            <img
              src={websiteIconSource}
              className="aspect-square w-10 select-none"
              alt="SPRCNHS SEMS"
            />
        </Link>
        <CardTitle size="2xl" weight="bold" align="center">
          Login with DepEd Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="deped-email">DepEd Email</Label>
            <Input
              id="deped-email"
              type="email"
              value={depedEmail}
              onChange={(event) => onDepedEmailChange(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </div>

          {errorText ? (
            <Text size="sm" className="text-destructive">
              {errorText}
            </Text>
          ) : null}

          <Button
            type="submit"
            className="w-full justify-center gap-2"
            disabled={isSubmitting}
          >
            <LogIn className="size-4" />
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Text size="sm" className="text-muted-foreground">
          Need an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create admin account
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
}
