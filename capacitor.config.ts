import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.zodimithra.main",
  appName: "ZodiMithra",
  webDir: "dist",
  server: {
    // url: "https://customer.zodimithra.com/",
    url: "http://192.168.37.22:5172",
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"],
    },
    StatusBar: {
      overlaysWebView: true,
    },
  },
};

export default config;
