import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.zodimithra.app",
  appName: "ZodiMithra",
  webDir: "dist",
  server: {
    // url: "http://10.234.162.172:5172",
    // url: "http://192.168.20.107:5172",
    url: "http://192.168.37.33:5172",
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
