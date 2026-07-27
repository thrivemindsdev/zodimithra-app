import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/mangal-dosh.png";
import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import MangalDoshForm from "./components/MangalDoshForm";
import { useTranslation } from "react-i18next";

const MangalDoshScreen = () => {
  const {t} = useTranslation();
  return (
    <>
      <Header
        title={t("mangalDosh.title")}
        subtitle={t("mangalDosh.subTitle")}
        showBackButton
        redirectPath="/explore"
      />
      <BodyLayout>
        <div className="pt-4">
          <Banner
            title={t("mangalDosh.title")}
            bgImage={BannerImage}
            rightImage={RightImage}
          />
        </div>
        <MangalDoshForm />
      </BodyLayout>
    </>
  );
};

export default MangalDoshScreen;
