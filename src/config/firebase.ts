import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, type Messaging } from "firebase/messaging";

// Firebase Configuration loaded from environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "";

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase web app instance safely
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!firebaseConfig.projectId) {
    console.warn("[Firebase] Firebase config is incomplete. Please check VITE_FIREBASE_* variables in .env");
    return null;
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
};

/**
 * Get Firebase Messaging instance for Web (checks browser support)
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  const isMessagingSupported = await isSupported();
  if (!isMessagingSupported) {
    console.warn("[Firebase] Messaging is not supported in this browser environment.");
    return null;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  if (!messaging) {
    messaging = getMessaging(firebaseApp);
  }
  return messaging;
};

/**
 * Register web service worker and obtain FCM Token for Web platform
 */
export const getWebFcmToken = async (): Promise<string | null> => {
  try {
    const fcmMessaging = await getFirebaseMessaging();
    if (!fcmMessaging) return null;

    const trimmedVapidKey = VAPID_KEY.trim();
    if (!trimmedVapidKey) {
      console.warn("[Firebase] VAPID Key is missing (VITE_FIREBASE_VAPID_KEY). Web push token generation may fail.");
    }

    let registration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      const swParams = new URLSearchParams(firebaseConfig).toString();
      const swUrl = `/firebase-messaging-sw.js?${swParams}`;
      registration = await navigator.serviceWorker.register(swUrl);
      await navigator.serviceWorker.ready;
    }

    const token = await getToken(fcmMessaging, {
      vapidKey: trimmedVapidKey || undefined,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("[Firebase] Web FCM Token successfully generated:", token);
      return token;
    } else {
      console.warn("[Firebase] No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("[Firebase] Error retrieving Web FCM token:", error);
    return null;
  }
};

/**
 * Subscribe to web foreground messages
 */
export const subscribeToWebMessages = async (
  onMessageReceived: (payload: any) => void
): Promise<(() => void) | null> => {
  try {
    const fcmMessaging = await getFirebaseMessaging();
    if (!fcmMessaging) return null;

    const unsubscribe = onMessage(fcmMessaging, (payload) => {
      console.log("[Firebase] Foreground Web Message received:", payload);
      onMessageReceived(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error("[Firebase] Error subscribing to web messages:", error);
    return null;
  }
};
