import { LoginFormCard } from "@/components/features/auth/LoginFormCard";
import { currentAdminSessionQuery, loginAction } from "@/domain/auth/actions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <LoginFormCard
        depedEmail={depedEmail}
        password={password}
        errorText={errorText}
        isSubmitting={isSubmitting}
        onDepedEmailChange={setDepedEmail}
        onPasswordChange={setPassword}
        onSubmit={() => void login()}
      />
    </main>
  );
}
