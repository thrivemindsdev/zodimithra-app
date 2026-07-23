import { getPremiumPlans } from "@/services/premium.api";
import { useQuery } from "@tanstack/react-query";

export const PREMIUM_QUERY_KEYS = {
  premium: "app-premium",
};

export const useGetPremiumPlansQuery = () => {
  return useQuery({
    queryKey: [PREMIUM_QUERY_KEYS.premium],
    queryFn: () => getPremiumPlans(),
  });
};
