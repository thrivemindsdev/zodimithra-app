import { useTranslation } from "react-i18next";
import HealingImg from "@/assets/home/healing.png";
import AffulenceImg from "@/assets/home/affulence.png";
import RitualImg from "@/assets/home/ritual.png";

const HomeTools = () => {
  const { t } = useTranslation();

  const tools = [
    { image: HealingImg, label: "home.healing" },
    { image: AffulenceImg, label: "home.affulence" },
    { image: RitualImg, label: "home.ritual" },
  ];

  return (
    <div className="flex items-center justify-between pt-6">
      {tools.map(({ image, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2"
        >
          <img
            src={image}
            alt={t(label)}
            className="w-24 h-24 object-contain"
          />
          <p className="text-xs font-semibold font-body-content text-text-primary text-center">
            {t(label)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HomeTools;