import React, { memo, useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Utility: Parse 24h string ("17:30") to { hour12: "05", minute: "30", ampm: "PM" }
function parseTimeString(
  timeStr: string | number | readonly string[] | undefined,
) {
  const str = typeof timeStr === "string" ? timeStr : "";
  if (!str || !str.includes(":")) {
    return { hour12: "12", minute: "00", ampm: "AM" };
  }
  const [hStr, mStr] = str.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) h = 12;
  let m = parseInt(mStr, 10);
  if (isNaN(m)) m = 0;

  const ampm = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;

  const hour12Str = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  const minuteStr = m < 10 ? `0${m}` : `${m}`;

  return { hour12: hour12Str, minute: minuteStr, ampm };
}

// Utility: Convert { hour12, minute, ampm } to 24h string ("17:30")
function formatTo24Hour(hour12: string, minute: string, ampm: string): string {
  let h = parseInt(hour12, 10);
  if (isNaN(h)) h = 12;
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  const mStr = minute.padStart(2, "0");
  return `${hStr}:${mStr}`;
}

// Utility: Format 24h string for display ("17:30" -> "05:30 PM")
function formatDisplayTime(
  timeStr: string | number | readonly string[] | undefined,
): string {
  const str = typeof timeStr === "string" ? timeStr : "";
  if (!str || !str.includes(":")) return "";
  const { hour12, minute, ampm } = parseTimeString(str);
  return `${hour12}:${minute} ${ampm}`;
}

// 12-Hour format lists
const HOURS_12 = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return h < 10 ? `0${h}` : `${h}`;
});

const MINUTES_60 = Array.from({ length: 60 }, (_, i) => {
  return i < 10 ? `0${i}` : `${i}`;
});

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  disabled,
  onClick,
  className = "",
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedHourRef = useRef<HTMLButtonElement>(null);
  const selectedMinuteRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const parsed = parseTimeString(value);
  const currentHour = parsed.hour12;
  const currentMinute = parsed.minute;
  const currentAmPm = parsed.ampm;

  // Auto-scroll selected hour & minute into view when popover opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        selectedHourRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        selectedMinuteRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const emitChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name || "",
          id: inputId,
          value: newValue,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleToggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (onClick) onClick(e as unknown as React.MouseEvent<HTMLInputElement>);
  };

  const handleHourSelect = (h: string) => {
    const new24h = formatTo24Hour(h, currentMinute, currentAmPm);
    emitChange(new24h);
  };

  const handleMinuteSelect = (m: string) => {
    const new24h = formatTo24Hour(currentHour, m, currentAmPm);
    emitChange(new24h);
  };

  const handleAmPmChange = (ampm: string) => {
    const new24h = formatTo24Hour(currentHour, currentMinute, ampm);
    emitChange(new24h);
  };

  const displayVal = formatDisplayTime(value);

  return (
    <div className="w-full relative" ref={containerRef}>
      <label
        htmlFor={inputId}
        className="block text-sm font-body text-text-primary mb-1 select-none"
      >
        {label}
      </label>

      {/* Trigger Box matching App Input style */}
      <div
        onClick={handleToggleOpen}
        className={`
          relative bg-input-bg border border-input-border rounded-lg py-2 px-4 pl-10 cursor-pointer
          flex items-center justify-between transition hover:border-primary/50
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Clock size={18} className="text-primary" />
        </span>

        <span
          className={`font-body text-xs md:text-base select-none ${
            displayVal ? "text-text-primary" : "text-placeholder/80"
          }`}
        >
          {displayVal || "Select time"}
        </span>
      </div>

      {/* Hidden real input for form compatibility */}
      <input
        type="hidden"
        id={inputId}
        name={name}
        value={typeof value === "string" ? value : ""}
        {...props}
      />

      {/* Popover 12-Hour Selector UI matching screenshot style */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-xl p-2 font-body animate-in fade-in duration-100">
          {/* AM / PM Segmented Control */}
          <div className="flex bg-gray-100 p-1 rounded-md mb-2">
            <button
              type="button"
              onClick={() => handleAmPmChange("AM")}
              className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer ${
                currentAmPm === "AM"
                  ? "bg-primary text-white shadow-xs"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handleAmPmChange("PM")}
              className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer ${
                currentAmPm === "PM"
                  ? "bg-primary text-white shadow-xs"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              PM
            </button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-md mb-2">
            <button
              type="button"
              onClick={() => handleAmPmChange("AM")}
              className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer text-gray-600 hover:text-primary`}
            >
              Hour
            </button>
            <button
              type="button"
              onClick={() => handleAmPmChange("PM")}
              className={`flex-1 py-1 text-xs font-bold rounded transition cursor-pointer text-gray-600 hover:text-primary`}
            >
              Min
            </button>
          </div>

          {/* 2 Vertical Scroll Columns (Hours | Minutes) */}
          <div className="grid grid-cols-2 gap-1 border-t border-gray-100 pt-1">
            {/* Hours Column (01 - 12) */}
            <div className="flex flex-col max-h-48 overflow-y-auto no-scrollbar py-1">
              {HOURS_12.map((h) => {
                const isSelected = currentHour === h;
                return (
                  <button
                    key={h}
                    ref={isSelected ? selectedHourRef : null}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={`py-1.5 text-center text-sm transition rounded-md cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            {/* Minutes Column (00 - 59) */}
            <div className="flex flex-col max-h-48 overflow-y-auto no-scrollbar py-1 border-l border-gray-100">
              {MINUTES_60.map((m) => {
                const isSelected = currentMinute === m;
                return (
                  <button
                    key={m}
                    ref={isSelected ? selectedMinuteRef : null}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    className={`py-1.5 text-center text-sm transition rounded-md cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TimeInput);
