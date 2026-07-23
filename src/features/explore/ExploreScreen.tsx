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
import GlobalLoader from "@/components/common/GlobalLoader";

const ExploreScreen = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;

  const TABS = [
    { id: "all", label: "All" },
    { id: "tools", label: "Tools" },
    { id: "calculators", label: "Calculators" },
    { id: "readings", label: "Readings" },
    { id: "premiumServices", label: "Premium Services" },
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
      label: "Gemstone Finder",
      category: "tools",
      icon: gemstoneImg,
      path: "/gemstone",
      bgColor: "bg-[#E6F5EC]",
      borderColor: "border-[#17827D]",
      premium: false,
    },
    {
      id: "panchang",
      label: "Panchang",
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
      label: "Vastu Compass",
      category: "tools",
      icon: vastuImg,
      path: "/vastu-compass",
      bgColor: "bg-[#F6EFE0]",
      borderColor: "border-[#A75212]",
      premium: false,
    },
    {
      id: "kundli-match",
      label: "Kundli Match",
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
      label: "Free Kundli",
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
      label: "Mangal Dosh",
      category: "calculators",
      icon: mangalImg,
      path: "/mangal-dosha",
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
      <Header title="Explore" subtitle="Explore mystical tools" />
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
                    navigate("/home/premium");
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
      </BodyLayout>
    </>
  );
};

export default ExploreScreen;
