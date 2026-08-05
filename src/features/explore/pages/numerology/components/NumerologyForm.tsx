import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import TimeInput from "@/components/common/TimeInput";
import { NumerologyCalculatorApi } from "@/services/explore.api";
import { User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormState {
  fullName: string;
  dob: string;
  tob: string;
}

const initialFormState: FormState = {
  fullName: "",
  dob: "",
  tob: "",
};

const NumerologyForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const updateField = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        dob: formData.dob,
        name: formData.fullName,
        time: formData.tob,
      };

      const response = await NumerologyCalculatorApi(payload);
      navigate("/numerology-result", {
        state: {
          result: response,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isFormIncomplete = Object.values(formData).some(
    (value) => !value.trim(),
  );

  return (
    <div className="rounded-2xl card-shadow p-4 mt-4">
      <h2 className="text-primary font-body font-bold text-xl pb-4">
        {t("numerologyCalculator.personalDetails", "Personal Details")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t("onboard.fullName", "Full Name")}
          name="fullName"
          icon={User}
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          placeholder={t("onboard.fullNamePlaceholder", "e.g. John Doe")}
        />

        <DateInput
          label={t("onboard.dateOfBirth", "Date of Birth")}
          name="dob"
          value={formData.dob}
          onChange={(e) => updateField("dob", e.target.value)}
        />

        <TimeInput
          label={t("onboard.timeofBirth", "Time of Birth")}
          name="tob"
          value={formData.tob}
          onChange={(e) => updateField("tob", e.target.value)}
        />

        <div className="mt-6">
          <button
            type="submit"
            disabled={isFormIncomplete}
            className="w-full bg-primary disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition transform outline-none cursor-pointer disabled:cursor-not-allowed"
          >
            {t("numerologyCalculator.calculate", "Calculate")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NumerologyForm;
