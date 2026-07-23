import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type TabId = "daily" | "tomorrow" | "weekly" | "monthly" | "yearly";

interface TabItem {
  id: TabId;
  label: string;
  premium: boolean;
}

interface DurationTabsProps {
  isPremium: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const DURATION_TABS: TabItem[] = [
  { id: "daily", label: "today", premium: false },
  { id: "tomorrow", label: "tomorrow", premium: false },
  { id: "weekly", label: "this Week", premium: false },
  { id: "monthly", label: "this month", premium: true },
  { id: "yearly", label: "this year", premium: true },
];

const DurationTabs = ({
  isPremium,
  activeTab,
  setActiveTab,
}: DurationTabsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTabChange = useCallback(
    (item: TabItem) => {
      if (item.premium && !isPremium) {
        navigate("/home/premium");
        return;
      }

      setActiveTab(item.id);
    },
    [isPremium, navigate, setActiveTab],
  );

  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-5 scrollbar-hide">
      {DURATION_TABS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleTabChange(item)}
          className={`shrink-0 rounded-full border border-secondary font-medium px-5 py-2 font-body-content text-center text-sm capitalize transition-all duration-200 ${
            activeTab === item.id
              ? "bg-linear-to-r from-primary to-secondary text-white border-transparent"
              : "text-gradient"
          }`}
        >
          {t(`home.${item.id}`)}
        </button>
      ))}
    </div>
  );
};

export default memo(DurationTabs);
