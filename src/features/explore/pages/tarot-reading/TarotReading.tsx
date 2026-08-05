import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { CalendarDays, MessageCircleQuestion } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  id: number;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    titleKey: "tarotReading.cardOfTheDay",
    defaultTitle: "Card of the Day",
    descKey: "tarotReading.cardOfTheDayDesc",
    defaultDesc: "View the card of the day selected for you",
    icon: <CalendarDays size={34} strokeWidth={2} />,
  },
  {
    id: 2,
    titleKey: "tarotReading.yesOrNo",
    defaultTitle: "Yes or No",
    descKey: "tarotReading.yesOrNoDesc",
    defaultDesc: "Ask a question that confusing you",
    icon: <MessageCircleQuestion size={34} strokeWidth={2} />,
  },
];

type MenuCardProps = {
  item: MenuItem;
  onClick?: () => void;
};

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl card-shadow bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-md mb-6 cursor-pointer"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-primary text-primary">
          {item.icon}
        </div>

        <h3 className="mt-6 text-lg font-header font-light text-text-primary">
          {t(item.titleKey, item.defaultTitle)}
        </h3>

        <p className="mt-2 max-w-xs font-body text-center text-sm leading-6 text-text-secondary">
          {t(item.descKey, item.defaultDesc)}
        </p>
      </div>
    </button>
  );
};

const TarotReading = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleMenuClick = (id: number) => {
    if (id === 1) {
      navigate("/tarot-cards/1");
    } else if (id === 2) {
      navigate("/tarot-yes-or-no");
    }
  };

  return (
    <>
      <Header
        title={t("tarotReading.title", "Tarot Reading")}
        subtitle={t(
          "tarotReading.subTitle",
          "Tarot gives you ideas for the life",
        )}
        showBackButton
        redirectPath="/home"
      />
      <BodyLayout>
        <div className="pt-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onClick={() => handleMenuClick(item.id)}
            />
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default TarotReading;
