import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/panchang-image.png";
import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import PanchangCard from "./components/PanchangCard";

const Panchang = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        title={t("panchang.title")}
        showBackButton
        redirectPath="/explore"
      />
      <BodyLayout>
        <div className="pt-4">
          <Banner
            title={t("panchang.title")}
            bgImage={BannerImage}
            rightImage={RightImage}
          />
          <PanchangCard />
        </div>
      </BodyLayout>
    </>
  );
};

export default Panchang;
