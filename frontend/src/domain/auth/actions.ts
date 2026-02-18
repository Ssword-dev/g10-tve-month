import { createServerAction } from "@/infrastructure/ServerAction";
import { createServerQuery } from "@/infrastructure/ServerQuery";

export type EmployeeIsAdminPayload = Record<"employee_number", number>;
export type LoginPayload = Record<"deped_email" | "password", string>;
export type CreateAdminUserPayload = Record<
  "employee_number" | "password" | "confirm_password",
  number | string
>;
export type UpdateAdminPasswordPayload = Record<
  "employee_number" | "new_password" | "confirm_password",
  number | string
>;
export type RemoveAdminRolePayload = Record<"employee_number", number>;

export interface EmployeeIsAdminResponse {
  employee_number: number;
  exists: boolean;
  is_admin: boolean;
}

export interface AdminSessionResponse {
  authenticated: boolean;
  role: "admin" | "guest";
  permissions: {
    can_manage_employees: boolean;
    can_view_sensitive_employee_fields: boolean;
  };
  user: {
    employee_number: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    deped_email: string | null;
    designation: string | null;
    employment_status: string | null;
    avatar_url: string | null;
  } | null;
}

export interface LoginResponse extends AdminSessionResponse {}

export interface LogoutResponse {
  authenticated: boolean;
  role: "guest";
  permissions: {
    can_manage_employees: false;
    can_view_sensitive_employee_fields: false;
  };
}

export interface AdminUserSummary {
  employee_number: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  deped_email: string | null;
  designation: string | null;
  employment_status: string | null;
  avatar_url: string | null;
}

export const loginAction = createServerAction<LoginPayload, LoginResponse>({
  name: "login",
  apiUrl: "/api/login",
  method: "POST",
});

export const employeeIsAdminAction = createServerAction<
  EmployeeIsAdminPayload,
  EmployeeIsAdminResponse
>({
  name: "employeeIsAdmin",
  apiUrl: "/api/employeeIsAdmin",
  method: "POST",
});

export const getCurrentAdminSessionAction = createServerAction<
  Record<string, never>,
  AdminSessionResponse
>({
  name: "getCurrentAdminSession",
  apiUrl: "/api/getCurrentAdminSession",
  method: "GET",
});

export const logoutAction = createServerAction<Record<string, never>, LogoutResponse>({
  name: "logout",
  apiUrl: "/api/logout",
  method: "POST",
});

export const getAllAdminsAction = createServerAction<
  Record<string, never>,
  AdminUserSummary[]
>({
  name: "getAllAdmins",
  apiUrl: "/api/getAllAdmins",
  method: "GET",
});

export const createAdminUserAction = createServerAction<
  CreateAdminUserPayload,
  { employee_number: number; is_admin: boolean }
>({
  name: "createAdminUser",
  apiUrl: "/api/createAdminUser",
  method: "POST",
});

export const updateAdminPasswordAction = createServerAction<
  UpdateAdminPasswordPayload,
  void
>({
  name: "updateAdminPassword",
  apiUrl: "/api/updateAdminPassword",
  method: "POST",
});

export const removeAdminRoleAction = createServerAction<RemoveAdminRolePayload, void>({
  name: "removeAdminRole",
  apiUrl: "/api/removeAdminRole",
  method: "POST",
});

export const currentAdminSessionQuery = createServerQuery(
  "Auth:getCurrentAdminSession",
  () => getCurrentAdminSessionAction({}),
  [],
);

export const allAdminsQuery = createServerQuery(
  "Auth:getAllAdmins",
  () => getAllAdminsAction({}),
  [],
);

export function createEmployeeIsAdminQuery(employeeNumber: number) {
  return createServerQuery(
    `Auth:employeeIsAdmin:${employeeNumber}`,
    (nextEmployeeNumber: number) =>
      employeeIsAdminAction({ employee_number: nextEmployeeNumber }),
    [employeeNumber],
  );
}

export function getAdminAvatarUrl(employeeNumber: number): string {
  return `/api/getAdminAvatar?employee_number=${encodeURIComponent(String(employeeNumber))}`;
}
