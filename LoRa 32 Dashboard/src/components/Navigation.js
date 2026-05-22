import { getAuthState, logout, onAuthStateChange } from "../firebase/authService.js";
import { onMount } from "../core/hooks.js";

export default function Navigation() {
  const currentPath = location.hash.slice(1) || "/";
  const authState = getAuthState();

  // Define tabs based on auth state
  const publicTabs = [
    { path: "/dashboard", label: "Monitoring" }
  ];

  const adminTabs = [
    { path: "/dashboard", label: "Monitoring" },
    { path: "/registration", label: "Registration" },
    { path: "/admin", label: "Admin Panel" }
  ];

  const tabs = authState.isAuthenticated && authState.isAdmin ? adminTabs : publicTabs;

  onMount(() => {
    // Handle logout button click
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.onclick = async (e) => {
        e.preventDefault();
        await logout();
      };
    }

    // Subscribe to auth state changes to update navigation
    onAuthStateChange((state) => {
      // Re-render navigation when auth state changes
      const navContainer = document.getElementById("navigation-container");
      if (navContainer) {
        // Trigger a re-render by updating the hash
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    });
  });

  return `
    <nav id="navigation-container" class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0">
            <a href="#/" class="text-xl font-bold text-gray-900">
              Faculty Monitoring
            </a>
          </div>

          <!-- Navigation Tabs -->
          <div class="hidden md:flex space-x-4">
            ${tabs.map(tab => `
              <a
                href="#${tab.path}"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === tab.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }"
              >
                ${tab.label}
              </a>
            `).join('')}
          </div>

          <!-- Auth Button -->
          <div class="flex items-center">
            ${authState.isAuthenticated ? `
              <button
                id="logout-btn"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            ` : `
              <a
                href="#/login"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Login
              </a>
            `}
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden pb-4">
          <div class="flex flex-col space-y-2">
            ${tabs.map(tab => `
              <a
                href="#${tab.path}"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === tab.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }"
              >
                ${tab.label}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </nav>
  `;
}
