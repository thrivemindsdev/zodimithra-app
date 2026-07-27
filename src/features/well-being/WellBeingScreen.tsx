import healingImg from "@/assets/well-being/healing.jpg";
import mantrasImg from "@/assets/well-being/mantra.png";
import poojaBookingImg from "@/assets/well-being/pooja.jpg";
import vastuSastraImg from "@/assets/well-being/vastusastra.jpg";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";

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

const WellBeingScreen = () => {
  return (
    <>
      <Header title="WellBeing" subtitle="Find your perfect Astrologer" />
      <BodyLayout>
        <div className="space-y-4 font-body">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="relative group h-44 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.01]"
            >
              {/* Background Image */}
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

              {/* Text Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-widest text-gray-200/90 font-medium mb-1">
                  {card.category}
                </span>
                <h3 className="text-xl font-bold mb-1 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-200/90 font-light">
                  {card.description}
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
