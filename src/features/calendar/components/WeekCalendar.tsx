import { type ActivePhase, getPhaseForDateSync } from "@/utils/getMoonPhase";
import { type Coordinates } from "@/utils/location-utils";
import { addDays, addWeeks, format, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface WeekCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  location: Coordinates | null | undefined;
}

interface WeekDayItem {
  date: Date;
  phase: ActivePhase | null;
}

const WeekCalendar = ({
  selectedDate,
  setSelectedDate,
  location,
}: WeekCalendarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState<WeekDayItem[]>([]);

  // ✅ Memoized: Prevents reference changes on every render pass
  const startOfCurrentWeek = useMemo(() => {
    return startOfWeek(addWeeks(new Date(), weekOffset), {
      weekStartsOn: 0,
    });
  }, [weekOffset]);

  useEffect(() => {
    let isMounted = true;

    if (!location?.latitude || !location?.longitude) {
      setWeekDays([]);
      return;
    }

    const lat = location.latitude;
    const lng = location.longitude;

    const days: WeekDayItem[] = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startOfCurrentWeek, i);
      const phase = getPhaseForDateSync(date, lat, lng);
      return { date, phase };
    });

    if (isMounted) {
      setWeekDays(days);
    }

    return () => {
      isMounted = false;
    };
  }, [startOfCurrentWeek, location?.latitude, location?.longitude]);

  const handleNextWeek = () => {
    if (weekOffset >= 1) return navigate("/calendar");
    setWeekOffset((prev) => prev + 1);
  };

  const handlePrevWeek = () => {
    if (weekOffset <= -1) return navigate("/calendar");
    setWeekOffset((prev) => prev - 1);
  };

  return (
    <>
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevWeek}
          className="rounded-full p-2 transition hover:bg-white active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h2 className="font-body-content text-base font-semibold text-slate-800">
          {weekOffset === 0
            ? t("calendar.thisWeek")
            : weekOffset > 0
              ? t("calendar.nextWeek")
              : t("calendar.previousWeek")}{" "}
          · {t(`calendar.${format(startOfCurrentWeek, "MMMM")}`)}
        </h2>
        <button
          type="button"
          onClick={handleNextWeek}
          className="rounded-full p-2 transition hover:bg-white active:scale-95"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Weekdays Row */}
      <div className="mt-4 grid grid-cols-7 gap-3">
        {weekDays.map(({ date, phase }) => {
          const isSelected = isSameDay(date, selectedDate);

          return (
            <div
              key={date.toISOString()}
              className="flex flex-col items-center"
            >
              <span className="font-body-content text-xs font-semibold text-slate-500">
                {format(date, "EEEEE")}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`font-body-content mt-2 flex h-14 w-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? "bg-[#F8D891] text-text-primary shadow-sm"
                    : "text-slate-700 hover:bg-gray-100"
                }`}
              >
                <span>{format(date, "d")}</span>

                {/* Dynamic Moon Image */}
                {phase?.image ? (
                  <img
                    src={phase.image}
                    alt={phase.name}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <div className="h-5 w-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WeekCalendar;
