import {
  CosmicEnergyApi,
  HoroscopeApi,
  LuckyDetailsApi,
} from "@/services/home.api";
import type { BirthDetailsParams, LanguageParams } from "@/types/common.types";
import type { HoroscopeParams } from "@/types/home.types";
import { getMillisecondsUntilTomorrow } from "@/utils/time-utils";
import { useQuery } from "@tanstack/react-query";

export const HOME_QUERY_KEYS = {
  horoscope: "horoscope",
  cosmicEnergy: "cosmic-energy",
  luckyDetails: "lucky-details",
};

export const useHoroscopeQuery = ({ sign_key, lang }: HoroscopeParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.horoscope, sign_key, lang],
    queryFn: () => HoroscopeApi({ sign_key, lang }),
    enabled: Boolean(sign_key && lang),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useCosmicEnergyQuery = ({ lang }: LanguageParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.cosmicEnergy, lang],
    queryFn: () => CosmicEnergyApi({ lang }),
    enabled: Boolean(lang),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useLuckyDetailsQuery = ({
  dob,
  lat,
  lon,
  tz,
  isUserLoading,
}: BirthDetailsParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.luckyDetails, dob, tz],
    queryFn: () => LuckyDetailsApi({ dob, lat, lon, tz }),
    enabled: Boolean(dob && lat && lon && tz && !isUserLoading),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};
