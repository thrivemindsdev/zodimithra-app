import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import {
  getPanchangam,
  nakshatraNames,
  Observer,
  tithiNames,
  yogaNames,
} from "@ishubhamx/panchangam-js";
import { MapPin, Moon, Sunrise, Sunset } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PanchangData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  abhijit: string;
  gulika: string;
  rahukaal: string;
  yamhand: string;
  tithi: string;
  karana1: string;
  nakshatra: string;
  yoga: string;
  karana2: string;
  vikramSamvat: string;
  shakaSamvat: string;
  month: string;
  paksha: string;
}

interface TimingItemProps {
  icon: React.ReactNode;
  label: string;
  time: string;
}

interface TimeBlockProps {
  label: string;
  value: string;
}

interface PanchangRowProps {
  label: string;
  value: string;
}

interface CalendarCardProps {
  label: string;
  value: string;
}

export const PanchangCard: React.FC = () => {
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useGetCurrentLocationQuery();

  const formattedDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(/,([^,]*)$/, " |$1");

  // Helper utility to convert optional Native JS Date models to 12-hour AM/PM blocks
  const formatTime = (dateInput?: Date | string | number | null): string => {
    if (!dateInput) return "--:-- --";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "--:-- --";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper utility to safely construct time spans from MuhurtaTime structures
  const formatMuhurtaRange = (
    muhurta: { start: Date; end: Date } | null,
  ): string => {
    if (!muhurta || !muhurta.start || !muhurta.end)
      return "--:-- -- - --:-- --";
    return `${formatTime(muhurta.start)} - ${formatTime(muhurta.end)}`;
  };

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    try {
      setLoading(true);
      const lat = location.latitude;
      const lon = location.longitude;

      const observer = new Observer(lat, lon, 0);
      const today = new Date();
      const timezoneOffset = -today.getTimezoneOffset(); // Evaluates local system offset in minutes automatically

      // Fetch the true Panchang object matching the structure definition
      const panchang = getPanchangam(today, observer, { timezoneOffset });

      // FIX: Access array properties through valid aliases exposed in the interface
      const activeTithi = panchang.tithis?.[0];
      const activeNakshatra = panchang.nakshatras?.[0];
      const activeYoga = panchang.yogas?.[0];

      const activeKarana1 = panchang.karanas?.[0];
      const activeKarana2 = panchang.karanas?.[1];

      setPanchangData({
        sunrise: formatTime(panchang.sunrise),
        sunset: formatTime(panchang.sunset),
        moonrise: formatTime(panchang.moonrise),
        moonset: formatTime(panchang.moonset),

        // Native Muhurta mappings parsed from interface definitions
        abhijit: formatMuhurtaRange(panchang.abhijitMuhurta),
        gulika: formatMuhurtaRange(panchang.gulikaKalam),
        rahukaal:
          panchang.rahuKalamStart && panchang.rahuKalamEnd
            ? `${formatTime(panchang.rahuKalamStart)} - ${formatTime(panchang.rahuKalamEnd)}`
            : "--:-- -- - --:-- --",
        yamhand: formatMuhurtaRange(panchang.yamagandaKalam),

        // Dynamic element names matched with custom formatting lookups
        tithi: `${panchang.paksha || ""} ${tithiNames[panchang.tithi] || "Tithi"} ${
          activeTithi ? `upto ${formatTime(activeTithi.endTime)}` : ""
        }`,
        karana1: activeKarana1 ? activeKarana1.name : panchang.karana || "--",
        nakshatra: `${nakshatraNames[panchang.nakshatra] || "Nakshatra"} ${
          activeNakshatra ? `upto ${formatTime(activeNakshatra.endTime)}` : ""
        }`,
        yoga: `${yogaNames[panchang.yoga] || "Yoga"} ${
          activeYoga ? `upto ${formatTime(activeYoga.endTime)}` : ""
        }`,
        karana2: activeKarana2 ? formatTime(activeKarana2.endTime) : "--:-- --",

        // Safe extraction of structural samvat and masa objects
        vikramSamvat: panchang.samvat
          ? `${panchang.samvat.vikram} ${panchang.samvat.samvatsara || ""}`
          : "--",
        shakaSamvat: panchang.samvat ? `${panchang.samvat.shaka}` : "--",
        month: panchang.masa
          ? `${panchang.masa.name}${panchang.masa.isAdhika ? " (Adhika)" : ""}`
          : "--",
        paksha: panchang.paksha ? `${panchang.paksha} Paksha` : "--",
      });
    } catch (error) {
      console.error("Error formatting resolved panchang values:", error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  if (isLocationLoading || loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center min-h-88 text-text-primary font-body font-medium text-sm">
        <MapPin className="w-5 h-5 animate-bounce text-indigo-600" />
        <div className="text-text-secondary text-xs font-normal">
          Loading dynamic panchang attributes...
        </div>
      </div>
    );
  }

  if (locationError || !panchangData) {
    return (
      <div className="max-w-md mx-auto p-5 text-center text-sm font-body bg-amber-50 text-amber-800 rounded-2xl border border-amber-200">
        Please verify that location permissions are granted to compute regional
        panchang parameters.
      </div>
    );
  }

  // --- Tiny Reusable UI Blocks (Eliminates Tailwind Redundancy) ---
  const TimingItem: React.FC<TimingItemProps> = ({ icon, label, time }) => (
    <div className="flex flex-col items-center flex-1">
      <div className="text-secondary mb-1">{icon}</div>
      <span className="text-xs text-text-secondary font-medium">{label}</span>
      <span className="text-sm font-bold text-text-primary mt-0.5">{time}</span>
    </div>
  );

  const TimeBlock: React.FC<TimeBlockProps> = ({ label, value }) => (
    <div className="bg-indigo-50/40 border border-indigo-200 rounded-2xl p-3 text-center">
      <div className="text-[11px] text-text-secondary font-medium">{label}</div>
      <div className="text-[13px] font-bold text-text-primary mt-0.5">
        {value}
      </div>
    </div>
  );

  const PanchangRow: React.FC<PanchangRowProps> = ({ label, value }) => (
    <div className="flex justify-between items-start text-sm">
      <span className="text-text-secondary font-medium">{label}</span>
      <span className="text-text-primary font-medium text-right max-w-[70%]">
        {value}
      </span>
    </div>
  );

  const CalendarCard: React.FC<CalendarCardProps> = ({ label, value }) => (
    <div className="bg-light-bg border border-primary rounded-2xl p-4 text-center">
      <div className="text-xs text-text-secondary font-medium">{label}</div>
      <div className="text-sm font-body font-black text-text-primary mt-1 first-letter:capitalize">
        {value}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto pt-6 bg-gray-50/50 space-y-5 font-body selection:bg-indigo-100 antialiased">
      <div className="max-w-md mx-auto p-5 bg-white rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center font-body selection:bg-indigo-100 antialiased">
        {/* Date Information */}
        <div className="flex flex-col">
          <h1 className="text-lg font-body font-bold text-primary">Today</h1>
          <span className="text-sm text-text-secondary font-medium mt-0.5">
            {formattedDate}
          </span>
        </div>

        {/* Location Pill */}
        <div className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full shadow-sm">
          <MapPin className="w-4 h-4 text-white/90 stroke-[2.5]" />
          <span className="text-sm font-body font-medium tracking-wide">
            {location?.city}
          </span>
        </div>
      </div>
      {/* 1. Dynamic Sun & Moon Elements */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex justify-between items-center text-center">
        <TimingItem
          icon={<Sunrise className="w-6 h-6" />}
          label="Sunrise"
          time={panchangData.sunrise}
        />
        <TimingItem
          icon={<Sunset className="w-6 h-6" />}
          label="Sunset"
          time={panchangData.sunset}
        />
        <TimingItem
          icon={<Moon className="w-6 h-6" />}
          label="Moonrise"
          time={panchangData.moonrise}
        />
        <TimingItem
          icon={<Moon className="w-6 h-6" />}
          label="Moonset"
          time={panchangData.moonset}
        />
      </div>

      {/* 2. Muhurat & Kaal Blocks */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-body font-bold text-primary mb-4">
          Auspicious / Inauspicious Time
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <TimeBlock label="Abhijit Muhurat" value={panchangData.abhijit} />
          <TimeBlock label="Gulikaal" value={panchangData.gulika} />
          <TimeBlock label="Rahukaal" value={panchangData.rahukaal} />
          <TimeBlock label="Yamghant Kaal" value={panchangData.yamhand} />
        </div>
      </div>

      {/* 3. Five Limbs of Panchang List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-body font-bold text-primary mb-2">
          Panchang
        </h2>
        <PanchangRow label="Tithi" value={panchangData.tithi} />
        <PanchangRow label="Karan" value={panchangData.karana1} />
        <PanchangRow label="Nakshatra" value={panchangData.nakshatra} />
        <PanchangRow label="Yog" value={panchangData.yoga} />
        <PanchangRow label="Karan End Time" value={panchangData.karana2} />
      </div>

      {/* 4. Traditional Hindu Calendar Blocks */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-body font-bold text-primary mb-4">
          Hindu Calendar
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <CalendarCard
            label="Vikram Samvat"
            value={panchangData.vikramSamvat}
          />
          <CalendarCard
            label="Month"
            value={panchangData.month.toLowerCase()}
          />
          <CalendarCard label="Shaka Samvat" value={panchangData.shakaSamvat} />
          <CalendarCard
            label="Paksha"
            value={panchangData.paksha.toLowerCase()}
          />
        </div>
      </div>
    </div>
  );
};

export default PanchangCard;
