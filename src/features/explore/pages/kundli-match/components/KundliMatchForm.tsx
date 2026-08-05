import DateInput from "@/components/common/DateInput";
import GenderSelect from "@/components/common/GenderSelect";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import TimeInput from "@/components/common/TimeInput";
import { User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

interface PartnerData {
  fullName: string;
  dob: string;
  tob: string;
  pob: string;
  gender: string;
  latitude: number | string;
  longitude: number | string;
}

export interface MatchFormState {
  partner1: PartnerData;
  partner2: PartnerData;
}

const initialPartnerState: PartnerData = {
  fullName: "",
  dob: "",
  tob: "",
  pob: "",
  gender: "male",
  latitude: "",
  longitude: "",
};

interface KundliMatchFormProps {
  handleMatch: (data: MatchFormState) => Promise<void> | void;
  loading: boolean;
}

const KundliMatchForm = ({ handleMatch, loading }: KundliMatchFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MatchFormState>({
    partner1: { ...initialPartnerState },
    partner2: { ...initialPartnerState, gender: "female" },
  });

  const updateFields = (
    partner: "partner1" | "partner2",
    fields: Partial<PartnerData>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        ...fields,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormIncomplete) return;

    await handleMatch(formData);
  };

  const isFormIncomplete = [
    ...Object.values(formData.partner1),
    ...Object.values(formData.partner2),
  ].some((value) => String(value).trim() === "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner 1 Card */}
        <div className="rounded-2xl card-shadow p-4">
          <h2 className="text-primary font-body font-bold text-xl pb-4 mb-4">
            {t("kundliMatch.partner1", "Partner 1")}
          </h2>
          <div className="space-y-5">
            <Input
              label={t("onboard.fullName", "Full Name")}
              name="p1-fullName"
              icon={User}
              value={formData.partner1.fullName}
              onChange={(e) =>
                updateFields("partner1", { fullName: e.target.value })
              }
              placeholder={t("onboard.fullNamePlaceholder", "e.g. John Doe")}
            />
            <DateInput
              label={t("onboard.dateOfBirth", "Date of Birth")}
              name="p1-dob"
              value={formData.partner1.dob}
              onChange={(e) =>
                updateFields("partner1", { dob: e.target.value })
              }
            />
            <TimeInput
              label={t("onboard.timeofBirth", "Time of Birth")}
              name="p1-tob"
              value={formData.partner1.tob}
              onChange={(e) =>
                updateFields("partner1", { tob: e.target.value })
              }
            />
            <PlaceInput
              label={t("onboard.placeOfBirth", "Place of Birth")}
              value={formData.partner1.pob}
              onChange={(placeName, lat, lng) =>
                updateFields("partner1", {
                  pob: placeName,
                  latitude: lat ?? "",
                  longitude: lng ?? "",
                })
              }
            />
            <GenderSelect
              selectedValue={formData.partner1.gender}
              onChange={(value) => updateFields("partner1", { gender: value })}
            />
          </div>
        </div>

        {/* Partner 2 Card */}
        <div className="rounded-2xl card-shadow p-4">
          <h2 className="text-primary font-body font-bold text-xl pb-4 mb-4">
            {t("kundliMatch.partner2", "Partner 2")}
          </h2>
          <div className="space-y-5">
            <Input
              label={t("onboard.fullName", "Full Name")}
              name="p2-fullName"
              icon={User}
              value={formData.partner2.fullName}
              onChange={(e) =>
                updateFields("partner2", { fullName: e.target.value })
              }
              placeholder={t("onboard.fullNamePlaceholder", "e.g. Jane Doe")}
            />
            <DateInput
              label={t("onboard.dateOfBirth", "Date of Birth")}
              name="p2-dob"
              value={formData.partner2.dob}
              onChange={(e) =>
                updateFields("partner2", { dob: e.target.value })
              }
            />
            <TimeInput
              label={t("onboard.timeofBirth", "Time of Birth")}
              name="p2-tob"
              value={formData.partner2.tob}
              onChange={(e) =>
                updateFields("partner2", { tob: e.target.value })
              }
            />
            <PlaceInput
              label={t("onboard.placeOfBirth", "Place of Birth")}
              value={formData.partner2.pob}
              onChange={(placeName, lat, lng) =>
                updateFields("partner2", {
                  pob: placeName,
                  latitude: lat ?? "",
                  longitude: lng ?? "",
                })
              }
            />
            <GenderSelect
              selectedValue={formData.partner2.gender}
              onChange={(value) => updateFields("partner2", { gender: value })}
            />
          </div>
        </div>
      </div>

      {/* Single Unified Submit Button */}
      <div className="mt-6 max-w-md mx-auto">
        <button
          type="submit"
          disabled={isFormIncomplete || loading}
          className="w-full bg-primary disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition transform outline-none cursor-pointer disabled:cursor-not-allowed shadow-md hover:opacity-90"
        >
          {t("kundliMatch.matchButton", "Match Kundli")}
        </button>
      </div>
    </form>
  );
};

export default KundliMatchForm;
