import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (token && isLoggedIn) {
    return <Navigate to={"/home"} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PublicRoute;
