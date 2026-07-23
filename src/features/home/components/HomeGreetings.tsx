import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// 1. Import all zodiac signs dynamically or map them out cleanly
import AriesImg from "@/assets/signs/aries.png";
import TaurusImg from "@/assets/signs/aries.png";
import GeminiImg from "@/assets/signs/aries.png";
import CancerImg from "@/assets/signs/aries.png";
import LeoImg from "@/assets/signs/aries.png";
import VirgoImg from "@/assets/signs/aries.png";
import LibraImg from "@/assets/signs/aries.png";
import ScorpioImg from "@/assets/signs/aries.png";
import SagittariusImg from "@/assets/signs/aries.png";
import CapricornImg from "@/assets/signs/aries.png";
import AquariusImg from "@/assets/signs/aries.png";
import PiscesImg from "@/assets/signs/aries.png";
import { useTranslation } from "react-i18next";

const ZODIAC_IMAGES: Record<string, string> = {
  aries: AriesImg,
  taurus: TaurusImg,
  gemini: GeminiImg,
  cancer: CancerImg,
  leo: LeoImg,
  virgo: VirgoImg,
  libra: LibraImg,
  scorpio: ScorpioImg,
  sagittarius: SagittariusImg,
  capricorn: CapricornImg,
  aquarius: AquariusImg,
  pisces: PiscesImg,
};

interface HomeGreetingsProps {
  data: {
    name?: string;
    zodiac_sign?: string;
  } | null;
  moreInfo?: boolean;
}

const HomeGreetings = ({ data, moreInfo = true }: HomeGreetingsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Calculate greeting text based on current hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.goodMorning");
    if (hour < 18) return t("home.goodAfternoon");
    return t("home.goodEvening");
  }, []);

  // Normalize sign name and fetch the corresponding image
  const signKey = data?.zodiac_sign?.toLowerCase() || "";
  const zodiacImg = ZODIAC_IMAGES[signKey] || AriesImg; // Fallback to Aries if empty/not found

  return (
    <section className="flex justify-between gap-6 rounded-2xl bg-white pb-8">
      {/* Left Content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Replaced 'text-gradient' with standard Tailwind utilities */}
          <h2 className="font-header font-light text-xl text-gradient">
            {greeting}
          </h2>
          <p className="py-1 font-semibold font-body-content text-text-primary text-md capitalize">
            {data?.name || "Guest"}
          </p>
        </div>

        {moreInfo && (
          <button
            type="button"
            onClick={() => navigate("/family-members")}
            className="w-fit rounded-full bg-black px-4 py-2 font-normal text-white text-xs transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            {t("home.moreInfo")}
          </button>
        )}
      </div>

      {/* Right Image Container */}
      <div className="flex w-36 shrink-0 flex-col items-center justify-center gap-1">
        <img
          src={zodiacImg}
          alt={`${data?.zodiac_sign || "Zodiac"} sign icon`}
          className="h-28 w-28 object-contain"
          loading="lazy"
          draggable={false}
        />
        {data?.zodiac_sign && (
          <h3 className="font-semibold text-[#A36D12] text-sm capitalize">
            {data.zodiac_sign}
          </h3>
        )}
      </div>
    </section>
  );
};

export default memo(HomeGreetings);
