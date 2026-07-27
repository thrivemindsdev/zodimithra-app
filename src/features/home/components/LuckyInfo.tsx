import { Clock, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";

// Interface for strictly typed props
interface LuckyInfoProps {
  loading: boolean;
  data?: {
    lucky?: {
      color?: string;
      colour_code?: string;
      number?: string | number;
    };
    muhurta?: {
      abhijit_muhurta?: string;
    };
  };
}

export default function LuckyInfo({ loading, data }: LuckyInfoProps) {
  const { t } = useTranslation();

  const isWhite = data?.lucky?.color === "White";
  const colorHex = isWhite ? "#000000" : data?.lucky?.colour_code;
  const luckyColor = data?.lucky?.color;
  const fortuneNumber = data?.lucky?.number;
  const auspiciousTime = data?.muhurta?.abhijit_muhurta;

  return (
    <div className="w-full py-6 font-body-content">
      {/* Title */}
      <h2 className="button-text-gradient font-body-content pb-2 text-lg font-bold capitalize">
        {t("home.todayFortune")}
      </h2>

      {loading ? (
        /* Skeleton Cards */
        <div className="flex flex-col gap-3">
          {/* Top Card Skeleton */}
          <div className="card-shadow flex flex-col items-center justify-center rounded-full bg-white px-6 py-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 stroke-[2.5] text-gray-300" />
              <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-2 h-3.5 w-36 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Bottom Grid Skeletons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Lucky Shade Skeleton */}
            <div className="card-shadow flex items-center justify-between rounded-full bg-white px-5 py-3.5">
              <div className="flex flex-col justify-center gap-1.5">
                <div className="h-3.5 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-3.5 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Fortune Number Skeleton */}
            <div className="card-shadow flex flex-col justify-center rounded-full bg-white px-5 py-3.5">
              <div className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5 stroke-3 text-gray-300" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="mt-1.5 h-3.5 w-8 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ) : (
        /* Content Cards */
        <div className="flex flex-col gap-3">
          {/* Auspicious Time - Top Full Width Card */}
          <div className="card-shadow flex flex-col items-center justify-center rounded-full bg-white px-6 py-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
              <Clock className="h-4 w-4 stroke-[2.5]" />
              <span>{t("home.auspiciousTime", "Auspicious Time")}</span>
            </div>
            <span className="mt-1 text-xs font-semibold text-text-primary">
              {auspiciousTime}
            </span>
          </div>

          {/* Bottom 2-Column Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Lucky Shade Card */}
            <div className="card-shadow flex items-center justify-between rounded-full bg-white px-5 py-3.5">
              <div className="flex flex-col justify-center gap-1">
                <span className="text-xs font-bold leading-tight text-text-primary">
                  {t("home.luckyColor", "Lucky Shade")}
                </span>
                <span className="text-xs font-bold leading-tight text-text-primary">
                  {luckyColor}
                </span>
              </div>
              <div
                className="h-8 w-8 shrink-0 rounded-full border border-black/5"
                style={{ backgroundColor: colorHex }}
                aria-hidden="true"
              />
            </div>

            {/* Fortune Number Card */}
            <div className="card-shadow flex flex-col justify-center rounded-full bg-white px-5 py-3.5">
              <div className="flex items-center gap-1 text-xs font-bold text-text-primary">
                <Hash className="h-3.5 w-3.5 stroke-3" />
                <span>{t("home.luckyNumber", "Fortune Number")}</span>
              </div>
              <span className="mt-0.5 text-xs font-bold text-text-primary">
                {fortuneNumber}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}