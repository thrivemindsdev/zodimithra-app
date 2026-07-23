// Select.tsx
import type { LucideIcon } from "lucide-react";
import React, { memo } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  icon: Icon,
  options,
  placeholder,
  id,
  ...props
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative bg-input-bg border-input-border rounded-lg">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <Icon size={18} className="text-primary" />
          </span>
        )}
        <select
          id={selectId}
          {...props}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-10 py-2 outline-none transition appearance-none text-gray-800 text-sm md:text-base`}
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/></svg>")`,
            backgroundPosition: "right 1rem center",
            backgroundSize: "1.25rem",
            backgroundRepeat: "no-repeat",
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(Select);