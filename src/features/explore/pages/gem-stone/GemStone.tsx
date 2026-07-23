import Banner from "@/components/common/Banner";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/lovestone.png";
import GemStoneForm from "./components/GemStoneForm";

const GemStone = () => {
  return (
    <>
      <Header
        title="Birthstone Finder"
        subtitle="Find your birth stone using your Birth details"
        showBackButton
      />
      <BodyLayout>
        <div className="pt-4">
          <Banner
            title={"Gemstone Finder"}
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
