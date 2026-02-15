import { createServerAction } from "@/infrastructure/ServerAction";
import { createServerQuery } from "@/infrastructure/ServerQuery";
import type { OverviewDashboardStatsPayload } from "./payloads";
import type { OverviewDashboardStats } from "./types";

export const getOverviewDashboardStatisticsAction = createServerAction<
  OverviewDashboardStatsPayload,
  OverviewDashboardStats
>({
  name: "getOverviewDashboardStatistics",
  apiUrl: "/api/getOverviewDashboardStatistics",
});

export const overviewDashboardStatsQuery = createServerQuery(
  "OverviewDashboard:getOverviewDashboardStatistics",
  () => getOverviewDashboardStatisticsAction({}),
  [],
);
