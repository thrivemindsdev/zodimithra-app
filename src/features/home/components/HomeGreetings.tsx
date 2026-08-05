import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import GreetingBg from "@/assets/home/Greetings.png";
import AquariusImage from "@/assets/signs/AQUARIUS.png";
import AriesImage from "@/assets/signs/ARIES.png";
import CancerImage from "@/assets/signs/CANCER.png";
import CapricornImage from "@/assets/signs/CAPRICON.png";
import GeminiImage from "@/assets/signs/GEMINI.png";
import LeoImage from "@/assets/signs/LEO.png";
import LibraImage from "@/assets/signs/LIBRA.png";
import PiscesImage from "@/assets/signs/PISCES.png";
import SagittariusImage from "@/assets/signs/SAGITTARUIS.png";
import ScorpioImage from "@/assets/signs/SCORPION.png";
import TaurusImage from "@/assets/signs/TAURUS.png";
import VirgoImage from "@/assets/signs/VIRGO.png";
import { AvatarGroup } from "./AvatarGroup";

const zodiacSigns: Record<string, string> = {
  Aries: AriesImage,
  Taurus: TaurusImage,
  Gemini: GeminiImage,
  Cancer: CancerImage,
  Leo: LeoImage,
  Virgo: VirgoImage,
  Libra: LibraImage,
  Scorpio: ScorpioImage,
  Sagittarius: SagittariusImage,
  Capricorn: CapricornImage,
  Aquarius: AquariusImage,
  Pisces: PiscesImage,
};

interface HomeGreetingsProps {
  loading: boolean;
  data: {
    name?: string;
    zodiac_sign: string;
  };
  moreInfo?: boolean;
}

const HomeGreetings = ({
  loading,
  data,
  moreInfo = true,
}: HomeGreetingsProps) => {
  const { t } = useTranslation();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return t("home.morning");
    if (hour < 18) return t("home.afternoon"); // 12 to 17
    if (hour < 21) return t("home.evening"); // 18 to 20

    return t("home.night"); // 21 to 4
  }, [t]);

  return (
    <section
      className="flex items-center justify-between rounded-2xl bg-cover bg-center mb-10 p-4"
      style={{
        backgroundImage: `url(${GreetingBg})`,
      }}
    >
      {/* Left side: Greetings & User Info */}
      <div className="w-[50%]">
        {loading ? (
          /* Skeleton for Greetings Content */
          <div className="space-y-2 py-1">
            <div className="h-7 w-28 animate-pulse rounded bg-white/30" />
            <div className="h-7 w-36 animate-pulse rounded bg-white/30" />
            <div className="mt-2 h-6 w-24 animate-pulse rounded bg-white/30" />

            {moreInfo && (
              <div className="mt-3 h-9 w-28 animate-pulse rounded-full bg-white/40" />
            )}
          </div>
        ) : (
          /* Actual Greetings Content */
          <>
            <h2 className="text-3xl font-header text-white font-light leading-tight">
              {greeting},
            </h2>
            <p className="text-xl pt-2 text-white font-semibold capitalize font-body-content tracking-wide">
              {data?.name || "Guest"}
            </p>

            {moreInfo && <AvatarGroup />}
          </>
        )}
      </div>

      {/* Right side: Zodiac Character Image + Zodiac Name Below */}
      <div className="flex flex-col items-center z-10">
        {loading ? (
          <div className="space-y-2 flex flex-col items-center">
            <div className="h-44 w-32 animate-pulse rounded-xl bg-white/20" />
            <div className="h-5 w-20 animate-pulse rounded bg-white/20" />
          </div>
        ) : (
          <>
            <img
              src={zodiacSigns[data?.zodiac_sign]}
              alt={`${data?.zodiac_sign || "Zodiac"} sign icon`}
              className="h-44 w-auto max-w-none object-contain"
              loading="lazy"
              draggable={false}
            />
            {data?.zodiac_sign && (
              <span className="mt-1 text-lg font-semibold capitalize tracking-wide text-white font-body-content drop-shadow">
                {t(
                  `freeKundli.${data.zodiac_sign.toLowerCase()}`,
                  data.zodiac_sign,
                )}
              </span>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default memo(HomeGreetings);
