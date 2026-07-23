// import { lazy, Suspense } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import GlobalLoader from "@/components/common/GlobalLoader";
// import MainLayout from "@/components/layout/MainLayout";
// import AuthListener from "./AuthListener";
// import PrivateRoute from "./PrivateRoute";
// import PublicRoute from "./PublicRoute";
// import OnboardingRoute from "./OnboardingRoute"; // Import the new guard

// // Lazy-loaded components
// const SplashScreen = lazy(() => import("@/features/splashScreen/SplashScreen"));
// const LoginScreen = lazy(() => import("@/features/auth/LoginScreen"));
// const OtpScreen = lazy(() => import("@/features/auth/OtpScreen"));
// const LanguageScreen = lazy(() => import("@/features/auth/LanguagesScreen"));
// const BirthDetailsForm = lazy(() => import("@/features/auth/BirthDetailsForm"));

// const HomeScreen = lazy(() => import("@/features/home/HomeScreen"));
// const CalendarScreen = lazy(() => import("@/features/calendar/CalendarScreen"));
// const AstrologerScreen = lazy(
//   () => import("@/features/astrologer/AstrologerScreen"),
// );
// const ExploreScreen = lazy(() => import("@/features/explore/ExploreScreen"));
// const WellBeingScreen = lazy(
//   () => import("@/features/well-being/WellBeingScreen"),
// );
// const ProfileScreen = lazy(() => import("@/features/profile/ProfileScreen"));
// const FamilyMembersScreen = lazy(() => import("@/components/ui/FamilyMembers"));
// const GemStoneScreen = lazy(
//   () => import("@/features/explore/pages/gemstone/GemStone"),
// );
// const PanchangScreen = lazy(
//   () => import("@/features/explore/pages/panchang/Panchang"),
// );
// const VastuCompassScreen = lazy(
//   () => import("@/features/explore/pages/vastucompass/VastuCompass"),
// );
// const KundliMatchScreen = lazy(
//   () => import("@/features/explore/pages/kundlimatch/KundliMatch"),
// );
// const FreeKundliScreen = lazy(
//   () => import("@/features/explore/pages/freekundli/FreeKundli"),
// );
// const NotFoundPage = lazy(() => import("@/features/notfound/NotFoundPage"));

// export function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Suspense fallback={<GlobalLoader />}>
//         <Routes>
//           <Route element={<AuthListener />}>
//             {/* Splash Screen - Root Route (Accessible by EVERYONE) */}
//             <Route path="/" element={<SplashScreen />} />
//             <Route path="/splash" element={<SplashScreen />} />
//             {/* Unauthenticated Routes */}
//             <Route element={<PublicRoute />}>
//               <Route path="/login" element={<LoginScreen />} />
//               <Route path="/otp" element={<OtpScreen />} />
//             </Route>

//             {/* Authenticated but Pending Onboarding */}
//             <Route element={<OnboardingRoute />}>
//               <Route
//                 path="/birth-details-form"
//                 element={<BirthDetailsForm />}
//               />
//             </Route>

//             {/* Protected App Routes */}
//             <Route element={<PrivateRoute />}>
//               {/* Option A: Full-screen Language Selector (No layout wrappers) */}
//               <Route path="/languages" element={<LanguageScreen />} />

//               <Route element={<MainLayout />}>
//                 <Route path="/home" element={<HomeScreen />} />
//                 <Route path="/calendar" element={<CalendarScreen />} />
//                 <Route path="/astrologer" element={<AstrologerScreen />} />
//                 <Route path="/explore" element={<ExploreScreen />} />
//                 <Route path="/wellbeing" element={<WellBeingScreen />} />
//                 <Route path="/profile" element={<ProfileScreen />} />
//                 <Route
//                   path="/family-members"
//                   element={<FamilyMembersScreen />}
//                 />
//                 <Route path="/gemstone" element={<GemStoneScreen />} />
//                 <Route path="/panchang" element={<PanchangScreen />} />
//                 <Route path="/vastu-compass" element={<VastuCompassScreen />} />
//                 <Route path="/kundli-match" element={<KundliMatchScreen />} />
//                 <Route path="/free-kundli" element={<FreeKundliScreen />} />
//               </Route>
//             </Route>

//             {/* Fallback */}
//             <Route path="*" element={<NotFoundPage />} />
//           </Route>
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import AuthListener from "./AuthListener";
import OnboardingRoute from "./OnboardingRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Regular imports
import BirthDetailsForm from "@/features/auth/BirthDetailsForm";
import LanguageScreen from "@/features/auth/LanguagesScreen";
import LoginScreen from "@/features/auth/LoginScreen";
import OtpScreen from "@/features/auth/OtpScreen";
import SplashScreen from "@/features/splash-screen/SplashScreen";

import FamilyMembersScreen from "@/components/ui/FamilyMembers";
import AstrologerScreen from "@/features/astrologer/AstrologerScreen";
import CalendarScreen from "@/features/calendar/CalendarScreen";
import ExploreScreen from "@/features/explore/ExploreScreen";
import FreeKundliScreen from "@/features/explore/pages/free-kundli/FreeKundli";
import GemStoneScreen from "@/features/explore/pages/gem-stone/GemStone";
import KundliMatchScreen from "@/features/explore/pages/kundli-match/KundliMatch";
import PanchangScreen from "@/features/explore/pages/panchang/Panchang";
import VastuCompassScreen from "@/features/explore/pages/vastu-compass/VastuCompass";
import HomeScreen from "@/features/home/HomeScreen";
import NotFoundPage from "@/features/notfound/NotFoundPage";
import ProfileScreen from "@/features/profile/ProfileScreen";
import WellBeingScreen from "@/features/well-being/WellBeingScreen";
import EditProfile from "@/features/profile/EditProfile";
import PremiumScreen from "@/features/premium/PremiumScreen";
import ShubhDinFinder from "@/features/calendar/components/ShubhDinFinder";
import Numerology from "@/features/explore/pages/numerology/Numerology";
import TarotReading from "@/features/explore/pages/tarot-reading/TarotReading";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthListener />}>
          {/* Splash Screen - Root Route (Accessible by EVERYONE) */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/splash" element={<SplashScreen />} />

          {/* Unauthenticated Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/otp" element={<OtpScreen />} />
          </Route>

          {/* Authenticated but Pending Onboarding */}
          <Route element={<OnboardingRoute />}>
            <Route path="/birth-details-form" element={<BirthDetailsForm />} />
          </Route>

          {/* Protected App Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/languages" element={<LanguageScreen />} />

            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/calendar" element={<CalendarScreen />} />
              <Route path="/astrologer" element={<AstrologerScreen />} />
              <Route path="/explore" element={<ExploreScreen />} />
              <Route path="/wellbeing" element={<WellBeingScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/premium" element={<PremiumScreen />} />
              <Route path="/family-members" element={<FamilyMembersScreen />} />
              <Route path="/gemstone" element={<GemStoneScreen />} />
              <Route path="/panchang" element={<PanchangScreen />} />
              <Route path="/vastu-compass" element={<VastuCompassScreen />} />
              <Route path="/kundli-match" element={<KundliMatchScreen />} />
              <Route path="/free-kundli" element={<FreeKundliScreen />} />
              <Route path="/shubdin-finder" element={<ShubhDinFinder />} />
              <Route path="/numerology" element={<Numerology />} />
              <Route path="/tarot-reading" element={<TarotReading />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
