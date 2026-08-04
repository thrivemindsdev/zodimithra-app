import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MonthCalendar from "./MonthCalendar";
import WeekCalendar from "./WeekCalendar";

import { type ActivePhase, getPhaseForDateSync } from "@/utils/getMoonPhase";
import { type LocationDetails } from "@/utils/location-utils";
import { Moon } from "lunarphase-js";

interface CalendarLayoutProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  location: LocationDetails | null | undefined;
  loading: boolean;
}

const CalendarLayout = ({
  selectedDate,
  setSelectedDate,
  location,
  loading,
}: CalendarLayoutProps) => {
  const { t } = useTranslation();
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ActivePhase | null>(null);

  const lat = location?.latitude;
  const lng = location?.longitude;
  const selectedTimestamp = selectedDate.getTime();

  useEffect(() => {
    if (!lat || !lng) {
      setCurrentPhase(null);
      return;
    }

    const moonPhase = getPhaseForDateSync(
      new Date(selectedTimestamp),
      lat,
      lng,
    );
    setCurrentPhase(moonPhase);
  }, [selectedTimestamp, lat, lng]);

  const isLoading = loading || !lat || !lng;

  const agePercent = Moon.lunarAgePercent(selectedDate);
  const currentIllumination =
    ((1 - Math.cos(2 * Math.PI * agePercent)) / 2) * 100;

  return (
    <section className="relative mt-6">
      {/* Top Hero Section: Phase Display */}
      <div className="flex w-full flex-col items-center">
        {/* Day Name */}
        {isLoading ? (
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="font-body-content text-xs tracking-[2px]">
            {t(`calendar.${format(selectedDate, "EEEE").toLowerCase()}`)}
          </p>
        )}

        {/* Date Display */}
        {isLoading ? (
          <div className="mt-1 h-6 w-32 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="font-body-content text-lg font-bold tracking-[1px]">
            {t(`calendar.${format(selectedDate, "MMMM")}`)}{" "}
            {format(selectedDate, "d")}
          </p>
        )}

        {/* Moon Image Skeleton / Hero Image */}
        <div className="my-4 flex h-28 w-28 items-center justify-center">
          {isLoading || !currentPhase?.image ? (
            <div className="h-28 w-28 animate-pulse rounded-full bg-slate-200" />
          ) : (
            <img
              src={currentPhase.image}
              alt={`${currentPhase.paksha} ${currentPhase.name}`}
              className="h-full w-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Dynamic Grid Views */}
      <div className="py-6">
        {/* Phase Name Header */}
        {isLoading ? (
          <div className="mx-auto mb-2 h-6 w-44 animate-pulse rounded bg-slate-200" />
        ) : (
          <h2 className="text-text-primary text-center font-body-content text-lg font-semibold">
            {currentPhase?.description || ""}
          </h2>
          // <h2 className="text-text-primary text-center font-body-content text-lg font-semibold">
          //   {currentPhase
          //     ? `${currentPhase.paksha} ${currentPhase.name}`
          //     : t("calendar.loading")}
          // </h2>
        )}

        {/* Description Subheader */}
        {isLoading ? (
          <div className="mx-auto mb-6 h-4 w-56 animate-pulse rounded bg-slate-200" />
        ) : (
          <>
            {/* <p className="text-text-primary pb-1 text-center font-body-content text-xs font-medium">
              {currentPhase?.description || ""}
            </p> */}
            <p className="pb-6 font-body-content text-xs text-center font-medium text-text-primary">
              {Number(currentIllumination.toFixed(2))}% {t("home.illuminated")}
            </p>
          </>
        )}

        {/* Calendar Grid View Skeleton or Component */}
        {isLoading ? (
          <CalendarGridSkeleton isMonth={showMonthCalendar} />
        ) : showMonthCalendar ? (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            location={location}
          />
        ) : (
          <WeekCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            location={location}
          />
        )}
      </div>

      {/* View Toggle Button */}
      <div className="w-full">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => setShowMonthCalendar((prev) => !prev)}
          className="bg-linear-to-r from-button-primary to-button-secondary font-body-content mx-auto w-full rounded-4xl py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {showMonthCalendar
            ? t("calendar.showWeek")
            : t("calendar.showFullMonth")}
        </button>
      </div>
    </section>
  );
};

/* Reusable Calendar Skeleton component for Week/Month grid */
const CalendarGridSkeleton = ({ isMonth }: { isMonth: boolean }) => {
  const itemCount = isMonth ? 35 : 7;

  return (
    <div className="space-y-4">
      {/* Month/Week Navigation Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
      </div>

      {/* Days of Week Row */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`skel-header-${i}`}
            className="mx-auto h-4 w-4 animate-pulse rounded bg-slate-200"
          />
        ))}
      </div>

      {/* Tile Grid Skeleton */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={`skel-tile-${i}`}
            className="flex h-14 flex-col items-center justify-center gap-1 rounded-lg bg-slate-100 p-2"
          >
            <div className="h-3 w-4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLayout;
