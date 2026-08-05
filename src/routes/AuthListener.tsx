import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { PushNotificationToast } from "@/components/common/PushNotificationToast";
import { extractTargetRoute } from "@/services/pushNotification.service";

export default function AuthListener() {
  const navigate = useNavigate();
  const { lastNotification, clearLastNotification } = usePushNotifications();

  useEffect(() => {
    const handleSignOut = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("app-unauthorized", handleSignOut);
    return () => window.removeEventListener("app-unauthorized", handleSignOut);
  }, [navigate]);

  return (
    <>
      <PushNotificationToast
        notification={lastNotification}
        onClose={clearLastNotification}
        onClick={() => {
          const targetRoute = extractTargetRoute(lastNotification?.data);
          if (targetRoute) {
            if (targetRoute.startsWith("http://") || targetRoute.startsWith("https://")) {
              window.open(targetRoute, "_blank");
            } else {
              navigate(targetRoute);
            }
          }
          clearLastNotification();
        }}
      />
      <Outlet />
    </>
  );
}
