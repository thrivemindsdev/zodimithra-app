import { axiosInstance } from "@/lib/axios";

export const getMantras = async () => {
  try {
    const response = await axiosInstance.get("/mantras");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching mantras:", error);
    throw error;
  }
};
