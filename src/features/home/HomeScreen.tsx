import GlobalLoader from "@/components/common/GlobalLoader";
import BodyLayout from "@/components/layout/BodyLayout";
import { useHardwareBack } from "@/hooks/useHardwareBack";
import { requestLocationPermission } from "@/permissions/permissions";
import { useHoroscopeQuery, useLuckyDetailsQuery } from "@/queries/homeQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { timeZone } from "@/utils/timezone-utils";
import { useEffect, useState } from "react";
import DailyMantras from "./components/DailyMantras";
import HomeCalendar from "./components/HomeCalendar";
import HomeGreetings from "./components/HomeGreetings";
import HomeHeader from "./components/HomeHeader";
import HomeServices from "./components/HomeServices";
import HomeTabs from "./components/HomeTabs";
import HoroScope from "./components/HoroScope";
import LuckyInfo from "./components/LuckyInfo";

const HomeScreen = () => {
  useHardwareBack({ route: "/home" });
  useEffect(() => {
    const fetchLocation = async () => {
      await requestLocationPermission();
    };

    fetchLocation();
  }, []);

  const [activeTab, setActiveTab] = useState<string>("you");

  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;
  const { data: horoscopeData, isLoading: isHoroscopeLoading } =
    useHoroscopeQuery({
      sign_key: userData?.zodiac_sign,
      lang: "en",
    });

  const dob = `${userData?.date_of_birth} ${userData?.birth_time}`;

  const { data: LuckyData, isLoading: isLuckyLoading } = useLuckyDetailsQuery({
    dob,
    lat: userData?.latitude ?? 0,
    lon: userData?.longitude ?? 0,
    tz: timeZone,
    isUserLoading,
  });

  const isLoading = isUserLoading || isHoroscopeLoading || isLuckyLoading;

  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <HomeHeader data={userData} />
      <BodyLayout>
        <HomeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "you" ? (
          <>
            <HomeGreetings data={userData} />
            <HoroScope data={horoscopeData} isPremium={isPremium} />
            <HomeCalendar />
            <LuckyInfo data={LuckyData} />
            <DailyMantras />
            <HomeServices />
          </>
        ) : null}
      </BodyLayout>
    </>
  );
};

export default HomeScreen;
