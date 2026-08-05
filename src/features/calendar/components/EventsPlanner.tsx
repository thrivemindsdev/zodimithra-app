import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import TimeInput from "@/components/common/TimeInput";
import ToastModal from "@/components/common/ToastModal";
import { useToastModal } from "@/hooks/useToastModal";
import { CALENDAR_QUERY_KEYS } from "@/queries/calendarQueries";
import { CreateEventApi } from "@/services/calendar.api";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface EventsPlannerProps {
  loading: boolean;
  data?: Array<{
    id: string | number;
    title: string;
    date: string;
    time?: string;
    notes?: string;
  }>;
}

const EventsPlanner = ({ loading, data }: EventsPlannerProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { toastState, showSuccess, showError, hideToast } = useToastModal();

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
      await CreateEventApi({
        title: title.trim(),
        date: eventDate,
        time: time,
        notes: notes.trim(),
        reminder: "",
      });

      await queryClient.invalidateQueries({
        queryKey: [CALENDAR_QUERY_KEYS.events],
      });
      resetForm();
      showSuccess(
        t("calendar.eventCreatedSuccessTitle", "Event Created Successfully"),
        t(
          "calendar.eventCreatedSuccessDesc",
          "Your event has been saved to your planner.",
        ),
        t("calendar.ok", "OK"),
      );
    } catch (e) {
      console.error("Failed to create event", e);
      showError(
        t("calendar.eventCreateErrorTitle", "Error"),
        t(
          "calendar.eventCreateErrorDesc",
          "Failed to create event. Please try again.",
        ),
        t("calendar.ok", "OK"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl card-shadow p-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          {/* Add Button Skeleton */}
          <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* List Skeleton Items */}
        <div className="space-y-2">
          <div className="space-y-2 rounded-2xl card-shadow p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2 rounded-2xl card-shadow p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Empty state / Footer Card Skeleton */}
        <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-dashed border-indigo-200/80 p-5 text-center">
          <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-56 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 rounded-2xl card-shadow p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-body-content text-lg font-bold text-[#0C0F27]">
              {t("calendar.planner")}
            </h2>
            <p className="font-body-content text-xs text-[#4C546C]">
              {t("calendar.upcomingEvents")}
            </p>
          </div>

          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-1 rounded-full bg-linear-to-r from-button-primary to-button-secondary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("calendar.add")}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center space-x-1 rounded-full bg-linear-to-r from-button-primary to-button-secondary px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <X className="h-3.5 w-3.5" />
              <span>{t("calendar.cancel")}</span>
            </button>
          )}
        </div>

        {/* ADD EVENT FORM */}
        {showForm && (
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="text-[10px] font-bold font-body uppercase tracking-wider text-[#0C0F2799]">
              {t("calendar.newEvent", "New Event")}
            </span>

            {/* Event Title */}
            <Input
              label={t("calendar.eventTitle", "Event Title")}
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("calendar.eventTitlePlaceholder", "Event title")}
            />

            {/* Date & Time Inputs */}
            <DateInput
              label={t("calendar.eventDate", "Event Date")}
              name="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <TimeInput
              label={t("calendar.eventTime", "Event Time")}
              name="eventTime"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            {/* Notes Input */}
            <textarea
              placeholder={t("calendar.notesOptional", "Notes (optional)")}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-input-bg font-body border-input-border w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
            />

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveEvent}
              disabled={
                !title.trim() ||
                !time.trim() ||
                !eventDate.trim() ||
                isSubmitting
              }
              className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white transition-all ${
                title.trim() && time.trim() && eventDate.trim() && !isSubmitting
                  ? "bg-linear-to-r from-button-primary to-button-secondary hover:opacity-95"
                  : "cursor-not-allowed bg-slate-200 text-[#0C0F2799]"
              }`}
            >
              {isSubmitting
                ? t("calendar.saving", "SAVING...")
                : t("calendar.saveEvent", "SAVE EVENT")}
            </button>
          </div>
        )}

        {/* LIST OF EVENTS */}
        {data && data.length > 0 && (
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.id}
                className="space-y-1 rounded-2xl card-shadow p-4"
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  <span>{item.date}</span>
                </div>
                <h4 className="font-body text-lg font-bold text-text-primary">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE / FOOTER NOTE */}
        {!showForm && (
          <div className="space-y-1 rounded-2xl border border-dashed border-indigo-200/80 p-5 text-center">
            <p className="font-body text-sm font-bold text-[#0C0F27]">
              {t("calendar.noUpcomingEvents")}
            </p>
            <p className="font-body-content text-xs font-normal text-[#1D1D1D]">
              {t("calendar.tap")}{" "}
              <span className="font-body-content font-bold text-indigo-900">
                {t("calendar.add")}
              </span>{" "}
              {t("calendar.tapToPlan")}
            </p>
          </div>
        )}
      </div>

      <ToastModal
        isOpen={toastState.isOpen}
        status={toastState.status}
        title={toastState.title}
        description={toastState.description}
        buttonText={toastState.buttonText}
        onDone={hideToast}
      />
    </>
  );
};

export default EventsPlanner;
