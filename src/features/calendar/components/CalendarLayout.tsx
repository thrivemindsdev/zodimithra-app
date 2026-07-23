import { format } from "date-fns";
import { Moon } from "lunarphase-js";
import { useState } from "react";

// Asset Imports
import firstQuarterImg from "@/assets/moons/first-quarter.png";
import fullMoonImg from "@/assets/moons/full-moon.png";
import newMoonImg from "@/assets/moons/new-moon.png";
import thirdQuarterImg from "@/assets/moons/third-quarter.png";
import waningCrescentImg from "@/assets/moons/waning-crescent.png";
import waningGibbousImg from "@/assets/moons/waning-gibbous.png";
import waxingCrescentImg from "@/assets/moons/waxing-crescent.png";
import waxingGibbousImg from "@/assets/moons/waxing-gibbous.png";
import MonthCalendar from "./MonthCalendar";
import WeekCalendar from "./WeekCalendar";

const moonImages = {
  New: newMoonImg,
  "Waxing Crescent": waxingCrescentImg,
  "First Quarter": firstQuarterImg,
  "Waxing Gibbous": waxingGibbousImg,
  Full: fullMoonImg,
  "Waning Gibbous": waningGibbousImg,
  "Last Quarter": thirdQuarterImg,
  "Waning Crescent": waningCrescentImg,
};

const CalendarLayout = ({ selectedDate, setSelectedDate }: any) => {
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

  const phase = Moon.lunarPhase(selectedDate);
  const agePercent = Moon.lunarAgePercent(selectedDate);

  return (
    <section className="mt-6 relative">
      {/* Top Hero Section: Phase Display */}
      <div className="w-full flex flex-col items-center">
        <p className="font-body-content text-xs tracking-[2px]">
          {format(selectedDate, "EEEE")}
        </p>
        <p className="font-header font-light text-lg tracking-[1px]">
          {format(selectedDate, "MMMM d")}
        </p>
        <img
          src={moonImages[phase] || newMoonImg}
          alt="Selected day moon phase"
          className="w-32 h-32 mt-2"
        />
      </div>

      {/* Dynamic Grid Views */}
      <div className="py-6">
        <h2 className="pb-1 font-body font-bold text-xl text-center text-text-primary">
          {phase}
        </h2>
        <p className="pb-6 font-body-content text-sm text-center font-medium text-text-primary">
          {Number(agePercent.toFixed(2))}% illuminated
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
          className="bg-linear-to-r from-primary to-secondary w-full rounded-4xl py-3 mx-auto text-white font-body-content uppercase text-xs font-semibold tracking-wider transition-all active:scale-[0.98]"
        >
          {showMonthCalendar ? "Show Week" : "Show full month"}
        </button>
      </div>
    </section>
  );
};

export default CalendarLayout;
