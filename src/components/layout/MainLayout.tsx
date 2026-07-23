import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const SHOW_BOTTOM_NAV_PATHS = [
  "/home",
  "/calendar",
  "/astrology",
  "/explore",
  "/wellbeing",
];

const MainLayout = () => {
  const location = useLocation();
  const showBottomNav = SHOW_BOTTOM_NAV_PATHS.some(
    (p) => location.pathname === p,
  );
  return (
    <section className="bg-white">
      <main className="p-4 overflow-hidden h-screen">
        <Outlet />
      </main>
      {showBottomNav && (
        <footer className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </footer>
      )}
    </section>
  );
};

export default MainLayout;
