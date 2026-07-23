import DurationTabs, { type TabId } from "@/components/common/DurationTabs";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

const HoroScope = ({ data, isPremium }: any) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("daily");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <DurationTabs
        isPremium={isPremium}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {data[activeTab] && (
        <section className="pt-6 p-4">
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 70 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="text-sm font-body text-justify text-text-secondary font-bold leading-[1.6]">
              {data[activeTab]}
            </p>
          </motion.div>
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full gap-1 mb-2 transition-opacity"
          >
            <h1 className="text-sm text-secondary font-semibold font-body">
              {isExpanded ? t("home.readLess") : t("home.readMore")}
            </h1>
            <ArrowRight
              size={16}
              color={"#D1197E"}
              className={`transition-transform ${isExpanded ? "-rotate-90" : ""}`}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default memo(HoroScope);
