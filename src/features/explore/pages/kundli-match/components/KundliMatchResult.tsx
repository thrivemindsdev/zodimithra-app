import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface GunaKoota {
  id: number;
  name: string;
  male_koot: string;
  female_koot: string;
  points: number;
  maximum_points: number;
  description: string;
}

const KundliMatchResult = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.result) {
      navigate("/kundli-match", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.result) {
    return null;
  }

  const {
    total_points,
    maximum_points,
    percentage,
    match_result,
    guna_kootas,
  } = state.result;

  // Circular progress ring values
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Offset formula to wrap active path around a 360-degree circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <>
      <Header
        title={t("kundliMatch.resultTitle", "Kundli Match Result")}
        showBackButton
        redirectPath="/kundli-match"
      />
      <BodyLayout>
        <div className="max-w-md mx-auto bg-white font-body text-primary">
          {/* 1. Full Circular Gauge Section */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#F4EFF2"
                  strokeWidth={strokeWidth}
                />
                {/* Active Circular Progress Path */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#2d126b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Centered Score Summary Typography inside the ring */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold tracking-tight">
                  {total_points}/{maximum_points}
                </span>
                <span className="text-[10px] font-medium text-text-secondary mt-0.5 uppercase tracking-wider">
                  {t("kundliMatch.gunaMilan", "Guna Milan")}
                </span>
              </div>
            </div>

            {/* Dynamic Match Result Badge Callout */}
            <div className="mt-4 flex items-center gap-1.5 font-bold text-sm text-primary">
              <span>
                {match_result} {t("kundliMatch.match", "Match")}
              </span>
              <span className="text-amber-400 text-base">✨</span>
            </div>
          </div>

          {/* 2. Heading Section */}
          <h2 className="text-base font-bold mb-4 tracking-wide text-primary">
            {t("kundliMatch.gunaBreakdown", "Guna Breakdown")}
          </h2>

          {/* 3. Dynamic Star Breakdown Cards Mapping */}
          <div className="space-y-4">
            {guna_kootas?.map((koota: GunaKoota) => {
              // Calculate individual bar filling percentage cleanly safely avoiding division by 0
              const barFillRatio =
                koota.maximum_points > 0
                  ? (koota.points / koota.maximum_points) * 100
                  : 0;

              return (
                <div
                  key={koota.id}
                  className="bg-white rounded-2xl p-4 card-shadow flex flex-col justify-between space-y-2.5 transition-all duration-300 hover:shadow-md"
                >
                  {/* Dynamic Header Row displaying Title Label & Points Ratio */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight text-primary">
                        {koota.name}
                      </span>
                      <span className="text-xs text-text-secondary font-medium mt-0.5">
                        {koota.description}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-primary tabular-nums">
                      {koota.points}/{koota.maximum_points}
                    </span>
                  </div>

                  {/* Individual Component Level Visual Bar Progress Fill */}
                  <div className="w-full bg-[#F4EFF2] h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barFillRatio}%` }}
                      className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BodyLayout>
    </>
  );
};

export default KundliMatchResult;
