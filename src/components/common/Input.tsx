import React, { memo } from "react";
import { User, type LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-body-content text-text-primary mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User size={18} className="text-primary" />
          </span>
        )}
        <input
          id={inputId}
          {...props}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-1.75 bg-input-bg border border-input-border rounded-lg outline-none transition text-text-primary font-body-content text-xs md:text-base placeholder:text-xs placeholder:text-placeholder/80`}
        />
      </div>
    </div>
  );
};

export default memo(Input);