import { axiosInstance, axiosSubInstance } from "@/lib/axios";
import type { BirthDetailsParams, LanguageParams } from "@/types/common.types";
import type { HoroscopeParams } from "@/types/home.types";

export const HoroscopeApi = async ({ sign, period, lang }: HoroscopeParams) => {
  try {
    const response = await axiosInstance.get("/horoscope", {
      params: { sign, period, lang },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching horoscope details:", error);
    throw error;
  }
};

export const CosmicEnergyApi = async ({ lang }: LanguageParams) => {
  try {
    const response = await axiosInstance.get("/cosmic-energy", {
      params: { lang },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching cosmic energy:", error);
    throw error;
  }
};

export const LuckyDetailsApi = async ({
  dob,
  lat,
  lon,
  tz,
  lang
}: BirthDetailsParams) => {
  try {
    const response = await axiosSubInstance.get("/lucky-details", {
      params: { dob, lat, lon, tz, lang },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching lucky details:", error);
    throw error;
  }
};

export const GetAllTarotCardsApi = async () => {
  try {
    const response = await axiosInstance.get("/tarot/cards");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching tarot cards :", error);
    throw error;
  }
};

export const GetDailyMantraApi = async () => {
  try {
    const response = await axiosInstance.get("/daily-mantra");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching daily mantra :", error);
    throw error;
  }
};

export const GetAffirmationApi = async ({ lang }: { lang: string }) => {
  try {
    const response = await axiosInstance.get("/affirmation/daily", {
      params: { lang },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching affirmation daily :", error);
    throw error;
  }
};

export const GetTarotCardResult = async ({ card_name, lang }: any) => {
  try {
    const response = await axiosInstance.get("/tarot/card-of-day", {
      params: { card_name, lang },
    });

    return response?.data?.response;
  } catch (error) {
    console.error("Error fetching tarot card result details:", error);
    throw error;
  }
};

export const GetYesOrNoResult = async ({ card_name, lang }: any) => {
  try {
    const response = await axiosInstance.get("/tarot/yes-no", {
      params: { card_name, lang },
    });

    return response?.data?.response;
  } catch (error) {
    console.error("Error fetching tarot card result details:", error);
    throw error;
  }
};
