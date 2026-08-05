// Firebase Messaging Service Worker for Web Push Notifications

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize Firebase App in Service Worker using URL search parameters or default config
const urlParams = new URLSearchParams(location.search);

const firebaseConfig = {
  apiKey: urlParams.get("apiKey") || "",
  authDomain: urlParams.get("authDomain") || "",
  projectId: urlParams.get("projectId") || "",
  storageBucket: urlParams.get("storageBucket") || "",
  messagingSenderId: urlParams.get("messagingSenderId") || "",
  appId: urlParams.get("appId") || "",
};

// Only initialize if we have a valid projectId (or fallback to window object if injected)
if (firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message: ", payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || "ZodiMithra";
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || "",
      icon: payload.notification?.icon || payload.data?.icon || "/ic_launcher_foreground.png",
      image: payload.notification?.image || payload.data?.image || undefined,
      badge: "/ic_launcher_foreground.png",
      data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click event in Web background
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const rawTarget =
    data.target ||
    data.url ||
    data.route ||
    data.path ||
    data.deep_link ||
    data.link ||
    data.page ||
    data.screen;

  let urlToOpen = "/";
  if (rawTarget && typeof rawTarget === "string") {
    const target = rawTarget.trim();
    if (target.startsWith("http://") || target.startsWith("https://")) {
      urlToOpen = target;
    } else {
      urlToOpen = target.startsWith("/") ? target : "/" + target;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.endsWith(urlToOpen) && "focus" in client) {
          if ("navigate" in client) {
            client.navigate(urlToOpen);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
