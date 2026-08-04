import { getCurrentLocation } from "@/utils/location-utils";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const LOCATION_QUERY_KEYS = {
  currentLocation: "current-location",
};

export const useGetCurrentLocationQuery = () => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEYS.currentLocation],
    queryFn: getCurrentLocation,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};
