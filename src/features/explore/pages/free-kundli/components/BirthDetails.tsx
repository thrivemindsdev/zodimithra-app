import { format, parse, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

interface BirthDetailsProps {
  loading?: boolean;
  data?: {
    name?: string;
    date_of_birth?: string;
    birth_time?: string;
    birth_place?: string;
    latitude?: string | number;
    longitude?: string | number;
  };
  panchangData?: {
    sunrise?: Date | string | number;
    sunset?: Date | string | number;
  };
}

const BirthDetails = ({ loading, data, panchangData }: BirthDetailsProps) => {
  const { t } = useTranslation();

  const safeFormatTime = (dateInput?: Date | string | number) => {
    if (!dateInput) return "-";
    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) return "-";
    return format(parsedDate, "h:mm a");
  };

  const details = [
    { label: t("freeKundli.name"), value: data?.name },
    {
      label: t("freeKundli.date"),
      value: data?.date_of_birth
        ? format(parseISO(data?.date_of_birth), "dd-MM-yyyy")
        : "",
    },
    {
      label: t("freeKundli.time"),
      value: data?.birth_time
        ? format(parse(data.birth_time, "HH:mm:ss", new Date()), "hh:mm a")
        : "",
    },
    { label: t("freeKundli.place"), value: data?.birth_place?.split(",")[0] },
    { label: t("freeKundli.latitude"), value: data?.latitude },
    { label: t("freeKundli.longitude"), value: data?.longitude },
    {
      label: t("freeKundli.sunRise"),
      value: safeFormatTime(panchangData?.sunrise),
    },
    {
      label: t("freeKundli.sunSet"),
      value: safeFormatTime(panchangData?.sunset),
    },
  ];

  return (
    <div className="w-full max-w-md font-body-content py-6">
      {/* Section Title */}
      <h2 className="mb-4 text-xl font-bold font-body text-primary tracking-tight">
        {t("freeKundli.birthDetails")}
      </h2>

      {/* Card Container */}
      <div className="overflow-hidden rounded-3xl border border-[#5A3AAE] bg-white shadow-md">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-5 py-4 ${
                  index !== 7 ? "border-b border-[#5A3AAE]" : ""
                }`}
              >
                {/* Label Skeleton */}
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                {/* Value Skeleton */}
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            ))
          : details.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-5 py-4 ${
                  index !== details.length - 1
                    ? "border-b border-[#5A3AAE]"
                    : ""
                }`}
              >
                <span className="text-sm font-medium text-text-secondary">
                  {item.label}
                </span>

                <span className="max-w-[60%] text-right text-sm font-semibold text-text-secondary">
                  {item.value || "-"}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default BirthDetails;
