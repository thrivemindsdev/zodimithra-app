import { axiosInstance } from "@/lib/axios";
import type { RazorpayVerifyPayload } from "./premium.api";

export interface RazorpayAsramamOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  asramam: {
    id: number;
    name: string;
  };
}

export const getAshramamLive = async () => {
  try {
    const response = await axiosInstance("/asramams/live-sessions");
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getAshramams = async () => {
  try {
    const response = await axiosInstance("/asramams");

    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getAshramamById = async ({ id, lang }: { id: number; lang: string }) => {
  try {
    const response = await axiosInstance(`/asramams/${id}`, {
      params: { lang },
    });

    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getAshramamLiveSessionByID = async ({ id, lang }: { id: number; lang: string }) => {
  try {
    const response = await axiosInstance(`/asramams/live-sessions/${id}`, {
      params: { lang },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export const createRazorpayOrderAshramaPremium = async (
  id: number,
): Promise<RazorpayAsramamOrderResponse> => {
  const response = await axiosInstance.post(
    `/asramam/${id}/subscription/create-order`
  );

  return response.data;
};

export const verifyAshramSubscriptionPayment = async (
  id: number,
  payload: RazorpayVerifyPayload,
) => {
  const response = await axiosInstance.post(
    `/asramam/${id}/subscription/verify-payment`,
    payload
  );

  return response.data;
};