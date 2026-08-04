import { type ActivePhase, getPhaseForDateSync } from "@/utils/getMoonPhase";
import { type LocationDetails } from "@/utils/location-utils";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MonthCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  location: LocationDetails | null | undefined;
}

interface CalendarDay {
  date: Date;
  phase: ActivePhase | null;
}

const MonthCalendar = ({
  selectedDate,
  onSelectDate,
  location,
}: MonthCalendarProps) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    let isMounted = true;

    const calculateMonthPhases = async () => {
      if (!location?.latitude || !location?.longitude) return null;

      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

      const grid: CalendarDay[] = [];
      let dayInstance = calendarStart;

      while (dayInstance <= calendarEnd) {
        // Synchronously get phase using resolved coordinates
        const phase = getPhaseForDateSync(
          dayInstance,
          location?.latitude,
          location?.longitude,
        );
        grid.push({
          date: new Date(dayInstance),
          phase,
        });
        dayInstance = addDays(dayInstance, 1);
      }

      if (isMounted) {
        setCalendarDays(grid);
      }
    };

    calculateMonthPhases();

    return () => {
      isMounted = false;
    };
  }, [currentMonth, location?.latitude, location?.longitude]);

  return (
    <>
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="rounded-full p-2 transition hover:bg-white active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h2 className="font-body-content text-base font-semibold text-slate-800">
          {t(`calendar.${format(currentMonth, "MMMM")}`)}{" "}
          {format(currentMonth, "yyyy")}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="rounded-full p-2 transition hover:bg-white active:scale-95"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="mt-4 mb-2 grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((dayName, idx) => (
          <div
            key={`${dayName}-${idx}`}
            className="font-body-content text-center text-xs font-semibold text-slate-500"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(({ date, phase }) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!isCurrentMonth}
              onClick={() => isCurrentMonth && onSelectDate(date)}
              className={`font-body-content flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-semibold transition ${
                isSelected
                  ? "bg-[#F8D891] text-text-primary shadow-sm"
                  : isCurrentMonth
                    ? "text-text-primary hover:bg-gray-100"
                    : "cursor-default text-gray-300 opacity-40"
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
          );
        })}
      </div>
    </>
  );
};

export default MonthCalendar;
