import DateInput from "@/components/common/DateInput";
import GenderSelect from "@/components/common/GenderSelect";
import PlaceInput from "@/components/common/PlaceInput";
import TimeInput from "@/components/common/TimeInput";
import { useGetGemStoneFinderQuery } from "@/queries/exploreQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { timeZone } from "@/utils/timezone-utils";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormState {
  dob: string;
  tob: string;
  pob: string;
  lat: string;
  lon: string;
  gender: string;
}

const initialFormState: FormState = {
  dob: "",
  tob: "",
  pob: "",
  lat: "",
  lon: "",
  gender: "male",
};

const GemStoneForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const { data: userData } = useGetUserDetailsQuery();
  const birthDate = `${userData?.date_of_birth}T${userData?.birth_time}Z`;

  const { data } = useGetGemStoneFinderQuery({
    dob: birthDate,
    lat: Number(formData?.lat) ?? 0,
    lon: Number(formData?.lon) ?? 0,
    tz: timeZone,
  });

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

  const updateField = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    navigate("/gemstone-result", {
      state: {
        result: data,
      },
    });
  };

  const isFormIncomplete = Object.values(formData).some(
    (value) => !value.trim(),
  );

  return (
    <div className="rounded-2xl card-shadow p-4 mt-4">
      <h2 className="text-primary font-body font-bold text-xl pb-4">
        {t("freeKundli.birthDetails")}
      </h2>
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
            className="w-full bg-primary disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition transform outline-none cursor-pointer disabled:cursor-not-allowed"
          >
            {t("gemstone.findButton", "Find Gemstone")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GemStoneForm;
