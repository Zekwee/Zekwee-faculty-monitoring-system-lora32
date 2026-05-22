import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g",
  authDomain: "faculty-monitoring-e00b7.firebaseapp.com",
  databaseURL: "https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "faculty-monitoring-e00b7"
};

// Use existing app if already initialized, otherwise create new one
const existingApps = getApps();
export const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
