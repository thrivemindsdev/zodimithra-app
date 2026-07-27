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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  // Show Skeleton loading when either location or panchang data calculation is pending
  if (isLocationLoading || loading) {
    return (
      <div className="mx-auto max-w-md space-y-5 bg-gray-50/50 font-body antialiased pt-6">
        {/* Header Skeleton */}
        <div className="mx-auto flex max-w-md items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-1.5">
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* 1. Sun & Moon Skeleton */}
        <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center">
              <div className="mb-2 h-6 w-6 animate-pulse rounded-full bg-gray-200" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              <div className="mt-1.5 h-4 w-14 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* 2. Muhurat & Kaal Blocks Skeleton */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-1.5 rounded-2xl border border-indigo-200/50 bg-indigo-50/20 p-3 text-center"
              >
                <div className="mx-auto h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mx-auto h-4 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Five Limbs Panchang List Skeleton */}
        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* 4. Hindu Calendar Skeleton */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-2xl border border-gray-100 bg-light-bg p-4 text-center"
              >
                <div className="mx-auto h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (locationError || !panchangData) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center font-body text-sm text-amber-800">
        Please verify that location permissions are granted to compute regional
        panchang parameters.
      </div>
    );
  }

  // --- Tiny Reusable UI Blocks ---
  const TimingItem: React.FC<TimingItemProps> = ({ icon, label, time }) => (
    <div className="flex flex-1 min-w-0 flex-col items-center">
      <div className="text-secondary mb-1">{icon}</div>
      <span className="w-full truncate text-center font-medium text-xs text-text-secondary">
        {label}
      </span>
      <span className="mt-0.5 font-bold text-sm text-text-primary">{time}</span>
    </div>
  );

  const TimeBlock: React.FC<TimeBlockProps> = ({ label, value }) => (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-3 text-center">
      <div className="font-medium text-[11px] text-text-secondary">{label}</div>
      <div className="mt-0.5 font-bold text-[13px] text-text-primary">
        {value}
      </div>
    </div>
  );

  const PanchangRow: React.FC<PanchangRowProps> = ({ label, value }) => (
    <div className="flex items-start justify-between text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <span className="max-w-[70%] text-right font-medium text-text-primary">
        {value}
      </span>
    </div>
  );

  const CalendarCard: React.FC<CalendarCardProps> = ({ label, value }) => (
    <div className="rounded-2xl border border-primary bg-light-bg p-4 text-center">
      <div className="font-medium text-xs text-text-secondary">{label}</div>
      <div className="mt-1 font-body font-black text-sm text-text-primary first-letter:capitalize">
        {value}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-md space-y-5 bg-gray-50/50 font-body antialiased selection:bg-indigo-100 pt-6">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 font-body antialiased shadow-sm selection:bg-indigo-100">
        {/* Date Information */}
        <div className="flex flex-col">
          <h1 className="font-body font-bold text-lg text-primary">
            {t("panchang.today", { defaultValue: "Today" })}
          </h1>
          <span className="mt-0.5 font-medium text-sm text-text-secondary">
            {formattedDate}
          </span>
        </div>

        {/* Location Pill */}
        <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-white shadow-sm">
          <MapPin className="h-4 w-4 stroke-[2.5] text-white/90" />
          <span className="font-body font-medium tracking-wide text-sm">
            {location?.city}
          </span>
        </div>
      </div>

      {/* 1. Dynamic Sun & Moon Elements */}
      <div className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 text-center shadow-sm">
        <TimingItem
          icon={<Sunrise className="h-6 w-6" />}
          label={t("panchang.sunRise")}
          time={panchangData.sunrise}
        />
        <TimingItem
          icon={<Sunset className="h-6 w-6" />}
          label={t("panchang.sunSet")}
          time={panchangData.sunset}
        />
        <TimingItem
          icon={<Moon className="h-6 w-6" />}
          label={t("panchang.moonRise")}
          time={panchangData.moonrise}
        />
        <TimingItem
          icon={<Moon className="h-6 w-6" />}
          label={t("panchang.moonSet")}
          time={panchangData.moonset}
        />
      </div>

      {/* 2. Muhurat & Kaal Blocks */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-body font-bold text-lg text-primary">
          {t("panchang.auspiciousTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <TimeBlock
            label={t("panchang.abhijeetMuhurat")}
            value={panchangData.abhijit}
          />
          <TimeBlock
            label={t("panchang.guliKaal")}
            value={panchangData.gulika}
          />
          <TimeBlock
            label={t("panchang.rahukaal")}
            value={panchangData.rahukaal}
          />
          <TimeBlock
            label={t("panchang.yamghantKaal")}
            value={panchangData.yamhand}
          />
        </div>
      </div>

      {/* 3. Five Limbs of Panchang List */}
      <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-body font-bold text-lg text-primary">
          {t("panchang.title")}
        </h2>
        <PanchangRow label={t("panchang.tithi")} value={panchangData.tithi} />
        <PanchangRow label={t("panchang.karan")} value={panchangData.karana1} />
        <PanchangRow
          label={t("panchang.nakshatra")}
          value={panchangData.nakshatra}
        />
        <PanchangRow label={t("panchang.yog")} value={panchangData.yoga} />
        <PanchangRow
          label={t("panchang.karanEndTime")}
          value={panchangData.karana2}
        />
      </div>

      {/* 4. Traditional Hindu Calendar Blocks */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-body font-bold text-lg text-primary">
          {t("panchang.hinduCalendar")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <CalendarCard
            label={t("panchang.Vikram Samvat")}
            value={panchangData.vikramSamvat}
          />
          <CalendarCard
            label={t("panchang.month")}
            value={panchangData.month.toLowerCase()}
          />
          <CalendarCard
            label={t("panchang.Shaka Samvat")}
            value={panchangData.shakaSamvat}
          />
          <CalendarCard
            label={t("panchang.paksha")}
            value={panchangData.paksha.toLowerCase()}
          />
        </div>
      </div>
    </div>
  );
};

export default PanchangCard;