// GenderButtonGroup.tsx
import type { LucideIcon } from "lucide-react";
import React, { memo } from "react";

interface GenderOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface GenderButtonGroupProps {
  label: string;
  options: GenderOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const GenderButtonGroup: React.FC<GenderButtonGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => (
  <div className="w-full">
    <label className="block text-sm font-body-content text-text-primary mb-2">
      {label}
    </label>
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center gap-2 py-1.75 px-2 border rounded-lg font-body-content font-medium text-xs md:text-base transition outline-none ${
              isSelected
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-blue-100 ring-2"
                : "border-gray-300 hover:bg-gray-50 text-gray-600"
            }`}
          >
            <Icon
              size={16}
              className={isSelected ? "text-blue-600" : "text-gray-400"}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default memo(GenderButtonGroup);
