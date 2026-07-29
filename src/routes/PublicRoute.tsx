import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);

  if (token) {
    // If authenticated, send them home if onboarded, or to onboarding if not
    const redirectPath = hasOnboarded ? "/home" : "/birth-details-form";
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PublicRoute;