import React, { memo, useRef } from "react";
import { Calendar } from "lucide-react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  id,
  value,
  onClick,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInteraction = (e: React.MouseEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        console.warn("Native showPicker API not supported:", err);
      }
    }
    if (onClick) onClick(e);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-body-content text-text-primary mb-1 select-none"
      >
        {label}
      </label>
      <div className="relative bg-input-bg border border-input-border rounded-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <Calendar size={18} className="text-primary" />
        </span>
        <input
          id={inputId}
          ref={inputRef}
          type="date"
          value={value}
          onClick={handleInteraction}
          {...props}
          className={`
            w-full pl-10 pr-4 py-2 bg-transparent outline-none transition text-text-primary text-xs md:text-base font-body-content cursor-pointer relative
            
            /* 1. Hides the browser's default grey format mask text (dd/mm/yyyy) when there's no data chosen */
            [&::-webkit-datetime-edit-fields-wrapper]:relative 
            ${!value ? '[&::-webkit-datetime-edit]:opacity-0 shadow-none' : '[&::-webkit-datetime-edit]:opacity-100'}
            
            /* 2. Seamlessly injects the "Select date" placeholder using pure Tailwind CSS classes */
            before:absolute before:left-10 before:pointer-events-none
            before:content-['Select_date'] before:text-xs before:text-placeholder/80
            ${value ? 'before:hidden' : 'before:block'}
          `}
        />
      </div>
    </div>
  );
};

export default memo(DateInput);