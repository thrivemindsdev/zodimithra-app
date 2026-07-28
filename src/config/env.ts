import { Capacitor } from "@capacitor/core";

export const ENV = {
  IS_IOS: Capacitor.getPlatform() === "ios",
  IS_ANDROID: Capacitor.getPlatform() === "android",

  // Platform-specific versions
  TARGET_VERSION:
    Capacitor.getPlatform() === "ios"
      ? import.meta.env.VITE_IOS_APP_VERSION
      : import.meta.env.VITE_ANDROID_APP_VERSION,

  TARGET_BUILD:
    Capacitor.getPlatform() === "ios"
      ? import.meta.env.VITE_IOS_APP_BUILD_VERSION
      : import.meta.env.VITE_ANDROID_APP_BUILD_VERSION,

  // Identifiers
  ANDROID_PACKAGE_NAME: import.meta.env.VITE_ANDROID_PACKAGE_NAME,
  IOS_APP_ID: import.meta.env.VITE_IOS_APP_ID,
} as const;
