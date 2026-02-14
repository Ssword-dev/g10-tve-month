import { useCallback, useRef, useState } from "react";
import Input from "@/components/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Card from "@/components/Card";
import CardContent from "@/components/CardContent";
import Field from "@/components/Field";
import FieldLabel from "@/components/FieldLabel";
import FieldGroup from "@/components/FieldGroup";
import FieldDescription from "@/components/FieldDescription";
import { Plus } from "lucide-react";
import Pagination from "@/components/Pagination";
import PaginationOffsetButton from "@/components/PaginationOffsetButton";

const employeeFormSchema = z.object({
  // name fields
  firstName: z
    .string()
    .min(1, { error: "First name is required." })
    .max(50, { error: "First name must be 50 characters or less." }),

  middleName: z
    .string()
    .max(40, { error: "Middle name must be 40 characters or less." })
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .min(1, { error: "Last name is required." })
    .max(50, { error: "Last name must be 50 characters or less." }),

  // contact / identity
  depedEmail: z.email({ error: "Invalid email address." }).max(140).optional(),

  contactNumber: z
    .string()
    .max(40, { error: "Contact number is too long." })
    .optional(),

  address: z
    .string()
    .max(120, { error: "Address must be 120 characters or less." })
    .optional(),

  // employment info
  designation: z
    .string()
    .max(30, { error: "Designation must be 30 characters or less." })
    .optional(),

  civilStatus: z
    .string()
    .max(15, { error: "Civil status must be 15 characters or less." })
    .optional(),

  employmentStatus: z
    .string()
    .max(15, { error: "Employment status must be 15 characters or less." })
    .optional(),

  // dates
  dateOfBirth: z.coerce.date().optional(),
  dateJoined: z.coerce.date().optional(),
  dateOfOriginalAppointment: z.coerce.date().optional(),
  dateOfLatestPromotion: z.coerce.date().optional(),

  // numbers
  salaryGrade: z.coerce.number().int().optional(),
  salary: z
    .string()
    .max(50, { error: "Salary must be 50 characters or less." })
    .optional(),

  bpNumber: z.coerce.number().int().optional(),

  tin: z
    .string()
    .length(11, { error: "TIN must be exactly 11 characters." })
    .optional(),

  placeOfBirth: z
    .string()
    .max(120, { error: "Place of birth must be 120 characters or less." })
    .optional(),

  // admin user only
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(255, { error: "Password is too long." }),
});

interface AvatarUploadInputProps {
  onUpload?(file: File): Promise<void>;
}

function AvatarUploadInput({ onUpload }: AvatarUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreview] = useState<string | null>(null);
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files?.[0];

      if (!file) {
        return; // Do nothing.
      }

      // setFile(file);
      setPreview(URL.createObjectURL(file));

      if (onUpload) {
        onUpload(file);
      }
    },
    [onUpload],
  );

  return (
    <>
      <div className="bg-muted relative md:block h-full w-full">
        <Card className="h-full w-full p-0">
          <CardContent className="p-0 h-full w-full">
            {/** Overlay trigger */}
            {previewURL && (
              <div className="peer flex flex-col justify-center items-center w-full h-full rounded-xl">
                <img
                  className="block rounded-full aspect-square w-32"
                  src={previewURL!}
                />
              </div>
            )}

            <div
              onClick={() => inputRef.current!.click()}
              className="w-full h-full hidden data-force-visibility:flex peer-hover:flex flex-col justify-center items-center p-2 z-999"
              data-force-visibility={!previewURL}
            >
              <div className="aspect-square w-8 rounded-full flex flex-col justify-center items-center bg-muted border-border-muted">
                <Plus />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <input
        ref={inputRef}
        onChange={onChange}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </>
  );
}

export default function SignupPage() {
  const resolver = zodResolver(employeeFormSchema);
  const { handleSubmit, control } = useForm({
    resolver,
    mode: "onBlur",
  });
  const signup = useCallback(() => {}, []);
  return (
    <>
      <main className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-6 w-4/5">
          <Card className="overflow-hidden p-0 w-4/5">
            <CardContent className="p-0">
              <form
                className="grid md:grid-cols-2 gap-8 p-6 md:p-8"
                onSubmit={handleSubmit(signup)}
              >
                <Pagination className="h-full w-full px-4">
                  <FieldGroup className="mt-4">
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            First Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            type="text"
                          />
                        </Field>
                      )}
                    />
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>
                            First Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            type="text"
                          />
                        </Field>
                      )}
                    />

                    <PaginationOffsetButton
                      className="w-full h-3/20 min-h-10 max-h-15"
                      offset={1}
                    >
                      Next
                    </PaginationOffsetButton>
                  </FieldGroup>
                </Pagination>
                <FieldGroup>
                  <AvatarUploadInput />
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </main>
    </>
  );
}
