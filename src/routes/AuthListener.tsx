import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function AuthListener() {
  const navigate = useNavigate();
  usePushNotifications();

  useEffect(() => {
    const handleSignOut = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("app-unauthorized", handleSignOut);
    return () => window.removeEventListener("app-unauthorized", handleSignOut);
  }, [navigate]);

  return <Outlet />;
}
