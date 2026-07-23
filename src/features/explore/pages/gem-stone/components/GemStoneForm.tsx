import DateInput from "@/components/common/DateInput";
import GenderSelect from "@/components/common/GenderSelect";
import PlaceInput from "@/components/common/PlaceInput";
import TimeInput from "@/components/common/TimeInput";
import { useState, type FormEvent } from "react";

interface FormState {
  dob: string;
  tob: string;
  pob: string;
  gender: string;
}

const initialFormState: FormState = {
  dob: "",
  tob: "",
  pob: "",
  gender: "male",
};

const GemStoneForm = () => {
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const updateField = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  const isFormIncomplete = Object.values(formData).some(
    (value) => !value.trim(),
  );

  return (
    <div className="rounded-2xl shadow-xl border border-gray-100 p-4 mt-4">
      <h2 className="text-primary font-body font-bold text-xl pb-4">
        Birth Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <DateInput
          label="Date of Birth"
          name="dob"
          value={formData.dob}
          onChange={(e) => updateField("dob", e.target.value)}
        />

        <TimeInput
          label="Time of Birth"
          name="tob"
          value={formData.tob}
          onChange={(e) => updateField("tob", e.target.value)}
        />

        <PlaceInput
          label="Place of Birth"
          value={formData.pob}
          onChange={(value) => updateField("pob", value)}
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
            Find Gemstone
          </button>
        </div>
      </form>
    </div>
  );
};

export default GemStoneForm;
