import { createServerAction } from "@/infrastructure/ServerAction";

export interface SignupResponse {
  employee_number: number;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export const signupAction = createServerAction<FormData, SignupResponse>({
  name: "signup",
  apiUrl: "/api/signup",
  method: "POST",
});
