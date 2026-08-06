import {
  CosmicEnergyApi,
  GetAffirmationApi,
  GetAllTarotCardsApi,
  GetDailyMantraApi,
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
  tarotCards: "tarot-cards",
  dailyMantra: "daily-mantra",
  affirmation: "affirmation",
};

export const useHoroscopeQuery = ({ sign, period, lang }: HoroscopeParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.horoscope, sign, period, lang],
    queryFn: () => HoroscopeApi({ sign, period, lang }),
    enabled: Boolean(sign && lang),
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
  lang,
  isUserLoading,
}: BirthDetailsParams) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.luckyDetails, dob, tz, lang],
    queryFn: () => LuckyDetailsApi({ dob, lat, lon, tz, lang }),
    enabled: Boolean(dob && lat && lon && tz && !isUserLoading),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetAllTarotCardsQuery = () => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.tarotCards],
    queryFn: GetAllTarotCardsApi,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetDailyMantraQuery = () => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.dailyMantra],
    queryFn: GetDailyMantraApi,
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};

export const useGetAffirmationQuery = ({ lang }: { lang: string }) => {
  return useQuery({
    queryKey: [HOME_QUERY_KEYS.affirmation, lang],
    queryFn: () => GetAffirmationApi({ lang }),
    staleTime: getMillisecondsUntilTomorrow(),
    gcTime: 24 * 60 * 60 * 1000, // Keep cache for 1 day
  });
};
