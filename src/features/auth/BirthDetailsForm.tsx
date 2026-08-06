import DateInput from "@/components/common/DateInput";
import GenderButtonGroup from "@/components/common/GenderButtonGroup";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import RadioGroup from "@/components/common/RadioGroup";
import TimeInput from "@/components/common/TimeInput";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import {
  useGetCityNameQuery,
  useGetCurrentLocationQuery,
} from "@/queries/locationQueries";
import { RegistrationApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Mars, User, Venus, VenusAndMars } from "lucide-react";
import React, { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface FormState {
  fullName: string;
  dob: string;
  tob: string;
  pob: string;
  lat: string;
  lon: string;
  gender: string;
  relationshipStatus: string;
  profileImage?: string | null;
  phone?: string;
}

export const initialFormState: FormState = {
  fullName: "",
  dob: "",
  tob: "",
  pob: "",
  lat: "",
  lon: "",
  gender: "",
  relationshipStatus: "",
};

export default function BirthDetailsForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { phoneNumber, setToken, setIsLoggedIn } = useAuthStore();
  const { data: currentLocation } = useGetCurrentLocationQuery();
  const { data: cityDetails } = useGetCityNameQuery(
    currentLocation?.latitude,
    currentLocation?.longitude,
  );
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = [
    { value: "male", label: t("onboard.male", "Male"), icon: Mars },
    { value: "female", label: t("onboard.female", "Female"), icon: Venus },
    { value: "other", label: t("onboard.other", "Other"), icon: VenusAndMars },
  ];

  const relationshipOptions = [
    { value: "unmarried", label: t("onboard.unmarried", "Unmarried") },
    { value: "married", label: t("onboard.married", "Married") },
    { value: "divorced", label: t("onboard.divorced", "Divorced") },
    { value: "widowed", label: t("onboard.widowed", "Widowed") },
    { value: "others", label: t("onboard.others", "Others") },
  ];

  // Generic handler for standard inputs and custom selectors
  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    updateField(e.target.name as keyof FormState, e.target.value);
  };

  const handlePlaceChange = (
    selectedPlace: string,
    latitude?: string,
    longitude?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pob: selectedPlace,
      lat: latitude ?? "",
      lon: longitude ?? "",
    }));
  };

  // Check if any required string field is empty
  const isFormIncomplete = Object.values(formData).some(
    (val) => typeof val === "string" && !val.trim(),
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isFormIncomplete) return;

    setIsSubmitting(true);
    try {
      const formDetails = new FormData();

      formDetails.append("name", formData.fullName);
      formDetails.append("gender", formData.gender);
      formDetails.append("marital_status", formData.relationshipStatus ?? "");
      formDetails.append("date_of_birth", formData.dob ?? "");
      formDetails.append("birth_time", formData.tob ?? "");
      formDetails.append("birth_place", formData.pob ?? "");
      formDetails.append("latitude", formData.lat ?? "");
      formDetails.append("longitude", formData.lon ?? "");
      formDetails.append("role", "customer");
      formDetails.append("phone", phoneNumber ?? "");
      formDetails.append("onboarding_completed", "1");
      formDetails.append("current_location", cityDetails?.city ?? "");
      formDetails.append("profile_image", "");

      const response = await RegistrationApi(formDetails);
      if (response?.status === 200) {
        if (response.data?.token) {
          setToken(response.data.token);
        }
        showSuccess(
          t("auth.regSuccess", "Registration Successful"),
          t(
            "auth.regSuccessDesc",
            "Your account has been created successfully!",
          ),
          t("common.continue", "Continue"),
          () => {
            setIsLoggedIn(true);
            navigate("/home");
          },
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
      showError(
        t("common.error", "Registration Failed"),
        t(
          "auth.regFailedDesc",
          "An error occurred while creating your account. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-body bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("onboard.title", "Personal & Birth Details")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "onboard.subTitle",
              "Please fill in your exact parameters below",
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label={t("onboard.fullName", "Full Name")}
            name="fullName"
            icon={User}
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder={t("onboard.fullNamePlaceholder", "e.g. John Doe")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateInput
              label={t("onboard.dateOfBirth", "Date of Birth")}
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <TimeInput
              label={t("onboard.timeofBirth", "Time of Birth")}
              name="tob"
              value={formData.tob}
              onChange={handleInputChange}
            />
          </div>

          <PlaceInput
            label={t("onboard.placeOfBirth", "Place of Birth")}
            value={formData.pob}
            onChange={handlePlaceChange}
          />

          <GenderButtonGroup
            label={t("onboard.gender", "Gender")}
            options={genderOptions}
            selectedValue={formData.gender}
            onChange={(val) => updateField("gender", val)}
          />

          <RadioGroup
            label={t("onboard.relationship", "Relationship Status")}
            options={relationshipOptions}
            selectedValue={formData.relationshipStatus}
            onChange={(val) => updateField("relationshipStatus", val)}
          />

          <button
            type="submit"
            disabled={isFormIncomplete || isSubmitting}
            className="w-full mt-6 font-body bg-primary text-white font-semibold py-2.5 px-4 rounded-lg transition outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 active:scale-98"
          >
            {isSubmitting
              ? t("auth.verifying", "Verifying...")
              : t("onboard.submit", "Submit")}
          </button>
        </form>
      </div>

      <ToastModal
        isOpen={toastState.isOpen}
        status={toastState.status}
        title={toastState.title}
        description={toastState.description}
        buttonText={toastState.buttonText}
        onDone={hideToast}
      />
    </div>
  );
}
