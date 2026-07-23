import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import TimeInput from "@/components/common/TimeInput";
import { CALENDAR_QUERY_KEYS } from "@/queries/calendarQueries";
import { CreateEventApi } from "@/services/calendar.api";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface EventsPlannerProps {
  data?: Array<{
    id: string | number;
    title: string;
    date: string;
    time?: string;
    notes?: string;
  }>;
}

const EventsPlanner = ({ data }: EventsPlannerProps) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetForm = () => {
    setTitle("");
    setTime("");
    setEventDate("");
    setNotes("");
    setShowForm(false);
  };

  const handleSaveEvent = async () => {
    if (!title.trim() || !eventDate.trim() || !time.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await CreateEventApi({
        title: title.trim(),
        date: eventDate,
        time: time,
        notes: notes.trim(),
        reminder: "",
      });

      if (response.status === 201 || response.status === 200) {
        // Correct syntax for TanStack Query v5
        await queryClient.invalidateQueries({
          queryKey: [CALENDAR_QUERY_KEYS.events],
        });
        resetForm();
      }
    } catch (e) {
      console.error("Failed to create event", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-header font-light text-[#0C0F27]">Planner</h2>
          <p className="text-xs font-body-content text-[#4C546C]">
            Upcoming intentions & events
          </p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1 bg-linear-to-r from-primary to-secondary text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center space-x-1 bg-linear-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
            <span>CLOSE</span>
          </button>
        )}
      </div>

      {/* ADD EVENT FORM */}
      {showForm && (
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-[#0C0F2799] uppercase">
            New Event
          </span>

          {/* Event Title */}
          <Input
            label="Event Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />

          {/* Date & Time Inputs */}
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <DateInput
                label="Event Date"
                name="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TimeInput
                label="Event Time"
                name="eventTime"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Notes Input */}
          <textarea
            placeholder="Notes (optional)"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-input-bg border border-input-border text-sm focus:outline-none resize-none"
          />

          {/* Save Button */}
          <button
            onClick={handleSaveEvent}
            disabled={
              !title.trim() || !time.trim() || !eventDate.trim() || isSubmitting
            }
            className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider text-white uppercase transition-all ${
              title.trim() && time.trim() && eventDate.trim() && !isSubmitting
                ? "bg-linear-to-r from-indigo-900 via-purple-800 to-pink-600 hover:opacity-95"
                : "bg-slate-200 text-[#0C0F2799] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "SAVING..." : "SAVE EVENT"}
          </button>
        </div>
      )}

      {/* LIST OF EVENTS */}
      {data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-indigo-100/70 rounded-2xl p-4 shadow-sm space-y-1"
            >
              <div className="flex items-center space-x-1.5 text-indigo-900 text-[10px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{item.date}</span>
              </div>
              <h4 className="text-lg font-body font-bold text-text-primary">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE / FOOTER NOTE */}
      {!showForm && (
        <div className="border border-dashed border-indigo-200/80 rounded-2xl p-5 text-center space-y-1">
          <p className="text-sm font-body font-bold text-[#0C0F27]">
            {data && data.length > 0
              ? "No more upcoming events"
              : "No upcoming events"}
          </p>
          <p className="text-xs text-[#1D1D1D] font-body-content font-normal">
            Tap{" "}
            <span className="font-bold font-body-content text-indigo-900">
              Add
            </span>{" "}
            to plan something meaningful.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPlanner;
