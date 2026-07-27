import { useTranslation } from "react-i18next";

interface PlanetaryPosition {
  name: string;
  rasi_name: string;
  degree: string;
}

interface PlanetaryPositionsCardProps {
  loading?: boolean;
  data?: PlanetaryPosition[];
}

export const PlanetaryPositionsCard = ({
  loading,
  data,
}: PlanetaryPositionsCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md font-body-content py-6">
      {/* Title */}
      <h2 className="mb-4 text-xl font-bold text-primary font-body tracking-tight">
        {t("freeKundli.planetTitle")}
      </h2>

      {/* Card Container */}
      <div className="overflow-hidden rounded-2xl border border-primary bg-white shadow-xl shadow-purple-900/10">
        <table className="w-full text-left border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-primary text-white text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-6">{t("freeKundli.planet")}</th>
              <th className="py-3 px-6 text-center">{t("freeKundli.sign")}</th>
              <th className="py-3 px-6 text-right">{t("freeKundli.degree")}</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-primary/15 text-text-secondary font-medium text-sm">
            {loading
              ? Array.from({ length: 9 }).map((_, index) => (
                  <tr key={index}>
                    {/* Planet Name Skeleton */}
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                    {/* Sign Skeleton */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </td>
                    {/* Degree Skeleton */}
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="ml-auto h-4 w-14 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              : data?.map((row, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-purple-50/40"
                  >
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      {t(`freeKundli.${row.name}`)}
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      {row.rasi_name}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap font-mono text-sm tracking-wide">
                      {row.degree}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanetaryPositionsCard;