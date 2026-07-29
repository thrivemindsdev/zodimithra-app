import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalLoader from "@/components/common/GlobalLoader";
import MainLayout from "@/components/layout/MainLayout";
// Import SplashScreen statically so it loads immediately without triggering Suspense
import SplashScreen from "@/features/splash-screen/SplashScreen";

import AuthListener from "./AuthListener";
import OnboardingRoute from "./OnboardingRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Lazy-loaded components to improve startup speed and split bundles
const BirthDetailsForm = lazy(() => import("@/features/auth/BirthDetailsForm"));
const LanguageScreen = lazy(() => import("@/features/auth/LanguagesScreen"));
const LoginScreen = lazy(() => import("@/features/auth/LoginScreen"));
const OtpScreen = lazy(() => import("@/features/auth/OtpScreen"));

const FamilyMembersScreen = lazy(() => import("@/components/ui/FamilyMembers"));
const AshramsScreen = lazy(() => import("@/features/ashrams/AshramsScreen"));
const AshramaDetails = lazy(
  () => import("@/features/ashrams/components/AshramDetails"),
);
const AshramaLive = lazy(
  () => import("@/features/ashrams/components/AshramLive"),
);
const AstrologerScreen = lazy(
  () => import("@/features/astrologer/AstrologerScreen"),
);
const CalendarScreen = lazy(() => import("@/features/calendar/CalendarScreen"));
const ShubhDinFinder = lazy(
  () => import("@/features/calendar/components/ShubhDinFinder"),
);
const ExploreScreen = lazy(() => import("@/features/explore/ExploreScreen"));
const FreeKundliScreen = lazy(
  () => import("@/features/explore/pages/free-kundli/FreeKundli"),
);
const GemStoneScreen = lazy(
  () => import("@/features/explore/pages/gem-stone/GemStone"),
);
const KundliMatchScreen = lazy(
  () => import("@/features/explore/pages/kundli-match/KundliMatch"),
);
const MangalDoshScreen = lazy(
  () => import("@/features/explore/pages/mangal-dosh/MangalDoshScreen"),
);
const Numerology = lazy(
  () => import("@/features/explore/pages/numerology/Numerology"),
);
const PanchangScreen = lazy(
  () => import("@/features/explore/pages/panchang/Panchang"),
);
const TarotReading = lazy(
  () => import("@/features/explore/pages/tarot-reading/TarotReading"),
);
const VastuCompassScreen = lazy(
  () => import("@/features/explore/pages/vastu-compass/VastuCompass"),
);
const HomeScreen = lazy(() => import("@/features/home/HomeScreen"));
const NotFoundPage = lazy(() => import("@/features/notfound/NotFoundPage"));
const PremiumScreen = lazy(() => import("@/features/premium/PremiumScreen"));
const EditProfile = lazy(() => import("@/features/profile/EditProfile"));
const ProfileScreen = lazy(() => import("@/features/profile/ProfileScreen"));
const WellBeingScreen = lazy(
  () => import("@/features/well-being/WellBeingScreen"),
);
const MantrasScreen = lazy(
  () => import("@/features/well-being/Mantras"),
);
const KundliMatchResult = lazy(
  () =>
    import("@/features/explore/pages/kundli-match/components/KundliMatchResult"),
);
const MangalDoshResult = lazy(
  () =>
    import("@/features/explore/pages/mangal-dosh/components/MangalDoshResult"),
);
const NumerologyResult = lazy(
  () =>
    import("@/features/explore/pages/numerology/components/NumerologyResult"),
);
const TarotCards = lazy(
  () => import("@/features/explore/pages/tarot-reading/components/TarotCards"),
);
const YesOrNo = lazy(
  () => import("@/features/explore/pages/tarot-reading/components/YesOrNo"),
);
const YesOrNoResult = lazy(
  () =>
    import("@/features/explore/pages/tarot-reading/components/YesOrNoResult"),
);
const GemStoneResult = lazy(
  () => import("@/features/explore/pages/gem-stone/components/GemStoneResult"),
);
const ComingSoonScreen = lazy(() => import("@/components/common/ComingSoon"));

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoader />}>
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
              <Route
                path="/birth-details-form"
                element={<BirthDetailsForm />}
              />
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
                <Route path="/mantras" element={<MantrasScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/premium" element={<PremiumScreen />} />
                <Route
                  path="/family-members"
                  element={<FamilyMembersScreen />}
                />
                <Route path="/gemstone" element={<GemStoneScreen />} />
                <Route path="/gemstone-result" element={<GemStoneResult />} />
                <Route path="/panchang" element={<PanchangScreen />} />
                <Route path="/vastu-compass" element={<VastuCompassScreen />} />
                <Route path="/kundli-match" element={<KundliMatchScreen />} />
                <Route
                  path="/kundli-match-result"
                  element={<KundliMatchResult />}
                />
                <Route path="/free-kundli" element={<FreeKundliScreen />} />
                <Route path="/mangal-dosh" element={<MangalDoshScreen />} />
                <Route
                  path="/mangal-dosh-result"
                  element={<MangalDoshResult />}
                />
                <Route path="/shubdin-finder" element={<ShubhDinFinder />} />
                <Route path="/numerology" element={<Numerology />} />
                <Route
                  path="/numerology-result"
                  element={<NumerologyResult />}
                />
                <Route path="/tarot-reading" element={<TarotReading />} />
                <Route path="/tarot-cards/:id" element={<TarotCards />} />
                <Route path="/tarot-yes-or-no" element={<YesOrNo />} />
                <Route
                  path="/tarot-yes-or-no-result"
                  element={<YesOrNoResult />}
                />
                <Route path="/ashrams" element={<AshramsScreen />} />
                <Route path="/ashram/:id" element={<AshramaDetails />} />
                <Route path="/ashram-live/:id" element={<AshramaLive />} />
                <Route path="/coming-soon" element={<ComingSoonScreen />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
