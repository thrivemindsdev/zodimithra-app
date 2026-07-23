import {
  GetChartApi,
  GetPanchangDetailsApi,
  GetPlanetaryPositionApi,
} from "@/services/explore.api";
import type { BirthDetailsParams } from "@/types/common.types";
import { useQuery } from "@tanstack/react-query";

export const HOME_QUERY_KEYS = {
  panchangDetails: "panchang-details",
  planetaryDetails: "planetary-details",
  chartDetails: "chart-details",
};

export const useGetPanchangDetailsQuery = ({
  datetime,
  coordinates,
  ayanamsa,
  latitude,
  longitude,
}: any) => {
  return useQuery({
    queryKey: [
      HOME_QUERY_KEYS.panchangDetails,
      datetime,
      coordinates,
      ayanamsa,
    ],
    queryFn: () => GetPanchangDetailsApi({ datetime, coordinates, ayanamsa }),
    enabled: Boolean(datetime && coordinates && ayanamsa && latitude && longitude),
  });
};

export const useGetPlanetaryPositionQuery = ({
  dob,
  lat,
  lon,
  tz,
}: BirthDetailsParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.planetaryDetails, dob, lat, lon, tz],
    queryFn: () => GetPlanetaryPositionApi({ dob, lat, lon, tz }),
    enabled: Boolean(dob && lat && lon && tz),
  });
};

export const useGetChartQuery = ({
  ayanamsa,
  coordinates,
  datetime,
  chart_type,
  chart_style,
}: any) => {
  return useQuery({
    queryKey: [
      HOME_QUERY_KEYS.chartDetails,
      ayanamsa,
      coordinates,
      datetime,
      chart_type,
      chart_style,
    ],
    queryFn: () =>
      GetChartApi({
        ayanamsa,
        coordinates,
        datetime,
        chart_type,
        chart_style,
      }),
    enabled: Boolean(
      ayanamsa && coordinates && datetime && chart_type && chart_style,
    ),
  });
};
