import { getDashboardStats } from "@/app/actions/dashboard/get-dashboard-stats";
import { useQuery } from "@tanstack/react-query";


export function useDashboardStats(tenant: string) {
  return useQuery({
    queryKey: ["dashboard-stats", tenant],
    queryFn: () => getDashboardStats({ tenant }),
    staleTime: 60_000, // 1 min — stats don't need to be real-time
    select: (result) => {
      if (!result.ok) throw new Error(result.error);
      return result.stats;
    },
  });
}