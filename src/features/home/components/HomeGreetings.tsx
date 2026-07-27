import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import ArtImage from "@/assets/home/Art.png";
import GreetingBg from "@/assets/home/Greetings.png";
import { AvatarGroup } from "./AvatarGroup";

interface HomeGreetingsProps {
  loading: boolean;
  data: {
    name?: string;
    zodiac_sign?: string;
  } | null;
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

    if (hour < 12) {
      return t("home.morning");
    }

    if (hour < 18) {
      return t("home.afternoon");
    }

    return t("home.evening");
  }, [t]);

  return (
    <section
      className="relative flex items-center justify-between rounded-2xl bg-cover bg-center mb-10 p-4"
      style={{
        backgroundImage: `url(${GreetingBg})`,
      }}
    >
      <div>
        {loading ? (
          /* Skeleton for Greetings Content */
          <div className="space-y-2 py-1">
            {/* Header Text Line 1 */}
            <div className="h-7 w-28 animate-pulse rounded bg-white/30" />
            {/* Header Text Line 2 */}
            <div className="h-7 w-36 animate-pulse rounded bg-white/30" />
            {/* Name Line */}
            <div className="mt-2 h-6 w-24 animate-pulse rounded bg-white/30" />

            {/* Button Skeleton */}
            {moreInfo && (
              <div className="mt-3 h-9 w-28 animate-pulse rounded-full bg-white/40" />
            )}
          </div>
        ) : (
          /* Actual Greetings Content */
          <>
            <h2 className="text-3xl font-header text-white font-light leading-tight">
              {t("home.good")}
            </h2>
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

      {/* Right side: Zodiac Character / Skeleton */}
      <div className="absolute right-2 -bottom-9">
        {loading ? (
          <div className="h-48 w-32 animate-pulse rounded-xl bg-white/20" />
        ) : (
          <img
            src={ArtImage}
            alt={`${data?.zodiac_sign || "Zodiac"} sign icon`}
            className="h-48 w-auto max-w-none object-contain"
            loading="lazy"
            draggable={false}
          />
        )}
      </div>
    </section>
  );
};

export default memo(HomeGreetings);
