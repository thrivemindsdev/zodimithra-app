import BannerImage from "@/assets/banner/bg-banner.jpg";
import RightImage from "@/assets/banner/love-calculator.png";
import Banner from "@/components/common/Banner";
import GlobalLoader from "@/components/common/GlobalLoader";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import {
  useGetPanchangDetailsQuery,
  useGetPlanetaryPositionQuery,
} from "@/queries/exploreQueries";
import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { timeZone } from "@/utils/timezone-utils";
import BirthDetails from "./components/BirthDetails";
import NavamsaChart from "./components/NavamsaChart";
import PanchangDetails from "./components/PanchangDetails";
import PlanetaryPositionsCard from "./components/PlanetaryPositionsCard";

const FreeKundli = () => {
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const birthDate = `${userData?.date_of_birth}T${userData?.birth_time}Z`;

  const { data: location, isLoading: isLocationLoading } =
    useGetCurrentLocationQuery();

  const { data: panchangData, isLoading: isPanchangLoading } =
    useGetPanchangDetailsQuery({
      datetime: birthDate,
      coordinates: `${location?.latitude}, ${location?.longitude}`,
      ayanamsa: 1,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

  const { data: planetaryData, isLoading: isPlanetaryLoading } =
    useGetPlanetaryPositionQuery({
      dob: birthDate,
      lat: location?.latitude ?? 0,
      lon: location?.longitude ?? 0,
      tz: timeZone,
    });

  const isLoading = isPanchangLoading || isUserLoading || isPlanetaryLoading || isLocationLoading;

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header title="Free Kundli" showBackButton />
      <BodyLayout>
        <div className="pt-6">
          <Banner
            title="Free Kundli"
            bgImage={BannerImage}
            rightImage={RightImage}
          />
        </div>
        <PlanetaryPositionsCard data={planetaryData} />
        <NavamsaChart userDetails={userData} birthDate={birthDate} />
        <BirthDetails data={userData} panchangData={panchangData} />
        <PanchangDetails data={panchangData} birthDate={birthDate} />
      </BodyLayout>
    </>
  );
};

export default FreeKundli;
