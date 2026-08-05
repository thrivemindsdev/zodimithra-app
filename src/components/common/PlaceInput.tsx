import { Loader2, MapPin, MapPinOff } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface PlaceInputProps {
  label: string;
  value: string;
  onChange: (
    selectedPlace: string,
    latitude?: string,
    longitude?: string,
  ) => void;
  placeholder?: string;
  emptyMessage?: string;
}

const PlaceInput: React.FC<PlaceInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Search city, region, or country...",
  emptyMessage = "No location found. Try refining your search.",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with outer form values
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle outside closing behavior
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Built-in 400ms search debounce logic
  useEffect(() => {
    if (inputValue.trim().length < 3 || inputValue === value) {
      setResults([]);
      setIsOpen(false);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            inputValue,
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              // Nominatim Usage Policy requirement
              "User-Agent": "YourAppName/1.0",
            },
          },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setHasSearched(true);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to resolve locations from API:", err);
        setResults([]);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, value]);

  const handleSelection = (selectedItem: NominatimResult) => {
    setInputValue(selectedItem?.display_name);
    onChange(selectedItem?.display_name, selectedItem?.lat, selectedItem?.lon);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-body text-text-primary mb-1">
        {label}
      </label>
      <div className="relative bg-input-bg border border-input-border rounded-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MapPin size={18} className="text-primary" />
        </span>
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.length >= 3 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 capitalize outline-none transition font-body text-text-primary placeholder:text-xs placeholder:text-placeholder/80 text-xs md:text-base"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 size={18} className="animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Results / No-Results Dropdown Overlay */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {results.map((item) => (
                <li
                  key={item.place_id}
                  onClick={() => handleSelection(item)}
                  className="px-4 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer text-sm text-gray-700 transition duration-150 ease-in-out"
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          ) : (
            /* Empty state when searched but no results found */
            hasSearched && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                <MapPinOff size={16} className="text-gray-400 shrink-0" />
                <span>{emptyMessage}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PlaceInput);
