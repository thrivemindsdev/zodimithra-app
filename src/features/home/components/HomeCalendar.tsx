import BgImg from "@/assets/moons/background.png";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Moon } from "lunarphase-js";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import firstQuarterImg from "@/assets/moons/first-quarter.png";
import fullMoonImg from "@/assets/moons/full-moon.png";
import newMoonImg from "@/assets/moons/new-moon.png";
import thirdQuarterImg from "@/assets/moons/third-quarter.png";
import waningCrescentImg from "@/assets/moons/waning-crescent.png";
import waningGibbousImg from "@/assets/moons/waning-gibbous.png";
import waxingCrescentImg from "@/assets/moons/waxing-crescent.png";
import waxingGibbousImg from "@/assets/moons/waxing-gibbous.png";
import { useTranslation } from "react-i18next";

const HomeCalendar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const start = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 0,
  });

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [start]);

  const phase = Moon.lunarPhase(selectedDate);
  const agePercent = Moon.lunarAgePercent(selectedDate);

  const nextWeek = () => {
    if (weekOffset >= 1) {
      navigate("/calendar");
      return;
    }

    setWeekOffset((prev) => prev + 1);
  };

  const prevWeek = () => {
    if (weekOffset <= -1) {
      navigate("/calendar");
      return;
    }

    setWeekOffset((prev) => prev - 1);
  };

  const moonImages: Record<string, string> = {
    New: newMoonImg,
    "Waxing Crescent": waxingCrescentImg,
    "First Quarter": firstQuarterImg,
    "Waxing Gibbous": waxingGibbousImg,
    Full: fullMoonImg,
    "Waning Gibbous": waningGibbousImg,
    "Last Quarter": thirdQuarterImg,
    "Waning Crescent": waningCrescentImg,
  };

  return (
    <section className="my-6 relative">
      <div className="w-full">
        <img
          src={BgImg}
          className="w-full object-cover"
          alt="Calendar background"
        />
      </div>
      <div className="flex justify-between">
        <img
          src={moonImages[Moon.lunarPhase(previousDate)]}
          alt="Previous day moon phase"
          className="w-20 h-20 absolute top-20"
        />

        <img
          src={moonImages[Moon.lunarPhase(selectedDate)]}
          alt="Selected day moon phase"
          className="w-20 h-20 absolute top-10 left-1/2 -translate-x-1/2"
        />

        <img
          src={moonImages[Moon.lunarPhase(nextDate)]}
          alt="Next day moon phase"
          className="w-20 h-20 absolute top-20 right-0"
        />
      </div>
      <div className="p-6">
        <h2 className="pb-2 font-body font-bold text-xl text-center text-text-primary">
          {phase}
        </h2>
        <p className="pb-6 font-body-content text-sm text-center font-medium text-text-primary">
          {Number(agePercent.toFixed(2))}% illuminated
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={prevWeek}
            className="rounded-full p-2 hover:bg-white"
          >
            <ChevronLeft />
          </button>

          <h2 className="text-lg font-body font-bold">
            {weekOffset === 0
              ? "This Week"
              : weekOffset > 0
                ? "Next Week"
                : "Previous Week"}{" "}
            · {format(start, "MMMM")}
          </h2>

          <button
            onClick={nextWeek}
            className="rounded-full p-2 hover:bg-white"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-3">
          {week.map((date) => (
            <div key={date.toString()} className="flex flex-col items-center">
              <span className="text-xs font-semibold font-body-content">
                {format(date, "EEEEE")}
              </span>

              <button
                onClick={() => setSelectedDate(date)}
                className={`mt-2 h-12 w-12 rounded-md text-xs font-body-content font-semibold transition flex flex-col items-center justify-center gap-0.5
                ${
                  isSameDay(date, selectedDate)
                    ? "bg-[#F8D891] text-text-primary"
                    : "hover:bg-gray-200"
                }`}
              >
                <span>{format(date, "d")}</span>
                <span>{Moon.lunarPhaseEmoji(date)}</span>

                {/* <img
                  src={moonImages[Moon.lunarPhase(date)]}
                  alt={phase}
                  className="w-4 h-4"
                /> */}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/calendar")}
          className="bg-linear-to-r from-primary to-secondary w-full rounded-4xl py-3 mt-4 text-white font-body-content uppercase text-xs font-semibold tracking-wider"
        >
          {t("home.showFullMonth")}
        </button>
      </div>
    </section>
  );
};

export default HomeCalendar;
