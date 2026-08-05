import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { CalendarDays, Clock3, User } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

type PersonalDetail = {
  name: string;
  dob: string;
  birthTime: string;
};

type NumerologyItem = {
  number: number;
  title?: string;
  description: string;
};

type NumerologyResultState = {
  life_path: NumerologyItem;
  birthday: NumerologyItem;
  personality: NumerologyItem;
};

type NumberCard = {
  title: string;
  subtitle?: string;
  number: number;
  description: string;
};

const personalDetail: PersonalDetail = {
  name: "Akhilesh",
  dob: "14 Mar 2010",
  birthTime: "10:12 PM",
};

const DetailRow = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) => (
  <div className="flex items-center gap-3 rounded-xl bg-input-bg border border-input-border px-4 py-3">
    <div className="text-primary">{icon}</div>
    <span className="text-sm font-bold text-text-secondary">{value}</span>
  </div>
);

const NumberCardItem = ({ item }: { item: NumberCard }) => (
  <div className="rounded-2xl card-shadow bg-white p-5">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>

        {item.subtitle && (
          <p className="mt-1 text-sm font-semibold text-[#DDAB2C]">
            {item.subtitle}
          </p>
        )}
      </div>

      <span className="text-4xl font-bold text-[#DDAB2C]">{item.number}</span>
    </div>

    <p className="text-sm leading-7 text-text-secondary">{item.description}</p>
  </div>
);

const NumerologyResult = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.result) {
      navigate("/numerology", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.result) {
    return null;
  }

  const result = state.result as NumerologyResultState;

  const numerologyCards: NumberCard[] = [
    {
      title: t("numerologyCalculator.lifePathNumber", "Life Path Number"),
      subtitle: result.life_path.title,
      number: result.life_path.number,
      description: result.life_path.description,
    },
    {
      title: t("numerologyCalculator.birthdayNumber", "Birthday Number"),
      subtitle: result.birthday.title,
      number: result.birthday.number,
      description: result.birthday.description,
    },
    {
      title: t("numerologyCalculator.personalityNumber", "Personality Number"),
      subtitle: result.personality.title,
      number: result.personality.number,
      description: result.personality.description,
    },
  ];

  return (
    <>
      <Header
        title={t("numerologyCalculator.resultTitle", "Numerology Result")}
        showBackButton
        redirectPath="/numerology"
      />

      <BodyLayout>
        <div className="space-y-5 font-body">
          {/* Personal Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-primary">
              {t("numerologyCalculator.personalDetails", "Personal Details")}
            </h2>

            <div className="space-y-3">
              <DetailRow
                icon={<User size={18} />}
                value={personalDetail.name}
              />

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

          {/* Numerology Cards */}
          {numerologyCards.map((item) => (
            <NumberCardItem key={item.title} item={item} />
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default NumerologyResult;
