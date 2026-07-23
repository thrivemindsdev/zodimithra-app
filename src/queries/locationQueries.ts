import { getCurrentLocation } from "@/utils/location-utils";
import { useQuery } from "@tanstack/react-query";

export const LOCATION_QUERY_KEYS = {
  currentLocation: "current-location",
};

export const useGetCurrentLocationQuery = () => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEYS.currentLocation],
    queryFn: getCurrentLocation,
  });
};
