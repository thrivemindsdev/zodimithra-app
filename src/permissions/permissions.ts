import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Capacitor.isNativePlatform()) {
      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location === "granted") {
        return true;
      }

      // Request permission if not already granted
      const requestStatus = await Geolocation.requestPermissions();
      return requestStatus.location === "granted";
    }

    return false;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};
