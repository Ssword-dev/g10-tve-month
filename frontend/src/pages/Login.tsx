import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/misc";
import { currentAdminSessionQuery, loginAction } from "@/domain/auth/actions";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  // `useNavigate` lets us redirect after successful login.
  const navigate = useNavigate();

  // Local form state for controlled inputs.
  const [depedEmail, setDepedEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state for async request feedback.
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async () => {
    try {
      // Reset UI errors and lock the submit button while request runs.
      setIsSubmitting(true);
      setErrorText("");

      // Send credentials to backend.
      const result = await loginAction({
        deped_email: depedEmail.trim(),
        password,
      });

      // Throws if backend returned an error envelope.
      result.unwrap();

      // Refresh cached session query so the app has fresh auth state.
      await currentAdminSessionQuery.refresh();

      // Move user to dashboard on success.
      navigate("/dashboard");
    } catch (error) {
      // Convert server errors to a readable message.
      setErrorText((error as Error).message);
    } finally {
      // Always unlock the button when request finishes.
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-background p-4">
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
              // Prevent full-page reload; run async login manually.
              event.preventDefault();
              void login();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="deped-email">DepEd Email</Label>
              <Input
                id="deped-email"
                type="email"
                value={depedEmail}
                onChange={(event) => setDepedEmail(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {errorText && (
              <Text size="sm" className="text-destructive">
                {errorText}
              </Text>
            )}

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
    </main>
  );
}
