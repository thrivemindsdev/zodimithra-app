import { Mars, User, Venus, VenusAndMars } from "lucide-react";
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import DateInput from "@/components/common/DateInput";
import GenderButtonGroup from "@/components/common/GenderButtonGroup";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import RadioGroup from "@/components/common/RadioGroup";
import TimeInput from "@/components/common/TimeInput";
import ToastModal from "@/components/common/ToastModal";
import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import { RegistrationApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

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
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    status: true,
    title: "",
    description: "",
  });

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
  const isFormIncomplete = Object.values(formData).some((val) => !val.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Prevent double submission
    if (isSubmitting) return;

    if (!isFormIncomplete) {
      setIsSubmitting(true);
      try {
        const formDeatils = new FormData();

        formDeatils.append("name", formData.fullName);
        formDeatils.append("gender", formData.gender);
        formDeatils.append("marital_status", formData.relationshipStatus ?? "");
        formDeatils.append("date_of_birth", formData.dob ?? "");
        formDeatils.append("birth_time", formData.tob ?? "");
        formDeatils.append("birth_place", formData.pob ?? "");
        formDeatils.append("latitude", formData.lat ?? "");
        formDeatils.append("longitude", formData.lon ?? "");
        formDeatils.append("role", "customer");
        formDeatils.append("phone", phoneNumber ?? "");
        formDeatils.append("onboarding_completed", "1");
        formDeatils.append("current_location", currentLocation?.city ?? "");
        formDeatils.append("profile_image", "");

        const response = await RegistrationApi(formDeatils);
        if (response?.status === 200) {
          setToken(response.data?.token);
          setModalState({
            isOpen: true,
            status: true,
            title: "Registration Successful",
            description: "Your account has been created successfully!",
          });
        }
      } catch (error) {
        console.error("Registration failed:", error);
        setModalState({
          isOpen: true,
          status: false,
          title: "Registration Failed",
          description:
            "An error occurred while creating your account. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDone = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.status) {
      setIsLoggedIn(true);
      navigate("/home");
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
            className="w-full mt-6 font-body bg-primary text-white font-semibold py-2.5 px-4 rounded-lg transition outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Submit"}
          </button>
        </form>
      </div>
      <ToastModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.title}
        description={modalState.description}
        buttonText="Continue"
        onDone={handleDone}
      />
    </div>
  );
}
