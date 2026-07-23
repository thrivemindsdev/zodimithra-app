import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("app-unauthorized", handleSignOut);
    return () => window.removeEventListener("app-unauthorized", handleSignOut);
  }, [navigate]);

  return <Outlet />;
}