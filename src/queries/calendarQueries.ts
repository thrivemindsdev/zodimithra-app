import {
  GetDayDetailsApi,
  GetEventsApi,
  GetFetivalsApi,
} from "@/services/calendar.api";
import type { GetFestivalsParams } from "@/types/calendar.types";
import type { BirthDetailsParams } from "@/types/common.types";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const CALENDAR_QUERY_KEYS = {
  festivals: "festivals",
  dayDetails: "day-details",
  events: "events",
};

export const useGetFestivalsQuery = ({
  year,
  month,
  day,
  country,
}: GetFestivalsParams) => {
  return useQuery({
    queryKey: [CALENDAR_QUERY_KEYS.festivals, year, month, day, country],
    queryFn: () => GetFetivalsApi({ year, month, day, country }),
    enabled: Boolean(year && month && day && country),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetDayDetailsQuery = ({
  dob,
  lat,
  lon,
  tz,
}: BirthDetailsParams) => {
  return useQuery({
    queryKey: [CALENDAR_QUERY_KEYS.dayDetails, dob, lat, lon, tz],
    queryFn: () => GetDayDetailsApi({ dob, lat, lon, tz }),
    enabled: Boolean(dob && lat && lon && tz),
  });
};

export const useGetEventsQuery = ({ lang }: { lang: string }) => {
  return useQuery({
    queryKey: [CALENDAR_QUERY_KEYS.events, lang],
    queryFn: () => GetEventsApi({ lang }),
  });
};
