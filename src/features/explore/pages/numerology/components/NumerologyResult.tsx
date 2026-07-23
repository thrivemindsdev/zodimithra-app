import React from "react";
import { CalendarDays, Clock3, User } from "lucide-react";

type PersonalDetail = {
  name: string;
  dob: string;
  birthTime: string;
};

type NumberCard = {
  title: string;
  number: number;
  description: string;
};

const personalDetail: PersonalDetail = {
  name: "Akhilesh",
  dob: "14 Mar 2010",
  birthTime: "10:12 PM",
};

const numerologyCards: NumberCard[] = [
  {
    title: "Life Path Number",
    number: 9,
    description:
      "The Life Path Number is the most significant number in numerology. It reveals your life's purpose and the main challenges you'll face.",
  },
  {
    title: "Birthday Number",
    number: 14,
    description:
      "The Birthday Number highlights a special talent or trait that is native to you and helps to understand how you present yourself to the world.",
  },
  {
    title: "Personality Number",
    number: 5,
    description:
      "The Personality Number uncovers the side of yourself that you show to the world, including your habits, traits, and outward demeanor.",
  },
];

const DetailRow = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl bg-input-bg border border-input-border px-4 py-3">
    <div className="text-primary">{icon}</div>
    <span className="text-sm text-text-secondary font-bold">
      {value}
    </span>
  </div>
);

const NumberCardItem = ({ item }: { item: NumberCard }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>

      <span className="text-4xl font-bold text-[#DDAB2C]">{item.number}</span>
    </div>

    <p className="text-sm leading-7 text-text-secondary">{item.description}</p>
  </div>
);

const NumerologyResult = () => {
  return (
    <div className="space-y-5 font-body">
      {/* Personal Details */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-primary">
          Personal Details
        </h2>

        <div className="space-y-3">
          <DetailRow icon={<User size={18} />} value={personalDetail.name} />

          <DetailRow
            icon={<CalendarDays size={18} />}
            value={personalDetail.dob}
          />

          <DetailRow
            icon={<Clock3 size={18} />}
            value={personalDetail.birthTime}
          />
        </div>
      </div>

      {/* Number Cards */}

      {numerologyCards.map((item) => (
        <NumberCardItem key={item.title} item={item} />
      ))}
    </div>
  );
};

export default NumerologyResult;
