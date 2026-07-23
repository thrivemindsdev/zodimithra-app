
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { Camera } from "@capacitor/camera";

export const requestCamera = async () => {
  if (Capacitor.getPlatform() === "web") {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    stream.getTracks().forEach((track) => track.stop());

    return {
      camera: "granted",
    };
  }

  return await Camera.requestPermissions({
    permissions: ["camera"],
  });
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    // Check current permission status
    const permissionStatus = await Geolocation.checkPermissions();

    if (permissionStatus.location === "granted") {
      return true;
    }

    // Request permission if not already granted
    const requestStatus = await Geolocation.requestPermissions();

    if (requestStatus.location === "granted") {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

