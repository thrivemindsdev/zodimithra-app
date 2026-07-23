import NumerologyIcon from "@/assets/home/numerology.png";
import TarotIcon from "@/assets/home/tarot.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HomeServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="flex justify-between items-center gap-4 w-full my-8">
      <div
        className="bg-input-bg pt-2 rounded-4xl shadow-sm"
        onClick={() => navigate("/numerology")}
      >
        <img src={NumerologyIcon} alt="Numerology" className="p-3" />
        <p className="text-center font-header text-sm font-medium rounded-bl-4xl rounded-br-4xl py-4 text-white bg-primary">
          {t("home.numerology")}
        </p>
      </div>
      <div
        className="bg-input-bg pt-2 rounded-4xl shadow-sm"
        onClick={() => navigate("/tarot-reading")}
      >
        <img src={TarotIcon} alt="Tarot" className="p-3" />
        <p className="text-center font-header text-sm font-medium rounded-bl-4xl rounded-br-4xl py-4 text-white bg-primary">
          {t("home.tarotReading")}
        </p>
      </div>
    </section>
  );
};

export default HomeServices;
