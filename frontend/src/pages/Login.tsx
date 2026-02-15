import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Text from "@/components/Text";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async () => {
    try {
      setIsSubmitting(true);
      setErrorText("");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          employee_number: Number(employeeNumber),
          password,
        }),
      });

      const parsed = (await response.json()) as
        | { type: "data"; data: { authenticated: boolean } }
        | { type: "error"; message: string };

      if (!response.ok || parsed.type === "error") {
        throw new Error(
          parsed.type === "error" ? parsed.message : "Login failed.",
        );
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
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
              void login();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="employee-number">Employee Number</Label>
              <Input
                id="employee-number"
                type="number"
                value={employeeNumber}
                onChange={(event) => setEmployeeNumber(event.target.value)}
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
              <Text size="sm" className="text-danger">
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

          <Text size="sm" className="text-text-muted">
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
