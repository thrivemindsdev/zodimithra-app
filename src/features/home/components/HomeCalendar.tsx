import BgImg from "@/assets/home/affirmation.png";
import { useGetAffirmationQuery } from "@/queries/homeQueries";
import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import { getPhaseForDateSync, type ActivePhase } from "@/utils/getMoonPhase";

import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Moon } from "lunarphase-js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomeCalendar = ({ isPremium }: { isPremium: boolean }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: location, isLoading: isLocationLoading } =
    useGetCurrentLocationQuery();
  const lat = location?.latitude;
  const lng = location?.longitude;

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const start = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 0,
  });

  const currentPhaseName = Moon.lunarPhase(selectedDate);
  const currentAgePercent = Moon.lunarAgePercent(selectedDate);
  const currentIllumination =
    ((1 - Math.cos(2 * Math.PI * currentAgePercent)) / 2) * 100;

  const handleDateSelect = (newDate: Date) => {
    if (isSameDay(newDate, selectedDate)) return;
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    if (weekOffset >= 1) {
      navigate(isPremium ? "/calendar" : "/premium");
      return;
    }
    setWeekOffset((prev) => prev + 1);
  };

  const prevWeek = () => {
    if (weekOffset <= -1) {
      navigate(isPremium ? "/calendar" : "/premium");
      return;
    }
    setWeekOffset((prev) => prev - 1);
  };

  const { data, isLoading } = useGetAffirmationQuery();

  const affirmation = data?.description;

  const handleSubmit = () => {
    if (isPremium) {
      navigate("/calendar");
    } else {
      navigate("/premium");
    }
  };

  const [prevPhase, setPrevPhase] = useState<ActivePhase | null>(null);
  const [currentPhase, setCurrentPhase] = useState<ActivePhase | null>(null);
  const [nextPhase, setNextPhase] = useState<ActivePhase | null>(null);

  // 3. Update phases for previous, current, and next days when date or location changes
  useEffect(() => {
    if (!lat || !lng) {
      setPrevPhase(null);
      setCurrentPhase(null);
      setNextPhase(null);
      return;
    }

    try {
      const current = new Date(selectedDate);

      const previous = new Date(current);
      previous.setDate(previous.getDate() - 1);

      const next = new Date(current);
      next.setDate(next.getDate() + 1);

      setPrevPhase(getPhaseForDateSync(previous, lat, lng));
      setCurrentPhase(getPhaseForDateSync(current, lat, lng));
      setNextPhase(getPhaseForDateSync(next, lat, lng));
    } catch (error) {
      console.error("Error calculating Tithi:", error);
      setPrevPhase(null);
      setCurrentPhase(null);
      setNextPhase(null);
    }
  }, [selectedDate, lat, lng]);

  // 4. Memoize weekly grid calculation with correct location dependencies
  const weekWithPhases = useMemo(() => {
    if (!lat || !lng) return [];

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      const phase = getPhaseForDateSync(date, lat, lng);
      return { date, phase };
    });
  }, [start, lat, lng]);

  // Fixed keys for visual stability during transitions
  const visibleMoons = [
    {
      id: "prev-moon",
      date: previousDate,
      positionClass: "absolute -top-2 left-4",
      image: prevPhase ? prevPhase?.image : undefined,
    },
    {
      id: "selected-moon",
      date: selectedDate,
      positionClass: "absolute -top-8 left-1/2 -translate-x-1/2",
      image: currentPhase ? currentPhase?.image : undefined,
    },
    {
      id: "next-moon",
      date: nextDate,
      positionClass: "absolute -top-2 right-4",
      image: nextPhase ? nextPhase?.image : undefined,
    },
  ];

  if (isLoading || isLocationLoading) {
    return (
      <section className="relative mt-6 overflow-hidden">
        {/* Skeleton for Header Background (NO BgImg rendered) */}
        <section className="h-89 animate-pulse bg-linear-to-b from-slate-400 to-slate-500">
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

  // const BACKGROUND_IMAGE_URL = "https://picsum.photos/600/800";
  // console.log("Previous Phase:", prevPhase);
  // console.log("Current Phase:", currentPhase);
  // console.log("Next Phase:", nextPhase);
  return (
    <section className="relative mt-6 overflow-hidden">
      <div className="w-full flex items-center justify-center bg-white py-5">
        <div className="relative w-full overflow-hidden">
          {/* Card Body with Custom Top Convex Arc & Background Image */}
          <div
            className="relative w-full bg-cover bg-center text-white pt-15 pb-25 rounded-t-[50%_40px]"
            style={{ backgroundImage: `url(${data?.image_url ?? BgImg})` }}
          >
            {/* Subtle Dark Overlay for Text Readability */}
            {/* <div className="absolute inset-0 bg-black/25 rounded-t-[50%_40px] pointer-events-none" /> */}

            {/* Card Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <h1 className="text-2xl font-extrabold tracking-[2px] uppercase mb-6 drop-shadow">
                {t("home.affirmation")}
              </h1>

              <p className="text-[15px] leading-relaxed font-medium text-white pb-4 drop-shadow-md">
                “ {affirmation} “
              </p>

              <button
                // onClick={() => alert("Shared!")}
                className="flex items-center justify-center mb-8 bg-white/20 backdrop-blur-md text-white border border-white/40 px-7 py-2.5 rounded-full text-[15px] font-semibold cursor-pointer shadow-lg hover:bg-white/30 transition-all duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Bottom Concave Cutout Arc */}
          <div className="absolute bottom-0 left-0 w-full h-17 bg-white rounded-t-[50%_40px] z-10" />
        </div>
      </div>

      {/* Moon Animation Viewport */}
      <div className="relative z-10 -mt-24 flex h-20 w-full items-center justify-center">
        {visibleMoons.map(({ id, positionClass, image }) => {
          return (
            <div
              key={id}
              className={`flex flex-col items-center ${positionClass}`}
            >
              <img src={image} alt="Moon" className="h-20 w-20 object-cover" />
            </div>
          );
        })}
      </div>

      {/* Phase Details & Calendar Controls */}
      <div className="p-6">
        <h2 className="font-body-content pb-1 text-center text-lg font-semibold text-text-primary">
          {t(`calendar.${currentPhaseName}`)}
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
                ? t("calendar.nextWeek")
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
          {weekWithPhases.map(({ date, phase }) => (
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
                className={`font-body-content flex h-14 w-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold transition ${
                  isSameDay(date, selectedDate)
                    ? "text-text-primary bg-[#F8D891] shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{format(date, "d")}</span>

                {/* Replaced CustomAnimatedMoon with your custom phase image */}
                {phase?.image ? (
                  <img
                    src={phase.image}
                    alt={phase.name}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <div className="h-5 w-5" /> // Fallback placeholder if phase is missing
                )}
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
