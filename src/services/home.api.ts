import { axiosInstance, axiosSubInstance } from "@/lib/axios";
import type { BirthDetailsParams, LanguageParams } from "@/types/common.types";
import type { HoroscopeParams } from "@/types/home.types";

export const HoroscopeApi = async ({ sign_key, lang }: HoroscopeParams) => {
  try {
    const response = await axiosInstance.get("/customer/horoscope/details", {
      params: { sign_key, lang },
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
}: BirthDetailsParams) => {
  try {
    const response = await axiosSubInstance.get("/lucky-details", {
      params: { dob, lat, lon, tz },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching lucky details:", error);
    throw error;
  }
};