import BgImg from "@/assets/home/affirmation.png";
import CustomAnimatedMoon from "@/components/common/CustomAnimatedMoon";
import { useGetAffirmationQuery } from "@/queries/homeQueries";
import { motion } from "framer-motion";

import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Moon } from "lunarphase-js";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomeCalendar = ({ isPremium }: { isPremium: boolean }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [isExpanded, setIsExpanded] = useState(false);

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

  const currentPhase = Moon.lunarPhase(selectedDate);
  const currentAgePercent = Moon.lunarAgePercent(selectedDate);
  const currentIllumination =
    ((1 - Math.cos(2 * Math.PI * currentAgePercent)) / 2) * 100;

  const handleDateSelect = (newDate: Date) => {
    if (isSameDay(newDate, selectedDate)) return;
    setSelectedDate(newDate);
  };

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

  // Fixed keys for visual stability during transitions
  const visibleMoons = [
    {
      id: "prev-moon",
      date: previousDate,
      positionClass: "absolute top-10 left-4",
    },
    {
      id: "selected-moon",
      date: selectedDate,
      positionClass: "absolute top-0 left-1/2 -translate-x-1/2",
    },
    {
      id: "next-moon",
      date: nextDate,
      positionClass: "absolute top-10 right-4",
    },
  ];

  const { data } = useGetAffirmationQuery();

  const affirmation = data?.description;

  const handleSubmit = () => {
    if (isPremium) {
      navigate("/calendar");
    } else {
      navigate("/premium");
    }
  };

  return (
    <section className="mt-6 relative overflow-hidden">
      <section
        className="bg-cover h-116"
        style={{
          backgroundImage: `url(${BgImg})`,
        }}
      >
        <div className="pt-16 px-4">
          <h2 className="text-center text-xl pb-2 font-body-content font-extrabold uppercase tracking-[1px] text-white">
            {t("home.affirmation")}
          </h2>

          <motion.div
            initial={false}
            // animate={{ height: isExpanded ? 205 : 150 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="text-sm font-body-content text-center text-white font-bold leading-[1.6]">
              &ldquo; {affirmation} &rdquo;
            </p>
          </motion.div>
          {/* <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full gap-1 my-3 transition-opacity"
          >
            <h1 className="text-sm text-white font-semibold font-body">
              {isExpanded ? t("home.readLess") : t("home.readMore")}
            </h1>
            <ArrowRight
              size={16}
              color={"#fff"}
              className={`transition-transform ${isExpanded ? "-rotate-90" : ""}`}
            />
          </div> */}
        </div>
      </section>
      {/* Moon Animation Viewport */}
      <div className="relative h-36 w-full -mt-24 flex justify-center items-center">
        {visibleMoons.map(({ id, date, positionClass }) => {
          const age = Moon.lunarAgePercent(date);

          return (
            <div
              key={id}
              className={`flex flex-col items-center ${positionClass}`}
            >
              <CustomAnimatedMoon agePercent={age} size={90} />
            </div>
          );
        })}
      </div>

      {/* Phase Details & Calendar Controls */}
      <div className="p-6">
        <h2 className="pb-1 font-body-content font-semibold text-lg text-center text-text-primary">
          {t(`calendar.${currentPhase}`)}
        </h2>
        <p className="pb-6 font-body-content text-xs text-center font-medium text-text-primary opacity-80">
          {currentIllumination.toFixed(1)}% {t("home.illuminated")}
        </p>

        {/* Week Switcher Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevWeek}
            aria-label="Previous week"
            className="rounded-full p-2 hover:bg-black/5 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-sm font-body-content font-semibold">
            {weekOffset === 0
              ? t("calendar.thisWeek")
              : weekOffset > 0
                ? t("calenar.nextWeek")
                : t("calendar.previousWeek")}{" "}
            · {t(`calendar.${format(start, "MMMM")}`)}
          </h2>

          <button
            onClick={nextWeek}
            aria-label="Next week"
            className="rounded-full p-2 hover:bg-black/5 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Calendar Strip */}
        <div className="mt-4 grid grid-cols-7 gap-2">
          {week.map((date) => (
            <div
              key={date.toISOString()}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-semibold font-body-content mb-1 text-slate-500">
                {format(date, "EEEEE")}
              </span>

              <button
                onClick={() => handleDateSelect(date)}
                className={`h-12 w-12 rounded-xl text-xs font-body-content font-semibold transition flex flex-col items-center justify-center gap-0.5
                ${
                  isSameDay(date, selectedDate)
                    ? "bg-[#F8D891] text-text-primary shadow-sm"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>{format(date, "d")}</span>
                <CustomAnimatedMoon
                  agePercent={Moon.lunarAgePercent(date)}
                  size={20}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Route Action Button */}
        <button
          onClick={handleSubmit}
          className="bg-linear-to-r from-button-primary to-button-secondary w-full rounded-3xl py-3 mt-6 text-white font-body-content uppercase text-xs font-semibold tracking-wider shadow-md hover:opacity-95 transition"
        >
          {t("calendar.showFullMonth")}
        </button>
      </div>
    </section>
  );
};

export default HomeCalendar;
