import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const CheckPhoneApi = async (data: any) => {
  return await axiosInstance.post("/check-phone", data);
};

export const VerifyPasswordApi = async (data: any) => {
  return await axiosInstance.post("/verify-password", data);
};

export const SendOtpApi = async (data: any) => {
  return await axiosInstance.post("/send-otp", data);
};

export const VerifyOtpApi = async (data: any) => {
  return await axiosInstance.post("/verify-otp", data);
};

export const CreatePasswordApi = async (data: any) => {
  return await axiosInstance.post("/create-password", data);
};

export const RegistrationApi = async (data: FormData) => {
  const { token } = useAuthStore.getState();

  return axios.post(
    `${import.meta.env.VITE_API_URL}/complete-registration`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
