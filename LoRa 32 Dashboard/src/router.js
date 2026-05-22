import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Registration from "./pages/Registration.js";
import AdminPanel from "./pages/AdminPanel.js";
import { getAuthState } from "./firebase/authService.js";

const routes = {
  "/": Home,
  "/dashboard": Dashboard,        // Public access
  "/login": Login,                // Public access
  "/registration": Registration,  // Protected (admin only)
  "/admin": AdminPanel            // Protected (admin only)
};

// Protected routes requiring admin authentication
const protectedRoutes = ["/registration", "/admin"];

function NotFound() {
  return `
    <div class="p-6 text-center">
      <h2 class="text-xl font-bold">404 - Page Not Found</h2>
      <p class="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
      <a href="#/" class="mt-4 inline-block text-blue-600 hover:underline">Go to Home</a>
    </div>
  `;
}

export function router() {
  let path = location.hash.slice(1) || "/";
  if (!path.startsWith("/")) path = "/" + path;
  
  // Check if route is protected
  if (protectedRoutes.includes(path)) {
    const authState = getAuthState();
    
    // Redirect to login if not authenticated or not admin
    if (!authState.isAuthenticated || !authState.isAdmin) {
      location.hash = "#/login";
      return Login();
    }
  }
  
  return (routes[path] || NotFound)();
}

export function initRouter(render) {
  const update = () => {
    // Reset dashboard subscription state when navigating away
    const currentPath = location.hash.slice(1) || "/";
    if (!currentPath.startsWith("/dashboard")) {
      // Clean up dashboard state when leaving
      if (window.dashboardCleanup) {
        window.dashboardCleanup();
        window.dashboardCleanup = null;
      }
      window.triggerDashboardRender = null;
    } else {
      // Set up dashboard render trigger
      window.triggerDashboardRender = () => {
        render(router());
      };
    }
    render(router());
  };
  window.addEventListener("hashchange", update);
  update();
}
