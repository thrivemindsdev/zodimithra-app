import { Gift, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface FestivalItem {
  description: string;
  name?: string;
}

interface FestivalProps {
  loading?: boolean;
  festivalData?: FestivalItem[] | null;
  selectedDate: number | string;
  selectedMonth: number;
}

const Festival = ({
  loading,
  festivalData,
  selectedDate,
  selectedMonth,
}: FestivalProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Circle Icon Skeleton */}
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
            {/* Title & Date Skeleton */}
            <div className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          {/* Badge Skeleton */}
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* List Items Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gray-300" />
              <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gray-300" />
              <div className="h-3.5 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedMonthName = months[selectedMonth] ?? "";

  return (
    <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDEA9] text-[#915200]">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-body-content text-xs font-bold uppercase tracking-wider text-[#915200]">
              {t("calendar.specialDay")}
            </h3>
            <p className="font-body-content text-xs text-slate-500">
              {t("calendar.festivals")} - {t(`calendar.${selectedMonthName}`)}{" "}
              {selectedDate}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-[#915200]">
          {festivalData?.length || 0} {t("calendar.events")}
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {festivalData && festivalData.length > 0 ? (
          festivalData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 fill-slate-700 text-slate-700" />
                <span className="text-xs font-semibold text-[#0C0F27]">
                  {item.description}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="font-body-content text-center text-xs text-slate-500">
            No Festivals
          </p>
        )}
      </div>
    </div>
  );
};

export default Festival;