import { memo } from "react";

export interface TabItem {
  id: number;
  label: string;
}

interface TabsProps {
  tabs: any;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex pb-5">
      {tabs.map((tab:any) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-md font-body-content font-semibold text-center cursor-pointer transition-all duration-200 ${
            activeTab === tab.id ? "text-text-primary" : "text-text-primary/50"
          }`}
        >
          {tab.icon}
          {tab.label}

          <div
            className={`absolute bottom-0 left-0 h-1 w-full rounded-full transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-linear-to-r from-primary to-secondary"
                : "bg-white"
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(Tabs);
