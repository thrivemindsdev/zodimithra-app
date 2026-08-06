import { axiosInstance, axiosSubInstance } from "@/lib/axios";
import type { GetFestivalsParams } from "@/types/calendar.types";
import type { BirthDetailsParams } from "@/types/common.types";

export const GetFetivalsApi = async ({
  year,
  month,
  day,
  country,
}: GetFestivalsParams) => {
  try {
    const response = await axiosSubInstance.get("/holidays", {
      params: { year, month, day, country },
    });

    return response?.data?.response;
  } catch (error) {
    console.error("Error fetching festivals:", error);
    throw error;
  }
};

export const GetDayDetailsApi = async ({
  dob,
  lat,
  lon,
  tz,
}: BirthDetailsParams) => {
  try {
    const response = await axiosSubInstance.get("/day-details", {
      params: { dob, lat, lon, tz },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching day details:", error);
    throw error;
  }
};

export const CreateEventApi = async (data: any) => {
  try {
    const response = await axiosInstance.post("/events", data);

    return response?.data?.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const GetEventsApi = async ({ lang }: { lang: string }) => {
  try {
    const response = await axiosInstance.get("/events", {
      params: { lang },
    });

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
