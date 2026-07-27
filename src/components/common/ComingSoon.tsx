import BodyLayout from "../layout/BodyLayout";
import Header from "../layout/Header";
import shopImg from "@/assets/explore/astro_shop.png";
import comingSoonImg from "@/assets/explore/coming_soon.png";

const ComingSoon = () => {
  return (
    <>
      <Header title="Coming Soon" showBackButton redirectPath="/wellbeing" />
      <BodyLayout>
        <div className="relative">
          <img src={shopImg} />
          <img
            src={comingSoonImg}
            alt="no_image"
            className="absolute top-[calc(50%-20px)]"
          />
        </div>
      </BodyLayout>
    </>
  );
};

export default ComingSoon;
