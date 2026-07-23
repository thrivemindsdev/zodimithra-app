import { Circle, CircleDot } from "lucide-react";
import React, { memo } from "react";

interface RelationshipOption {
  value: string;
  label: string;
}

interface RelationshipRadioGroupProps {
  label: string;
  options: RelationshipOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioGroup: React.FC<RelationshipRadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  error,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-body-content text-text-primary mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-2 px-3 py-1.75 border rounded-lg font-medium font-body-content text-xs transition outline-none select-none text-left w-full ring-offset-1
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-blue-100 shadow-sm ring-2"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700 bg-white"
                }`}
            >
              {isSelected ? (
                <CircleDot size={14} className="shrink-0" />
              ) : (
                <Circle size={14} className="text-gray-400 shrink-0" />
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default memo(RadioGroup);
