import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlanetCardProps {
  loading?: boolean;
  planetData?: {
    sun?: string;
    moon?: string;
  };
}

const PlanetCard = ({ loading, planetData }: PlanetCardProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="my-6 flex items-center justify-between rounded-2xl p-4 card-shadow">
        {/* Sun Skeleton */}
        <div className="flex flex-1 items-center space-x-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-100" />

        {/* Moon Skeleton */}
        <div className="flex flex-1 items-center space-x-3 pl-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-2.5 w-8 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const sunSign = planetData?.sun?.toLowerCase();
  const moonSign = planetData?.moon?.toLowerCase();

  return (
    <div className="my-6 flex items-center justify-between rounded-2xl p-4 card-shadow">
      {/* Sun */}
      <div className="flex flex-1 items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFDEA9] text-[#915200]">
          <Sun className="h-5 w-5" />
        </div>
        <div>
          <p className="font-body-content text-[10px] font-bold uppercase tracking-wider text-[#0C0F2799]">
            {t("calendar.sun")}
          </p>
          <p className="font-serif text-sm font-bold text-text-primary">
            {/* {sunSign ? t(`freeKundli.${sunSign}`) : "-"} */}
            {sunSign ? sunSign : "-"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-slate-100" />

      {/* Moon */}
      <div className="flex flex-1 items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5EBF9] text-[#384768]">
          <Moon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-body-content text-[10px] font-bold uppercase tracking-wider text-[#0C0F2799]">
            {t("calendar.moon")}
          </p>
          <p className="font-serif text-sm font-bold text-text-primary">
            {/* {moonSign ? t(`freeKundli.${moonSign}`) : "-"} */}
            {moonSign ? moonSign : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanetCard;
