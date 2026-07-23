import {
    addDays,
    addWeeks,
    format,
    isSameDay,
    startOfWeek
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Moon } from "lunarphase-js";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const WeekCalendar = ({ selectedDate, setSelectedDate }: any) => {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);

  const startOfCurrentWeek = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 0,
  });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  }, [startOfCurrentWeek]);

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
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevWeek}
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
          · {format(startOfCurrentWeek, "MMMM")}
        </h2>
        <button
          onClick={handleNextWeek}
          className="rounded-full p-2 hover:bg-white"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-3">
        {weekDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <div key={date.toString()} className="flex flex-col items-center">
              <span className="text-xs font-semibold font-body-content">
                {format(date, "EEEEE")}
              </span>
              <button
                onClick={() => setSelectedDate(date)}
                className={`mt-2 h-12 w-12 rounded-md text-xs font-body-content font-semibold transition flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? "bg-[#F8D891] text-text-primary"
                    : "hover:bg-gray-200"
                }`}
              >
                <span>{format(date, "d")}</span>
                <span className="text-base">{Moon.lunarPhaseEmoji(date)}</span>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WeekCalendar;
