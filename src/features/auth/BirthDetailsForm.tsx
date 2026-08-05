import DateInput from "@/components/common/DateInput";
import GenderButtonGroup from "@/components/common/GenderButtonGroup";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import RadioGroup from "@/components/common/RadioGroup";
import TimeInput from "@/components/common/TimeInput";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import { RegistrationApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";
import { Mars, User, Venus, VenusAndMars } from "lucide-react";
import React, { useState, type FormEvent } from "react";
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

export const GENDER_OPTIONS = [
  { value: "male", label: "Male", icon: Mars },
  { value: "female", label: "Female", icon: Venus },
  { value: "other", label: "Other", icon: VenusAndMars },
];

export const RELATIONSHIP_OPTIONS = [
  { value: "unmarried", label: "Unmarried" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "others", label: "Others" },
];

export default function BirthDetailsForm() {
  const navigate = useNavigate();
  const { phoneNumber, setToken, setIsLoggedIn } = useAuthStore();
  const { data: currentLocation } = useGetCurrentLocationQuery();
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      formDetails.append("current_location", currentLocation?.city ?? "");
      formDetails.append("profile_image", "");

      const response = await RegistrationApi(formDetails);
      if (response?.status === 200) {
        if (response.data?.token) {
          setToken(response.data.token);
        }
        showSuccess(
          "Registration Successful",
          "Your account has been created successfully!",
          "Continue",
          () => {
            setIsLoggedIn(true);
            navigate("/home");
          },
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
      showError(
        "Registration Failed",
        "An error occurred while creating your account. Please try again.",
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
            Personal &amp; Birth Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in your exact parameters below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            icon={User}
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateInput
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <TimeInput
              label="Time of Birth"
              name="tob"
              value={formData.tob}
              onChange={handleInputChange}
            />
          </div>

          <PlaceInput
            label="Place of Birth"
            value={formData.pob}
            onChange={handlePlaceChange}
          />

          <GenderButtonGroup
            label="Gender"
            options={GENDER_OPTIONS}
            selectedValue={formData.gender}
            onChange={(val) => updateField("gender", val)}
          />

          <RadioGroup
            label="Relationship Status"
            options={RELATIONSHIP_OPTIONS}
            selectedValue={formData.relationshipStatus}
            onChange={(val) => updateField("relationshipStatus", val)}
          />

          <button
            type="submit"
            disabled={isFormIncomplete || isSubmitting}
            className="w-full mt-6 font-body bg-primary text-white font-semibold py-2.5 px-4 rounded-lg transition outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 active:scale-98"
          >
            {isSubmitting ? "Verifying..." : "Submit"}
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
