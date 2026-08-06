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

export const getMantrasCategory = async () => {
  try {
    const response = await axiosInstance.get("/mantra-categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching mantras categories:", error);
    throw error;
  }
};

export const getMantraCategoryById = async ({ id }: { id: number }) => {
  try {
    const response = await axiosInstance.get("/mantras", {
      params: { category_id: id },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching mantra category:", error);
    throw error;
  }
};
