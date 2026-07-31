import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.zodimithra.main",
  appName: "ZodiMithra",
  webDir: "dist",
  server: {
    url: "https://customer.zodimithra.com",
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"],
    },
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#FFFFFF",
    },
  },
};

export default config;
