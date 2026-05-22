
export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service Worker registered");
      } catch (err) {
        console.error("SW registration failed:", err);
      }
    });
  }
}
