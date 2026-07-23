import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { CalendarDays, MessageCircleQuestion } from "lucide-react";
import React from "react";

type MenuItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Card of the Day",
    description: "View the card of the day selected for you",
    icon: <CalendarDays size={34} strokeWidth={2} />,
  },
  {
    id: 2,
    title: "Yes or No",
    description: "Ask a question that confusing you",
    icon: <MessageCircleQuestion size={34} strokeWidth={2} />,
  },
];

type MenuCardProps = {
  item: MenuItem;
  onClick?: () => void;
};

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md mb-6"
    >
      <div className="flex flex-col items-center">
        {/* Icon */}

        <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-primary text-primary">
          {item.icon}
        </div>

        {/* Title */}

        <h3 className="mt-6 text-lg font-header font-light text-text-primary">
          {item.title}
        </h3>

        {/* Description */}

        <p className="mt-2 max-w-xs font-body text-center text-sm leading-6 text-text-secondary">
          {item.description}
        </p>
      </div>
    </button>
  );
};

const TarotReading = () => {
  return (
    <>
      <Header
        title="Tarot Reading"
        subtitle="Tarot gives you ideas for the life"
        showBackButton
      />
      <BodyLayout>
        <div className="pt-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onClick={() => console.log(item.title)}
            />
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default TarotReading;
