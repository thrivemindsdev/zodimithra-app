import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import {
  Gem,
  Heart,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import GemstoneImage from "@/assets/explore/gemstone/gemstone.png";

// Types matching your location state structure
interface Benefit {
  title: string;
  description: string;
}

interface GemstoneData {
  gemstone: string;
  description: {
    about: string;
    benefits: Benefit[];
  };
  rasi: string;
  moon_sign: string;
  nakshatra: string;
}

// Fallback icon list for dynamic items
const DEFAULT_ICONS: LucideIcon[] = [Sparkles, Heart, ShieldCheck];

const GemStoneResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!state?.result) {
      navigate("/gemstone", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.result) {
    return null;
  }

  const result: GemstoneData = state.result;

  return (
    <>
      <Header
        title={t("gemstone.title")}
        showBackButton
        redirectPath="/gemstone"
      />
      <BodyLayout>
        {/* Circle Showcase Header */}
        <div className="relative mb-10 z-10 flex justify-center items-center">
          <div className="w-56 h-56 rounded-full border-2 border-dashed border-purple-200 bg-purple-50/50 flex justify-center items-center relative p-4">
            {/* Background decorative sparkles */}
            <Sparkles className="w-4 h-4 text-secondary absolute top-8 left-8 opacity-70" />
            <Sparkles className="w-3 h-3 text-secondary absolute top-10 right-8 opacity-50" />
            <Sparkles className="w-4 h-4 text-secondary absolute bottom-6 left-1/2 -translate-x-1/2 opacity-70" />

            {/* Gemstone Image */}
            <img
              src={GemstoneImage}
              alt={result.gemstone}
              className="w-44 h-44 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="w-full font-body bg-white rounded-3xl pb-8 px-6 card-shadow flex flex-col items-center text-center">
          {/* Header Badge */}
          <span className="text-sm font-bold tracking-[2px] text-secondary uppercase pt-5 pb-2">
            {t("gemstone.recommanded")}
          </span>

          {/* Title */}
          <h2 className="text-2xl font-body font-bold text-primary mb-3">
            {result.gemstone}
          </h2>

          {/* Subheading Badge */}
          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mb-3">
            <Gem className="w-3.5 h-3.5 text-primary" />
            <span>{t("gemstone.about")}</span>
          </div>

          {/* About Description */}
          <p className="text-xs text-text-secondary leading-relaxed mb-6 max-w-xs">
            {result.description.about}
          </p>

          {/* Benefits Section Label */}
          <h3 className="text-sm font-semibold text-primary mb-4">
            {t("gemstone.benefits")}
          </h3>

          {/* Dynamic Benefits List */}
          <div className="w-full space-y-3 text-left">
            {result.description.benefits.map((benefit, index) => {
              const IconComponent = DEFAULT_ICONS[index % DEFAULT_ICONS.length];

              return (
                <div key={index} className="flex items-start gap-3">
                  {/* Icon Box */}
                  <div className="w-8 h-8 rounded-lg bg-light-bg flex items-center justify-center shrink-0 mt-0.5">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>

                  {/* Text Content */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-text-secondary">
                      {benefit.description}
                    </p>
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

export default GemStoneResult;
