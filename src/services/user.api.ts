import { axiosInstance } from "@/lib/axios";

export const GetUserDetailsApi = async () => {
  try {
    const response = await axiosInstance.get("get-user-details");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const GetFamilyMembersApi = async () => {
  try {
    const response = await axiosInstance.get("/family-members");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }
};

export const AddFamilyMember = async (data: any) => {
  return await axiosInstance.post("/family-members", data);
};

export const updateUserDetailsApi = async (data: FormData) => {
  return await axiosInstance.post("/profile/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const SaveFcmTokenApi = async (token: string, platform: string) => {
  console.log("Saving FCM token:", token, "for platform:", platform);
  try {
    const response = await axiosInstance.post("/fcm-token", {
      fcm_token: token,
    });
    return response?.data;
  } catch (error) {
    console.error("Error saving FCM token:", error);
    // Don't rethrow to avoid crashing caller
    return null;
  }
};

