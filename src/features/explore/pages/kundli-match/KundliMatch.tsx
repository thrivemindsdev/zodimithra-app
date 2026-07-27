import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/love-calculator.png";
import Banner from "@/components/common/Banner";
import GlobalLoader from "@/components/common/GlobalLoader";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { KundliMatchApi } from "@/services/explore.api";
import { timeZone } from "@/utils/timezone-utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KundliMatchForm, {
  type MatchFormState,
} from "./components/KundliMatchForm";

const KundliMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleMatch = async (formData: MatchFormState) => {
    // Determine dynamically which partner is male/female based on user choices
    const isP1Male = formData.partner1.gender === "male";
    const malePartner = isP1Male ? formData.partner1 : formData.partner2;
    const femalePartner = isP1Male ? formData.partner2 : formData.partner1;

    const payload = {
      male: {
        datetime: `${malePartner.dob}T${malePartner.tob}:00`,
        latitude: Number(malePartner.latitude),
        longitude: Number(malePartner.longitude),
        timezone: timeZone,
        gender: "male",
      },
      female: {
        datetime: `${femalePartner.dob}T${femalePartner.tob}:00`,
        latitude: Number(femalePartner.latitude),
        longitude: Number(femalePartner.longitude),
        timezone: timeZone,
        gender: "female",
      },
    };

    try {
      setLoading(true);
      const response = await KundliMatchApi(payload);

      navigate("/kundli-match-result", {
        state: {
          result: response,
        },
      });
    } catch (error) {
      console.error("Failed to fetch Kundli match results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header
        title="Kundli Matching"
        subtitle="Match your kundlis to see the score"
        showBackButton
        redirectPath="/explore"
      />
      <BodyLayout>
        <div className="pt-6">
          <Banner
            title="Kundli Matching"
            bgImage={BannerImage}
            rightImage={RightImage}
          />
        </div>
        <KundliMatchForm handleMatch={handleMatch} loading={loading} />
      </BodyLayout>
    </>
  );
};

export default KundliMatch;
