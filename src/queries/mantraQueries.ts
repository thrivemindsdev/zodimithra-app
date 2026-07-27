import { getMantras } from "@/services/mantras.api";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const MANTRAS_QUERY_KEYS = {
  mantras: "mantras",
};

export const useGetMantrasQuery = () => {
  return useQuery({
    queryKey: [MANTRAS_QUERY_KEYS.mantras],
    queryFn: getMantras,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};
