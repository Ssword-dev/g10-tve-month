import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import CardHeader from "@/components/CardHeader";
import CardTitle from "@/components/CardTitle";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Text from "@/components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, UserRound } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const signupSchema = z
  .object({
    employeeNumber: z.coerce
      .number({ message: "Employee number is required." })
      .int("Employee number must be an integer.")
      .positive("Employee number must be positive."),
    firstName: z.string().min(1, "First name is required."),
    middleName: z.string().default(""),
    lastName: z.string().min(1, "Last name is required."),
    depedEmail: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine(
        (value) => value === "" || z.email().safeParse(value).success,
        "DepEd email must be valid.",
      ),
    designation: z.string().default(""),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

function AvatarUpload({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const hasPreview = useMemo(() => previewUrl !== null, [previewUrl]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onChange(nextFile);

    if (!nextFile) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(nextFile));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Admin Avatar (optional)</Label>
      <label
        htmlFor="avatar"
        className="border-border bg-surface hover:border-accent flex aspect-square w-full cursor-pointer items-center justify-center rounded-xl border p-4 transition-colors"
      >
        {hasPreview ? (
          <img
            src={previewUrl!}
            alt="Avatar preview"
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="text-text-muted flex flex-col items-center gap-2">
            <div className="bg-muted rounded-full p-3">
              <Camera className="size-5" />
            </div>
            <Text size="sm">Upload avatar</Text>
          </div>
        )}
      </label>
      <Input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
      />
      <Text size="xs" className="text-text-muted">
        JPG, PNG, or WEBP up to 5MB.
      </Text>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      middleName: "",
      depedEmail: "",
      designation: "",
    },
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      setIsSubmitting(true);
      setErrorText("");
      setSuccessText("");

      const payload = new FormData();
      payload.append("employee_number", String(values.employeeNumber));
      payload.append("first_name", values.firstName.trim());
      payload.append("middle_name", values.middleName.trim());
      payload.append("last_name", values.lastName.trim());
      payload.append("deped_email", values.depedEmail?.trim() ?? "");
      payload.append("designation", values.designation.trim());
      payload.append("password", values.password);
      payload.append("confirm_password", values.confirmPassword);

      if (avatar) {
        payload.append("avatar", avatar);
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: payload,
        credentials: "same-origin",
      });
      const parsed = (await response.json()) as
        | { type: "data"; data: { employee_number: number } }
        | { type: "error"; message: string };

      if (!response.ok || parsed.type === "error") {
        throw new Error(
          parsed.type === "error" ? parsed.message : "Signup failed.",
        );
      }

      setSuccessText(
        `Account created for employee #${parsed.data.employee_number}.`,
      );
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setErrorText((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-8">
      <Card className="w-full max-w-5xl border-border p-0">
        <CardHeader className="border-border flex flex-row items-center justify-between border-b px-6 py-4">
          <CardTitle>
            <Text size="2xl" weight="bold">
              Create Admin Account
            </Text>
          </CardTitle>
          <Badge className="rounded-full">
            <UserRound className="mr-1 size-3.5" />
            Admin
          </Badge>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <form
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input id="employeeNumber" type="number" {...register("employeeNumber")} />
                {errors.employeeNumber && (
                  <Text size="xs" className="text-danger">
                    {errors.employeeNumber.message}
                  </Text>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="depedEmail">DepEd Email</Label>
                <Input id="depedEmail" type="email" {...register("depedEmail")} />
                {errors.depedEmail && (
                  <Text size="xs" className="text-danger">
                    {errors.depedEmail.message}
                  </Text>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <Text size="xs" className="text-danger">
                    {errors.firstName.message}
                  </Text>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" {...register("middleName")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <Text size="xs" className="text-danger">
                    {errors.lastName.message}
                  </Text>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" {...register("designation")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <Text size="xs" className="text-danger">
                    {errors.password.message}
                  </Text>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <Text size="xs" className="text-danger">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </div>
            </div>

            <AvatarUpload onChange={setAvatar} />

            <div className="col-span-full space-y-2">
              {errorText && (
                <Text className="text-danger" size="sm">
                  {errorText}
                </Text>
              )}
              {successText && (
                <Text className="text-success" size="sm">
                  {successText}
                </Text>
              )}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
                <Text size="sm" className="text-text-muted">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </Text>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
