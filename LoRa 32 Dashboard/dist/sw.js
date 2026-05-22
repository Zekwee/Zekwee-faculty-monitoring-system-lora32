
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
});

const messaging = firebase.messaging();

/* Background Push Notification */

messaging.onBackgroundMessage(function(payload) {

  const title = payload.notification?.title || "XUI Notification";

  const options = {
    body: payload.notification?.body || "New message received",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

/* =====================================
   PWA CACHE SYSTEM
===================================== */

const CACHE_NAME = "xui-cache-v4";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json"
];

/* ================= INSTALL ================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

/* ================= ACTIVATE ================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* ================= FETCH ================= */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  /* Navigation fallback */

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  /* Static caching */

  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
