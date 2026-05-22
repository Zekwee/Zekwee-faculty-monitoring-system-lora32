
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./config";

const messaging = getMessaging(app);

export async function initPush() {

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Notification permission denied");
    return;
  }
const registration = await navigator.serviceWorker.register("/sw.js");
  const token = await getToken(messaging, {
    vapidKey: "your_vapid_key",
    serviceWorkerRegistration: registration
  });

  console.log("FCM TOKEN:", token);

}

export function listenPush() {

  onMessage(messaging, (payload) => {
    console.log("Foreground notification:", payload);

    alert(payload.notification?.title);
  });

}
