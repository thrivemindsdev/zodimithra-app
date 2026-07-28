import { AppLauncher } from "@capacitor/app-launcher";
import { ENV } from "../config/env";

export const openAppStore = async (): Promise<void> => {
  let storeUrl = "";
  let nativeUrl = "";

  if (ENV.IS_IOS) {
    // iOS App Store URL formats
    storeUrl = `https://apps.apple.com/app/id${ENV.IOS_APP_ID}`;
    nativeUrl = `itms-apps://apps.apple.com/app/id${ENV.IOS_APP_ID}`;
  } else {
    // Android Google Play URL formats
    storeUrl = `https://play.google.com/store/apps/details?id=${ENV.ANDROID_PACKAGE_NAME}`;
    nativeUrl = `market://details?id=${ENV.ANDROID_PACKAGE_NAME}`;
  }

  try {
    // Try opening native store scheme (itms-apps:// or market://)
    const { value: canOpen } = await AppLauncher.canOpenUrl({ url: nativeUrl });
    if (canOpen) {
      await AppLauncher.openUrl({ url: nativeUrl });
      return;
    }

    // Fallback to https:// store page
    await AppLauncher.openUrl({ url: storeUrl });
  } catch (error) {
    console.error("Error opening App Store:", error);
    window.open(storeUrl, "_blank");
  }
};
