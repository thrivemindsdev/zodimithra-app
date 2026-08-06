import { useTranslation } from "react-i18next";
import HealingImg from "@/assets/home/healing.png";
import AffulenceImg from "@/assets/home/affluence.png";
import RitualImg from "@/assets/home/rituals.png";
import MindfulImg from "@/assets/home/mindful.png";
import SleepImg from "@/assets/home/sleep.png";
import { useNavigate } from "react-router-dom";
import { useGetMantrasCategoriesQuery } from "@/queries/mantraQueries";

const HomeTools = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: mantrasCategories = [] } = useGetMantrasCategoriesQuery();

  const healingId = mantrasCategories.find(
    (category: any) => category.name === "Healing",
  )?.id;

  const tools = [
    {
      image: HealingImg,
      label: "home.healing",
      defaultText: "Healing",
      id: healingId,
    },
    { image: AffulenceImg, label: "home.affluence", defaultText: "Affluence" },
    { image: RitualImg, label: "home.ritual", defaultText: "Nightly Ritual" },
    {
      image: MindfulImg,
      label: "home.mindfulRest",
      defaultText: "Mindful Rest",
    },
    {
      image: SleepImg,
      label: "home.sleepConcerns",
      defaultText: "Sleep Concerns",
    },
  ];

  return (
    <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pt-6 pb-2 select-none">
      {tools.map(({ image, label, defaultText, id }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 shrink-0 w-24"
          onClick={() => {
            if (id) {
              navigate(`/mantras`, { state: { categoryId: id } });
            }
          }}
        >
          <img
            src={image}
            alt={t(label, defaultText)}
            className="w-24 h-24 object-contain"
          />
          <p className="text-xs font-semibold font-body-content text-text-primary text-center leading-tight">
            {t(label, defaultText)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HomeTools;
