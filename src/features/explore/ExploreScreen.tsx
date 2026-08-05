import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import babyImg from "@/assets/explore/baby_names.png";
// import birthTimeImg from "@/assets/explore/birt_time_new.png";
import freeKundliImg from "@/assets/explore/free_kundly_new.png";
import gemstoneImg from "@/assets/explore/gem_stone.png";
import kundliImg from "@/assets/explore/kundli.png";
// import loveImg from "@/assets/explore/love_calcu.png";
import mangalImg from "@/assets/explore/mangal_dosh.png";
// import numerologyImg from "@/assets/explore/numerology_new.png";
import panchangImg from "@/assets/explore/panchang_copy.png";
import vastuImg from "@/assets/explore/vastu.png";
// import vivahImg from "@/assets/explore/vivah_muhurt_new.png";
import startImg from "@/assets/explore/staricon.png";
import healingImg from "@/assets/well-being/healing.jpg";
import mantrasImg from "@/assets/well-being/mantra.png";
import poojaBookingImg from "@/assets/well-being/pooja.jpg";
import vastuSastraImg from "@/assets/well-being/vastusastra.jpg";
import GlobalLoader from "@/components/common/GlobalLoader";
import { useTranslation } from "react-i18next";

interface CardData {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

const cardsData: CardData[] = [
  {
    id: "1",
    category: "MINDFUL JOURNEYS",
    title: "Mantras",
    description: "Guided sessions for inner peace",
    imageUrl: mantrasImg,
  },
  {
    id: "2",
    category: "SACRED WELLNESS",
    title: "Healing",
    description: "Theta, Reiki, Pranic & more",
    imageUrl: healingImg,
  },
  {
    id: "3",
    category: "SACRED RITUALS",
    title: "E-Pooja",
    description: "Vedic rituals at sacred temples",
    imageUrl: poojaBookingImg,
  },
  {
    id: "4",
    category: "ANCIENT SCIENCE",
    title: "Vastu Shastra",
    description: "Transform your space & future",
    imageUrl: vastuSastraImg,
  },
  {
    id: "5",
    category: "COSMIC ALIGNMENTS",
    title: "Dyaan",
    description: "Personalized dyaans for you",
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
      bgColor: "bg-[#E6F5EC]",
      borderColor: "border-[#17827D]",
      premium: false,
    },
    {
      id: "panchang",
      label: t("explore.panchang"),
      category: "readings",
      icon: panchangImg,
      path: "/panchang",
      bgColor: "bg-[#FCECFF]",
      borderColor: "border-[#AD82AC]",
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
      bgColor: "bg-[#F6EFE0]",
      borderColor: "border-[#A75212]",
      premium: false,
    },
    {
      id: "kundli-match",
      label: t("explore.kundliMatch"),
      category: "calculators",
      icon: kundliImg,
      path: "/kundli-match",
      bgColor: "bg-[#F6EFE0]",
      borderColor: "border-[#A75212]",
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
      bgColor: "bg-[#EBF0FE]",
      borderColor: "border-[#6488E4]",
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
      bgColor: "bg-[#FEEFE3]",
      borderColor: "border-[#CD2A12]",
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
                className={`${tool.bgColor} ${tool.borderColor} mt-12 border rounded-2xl p-3 flex flex-col justify-between h-22 relative`}
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
                <p className="text-xs text-text-primary font-body text-center pt-6">
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
              className="relative group h-44 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.01]"
              onClick={() =>
                card.id === "1"
                  ? navigate("/mantras")
                  : navigate("/coming-soon")
              }
            >
              {/* Background Image */}
              <img
                src={card.imageUrl}
                alt={t(card.title, card.title)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

              {/* Text Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-widest text-gray-200/90 font-medium mb-1">
                  {t(
                    `wellbeing.${card.id === "1" ? "mindfulJourneys" : card.id === "2" ? "sacredWellness" : card.id === "3" ? "sacredRituals" : card.id === "4" ? "ancientScience" : "cosmicAlignments"}`,
                    card.category,
                  )}
                </span>
                <h3 className="text-xl font-bold mb-1 tracking-wide">
                  {t(
                    `wellbeing.${card.id === "1" ? "mantras" : card.id === "2" ? "healing" : card.id === "3" ? "ePooja" : card.id === "4" ? "vastuShastra" : "dyaan"}`,
                    card.title,
                  )}
                </h3>
                <p className="text-sm text-gray-200/90 font-light">
                  {t(
                    `wellbeing.${card.id === "1" ? "mantrasDesc" : card.id === "2" ? "healingDesc" : card.id === "3" ? "poojaDesc" : card.id === "4" ? "vastuDesc" : "dyaanDesc"}`,
                    card.description,
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default ExploreScreen;
