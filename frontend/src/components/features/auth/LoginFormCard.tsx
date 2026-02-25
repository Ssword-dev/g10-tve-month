import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/misc";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

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
      <CardHeader>
        <CardTitle>
          <Text size="2xl" weight="bold">
            Admin Login
          </Text>
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
