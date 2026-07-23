import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import TimeInput from "@/components/common/TimeInput";
import { User } from "lucide-react";
import { useState, type FormEvent } from "react";
import NumerologyResult from "./NumerologyResult";

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
    <>
      {true ? (
        <div className="rounded-2xl shadow-s, border border-gray-200 p-4 mt-4">
          <h2 className="text-primary font-body font-bold text-xl pb-4">
            Personal Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="fullName"
              icon={User}
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="e.g. John Doe"
            />

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

            <div className="mt-6">
              <button
                type="submit"
                disabled={isFormIncomplete}
                className="w-full bg-primary disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition transform outline-none cursor-pointer disabled:cursor-not-allowed"
              >
                Calculate
              </button>
            </div>
          </form>
        </div>
      ) : (
        <NumerologyResult />
      )}
    </>
  );
};

export default NumerologyForm;
