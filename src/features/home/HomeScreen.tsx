import type { TabId } from "@/components/common/DurationTabs";
import BodyLayout from "@/components/layout/BodyLayout";
import { useHardwareBack } from "@/hooks/useHardwareBack";
import { requestLocationPermission } from "@/permissions/permissions";
import { useHoroscopeQuery, useLuckyDetailsQuery } from "@/queries/homeQueries";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { useActiveUserStore } from "@/store/useActiveUserStore";
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

  const [activeTab, setActiveTab] = useState<TabId>("daily");

  useEffect(() => {
    requestLocationPermission().catch(console.error);
  }, []);

  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const { activeUser } = useActiveUserStore();

  const currentUser = activeUser ?? userData;

  const zodiacSign = currentUser?.zodiac_sign;
  const isPremium = userData?.is_subscribed;

  const { data: horoscopeData, isLoading: isHoroscopeLoading } =
    useHoroscopeQuery({
      sign: zodiacSign,
      period: activeTab,
      lang: "en",
    });

  const dob = currentUser?.date_of_birth
    ? `${currentUser.date_of_birth} ${currentUser.birth_time ?? ""}`.trim()
    : "";

  const { data: luckyData, isLoading: isLuckyLoading } = useLuckyDetailsQuery({
    dob,
    lat: currentUser?.latitude ?? 0,
    lon: currentUser?.longitude ?? 0,
    tz: timeZone,
    isUserLoading,
  });

  return (
    <>
      <HomeHeader loading={isUserLoading} data={userData} />
      <BodyLayout className="-mx-4 overflow-x-hidden w-screen">
        <HomeGreetings loading={isUserLoading} data={currentUser} />
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
          <LuckyInfo loading={isLuckyLoading} data={luckyData} />
          <HomeServices isPremium={isPremium} />
        </div>
      </BodyLayout>
    </>
  );
};

export default HomeScreen;
