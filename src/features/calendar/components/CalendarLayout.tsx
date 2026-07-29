import { format } from "date-fns";
import { Moon } from "lunarphase-js";
import { useState } from "react";

// Asset Imports
import CustomAnimatedMoon from "@/components/common/CustomAnimatedMoon";
import { useTranslation } from "react-i18next";
import MonthCalendar from "./MonthCalendar";
import WeekCalendar from "./WeekCalendar";

const CalendarLayout = ({ selectedDate, setSelectedDate }: any) => {
  const { t } = useTranslation();
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

  const phase = Moon.lunarPhase(selectedDate);
  const agePercent = Moon.lunarAgePercent(selectedDate);
  const currentIllumination =
    ((1 - Math.cos(2 * Math.PI * agePercent)) / 2) * 100;

  return (
    <section className="mt-6 relative">
      {/* Top Hero Section: Phase Display */}
      <div className="w-full flex flex-col items-center">
        <p className="font-body-content text-xs tracking-[2px]">
          {t(`calendar.${format(selectedDate, "EEEE").toLowerCase()}`)}
        </p>
        <p className="font-body-content font-bold text-lg tracking-[1px]">
          {t(`calendar.${format(selectedDate, "MMMM")}`)}{" "}
          {format(selectedDate, "d")}
        </p>
        <CustomAnimatedMoon agePercent={Moon.lunarAgePercent(selectedDate)} />
      </div>

      {/* Dynamic Grid Views */}
      <div className="py-6">
        <h2 className="pb-1 font-body-content font-semibold text-lg text-center text-text-primary">
          {t(`calendar.${phase}`)}
        </h2>
        <p className="pb-6 font-body-content text-xs text-center font-medium text-text-primary">
          {Number(currentIllumination.toFixed(2))}% {t("home.illuminated")}
        </p>
        {showMonthCalendar ? (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        ) : (
          <WeekCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>

      <div className="w-full">
        <button
          onClick={() => setShowMonthCalendar((prev) => !prev)}
          className="bg-linear-to-r from-button-primary to-button-secondary w-full rounded-4xl py-3 mx-auto text-white font-body-content uppercase text-xs font-semibold tracking-wider transition-all active:scale-[0.98]"
        >
          {showMonthCalendar
            ? t("calendar.showWeek")
            : t("calendar.showFullMonth")}
        </button>
      </div>
    </section>
  );
};

export default CalendarLayout;
