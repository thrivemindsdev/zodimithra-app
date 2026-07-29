import Logo from "@/assets/splash/SPLASHSCREEN-ZODI.gif";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        if (hasOnboarded) {
          navigate("/home", { replace: true });
        } else {
          navigate("/birth-details-form", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, token, hasOnboarded]);
  
  return (
    <section className="flex h-screen w-full items-center justify-center bg-[#6D1D12]">
      <img src={Logo} alt="Zodimithra Logo" loading="eager" />
    </section>
  );
};

export default SplashScreen;
