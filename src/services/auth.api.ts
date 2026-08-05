import { axiosInstance } from "@/lib/axios";
import type {
  CheckPhonePayload,
  CheckPhoneResponseData,
  CreatePinPayload,
  CreatePinResponseData,
  RegistrationResponseData,
  SendOtpPayload,
  VerifyOtpPayload,
  VerifyOtpResponseData,
  VerifyPasswordPayload,
  VerifyPasswordResponseData,
} from "@/types/auth";
import type { AxiosResponse } from "axios";


export const CheckPhoneApi = async (
  data: CheckPhonePayload,
): Promise<AxiosResponse<CheckPhoneResponseData>> => {
  return await axiosInstance.post<CheckPhoneResponseData>("/check-phone", data);
};

export const VerifyPasswordApi = async (
  data: VerifyPasswordPayload,
): Promise<AxiosResponse<VerifyPasswordResponseData>> => {
  return await axiosInstance.post<VerifyPasswordResponseData>(
    "/verify-password",
    data,
  );
};

export const SendOtpApi = async (
  data: SendOtpPayload,
): Promise<AxiosResponse<unknown>> => {
  return await axiosInstance.post("/send-otp", data);
};

export const VerifyOtpApi = async (
  data: VerifyOtpPayload,
): Promise<AxiosResponse<VerifyOtpResponseData>> => {
  return await axiosInstance.post<VerifyOtpResponseData>("/verify-otp", data);
};

export const CreatePinApi = async (
  data: CreatePinPayload,
): Promise<AxiosResponse<CreatePinResponseData>> => {
  return await axiosInstance.post<CreatePinResponseData>(
    "/create-password",
    data,
  );
};

export const RegistrationApi = async (
  data: FormData,
): Promise<AxiosResponse<RegistrationResponseData>> => {
  return await axiosInstance.post<RegistrationResponseData>(
    "/complete-registration",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
