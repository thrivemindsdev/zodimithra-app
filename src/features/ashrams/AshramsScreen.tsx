import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import AshramsBanner from "./components/AshramsBanner";
import AshramsList from "./components/AshramsList";
import { useTranslation } from "react-i18next";

const AshramsScreen = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        title={t("ashrams.title", "Ashrams")}
        showBackButton
        redirectPath="/home"
      />
      <BodyLayout>
        <AshramsBanner />
        <AshramsList />
      </BodyLayout>
    </>
  );
};

export default AshramsScreen;
