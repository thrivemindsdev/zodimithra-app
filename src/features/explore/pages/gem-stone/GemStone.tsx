import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/lovestone.png";
import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";
import GemStoneForm from "./components/GemStoneForm";

const GemStone = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header
        title={t("gemstone.title")}
        showBackButton
        redirectPath="/explore"
      />
      <BodyLayout>
        <div className="pt-4">
          <Banner
            title={t("gemstone.title")}
            bgImage={BannerImage}
            rightImage={RightImage}
          />
        </div>
        <GemStoneForm />
      </BodyLayout>
    </>
  );
};

export default GemStone;
