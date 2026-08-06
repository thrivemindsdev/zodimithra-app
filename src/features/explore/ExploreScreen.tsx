import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import babyImg from "@/assets/explore/baby_names.png";
// import birthTimeImg from "@/assets/explore/birt_time_new.png";
import freeKundliImg from "@/assets/explore/Free_Kundli.png";
import gemstoneImg from "@/assets/explore/Birthstone_Finder.png";
import kundliImg from "@/assets/explore/Kundli_Match.png";
// import loveImg from "@/assets/explore/love_calcu.png";
import mangalImg from "@/assets/explore/Mangal-Dosh.png";
// import numerologyImg from "@/assets/explore/numerology_new.png";
import panchangImg from "@/assets/explore/Panchang.png";
import vastuImg from "@/assets/explore/Vastu_Compass.png";
// import vivahImg from "@/assets/explore/vivah_muhurt_new.png";
import startImg from "@/assets/explore/staricon.png";
import healingImg from "@/assets/explore/healing.png";
import mantrasImg from "@/assets/explore/mantras.png";
import poojaBookingImg from "@/assets/explore/epooja.png";
import vastuSastraImg from "@/assets/explore/vastu_shastra.png";
import GlobalLoader from "@/components/common/GlobalLoader";
import { useTranslation } from "react-i18next";

interface CardData {
  id: string;
  imageUrl: string;
}

const cardsData: CardData[] = [
  {
    id: "1",
    imageUrl: mantrasImg,
  },
  {
    id: "2",
    imageUrl: healingImg,
  },
  {
    id: "3",
    imageUrl: poojaBookingImg,
  },
  {
    id: "4",
    imageUrl: vastuSastraImg,
  },
];

const ExploreScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;

  const TABS = [
    { id: "all", label: t("explore.all") },
    { id: "tools", label: t("explore.tools") },
    { id: "calculators", label: t("explore.calculators") },
    { id: "readings", label: t("explore.readings") },
    { id: "premiumServices", label: t("explore.premiumServices") },
  ] as const;

  const ALL_TOOLS = [
    // {
    //   id: "love-calculator",
    //   label: "loveCalculator",
    //   category: "calculators",
    //   icon: loveImg,
    //   path: "/love-calculator",
    //   bgColor: "bg-[#FFF1E7]",
    //   borderColor: "border-[#FD8F84]",
    //   premium: false,
    // },
    {
      id: "gemstone-finder",
      label: t("explore.gemstoneFinder"),
      category: "tools",
      icon: gemstoneImg,
      path: "/gemstone",
      premium: false,
    },
    {
      id: "panchang",
      label: t("explore.panchang"),
      category: "readings",
      icon: panchangImg,
      path: "/panchang",
      premium: false,
    },
    // {
    //   id: "baby-names",
    //   label: "babyNames",
    //   category: "tools",
    //   icon: babyImg,
    //   path: "/baby-names",
    //   bgColor: "bg-[#FFF6CF]",
    //   borderColor: "border-[#552101]",
    //   premium: false,
    // },
    {
      id: "vastu-compass",
      label: t("explore.vastuCompass"),
      category: "tools",
      icon: vastuImg,
      path: "/vastu-compass",
      premium: false,
    },
    {
      id: "kundli-match",
      label: t("explore.kundliMatch"),
      category: "calculators",
      icon: kundliImg,
      path: "/kundli-match",
      premium: false,
    },
    // {
    //   id: "numerology",
    //   label: "numerologyServices",
    //   category: "premiumServices",
    //   icon: numerologyImg,
    //   path: "/numerology",
    //   bgColor: "bg-[#F9FFFB]",
    //   borderColor: "border-[#C1E0D8]",
    //   premium: true,
    // },
    // {
    //   id: "vivah-muhurth",
    //   label: "vivahMuhurthConsultation",
    //   category: "premiumServices",
    //   icon: vivahImg,
    //   path: "/muhurth-finder",
    //   bgColor: "bg-[#FFFBE2]",
    //   borderColor: "border-[#C76A1C]",
    //   premium: true,
    // },
    {
      id: "free-kundli",
      label: t("explore.freeKundli"),
      category: "readings",
      icon: freeKundliImg,
      path: "/free-kundli",
      premium: false,
    },
    // {
    //   id: "birth-time",
    //   label: "birthTimeRectification",
    //   category: "premiumServices",
    //   icon: birthTimeImg,
    //   path: "/astrology",
    //   bgColor: "bg-[#FDFDE1]",
    //   borderColor: "border-[#A34D14]",
    //   premium: true,
    // },
    {
      id: "mangal-dosh",
      label: t("explore.mangalDosh"),
      category: "calculators",
      icon: mangalImg,
      path: "/mangal-dosh",
      premium: false,
    },
  ] as const;

  const filteredTools =
    activeTab === "all"
      ? ALL_TOOLS
      : ALL_TOOLS.filter((tool) => tool.category === activeTab);

  if (isUserLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header title={t("explore.title")} subtitle={t("explore.subTitle")} />
      <BodyLayout>
        {/* Tabs Header */}
        <div className="flex overflow-x-auto hide-scrollbar mb-3 gap-3 bg-white rounded-[14px] py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-2 border font-body font-bold rounded-4xl text-xs transition-colors ${
                activeTab === tab.id
                  ? "border-primary bg-primary text-white"
                  : "border-primary text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {filteredTools.map((tool) => {
            const isLocked = tool.premium && !isPremium;
            return (
              <div
                key={tool.id}
                className="mt-12 bg-linear-to-b from-[#533372] to-[#0D0A34] rounded-2xl p-3 flex flex-col justify-between h-22 relative"
                onClick={() => {
                  if (isLocked) {
                    navigate("/premium");
                  } else {
                    navigate(tool.path);
                  }
                }}
              >
                <div className="absolute -top-9 left-[calc(50%-33px)]">
                  <img src={tool.icon} alt={tool.label} className="w-16 h-16" />
                </div>
                {tool.premium && (
                  <div className="absolute right-0 top-0 rounded-4xl bg-primary w-6 h-6 flex justify-center items-center">
                    <img src={startImg} alt={tool.label} className="w-3 h-3" />
                  </div>
                )}
                <p className="text-xs text-white font-body text-center pt-6">
                  {tool.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 font-body pt-8">
          {cardsData.map((card) => (
            <div
              key={card.id}
              onClick={() =>
                card.id === "1"
                  ? navigate("/mantras")
                  : navigate("/coming-soon")
              }
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={card.imageUrl}
                alt={`Card ${card.id}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default ExploreScreen;
