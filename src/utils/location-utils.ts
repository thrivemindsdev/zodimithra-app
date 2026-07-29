import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export interface LocationDetails {
  city: string;
  state: string;
  country: string;
  formatted: string;
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<LocationDetails | null> => {
  try {
    // Permission checks are native-only; skip them when running on Web
    if (Capacitor.isNativePlatform()) {
      let permissions = await Geolocation.checkPermissions();

      if (permissions.location !== "granted") {
        permissions = await Geolocation.requestPermissions();

        if (permissions.location !== "granted") {
          console.warn("Location permission denied.");
          return null;
        }
      }
    }

    // Get current position (works on iOS, Android, and Web)
    const { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 3600000,
    });

    const { latitude, longitude } = coords;

    // Reverse geocode
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    const city = data.city || data.locality || "";
    const state = data.principalSubdivision || "";
    const country = data.countryName || "";

    const placeName = city || state || "Unknown location";

    return {
      city,
      state,
      country,
      formatted: `${placeName}${country ? `, ${country}` : ""}`,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
