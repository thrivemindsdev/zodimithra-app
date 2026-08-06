import { axiosInstance, axiosSubInstance } from "@/lib/axios";
import type { BirthDetailsParams } from "@/types/common.types";

export const KundliMatchApi = async (data: any) => {
  try {
    const response = await axiosSubInstance.post(
      "/astrology/kundli-matching",
      data,
    );

    return response?.data?.data;
  } catch (error) {
    console.error("Error matching kundli:", error);
    throw error;
  }
};

export const GetPanchangDetailsApi = async ({
  datetime,
  coordinates,
  ayanamsa,
}: any) => {
  try {
    const response = await axiosSubInstance.get("/panchang", {
      params: {
        datetime,
        coordinates,
        ayanamsa,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching Panchang details:", error);
    throw error;
  }
};

export const GetPlanetaryPositionApi = async ({
  dob,
  lat,
  lon,
  tz,
}: BirthDetailsParams) => {
  try {
    const response = await axiosSubInstance.get("/planetary-positions", {
      params: { dob, lat, lon, tz },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching planetary positions:", error);
    throw error;
  }
};

export const GetChartApi = async ({
  ayanamsa,
  coordinates,
  datetime,
  chart_type,
  chart_style,
}: any) => {
  try {
    const response = await axiosSubInstance.get("/chart", {
      params: {
        ayanamsa,
        coordinates,
        datetime,
        chart_type,
        chart_style,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error fetching chart:", error);
    throw error;
  }
};

export const GetGemStoneFinderApi = async ({
  dob,
  lat,
  lon,
  tz,
  lang,
}: BirthDetailsParams) => {
  try {
    const response = await axiosSubInstance.get("/gemstone-finder", {
      params: { dob, lat, lon, tz, lang },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching gemstone finder:", error);
    throw error;
  }
};

export const MangalDoshApi = async (data: any) => {
  try {
    const response = await axiosInstance.post("/vedika/mangal-dosha", data);

    return response?.data?.data;
  } catch (error) {
    console.error("Error mangal dosha:", error);
    throw error;
  }
};

export const NumerologyCalculatorApi = async (data: any) => {
  try {
    const response = await axiosInstance.post("/numerology/calculate", data);
    return response?.data?.data;
  } catch (error) {
    console.error("Error mangal dosha:", error);
    throw error;
  }
};
