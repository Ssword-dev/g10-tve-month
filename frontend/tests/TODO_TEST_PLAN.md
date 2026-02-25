# Frontend Test TODO Plan

This backlog is grouped by test type and ordered roughly by impact/risk.

## Unit Tests

### Infrastructure
- [x] Add `tests/unit/infrastructure/ServerAction.test.ts`
  - [x] Verifies GET/HEAD/DELETE params are sent as query string.
  - [x] Verifies POST/PUT/PATCH params are sent as JSON body.
  - [x] Verifies `FormData` payloads are sent without forcing JSON `Content-Type`.
  - [x] Verifies `unwrap()` behavior for `data`, `success`, and `error` responses.
  - [x] Verifies invalid JSON/fetch failure returns normalized error response.
  - [x] Verifies action caching by `name` returns same action instance.

- [x] Add `tests/unit/infrastructure/ServerQuery.test.ts`
  - [x] Verifies initial state and first auto-refresh fetch.
  - [x] Verifies `refresh()` uses cache and still updates loading transitions.
  - [x] Verifies `refetch()` bypasses cache.
  - [x] Verifies `invalidate(args)` removes only targeted cache entry.
  - [x] Verifies `invalidateAll()` clears all entries.
  - [x] Verifies subscription/unsubscribe notification behavior.
  - [x] Verifies error transition (`isSuccess=false`, `error` populated).

### Hooks
- [x] Add `tests/unit/hooks/useServerQuery.test.tsx`
  - [x] Verifies hook mirrors server query state updates.
  - [x] Verifies `refresh/refetch/invalidate/invalidateAll` call through correctly.
  - [x] Verifies cleanup unsubscribes on unmount.

- [x] Add `tests/unit/hooks/useRequest.test.tsx`
  - [x] Verifies status transitions: `idle -> loading -> success/error`.
  - [x] Verifies parser behavior for `json`, `text`, and `none`.
  - [x] Verifies JSON header auto-application for object body only.
  - [x] Verifies `FormData`/string bodies do not get JSON header.
  - [x] Verifies `abort()` cancels in-flight request.
  - [x] Verifies `reset()` restores initial state.

- [x] Add `tests/unit/hooks/useIsMobile.test.tsx`
  - [x] Verifies mobile detection from media query.
  - [x] Verifies resize/media-query listener updates state.

### Domain + Utilities
- [x] Add `tests/unit/domain/theme/settings.test.ts`
  - [x] Verifies storage read/write and invalid storage fallback.
  - [x] Verifies dark mode resolution from `matchMedia`.
  - [x] Verifies `applyThemeMode` toggles root `dark` class.

- [x] Add `tests/unit/domain/auth/actions.test.ts`
  - [x] Verifies query/action wiring (endpoint + method + payload shape expectations).
  - [x] Verifies `getAdminAvatarUrl` encoding.

- [x] Add `tests/unit/pages/EmployeeDashboard/schemas.test.ts`
  - [x] Verifies schema validation success/failure for edge payloads.

### UI Components (high-value behavior)
- [x] Add `tests/unit/components/features/auth/LoginFormCard.test.tsx`
  - [x] Verifies required field validation and submit-disabled/loading states.

- [x] Add `tests/unit/components/features/dashboard/AddEmployeeForm.test.tsx`
  - [x] Verifies multi-step navigation and required field validation.
  - [x] Verifies final submit payload shape.

- [x] Add `tests/unit/components/features/dashboard/FilterModal.test.tsx`
  - [x] Verifies adding/removing filter conditions.
  - [x] Verifies include-columns and degree filters produce expected query object.

- [x] Add `tests/unit/components/features/dashboard/UpdateActionsModal.test.tsx`
  - [x] Verifies edit mode toggles and save/cancel behavior.

- [x] Add `tests/unit/components/features/dashboard/EmployeeInfoModal.test.tsx`
  - [x] Verifies detail rendering and action buttons visibility by permissions.

## E2E Tests

### Auth + Route Guards
- [x] Add `tests/e2e/auth.login.negative.test.tsx`
  - [x] Invalid email/password shows backend error message.
  - [x] Wrong credentials do not navigate to dashboard.

- [x] Add `tests/e2e/auth.signup.negative.test.tsx`
  - [x] Duplicate employee number/deped email flow shows error.
  - [x] Password mismatch is blocked client-side and/or server-side.

- [x] Add `tests/e2e/routes.guard.test.tsx`
  - [x] Guest trying `/dashboard/overview` is redirected to `/dashboard/employees`.
  - [x] Authenticated user trying `/login` or `/signup` is redirected to `/dashboard`.

### Dashboard Employees Deep Flows
- [x] Add `tests/e2e/employees.filters.test.tsx`
  - [x] Multiple filter combinations return expected rows.
  - [x] Clear/reset returns full results.
  - [x] Pagination or page limit controls (if present) behave correctly.

- [x] Add `tests/e2e/employees.crud.test.tsx`
  - [x] Add employee validation errors are shown for missing/invalid fields.
  - [x] Update employee details persists changes.
  - [x] Delete employee removes row and handles confirmation dialog edge cases.

- [x] Add `tests/e2e/employees.courses.test.tsx`
  - [x] Add, edit, and remove courses for an employee.
  - [x] Duplicate course edge case is blocked.

### Settings + Session
- [x] Add `tests/e2e/settings.theme-persistence.test.tsx`
  - [x] Theme toggle persists after reload.
  - [x] Theme preference survives re-login if expected by app rules.

- [x] Add `tests/e2e/session.logout.test.tsx`
  - [x] Logout invalidates session and blocks privileged routes.
  - [x] Browser back navigation does not restore authenticated content.

### API E2E Expansion
- [x] Extend `tests/e2e/api.test.tsx`
  - [x] Add success/invalid payload coverage for `addEmployee`, `updateEmployee`, `deleteEmployee`.
  - [x] Add success/invalid payload coverage for `addCourse`, `updateCourse`, `deleteCourse`.
  - [x] Add auth-sensitive endpoint checks (expected 401/403 behavior where applicable).

## Suggested Execution Order
1. Infrastructure unit tests (`ServerAction`, `ServerQuery`).
2. Hook unit tests (`useRequest`, `useServerQuery`).
3. Auth/route guard E2E tests.
4. Employee CRUD/filter/courses E2E tests.
5. Remaining component unit tests.
