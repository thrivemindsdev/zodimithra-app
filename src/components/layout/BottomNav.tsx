// import AstrologyIcon from "@/assets/bottom-tabs/astrology.png";
import WaveIcon from "@/assets/bottom-tabs/bend-icon.png";
import CalendarIcon from "@/assets/bottom-tabs/calendar.png";
import ExploreIcon from "@/assets/bottom-tabs/explore.png";
import HomeIcon from "@/assets/bottom-tabs/home.png";
import WellbeingIcon from "@/assets/bottom-tabs/wellbeing.png";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { memo, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    path: "/home",
    label: "Home",
    icon: HomeIcon,
    premiumScreen: false,
  },
  {
    path: "/calendar",
    label: "Calendar",
    icon: CalendarIcon,
    premiumScreen: true,
  },
  // {
  //   path: "/astrology",
  //   label: "Astrology",
  //   icon: AstrologyIcon,
  //   premiumScreen: false,
  // },
  {
    path: "/explore",
    label: "Explore",
    icon: ExploreIcon,
    premiumScreen: false,
  },
  {
    path: "/wellbeing",
    label: "WellBeing",
    icon: WellbeingIcon,
    premiumScreen: false,
  },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { data: userDetails } = useGetUserDetailsQuery();
  const isPremium = userDetails?.is_subscribed;

  const activeIndex = useMemo(
    () => NAV_ITEMS.findIndex((item) => item.path === pathname),
    [pathname],
  );

  return (
    <div className="bg-primary h-18 px-4">
      <ul className="relative flex justify-between items-center h-full">
        {/* Active Circle */}
        {activeIndex >= 0 && (
          <img
            src={WaveIcon}
            className="absolute top-0 h-7.5 w-30 bg-primary transition-all duration-500"
            style={{
              left: `calc(${(activeIndex * 100) / NAV_ITEMS.length}% + ${
                50 / NAV_ITEMS.length
              }% - 60px)`,
            }}
          />
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.premiumScreen && !isPremium;

          return (
            <li key={item.path} className="flex-1">
              <Link
                to={isLocked ? "/premium" : item.path}
                className="flex w-full flex-col items-center justify-center"
              >
                <span
                  className={`transition-all duration-500 flex justify-center items-center  ${
                    isActive
                      ? "-translate-y-6 rounded-full bg-primary w-12 h-12"
                      : "-translate-y-1"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-6 w-6"
                    style={{
                      filter: isLocked
                        ? "grayscale(100%) brightness(0.6)"
                        : "none",
                    }}
                  />
                </span>

                <span
                  className={`text-[9px] font-body-content font-light uppercase transition-all duration-500 ${
                    isActive
                      ? "-translate-y-3 opacity-100"
                      : "translate-y-0 opacity-100"
                  } ${isLocked ? "text-gray-400" : "text-white"}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(BottomNav);
