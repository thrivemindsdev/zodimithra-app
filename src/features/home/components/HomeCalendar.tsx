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

  const { data, isLoading } = useGetAffirmationQuery();

  const affirmation = data?.description;

  const handleSubmit = () => {
    if (isPremium) {
      navigate("/calendar");
    } else {
      navigate("/premium");
    }
  };

  if (isLoading) {
    return (
      <section className="relative mt-6 overflow-hidden">
        {/* Skeleton for Header Background (NO BgImg rendered) */}
        <section className="h-116 animate-pulse bg-linear-to-b from-slate-400 to-slate-500">
          <div className="px-4 pt-16">
            <div className="mx-auto mb-3 h-5 w-36 rounded bg-white/20" />
            <div className="mx-auto space-y-2">
              <div className="mx-auto h-4 w-5/6 rounded bg-white/10" />
              <div className="mx-auto h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        </section>

        <div className="bg-white rounded-full w-full h-90 absolute bottom-15" />

        {/* Moon Animation Viewport Skeleton */}
        <div className="relative -mt-24 flex h-36 w-full items-center justify-center">
          <div className="absolute top-10 left-4 h-20 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="absolute top-0 left-1/2 h-24 w-24 -translate-x-1/2 animate-pulse rounded-full bg-slate-300" />
          <div className="absolute top-10 right-4 h-20 w-20 animate-pulse rounded-full bg-slate-200" />
        </div>

        {/* Phase Details & Calendar Controls Skeleton */}
        <div className="p-6">
          <div className="mx-auto mb-2 h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto mb-6 h-3.5 w-28 animate-pulse rounded bg-gray-200" />

          {/* Week Switcher Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* 7-Day Calendar Strip Skeleton */}
          <div className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-3 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Action Button Skeleton */}
          <div className="mt-6 h-11 w-full animate-pulse rounded-3xl bg-gray-200" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative mt-6 overflow-hidden">
      <section
        className="h-116 bg-cover"
        style={{
          backgroundImage: `url(${BgImg})`,
        }}
      >
        <div className="px-4 pt-16">
          <h2 className="font-body-content pb-2 text-center text-xl font-extrabold uppercase tracking-[1px] text-white">
            {t("home.affirmation")}
          </h2>

          <motion.div
            initial={false}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="font-body-content text-center text-sm font-bold leading-[1.6] text-white">
              &ldquo; {affirmation} &rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Moon Animation Viewport */}
      <div className="relative -mt-24 flex h-36 w-full items-center justify-center">
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
        <h2 className="font-body-content pb-1 text-center text-lg font-semibold text-text-primary">
          {t(`calendar.${currentPhase}`)}
        </h2>
        <p className="font-body-content text-text-primary pb-6 text-center text-xs font-medium opacity-80">
          {currentIllumination.toFixed(1)}% {t("home.illuminated")}
        </p>

        {/* Week Switcher Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevWeek}
            aria-label="Previous week"
            className="cursor-pointer rounded-full p-2 transition hover:bg-black/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2 className="font-body-content text-sm font-semibold">
            {weekOffset === 0
              ? t("calendar.thisWeek")
              : weekOffset > 0
                ? t("calenar.nextWeek")
                : t("calendar.previousWeek")}{" "}
            · {t(`calendar.${format(start, "MMMM")}`)}
          </h2>

          <button
            type="button"
            onClick={nextWeek}
            aria-label="Next week"
            className="cursor-pointer rounded-full p-2 transition hover:bg-black/5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 7-Day Calendar Strip */}
        <div className="mt-4 grid grid-cols-7 gap-2">
          {week.map((date) => (
            <div
              key={date.toISOString()}
              className="flex flex-col items-center"
            >
              <span className="font-body-content mb-1 text-xs font-semibold text-slate-500">
                {format(date, "EEEEE")}
              </span>

              <button
                type="button"
                onClick={() => handleDateSelect(date)}
                className={`font-body-content flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold transition ${
                  isSameDay(date, selectedDate)
                    ? "text-text-primary bg-[#F8D891] shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
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
          type="button"
          onClick={handleSubmit}
          className="font-body-content bg-linear-to-r from-button-primary to-button-secondary mt-6 w-full cursor-pointer rounded-3xl py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition hover:opacity-95"
        >
          {t("calendar.showFullMonth")}
        </button>
      </div>
    </section>
  );
};

export default HomeCalendar;
