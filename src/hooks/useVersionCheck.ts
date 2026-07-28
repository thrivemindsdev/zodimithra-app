import { App as NativeApp, type AppInfo } from "@capacitor/app";
import { useEffect, useState } from "react";
import { ENV } from "../config/env";

export interface UseVersionCheckResult {
  appInfo: AppInfo;
  isOutdated: boolean;
  isChecking: boolean;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const [appInfo, setAppInfo] = useState<AppInfo>({
    name: "ZodiMithra",
    id: ENV.IS_IOS ? ENV.IOS_APP_ID : ENV.ANDROID_PACKAGE_NAME,
    version: "0.0.0",
    build: "0",
  });

  const [isOutdated, setIsOutdated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const verifyVersion = async () => {
      try {
        // Reads native version & build info directly from iOS/Android native bundle
        const currentInfo = await NativeApp.getInfo();
        setAppInfo(currentInfo);

        // Compare installed native values against platform target values from ENV
        const versionMismatch = currentInfo.version !== ENV.TARGET_VERSION;
        const buildMismatch = currentInfo.build !== ENV.TARGET_BUILD;

        if (versionMismatch || buildMismatch) {
          setIsOutdated(true);
        }
      } catch (error) {
        console.warn(
          "Native environment not detected, using web fallback check:",
          error,
        );

        // Development / browser fallback check
        if ("0.0.0" !== ENV.TARGET_VERSION) {
          setIsOutdated(true);
        }
      } finally {
        setIsChecking(false);
      }
    };

    verifyVersion();
  }, []);

  return { appInfo, isOutdated, isChecking };
};
