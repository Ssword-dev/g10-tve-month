import type { Employee } from "@/domain/employees/types";

type OverviewActivityEmployee = Pick<
  Employee,
  | "employee_number"
  | "first_name"
  | "last_name"
  | "designation"
  | "date_of_latest_promotion"
  | "date_joined"
>;

type OverviewDashboardStats = {
  totalEmployees: number;
  permanentCount: number;
  nonPermanentCount: number;
  teacherCount: number;
  principalCount: number;
  averageSalaryGrade: number;
  recentlyPromoted: OverviewActivityEmployee[];
  recentlyJoined: OverviewActivityEmployee[];
  designationDistribution: Record<string, number>;
};

export type { OverviewActivityEmployee, OverviewDashboardStats };
