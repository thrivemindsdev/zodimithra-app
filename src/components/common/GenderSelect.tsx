// GenderSelect.tsx
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

interface GenderOption {
  value: string;
  label: string;
}

interface GenderSelectProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

const GenderSelect: React.FC<GenderSelectProps> = ({
  selectedValue,
  onChange,
}) => {
  const { t } = useTranslation();
  const options: GenderOption[] = [
    {
      value: "male",
      label: t("onboard.male"),
    },
    {
      value: "female",
      label: t("onboard.female"),
    },
  ];
  return (
    <div className="w-full">
      <label className="block text-sm font-body-content text-text-primary mb-2">
        {t("onboard.gender")}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center gap-2 py-2.5 px-2 border rounded-lg font-body-content font-medium text-xs md:text-base transition outline-none ${
                isSelected
                  ? `bg-primary text-white`
                  : "border-primary text-primary"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(GenderSelect);
