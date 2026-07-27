import type { TabId } from "@/components/common/DurationTabs";
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
import HomeTools from "./components/HomeTools";
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

  const [activeTab, setActiveTab] = useState<TabId>("daily");

  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;
  const { data: horoscopeData, isLoading: isHoroscopeLoading } =
    useHoroscopeQuery({
      sign: userData?.zodiac_sign,
      period: activeTab,
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

  return (
    <>
      <HomeHeader loading={isUserLoading} data={userData} />
      <BodyLayout className="-mx-4 w-screen">
        <div className="pt-4">
          <HomeGreetings loading={isUserLoading} data={userData} />
        </div>
        <div className="px-4">
          <HoroScope
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={isHoroscopeLoading}
            data={horoscopeData}
            isPremium={isPremium}
          />
        </div>
        <HomeCalendar isPremium={isPremium} />
        <div className="px-4">
          <DailyMantras />
          <HomeTools />
          <LuckyInfo loading={isLuckyLoading} data={LuckyData} />
          <HomeServices isPremium={isPremium} />
          {/* <AstroVlogCard /> */}
        </div>
      </BodyLayout>
    </>
  );
};

export default HomeScreen;
