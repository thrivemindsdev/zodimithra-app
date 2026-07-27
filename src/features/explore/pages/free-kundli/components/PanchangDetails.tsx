import { useTranslation } from "react-i18next";

interface PanchangItem {
  name?: string;
  start?: string | Date;
  end?: string | Date;
}

interface PanchangDetailsProps {
  loading?: boolean;
  data?: {
    tithi?: PanchangItem[];
    karana?: PanchangItem[];
    nakshatra?: PanchangItem[];
    yoga?: PanchangItem[];
  };
  birthDate?: Date | string;
}

const PanchangDetails = ({
  loading,
  data,
  birthDate,
}: PanchangDetailsProps) => {
  const { t } = useTranslation();

  const getActiveItem = (items?: PanchangItem[], targetDateInput?: Date | string) => {
    if (!items || items.length === 0 || !targetDateInput) return undefined;

    const targetTime = new Date(targetDateInput).getTime();

    return items.find((item: PanchangItem) => {
      if (!item.start || !item.end) return false;

      const start = new Date(item.start).getTime();
      const end = new Date(item.end).getTime();

      return start <= targetTime && targetTime <= end;
    });
  };

  const activeTithi = getActiveItem(data?.tithi, birthDate);
  const activeKarana = getActiveItem(data?.karana, birthDate);
  const activeNakshatra = getActiveItem(data?.nakshatra, birthDate);
  const activeYoga = getActiveItem(data?.yoga, birthDate);

  const details = [
    {
      label: t("freeKundli.tithi"),
      value: activeTithi?.name || "-",
    },
    {
      label: t("freeKundli.karan"),
      value: activeKarana?.name || "-",
    },
    {
      label: t("freeKundli.yog"),
      value: activeYoga?.name || "-",
    },
    {
      label: t("freeKundli.nakshatra"),
      value: activeNakshatra?.name || "-",
    },
  ];

  return (
    <div className="w-full max-w-md font-body-content">
      <h2 className="mb-4 font-body text-xl font-bold tracking-tight text-primary">
        {t("freeKundli.panchanDetails")}
      </h2>

      <div className="overflow-hidden rounded-3xl border border-[#5A3AAE] bg-white shadow-md">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-5 py-4 ${
                  index !== 3 ? "border-b border-[#5A3AAE]" : ""
                }`}
              >
                {/* Label Skeleton */}
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
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
                  {item.value}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PanchangDetails;