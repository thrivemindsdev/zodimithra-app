import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const OnboardingRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);

  // Must be logged in to access onboarding
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If already onboarded, send them to home
  if (hasOnboarded) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default OnboardingRoute;