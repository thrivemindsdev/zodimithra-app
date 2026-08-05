import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import NumerologyForm from "./components/NumerologyForm";

const Numerology = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        title={t("numerologyCalculator.title", "Numerology Calculator")}
        subtitle={t(
          "numerologyCalculator.subTitle",
          "Find the luck with the numbers",
        )}
        showBackButton
        redirectPath="/home"
      />
      <BodyLayout>
        <NumerologyForm />
      </BodyLayout>
    </>
  );
};

export default Numerology;
