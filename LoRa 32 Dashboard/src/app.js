
import "./styles.css";
import { registerSW } from "./pwa.js";
import Layout from "./components/Layout.js";
import { router, initRouter } from "./router.js";
import { runMounts } from "./core/hooks.js";
import { initAuthService } from "./firebase/authService.js";

registerSW();

// Initialize auth service before router
initAuthService();

function render(content) {
  const start = performance.now();
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = Layout(content);
    runMounts();
  }
  const end = performance.now();
  const renderTime = (end - start).toFixed(2);
  const indicator = document.getElementById("render-time");
  if (indicator) {
    indicator.textContent = renderTime + " ms";
  }
}

initRouter(render);
