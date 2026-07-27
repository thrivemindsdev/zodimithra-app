import NumerologyIcon from "@/assets/home/numerology.png";
import TarotIcon from "@/assets/home/tarot.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomeServices = ({ isPremium }: { isPremium: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-lg font-bold font-body-content button-text-gradient capitalize pb-2">
        {t("home.discover")}
      </h2>

      <section className="grid grid-cols-2 gap-4">
        <div
          onClick={() => navigate("/numerology")}
          className="flex items-center gap-3 rounded-2xl p-3 card-shadow cursor-pointer hover:bg-primary/10 transition"
        >
          <img
            src={NumerologyIcon}
            alt="Numerology"
            className="w-10 h-10 object-contain"
          />
          <p className="text-text-primary text-xs font-bold">
            {t("home.numerology")}
          </p>
        </div>

        <div
          onClick={() => {
            isPremium ? navigate("/tarot-reading") : navigate("/premium");
          }}
          className="flex items-center gap-3 rounded-2xl p-3 card-shadow cursor-pointer hover:bg-primary/10 transition"
        >
          <img
            src={TarotIcon}
            alt="Tarot"
            className="w-10 h-10 object-contain"
          />
          <p className="text-text-primary text-xs font-bold">
            {t("home.tarotReading")}
          </p>
        </div>
      </section>
    </>
  );
};

export default HomeServices;
