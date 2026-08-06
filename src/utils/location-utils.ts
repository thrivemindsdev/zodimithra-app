import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityDetails {
  city: string;
  state: string;
  country: string;
  formatted: string;
}

export interface LocationDetails extends Coordinates, CityDetails {}

export const getCurrentCoordinates = async (): Promise<Coordinates | null> => {
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

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export const getCityName = async (
  latitude: number,
  longitude: number,
): Promise<CityDetails | null> => {
  try {
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
    };
  } catch (error) {
    console.error("Error fetching city name:", error);
    return null;
  }
};

export const getCurrentLocation = async (): Promise<LocationDetails | null> => {
  const coords = await getCurrentCoordinates();
  if (!coords) return null;

  const cityDetails = await getCityName(coords.latitude, coords.longitude);

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    city: cityDetails?.city || "",
    state: cityDetails?.state || "",
    country: cityDetails?.country || "",
    formatted: cityDetails?.formatted || "",
  };
};

