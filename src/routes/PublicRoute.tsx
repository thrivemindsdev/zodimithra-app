import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to={"/home"} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PublicRoute;
