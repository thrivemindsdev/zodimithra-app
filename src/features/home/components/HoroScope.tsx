import DurationTabs, { type TabId } from "@/components/common/DurationTabs";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { memo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface DetailItem {
  icon: string | null;
  category_id: string | number;
  category: string;
  description: string;
}

interface HoroScopeProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  loading: boolean;
  data?: {
    details?: DetailItem[];
  };
  isPremium: boolean;
}

const HoroScope = ({
  activeTab,
  setActiveTab,
  loading,
  data,
  isPremium,
}: HoroScopeProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.clientWidth,
    );

    setActive(index);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <>
      <DurationTabs
        isPremium={isPremium}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading ? (
        /* Card Skeleton Matching Visual Structure */
        <div className="card-shadow mt-4 rounded-2xl p-4">
          {/* Header Row Skeleton */}
          <div className="mb-2 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
            <div className="h-7 w-36 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Decorative Divider Line Skeleton */}
          <div className="relative my-3 flex items-center w-full">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <div className="h-[1.5px] flex-1 bg-gray-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          </div>

          {/* Paragraph Lines Skeleton */}
          <div className="space-y-2.5 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-[95%] animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-[88%] animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-[60%] animate-pulse rounded bg-gray-200" />
          </div>

          {/* Read More Trigger Skeleton */}
          <div className="mt-4 flex items-center justify-center">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Pagination Indicators Skeleton */}
          <div className="mt-4 flex justify-center gap-2 pb-1">
            <div className="h-2 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="card-shadow mt-4 rounded-2xl">
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="scrollbar-hide flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
          >
            {data?.details?.map((item, index) => (
              <div
                key={item.category_id ?? index}
                className="w-full shrink-0 snap-center p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F6685] text-white shadow-sm">
                    {/* <Gem className="h-4 w-4 stroke-[2.2]" /> */}
                    <img src={item.icon ?? ""} className="h-4 w-4" />
                  </div>

                  {/* Header Text */}
                  <h2 className="text-xl font-bold tracking-tight text-[#4F6685]">
                    {item?.category}
                  </h2>
                </div>

                {/* Decorative Divider with End Dots */}
                <div className="relative flex w-full items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4F6685]" />
                  <div className="h-[1.5px] flex-1 bg-[#4F6685]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4F6685]" />
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 100 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden pt-4"
                >
                  <p className="text-justify font-body-content text-sm font-medium leading-[1.6] text-text-secondary/90">
                    {item?.description}
                  </p>
                </motion.div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 transition-opacity focus:outline-none"
                >
                  <span className="font-body-content text-sm font-semibold text-button-primary">
                    {isExpanded ? t("home.readLess") : t("home.readMore")}
                  </span>
                  <ArrowRight
                    size={16}
                    color="#31358C"
                    className={`transition-transform duration-300 ${
                      isExpanded ? "-rotate-90" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 pb-4">
            {data?.details?.map((session, index) => (
              <button
                key={session.category_id ?? index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  active === index ? "w-6 bg-button-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(HoroScope);
