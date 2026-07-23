import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/mangal-dosh.png";
import VastuCompassApp from "./components/VastuCompassApp";

const VastuCompass = () => {
  return (
    <>
      <Header
        title="Vastu Compass"
        subtitle="Vastu Compass"
        showBackButton
      />
      <BodyLayout>
        <div className="pt-6">
          <Banner
            title={"Vastu Compass"}
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
