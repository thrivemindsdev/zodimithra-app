import DateInput from "@/components/common/DateInput";
import GenderSelect from "@/components/common/GenderSelect";
import PlaceInput from "@/components/common/PlaceInput";
import TimeInput from "@/components/common/TimeInput";
import { MangalDoshApi } from "@/services/explore.api";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormState {
  dob: string;
  tob: string;
  pob: string;
  latitude: string;
  longitude: string;
  gender: string;
}

const initialFormState: FormState = {
  dob: "",
  tob: "",
  pob: "",
  latitude: "",
  longitude: "",
  gender: "male",
};

const MangalDoshForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const updateField = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceChange = (
    selectedPlace: string,
    latitude?: string,
    longitude?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pob: selectedPlace,
      latitude: latitude ?? "",
      longitude: longitude ?? "",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        datetime: `${formData.dob}T${formData.tob}:00`,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        timezone: "+05:30",
      };

      const response = await MangalDoshApi(payload);
      navigate("/mangal-dosh-result", {
        state: {
          result: response,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isFormIncomplete =
    !formData.dob ||
    !formData.tob ||
    !formData.pob ||
    !formData.latitude ||
    !formData.longitude;

  return (
    <div className="rounded-2xl card-shadow p-4 mt-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        <DateInput
          label={t("onboard.dateOfBirth")}
          name="dob"
          value={formData.dob}
          onChange={(e) => updateField("dob", e.target.value)}
        />

        <TimeInput
          label={t("onboard.timeofBirth")}
          name="tob"
          value={formData.tob}
          onChange={(e) => updateField("tob", e.target.value)}
        />

        <PlaceInput
          label={t("onboard.placeOfBirth")}
          value={formData.pob}
          onChange={handlePlaceChange}
        />

        <GenderSelect
          selectedValue={formData.gender}
          onChange={(value) => updateField("gender", value)}
        />

        <div className="mt-6">
          <button
            type="submit"
            disabled={isFormIncomplete}
            className="w-full rounded-lg bg-primary py-2.5 px-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("onboard.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MangalDoshForm;
