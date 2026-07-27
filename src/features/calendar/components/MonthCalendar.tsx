import { useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Moon } from "lunarphase-js";
import { useTranslation } from "react-i18next";

const MonthCalendar = ({ selectedDate, onSelectDate }: any) => {
  const {t} = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const calendarGrid = [];
    let dayInstance = calendarStart;

    while (dayInstance <= calendarEnd) {
      calendarGrid.push(dayInstance);
      dayInstance = addDays(dayInstance, 1);
    }
    return calendarGrid;
  }, [currentMonth]);

  return (
    <>
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          className="rounded-full p-2 hover:bg-white"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-base font-body-content font-semibold">
          {t(`calendar.${format(currentMonth, "MMMM")}`)} {format(currentMonth, "yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="rounded-full p-2 hover:bg-white"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="mt-4 grid grid-cols-7 gap-3">
        {["S", "M", "T", "W", "T", "F", "S"].map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-semibold font-body-content"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 28-35 Day Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <button
              key={date.toISOString()}
              onClick={() => isCurrentMonth && onSelectDate(date)}
              className={`h-14 rounded-lg text-xs font-body-content font-semibold flex flex-col items-center justify-center transition ${
                isSelected ? "bg-[#F8D891]" : "hover:bg-gray-100"
              } ${isCurrentMonth ? "text-text-primary" : "text-gray-300"}`}
            >
              <span>{format(date, "d")}</span>
              <span>{Moon.lunarPhaseEmoji(date)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MonthCalendar;
