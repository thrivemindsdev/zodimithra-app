import { getWebFcmToken, subscribeToWebMessages } from "@/config/firebase";
import { SaveFcmTokenApi } from "@/services/user.api";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, type ActionPerformed, type PermissionStatus, type PushNotificationSchema } from "@capacitor/push-notifications";

export interface NotificationPayload {
  id?: string;
  title?: string;
  body?: string;
  image?: string;
  data?: Record<string, any>;
}

export type NotificationCallback = (notification: NotificationPayload) => void;
export type ActionCallback = (action: ActionPerformed) => void;

/**
 * Extracts and formats the target navigation route from notification payload data.
 * Handles targets like "home", "/home", "type: deep_link", "url", "route", "path", etc.
 */
export function extractTargetRoute(data?: Record<string, any>): string | null {
  if (!data || typeof data !== "object") return null;

  const rawTarget =
    data.target ||
    data.url ||
    data.route ||
    data.path ||
    data.deep_link ||
    data.link ||
    data.page ||
    data.screen;

  if (!rawTarget || typeof rawTarget !== "string") return null;

  const target = rawTarget.trim();
  if (!target) return null;

  if (target.startsWith("http://") || target.startsWith("https://")) {
    return target;
  }

  return target.startsWith("/") ? target : `/${target}`;
}

class PushNotificationService {
  private token: string | null = null;
  private onNotificationReceivedCallbacks: NotificationCallback[] = [];
  private onNotificationActionCallbacks: ActionCallback[] = [];
  private isInitialized = false;
  private pendingAction: ActionPerformed | null = null;

  /**
   * Check current push notification permission status
   */
  public async checkPermissions(): Promise<string> {
    if (Capacitor.isNativePlatform()) {
      try {
        const status: PermissionStatus = await PushNotifications.checkPermissions();
        return status.receive;
      } catch (error) {
        console.error("[PushService] Error checking native permissions:", error);
        return "prompt";
      }
    } else {
      if (!("Notification" in window)) {
        return "denied";
      }
      return Notification.permission;
    }
  }

  /**
   * Request push notification permission from the user
   */
  public async requestPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const result: PermissionStatus = await PushNotifications.requestPermissions();
        return result.receive === "granted";
      } catch (error) {
        console.error("[PushService] Error requesting native permissions:", error);
        return false;
      }
    } else {
      if (!("Notification" in window)) {
        console.warn("[PushService] Web Notifications not supported in this browser.");
        return false;
      }
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
  }

  /**
   * Initialize Android Notification Channel (Required for Android 8+)
   */
  private async createAndroidNotificationChannel(): Promise<void> {
    if (Capacitor.getPlatform() === "android") {
      try {
        await PushNotifications.createChannel({
          id: "default",
          name: "Default Notifications",
          description: "General app notifications and alerts",
          importance: 5, // High importance (shows heads-up notification and plays sound)
          visibility: 1, // Public visibility
          sound: "droplets",
          vibration: true,
          lights: true,
          lightColor: "#FF6B00",
        });
        console.log("[PushService] Android notification channel created.");
      } catch (error) {
        console.error("[PushService] Failed to create Android notification channel:", error);
      }
    }
  }

  /**
   * Initialize and register push notifications for current platform
   */
  public async init(): Promise<string | null> {
    if (this.isInitialized && this.token) {
      return this.token;
    }

    const platform = Capacitor.getPlatform();
    console.log(`[PushService] Initializing Push Notifications for platform: ${platform}`);

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn("[PushService] Push Notification permission not granted.");
      return null;
    }

    if (Capacitor.isNativePlatform()) {
      await this.createAndroidNotificationChannel();
      return this.initNativePush();
    } else {
      return this.initWebPush();
    }
  }

  /**
   * Native (Android/iOS) Push Notification setup
   */
  private async initNativePush(): Promise<string | null> {
    return new Promise((resolve) => {
      // Remove any previously attached listeners to prevent duplicates
      PushNotifications.removeAllListeners();

      // Listener: Registration Success -> FCM Token received
      PushNotifications.addListener("registration", async (tokenData) => {
        const fcmToken = tokenData.value;
        console.log("[PushService] Native FCM Token registered:", fcmToken);
        this.token = fcmToken;
        this.isInitialized = true;

        // Save token to backend API
        await SaveFcmTokenApi(fcmToken, Capacitor.getPlatform());
        resolve(fcmToken);
      });

      // Listener: Registration Error
      PushNotifications.addListener("registrationError", (err) => {
        console.error("[PushService] Native registration error:", err.error);
        resolve(null);
      });

      // Listener: Push notification received while app is in foreground
      PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
        console.log("[PushService] Native foreground push notification received:", notification);
        const payload: NotificationPayload = {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        };

        this.onNotificationReceivedCallbacks.forEach((cb) => cb(payload));
      });

      // Listener: User tapped on notification
      PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
        console.log("[PushService] Native notification tapped:", action);
        if (this.onNotificationActionCallbacks.length > 0) {
          this.onNotificationActionCallbacks.forEach((cb) => cb(action));
        } else {
          this.pendingAction = action;
        }
      });

      // Trigger native registration with APNs / FCM
      PushNotifications.register().catch((err) => {
        console.error("[PushService] Error calling PushNotifications.register():", err);
        resolve(null);
      });
    });
  }

  /**
   * Web FCM Push Notification setup
   */
  private async initWebPush(): Promise<string | null> {
    try {
      const fcmToken = await getWebFcmToken();
      if (!fcmToken) {
        console.warn("[PushService] Web FCM Token registration returned null.");
        return null;
      }

      this.token = fcmToken;
      this.isInitialized = true;

      // Save token to backend API
      await SaveFcmTokenApi(fcmToken, "web");

      // Subscribe to foreground Web push messages
      await subscribeToWebMessages((payload) => {
        const notif: NotificationPayload = {
          title: payload.notification?.title || payload.data?.title,
          body: payload.notification?.body || payload.data?.body,
          image: payload.notification?.image || payload.data?.image,
          data: payload.data,
        };

        // Play custom notification sound on foreground web push
        try {
          const audio = new Audio("/droplets.wav");
          audio.play().catch((e) => console.warn("[PushService] Could not play notification audio:", e));
        } catch (err) {
          console.warn("[PushService] Audio playback error:", err);
        }

        this.onNotificationReceivedCallbacks.forEach((cb) => cb(notif));
      });

      return fcmToken;
    } catch (error) {
      console.error("[PushService] Error during Web Push initialization:", error);
      return null;
    }
  }

  /**
   * Subscribe to incoming foreground notifications
   */
  public onNotificationReceived(callback: NotificationCallback): () => void {
    this.onNotificationReceivedCallbacks.push(callback);
    return () => {
      this.onNotificationReceivedCallbacks = this.onNotificationReceivedCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Subscribe to notification click/tap actions
   */
  public onNotificationTapped(callback: ActionCallback): () => void {
    this.onNotificationActionCallbacks.push(callback);

    if (this.pendingAction) {
      const actionToDeliver = this.pendingAction;
      this.pendingAction = null;
      setTimeout(() => {
        callback(actionToDeliver);
      }, 0);
    }

    return () => {
      this.onNotificationActionCallbacks = this.onNotificationActionCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Get cached token
   */
  public getToken(): string | null {
    return this.token;
  }
}

export const pushNotificationService = new PushNotificationService();
