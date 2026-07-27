import { Circle } from "lucide-react";
import { memo, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    id: "you",
    label: "You",
  },
  {
    id: "ashrams",
    label: "Ashrams",
    icon: <Circle size={8} className="fill-text-primary text-text-primary" />,
  },
];

interface HomeTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const HomeTabs = ({ activeTab, setActiveTab }: HomeTabsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex pb-5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => {
            if (tab.id === "ashrams") {
              // setActiveTab(tab.id);
              navigate("/ashrams");
            } else {
              setActiveTab(tab.id);
            }
          }}
          className={`relative flex flex-1 items-center justify-center gap-2 py-3 text-center font-body-content text-md font-normal transition-all duration-200 ${
            activeTab === tab.id ? "text-text-primary" : "text-text-primary/50"
          }`}
        >
          {tab.icon}
          <span>{t(`home.${tab.id}`)}</span>

          <div
            className={`absolute bottom-0 left-0 h-1 w-full rounded-full transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-linear-to-r from-primary to-secondary"
                : "bg-transparent"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default memo(HomeTabs);
