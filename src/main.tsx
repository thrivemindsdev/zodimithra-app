import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18";

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

async function initializeApp() {
  if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
    await StatusBar.setOverlaysWebView({
      overlay: false,
    });

    await StatusBar.setStyle({
      style: Style.Dark,
    });
  }

  
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
}

initializeApp();