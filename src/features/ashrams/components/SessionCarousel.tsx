import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Lock } from "lucide-react";
import { type LiveSession } from "@/types/ashrams.types";

interface SessionCarouselProps {
  title: string;
  type?: "live" | "upcoming";
  sessions?: LiveSession[] | any[];
  loading?: boolean;
  onSessionClick?: (session: any) => void;
}

const SessionCarousel = ({
  title,
  type,
  sessions = [],
  loading,
  onSessionClick,
}: SessionCarouselProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const isUpcoming =
    type === "upcoming" ||
    (type !== "live" && title.toLowerCase().includes("upcoming"));

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.clientWidth
    );

    setActive(index);
  };

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-4 shadow-sm">
        {/* Title Skeleton */}
        <div className="mb-4 h-5 w-36 animate-pulse rounded bg-gray-200" />

        {/* Carousel Image Skeleton */}
        <div className="h-44 w-full animate-pulse rounded-2xl bg-gray-200" />

        {/* Pagination Dots Skeleton */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2 w-6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!sessions.length) return null;

  return (
    <div className="rounded-2xl py-4 shadow-sm">
      <div className="pb-4">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
            isUpcoming
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                isUpcoming
                  ? "bg-blue-500 animate-pulse"
                  : "bg-red-500 animate-ping"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isUpcoming ? "bg-blue-500" : "bg-red-500"
              }`}
            />
          </span>

          <span className="text-xs font-semibold tracking-wide uppercase">
            {title}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
      >
        {sessions.map((session) => {
          const isSubscribed = Boolean(session.is_subscribed);

          return (
            <div
              key={session.id}
              onClick={() => onSessionClick?.(session)}
              className="relative min-w-full cursor-pointer snap-center overflow-hidden rounded-2xl"
            >
              <img
                src={session.author?.image}
                alt={session.title}
                className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
              />

              {/* Subscription Status Badge */}
              <div className="absolute top-3 right-3">
                {isSubscribed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md">
                    <Check className="h-3.5 w-3.5" />
                    {t("ashrams.subscribed", "Subscribed")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 shadow-md backdrop-blur-md">
                    <Lock className="h-3.5 w-3.5" />
                    {t("ashrams.subscribe", "Subscribe")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {sessions.map((session, index) => (
          <button
            key={session.id}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${active === index ? "w-6 bg-pink-500" : "w-2 bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionCarousel;