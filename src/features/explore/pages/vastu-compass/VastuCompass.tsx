import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/mangal-dosh.png";
import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import VastuCompassApp from "./components/VastuCompassApp";

const VastuCompass = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        title={t("vastuCompass.title")}
        subtitle={t("vastuCompass.title")}
        showBackButton
        redirectPath="/explore"
      />
      <BodyLayout>
        <div className="pt-6">
          <Banner
            title={t("vastuCompass.title")}
            bgImage={BannerImage}
            rightImage={RightImage}
          />
        </div>
        <VastuCompassApp />
      </BodyLayout>
    </>
  );
};

export default VastuCompass;
