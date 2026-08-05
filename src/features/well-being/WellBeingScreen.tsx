import healingImg from "@/assets/well-being/healing.jpg";
import mantrasImg from "@/assets/well-being/mantra.png";
import poojaBookingImg from "@/assets/well-being/pooja.jpg";
import vastuSastraImg from "@/assets/well-being/vastusastra.jpg";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface CardData {
  id: string;
  categoryKey: string;
  defaultCategory: string;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
  imageUrl: string;
}

const cardsData: CardData[] = [
  {
    id: "1",
    categoryKey: "wellbeing.mindfulJourneys",
    defaultCategory: "MINDFUL JOURNEYS",
    titleKey: "wellbeing.mantras",
    defaultTitle: "Mantras",
    descriptionKey: "wellbeing.mantrasDesc",
    defaultDescription: "Guided sessions for inner peace",
    imageUrl: mantrasImg,
  },
  {
    id: "2",
    categoryKey: "wellbeing.sacredWellness",
    defaultCategory: "SACRED WELLNESS",
    titleKey: "wellbeing.healing",
    defaultTitle: "Healing",
    descriptionKey: "wellbeing.healingDesc",
    defaultDescription: "Theta, Reiki, Pranic & more",
    imageUrl: healingImg,
  },
  {
    id: "3",
    categoryKey: "wellbeing.sacredRituals",
    defaultCategory: "SACRED RITUALS",
    titleKey: "wellbeing.ePooja",
    defaultTitle: "E-Pooja",
    descriptionKey: "wellbeing.poojaDesc",
    defaultDescription: "Vedic rituals at sacred temples",
    imageUrl: poojaBookingImg,
  },
  {
    id: "4",
    categoryKey: "wellbeing.ancientScience",
    defaultCategory: "ANCIENT SCIENCE",
    titleKey: "wellbeing.vastuShastra",
    defaultTitle: "Vastu Shastra",
    descriptionKey: "wellbeing.vastuDesc",
    defaultDescription: "Transform your space & future",
    imageUrl: vastuSastraImg,
  },
  {
    id: "5",
    categoryKey: "wellbeing.cosmicAlignments",
    defaultCategory: "COSMIC ALIGNMENTS",
    titleKey: "wellbeing.dyaan",
    defaultTitle: "Dyaan",
    descriptionKey: "wellbeing.dyaanDesc",
    defaultDescription: "Personalized dyaans for you",
    imageUrl: vastuSastraImg,
  },
];

const WellBeingScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Header
        title={t("wellbeing.title", "WellBeing")}
        subtitle={t("wellbeing.subtitle", "Find your perfect Astrologer")}
      />
      <BodyLayout>
        <div className="space-y-4 font-body">
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
                alt={t(card.titleKey, card.defaultTitle)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

              {/* Text Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-widest text-gray-200/90 font-medium mb-1">
                  {t(card.categoryKey, card.defaultCategory)}
                </span>
                <h3 className="text-xl font-bold mb-1 tracking-wide">
                  {t(card.titleKey, card.defaultTitle)}
                </h3>
                <p className="text-sm text-gray-200/90 font-light">
                  {t(card.descriptionKey, card.defaultDescription)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default WellBeingScreen;
