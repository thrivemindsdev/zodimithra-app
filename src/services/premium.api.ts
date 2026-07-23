import { axiosInstance } from "@/lib/axios";

export interface RazorpayCreateOrderResponse {
  order_id: string;
  amount: number; // in paise
  currency: string;
  key_id: string;
}

export interface RazorpayVerifyPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
}

export const getPremiumPlans = async () => {
  try {
    const response = await axiosInstance.get("/subscription");

    return response.data;
  } catch (error: any) {
    console.error("getPremiumPlans error:", error);

    throw {
      message:
        error?.response?.data?.message || "Failed to fetch premium plans",
      status: error?.response?.status || 500,
    };
  }
};

export const createRazorpayOrder = async (data: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.post<RazorpayCreateOrderResponse>(
      "/subscription/razorpay/create-order",
      data,
    );

    return response.data;
  } catch (error: any) {
    console.error("createRazorpayOrder error:", error);

    throw {
      message:
        error?.response?.data?.message || "Failed to create Razorpay order",
      status: error?.response?.status || 500,
    };
  }
};

export const verifyRazorpayOrder = async (data: RazorpayVerifyPayload) => {
  try {
    const response = await axiosInstance.post<RazorpayVerifyResponse>(
      "/subscription/razorpay/verify-payment",
      data,
    );

    return response.data;
  } catch (error: any) {
    console.error("verifyRazorpayOrder error:", error);

    throw {
      message:
        error?.response?.data?.message || "Failed to verify Razorpay payment",
      status: error?.response?.status || 500,
    };
  }
};
