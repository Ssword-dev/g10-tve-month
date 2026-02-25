import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignupAvatarUploadPanel } from "@/components/features/auth/SignupAvatarUploadPanel";
import { SignupFormField } from "@/components/features/auth/SignupFormField";
import { Text } from "@/components/ui/misc";
import { signupAction } from "@/domain/signup/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const optionalDate = z
  // Optional date: empty string is allowed, otherwise must match YYYY-MM-DD.
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Use YYYY-MM-DD format.",
  );

const optionalNumeric = z
  // Optional numeric text: empty string is allowed, otherwise digits only.
  .string()
  .trim()
  .default("")
  .refine((value) => value === "" || /^\d+$/.test(value), "Numbers only.");

const optionalBpNumber = z
  .string()
  .trim()
  .default("")
  .refine((value) => value.length <= 30, "BP number must be at most 30 characters.");

const signupSchema = z
  // Main form validation schema for the multi-step signup flow.
  .object({
    employeeNumber: z
      .string()
      .trim()
      .min(1, "Employee number is required.")
      .regex(/^\d+$/, "Employee number must be numeric.")
      .refine(
        (value) => Number(value) > 0,
        "Employee number must be positive.",
      ),
    firstName: z.string().trim().min(1, "First name is required."),
    middleName: z.string().trim().default(""),
    lastName: z.string().trim().min(1, "Last name is required."),
    depedEmail: z
      .string()
      .trim()
      .default("")
      .refine(
        (value) => value === "" || z.string().email().safeParse(value).success,
        "DepEd email must be valid.",
      ),
    contactNumber: z.string().trim().default(""),
    address: z.string().trim().default(""),
    civilStatus: z.string().trim().default(""),
    dateOfBirth: optionalDate,
    placeOfBirth: z.string().trim().default(""),
    designation: z.string().trim().default(""),
    employmentStatus: z.string().trim().default(""),
    dateJoined: optionalDate,
    dateOfLatestPromotion: optionalDate,
    dateOfOriginalAppointment: optionalDate,
    plantillaNumber: z.string().trim().default(""),
    bpNumber: optionalBpNumber,
    salaryGrade: optionalNumeric,
    salary: optionalNumeric,
    tin: z
      .string()
      .trim()
      .default("")
      .refine(
        (value) => value === "" || value.length <= 60,
        "TIN must be 60 characters or less.",
      ),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormInput = z.input<typeof signupSchema>;
type SignupValues = z.output<typeof signupSchema>;
type StepId = "identity" | "personal" | "employment" | "admin";

type StepFieldConfig = {
  id: FieldPath<SignupFormInput>;
  label: string;
  type?: "text" | "email" | "password" | "date" | "number";
  placeholder?: string;
};

const defaultValues: SignupFormInput = {
  // Initial values used by react-hook-form.
  employeeNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  depedEmail: "",
  contactNumber: "",
  address: "",
  civilStatus: "",
  dateOfBirth: "",
  placeOfBirth: "",
  designation: "",
  employmentStatus: "",
  dateJoined: "",
  dateOfLatestPromotion: "",
  dateOfOriginalAppointment: "",
  plantillaNumber: "",
  bpNumber: "",
  salaryGrade: "",
  salary: "",
  tin: "",
  password: "",
  confirmPassword: "",
};

const steps: Array<{
  id: StepId;
  title: string;
  subtitle: string;
  fields: FieldPath<SignupFormInput>[];
}> = [
  // Defines step order and which fields are validated per step.
  {
    id: "identity",
    title: "Identity",
    subtitle: "Basic employee details",
    fields: [
      "employeeNumber",
      "firstName",
      "middleName",
      "lastName",
      "depedEmail",
      "contactNumber",
    ],
  },
  {
    id: "personal",
    title: "Personal Info",
    subtitle: "Personal records",
    fields: ["address", "civilStatus", "dateOfBirth", "placeOfBirth", "tin"],
  },
  {
    id: "employment",
    title: "Employment",
    subtitle: "Work and compensation",
    fields: [
      "designation",
      "employmentStatus",
      "dateJoined",
      "dateOfLatestPromotion",
      "dateOfOriginalAppointment",
      "plantillaNumber",
      "bpNumber",
      "salaryGrade",
      "salary",
    ],
  },
  {
    id: "admin",
    title: "Admin Access",
    subtitle: "Portal login credentials",
    fields: ["password", "confirmPassword"],
  },
];

const stepFieldLookup: Record<StepId, StepFieldConfig[]> = {
  // UI metadata for rendering inputs per step.
  identity: [
    {
      id: "employeeNumber",
      label: "Employee Number *",
      placeholder: "e.g. 2025001",
    },
    {
      id: "depedEmail",
      label: "DepEd Email",
      type: "email",
      placeholder: "name@deped.gov.ph",
    },
    { id: "firstName", label: "First Name *" },
    { id: "middleName", label: "Middle Name" },
    { id: "lastName", label: "Last Name *" },
    { id: "contactNumber", label: "Contact Number" },
  ],
  personal: [
    { id: "address", label: "Address" },
    { id: "civilStatus", label: "Civil Status" },
    { id: "dateOfBirth", label: "Date of Birth", type: "date" },
    { id: "placeOfBirth", label: "Place of Birth" },
    { id: "tin", label: "TIN", placeholder: "Up to 60 chars" },
  ],
  employment: [
    { id: "designation", label: "Designation" },
    { id: "employmentStatus", label: "Employment Status" },
    { id: "dateJoined", label: "Date Joined", type: "date" },
    {
      id: "dateOfLatestPromotion",
      label: "Latest Promotion Date",
      type: "date",
    },
    {
      id: "dateOfOriginalAppointment",
      label: "Original Appointment Date",
      type: "date",
    },
    { id: "plantillaNumber", label: "Plantilla Number" },
    { id: "bpNumber", label: "BP Number" },
    { id: "salaryGrade", label: "Salary Grade", type: "number" },
    { id: "salary", label: "Salary", type: "number" },
  ],
  admin: [
    { id: "password", label: "Password *", type: "password" },
    { id: "confirmPassword", label: "Confirm Password *", type: "password" },
  ],
};

function normalizeServerMessage(message: string): string {
  // Backend sometimes returns HTML line breaks. Convert them to plain text lines.
  return message.replace(/<br\s*\/?>/gi, "\n").trim();
}

function appendSignupPayload(payload: FormData, values: SignupValues): void {
  // Convert frontend field names to backend payload keys.
  const entries: Array<[string, string]> = [
    ["employee_number", values.employeeNumber.trim()],
    ["first_name", values.firstName.trim()],
    ["middle_name", values.middleName.trim()],
    ["last_name", values.lastName.trim()],
    ["deped_email", values.depedEmail.trim()],
    ["designation", values.designation.trim()],
    ["date_joined", values.dateJoined.trim()],
    ["date_of_latest_promotion", values.dateOfLatestPromotion.trim()],
    ["contact_number", values.contactNumber.trim()],
    ["plantilla_number", values.plantillaNumber.trim()],
    ["date_of_original_appointment", values.dateOfOriginalAppointment.trim()],
    ["bp_number", values.bpNumber.trim()],
    ["address", values.address.trim()],
    ["civil_status", values.civilStatus.trim()],
    ["date_of_birth", values.dateOfBirth.trim()],
    ["salary_grade", values.salaryGrade.trim()],
    ["salary", values.salary.trim()],
    ["employment_status", values.employmentStatus.trim()],
    ["tin", values.tin.trim()],
    ["place_of_birth", values.placeOfBirth.trim()],
    ["password", values.password],
    ["confirm_password", values.confirmPassword],
  ];

  entries.forEach(([key, value]) => payload.append(key, value));
}

export default function SignupPage() {
  // Router + timer ref used for delayed redirect after successful signup.
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef<number | null>(null);

  // Multi-step form UI state.
  const [stepIndex, setStepIndex] = useState(0);

  // Avatar upload state.
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  // Submission feedback state.
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupFormInput, unknown, SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    // Cleanup preview object URL and pending redirect when component unmounts.
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }

      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [avatarPreviewUrl, redirectTimeoutRef]);

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Validate selected file first before saving it to state.
    const file = event.target.files?.[0] ?? null;
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file && !acceptedTypes.includes(file.type)) {
      setErrorText("Avatar must be a JPEG, PNG, or WEBP image.");
      return;
    }

    if (file && file.size > maxSizeInBytes) {
      setErrorText("Avatar must be less than or equal to 5MB.");
      return;
    }

    setErrorText("");
    setAvatar(file);

    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }

    if (file) {
      setAvatarPreviewUrl(URL.createObjectURL(file));
    }
  };

  const goToNextStep = async () => {
    // Validate only the fields in the current step before moving forward.
    const isCurrentStepValid = await trigger(currentStep.fields, {
      shouldFocus: true,
    });

    if (!isCurrentStepValid) {
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onSubmit = async (values: SignupValues) => {
    try {
      // Reset UI feedback and start submit state.
      setIsSubmitting(true);
      setErrorText("");
      setSuccessText("");

      // Build multipart payload so we can include optional avatar file.
      const payload = new FormData();
      appendSignupPayload(payload, values);

      if (avatar) {
        payload.append("avatar", avatar);
      }

      const response = await signupAction(payload);
      const data = response.unwrap();

      setSuccessText(
        `Admin account created for ${data.first_name} ${data.last_name} (#${data.employee_number}).`,
      );

      // Short delay so user can see success message before redirect.
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setErrorText(normalizeServerMessage((error as Error).message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Keep the SPA flow (no browser reload).
    event.preventDefault();

    if (!isLastStep) {
      // For non-final steps, validate and move to the next step.
      void goToNextStep();
      return;
    }

    // Final step: run full schema submit.
    void handleSubmit(onSubmit)(event);
  };

  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-background p-4 md:p-8">
      <Card className="w-full max-w-6xl border-border p-0">
        <CardHeader className="border-border flex flex-row items-center justify-between border-b px-6 py-4">
          <CardTitle>
            <Text size="2xl" weight="bold" leading="none">
              Signup
            </Text>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form
            onSubmit={onFormSubmit}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
          >
            <section className="space-y-5 rounded-xl border border-border bg-card p-4 md:p-5">
              <div className="flex flex-col">
                {/* <div className="flex flex-row justify-between items-center">
                  <Text size="sm" className="text-muted-foreground">
                    {stepProgressText}
                  </Text>
                  <Text size="xl" weight="semibold">
                    {currentStep.title}
                  </Text>
                  <Text size="sm" className="text-muted-foreground">
                    {currentStep.subtitle}
                  </Text>
                </div> */}

                <div className="flex items-center gap-1">
                  {steps.map((step, idx) => (
                    <span
                      key={step.id}
                      className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                        idx <= stepIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {stepFieldLookup[currentStep.id].map((field) => (
                  <SignupFormField<SignupFormInput>
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    register={register}
                    error={errors[field.id]?.message as string | undefined}
                  />
                ))}
              </div>

              {errorText ? (
                <Text size="sm" className="whitespace-pre-line text-destructive">
                  {errorText}
                </Text>
              ) : null}
              {successText ? (
                <Text size="sm" className="text-success">
                  {successText}
                </Text>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                {stepIndex > 0 && (
                  <Button
                    type="button"
                    onClick={() =>
                      setStepIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <ChevronLeft className="size-4" />
                    Back
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={() => void goToNextStep()}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <UserRound className="size-4" />
                      {isSubmitting
                        ? "Creating account..."
                        : "Create Admin Account"}
                    </Button>
                  )}
                </div>
              </div>

              <Text size="sm" className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </Text>
            </section>

            <SignupAvatarUploadPanel
              previewUrl={avatarPreviewUrl}
              onFileChange={onAvatarChange}
            />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
