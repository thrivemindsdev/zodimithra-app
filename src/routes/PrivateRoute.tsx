import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
