import {
  getCityName,
  getCurrentCoordinates,
  getCurrentLocation,
} from "@/utils/location-utils";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const LOCATION_QUERY_KEYS = {
  currentLocation: "current-location",
  coordinates: "current-coordinates",
  cityName: "city-name",
};

export const useGetCurrentCoordinatesQuery = () => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEYS.coordinates],
    queryFn: getCurrentCoordinates,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetCityNameQuery = (latitude?: number, longitude?: number) => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEYS.cityName, latitude, longitude],
    queryFn: () => {
      if (latitude === undefined || longitude === undefined) return null;
      return getCityName(latitude, longitude);
    },
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetCurrentLocationQuery = () => {
  return useGetCurrentCoordinatesQuery();
};

