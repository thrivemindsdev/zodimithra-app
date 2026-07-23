import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/panchang-image.png";
import PanchangCard from "./components/PanchangCard";

const Panchang = () => {
  return (
    <>
      <Header
        title="Panchang"
        showBackButton
      />
      <BodyLayout>
        <div className="pt-4">
          <Banner
            title={"Panchang"}
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
