import { useEffect, useState, useCallback } from "react";
import { pushNotificationService, extractTargetRoute, type NotificationPayload } from "@/services/pushNotification.service";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export interface UsePushNotificationsReturn {
  token: string | null;
  permissionStatus: string;
  lastNotification: NotificationPayload | null;
  requestPermission: () => Promise<boolean>;
  clearLastNotification: () => void;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const [token, setToken] = useState<string | null>(pushNotificationService.getToken());
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");
  const [lastNotification, setLastNotification] = useState<NotificationPayload | null>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  // Check initial permissions
  useEffect(() => {
    pushNotificationService.checkPermissions().then(setPermissionStatus);
  }, []);

  // Initialize push notification registration when user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;

    pushNotificationService.init().then((fcmToken) => {
      if (isMounted && fcmToken) {
        setToken(fcmToken);
      }
    });

    // Listen for foreground notifications
    const unsubReceived = pushNotificationService.onNotificationReceived((notification) => {
      console.log("[usePushNotifications] Notification received in hook:", notification);
      if (isMounted) {
        setLastNotification(notification);
      }
    });

    // Listen for notification tap actions (navigation support)
    const unsubTapped = pushNotificationService.onNotificationTapped((action) => {
      console.log("[usePushNotifications] Notification action in hook:", action);
      const targetRoute = extractTargetRoute(action.notification.data);
      if (targetRoute) {
        if (targetRoute.startsWith("http://") || targetRoute.startsWith("https://")) {
          window.open(targetRoute, "_blank");
        } else {
          navigate(targetRoute);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubReceived();
      unsubTapped();
    };
  }, [isLoggedIn, navigate]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await pushNotificationService.requestPermissions();
    const status = await pushNotificationService.checkPermissions();
    setPermissionStatus(status);

    if (granted) {
      const fcmToken = await pushNotificationService.init();
      if (fcmToken) {
        setToken(fcmToken);
      }
    }
    return granted;
  }, []);

  const clearLastNotification = useCallback(() => {
    setLastNotification(null);
  }, []);

  return {
    token,
    permissionStatus,
    lastNotification,
    requestPermission,
    clearLastNotification,
  };
};
