import { axiosInstance } from "@/lib/axios";

export const SendOtpApi = async (data: any) => {
  return await axiosInstance.post("/send-otp", data);
};

export const VerifyOtpApi = async (data: any) => {
  return await axiosInstance.post("/verify-otp", data);
};

// FIX: Explicitly type 'data' as FormData
export const RegistrationApi = async (data: FormData) => {
  return await axiosInstance.post("/complete-registration", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
