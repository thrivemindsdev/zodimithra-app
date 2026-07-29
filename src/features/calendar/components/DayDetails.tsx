import { useTranslation } from "react-i18next";

interface DayDetailsProps {
  loading?: boolean;
  data?: {
    rahu_kal?: string;
    shubha_muhurt?: string;
  };
}

const DayDetails = ({ loading, data }: DayDetailsProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 py-6">
        {/* Challenging Time Skeleton */}
        <div className="rounded-2xl card-shadow p-3.5">
          <div className="mb-1.5 flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9A4729]/40" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Prosperous Time Skeleton */}
        <div className="rounded-2xl card-shadow p-3.5">
          <div className="mb-1.5 flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#005E26]/40" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 py-6">
      {/* Challenging Time */}
      <div className="rounded-2xl card-shadow p-3.5">
        <div className="mb-1 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9A4729]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A4729]">
            {t("calendar.challenging")}
          </span>
        </div>
        <p className="font-body text-sm font-bold text-[#0C0F27]">
          {data?.rahu_kal || "-"}
        </p>
      </div>

      {/* Prosperous Time */}
      <div className="rounded-2xl card-shadow p-3.5">
        <div className="mb-1 flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#005E26]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#005E26]">
            {t("calendar.prosperous")}
          </span>
        </div>
        <p className="font-body text-sm font-bold text-[#0C0F27]">
          {data?.shubha_muhurt || "-"}
        </p>
      </div>
    </div>
  );
};

export default DayDetails;