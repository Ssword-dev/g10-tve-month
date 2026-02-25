import {
  allAdminsQuery,
  createAdminUserAction,
  createEmployeeIsAdminQuery,
  employeeIsAdminAction,
  getAdminAvatarUrl,
  getAllAdminsAction,
  getCurrentAdminProfilePictureAction,
  getCurrentAdminSessionAction,
  loginAction,
  logoutAction,
  removeAdminRoleAction,
  updateAdminPasswordAction,
} from "@/domain/auth/actions";
import { describe, expect, it } from "vitest";

describe("domain/auth/actions", () => {
  it("exposes server actions with expected endpoint metadata", () => {
    expect(loginAction.apiUrl).toBe("/api/login");
    expect(loginAction.method).toBe("POST");

    expect(employeeIsAdminAction.apiUrl).toBe("/api/employeeIsAdmin");
    expect(employeeIsAdminAction.method).toBe("POST");

    expect(getCurrentAdminSessionAction.apiUrl).toBe("/api/getCurrentAdminSession");
    expect(getCurrentAdminSessionAction.method).toBe("GET");

    expect(getCurrentAdminProfilePictureAction.apiUrl).toBe("/api/getCurrentAdminProfilePicture");
    expect(getCurrentAdminProfilePictureAction.method).toBe("GET");

    expect(logoutAction.apiUrl).toBe("/api/logout");
    expect(logoutAction.method).toBe("POST");

    expect(getAllAdminsAction.apiUrl).toBe("/api/getAllAdmins");
    expect(getAllAdminsAction.method).toBe("GET");

    expect(createAdminUserAction.apiUrl).toBe("/api/createAdminUser");
    expect(createAdminUserAction.method).toBe("POST");

    expect(updateAdminPasswordAction.apiUrl).toBe("/api/updateAdminPassword");
    expect(updateAdminPasswordAction.method).toBe("POST");

    expect(removeAdminRoleAction.apiUrl).toBe("/api/removeAdminRole");
    expect(removeAdminRoleAction.method).toBe("POST");
  });

  it("creates employee-admin query with employee-specific key", async () => {
    const query = createEmployeeIsAdminQuery(10001);

    expect(query.key).toBe("Auth:employeeIsAdmin:10001");

    await query.refresh(10001);
    const state = query.getState();
    expect(state.error).toBeNull();
  });

  it("exports prebuilt auth queries", () => {
    expect(allAdminsQuery.key).toBe("Auth:getAllAdmins");
  });

  it("builds encoded avatar URL", () => {
    expect(getAdminAvatarUrl(10001)).toBe(
      "/api/getAdminAvatar?employee_number=10001",
    );
    expect(getAdminAvatarUrl(10_001_999)).toContain("employee_number=10001999");
  });
});
