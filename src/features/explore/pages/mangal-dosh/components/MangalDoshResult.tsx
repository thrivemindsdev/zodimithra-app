import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

// --- TYPES BASED ON YOUR API RESPONSE ---
export interface GemstoneInfo {
  stone: string;
  metal: string;
  finger: string;
  day: string;
  weight: string;
}

export interface RemedialMeasures {
  spiritual: string[];
  charitable: string[];
  lifestyle: string[];
  gemstone: GemstoneInfo;
}

export interface MangalDoshData {
  has_dosha: boolean;
  dosha_type: string;
  severity: "Low" | "Moderate" | "Severe" | string;
  description: string;
  percentage: number;
  is_cancelled: boolean;
  mars: {
    house: number;
    house_from_moon: number;
    house_from_venus: number;
    is_retrograde: boolean;
    sign: string;
  };
  remedies: string[];
  interpretation?: {
    currentStatus?: {
      severity: string;
      description: string;
      effects: string[];
      guidance: string;
    };
    remedialMeasures?: RemedialMeasures;
  };
}

// Static definition of Houses for the Birth Chart grid
const HOUSES_DEFINITION = [
  { number: 1, name: "Lagna" },
  { number: 2, name: "Dhana" },
  { number: 3, name: "Sahaja" },
  { number: 4, name: "Sukha" },
  { number: 5, name: "Putra" },
  { number: 6, name: "Ari" },
  { number: 7, name: "Kalatra" },
  { number: 8, name: "Mrityu" },
  { number: 9, name: "Dharma" },
  { number: 10, name: "Karma" },
  { number: 11, name: "Labha" },
  { number: 12, name: "Vyaya" },
];

export const MangalDoshResult = () => {
  const {t} = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.result) {
      navigate("/mangal-dosh", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.result) {
    return null;
  }

  const { has_dosha, severity, description, mars, remedies } = state.result;

  // Dynamic styling based on Severity
  const getSeverityBadgeStyles = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "severe":
        return "bg-secondary text-white";
      case "moderate":
        return "bg-pink-600 text-white";
      case "low":
        return "bg-amber-500 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  return (
    <>
      <Header
        title={t("mangalDosh.title")}
        showBackButton
        redirectPath="/mangal-dosh"
      />
      <BodyLayout>
        <div className="rounded-3xl shadow-sm text-gray-800 font-body">
          {/* --- TOP STATUS CARD --- */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md text-center flex flex-col items-center">
            {/* Warning Icon */}
            <div className="mb-3 text-secondary">
              <TriangleAlert className="w-14 h-14" strokeWidth={1.8} />
            </div>

            {/* Status Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {has_dosha ? t("mangalDosh.detected") : t("mangalDosh.notDetecte")}
            </h2>

            {/* Severity Pill */}
            <span
              className={`inline-block text-xs font-semibold px-5 py-1.5 rounded-full mb-3 ${getSeverityBadgeStyles(
                severity,
              )}`}
            >
              {severity} {t("mangalDosh.severity")}
            </span>

            {/* Detail Subtext */}
            <p className="text-xs text-gray-600 font-medium">{description}</p>
          </div>

          {/* --- BIRTH CHART HOUSES GRID --- */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              {t("mangalDosh.birthChartHouses")}
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {HOUSES_DEFINITION.map((house) => {
                const isMarsHere = mars?.house === house.number;

                return (
                  <div
                    key={house.number}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center min-h-18 transition-all ${
                      isMarsHere
                        ? "bg-[#fce4ec] border border-[#f48fb1]"
                        : "bg-transparent"
                    }`}
                  >
                    <span className="text-sm font-bold text-gray-800">
                      {house.number}
                    </span>
                    <span className="text-[11px] text-gray-600 leading-tight mt-0.5">
                      {house.name}
                    </span>
                    {isMarsHere && (
                      <span className="text-[9px] text-[#c2185b] font-semibold mt-0.5">
                        🪨 {t("mangalDosh.mars")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- REMEDIES SECTION --- */}
          {remedies && remedies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-body font-bold text-gray-900 text-center mb-5">
                {t("mangalDosh.remedies")}
              </h3>

              <ul className="space-y-3.5">
                {remedies.map((remedy: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    {/* Number Badge */}
                    <span className="shrink-0 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {index + 1}
                    </span>

                    {/* Remedy Text */}
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      {remedy}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </BodyLayout>
    </>
  );
};

export default MangalDoshResult;
