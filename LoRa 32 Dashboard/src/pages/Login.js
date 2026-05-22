import { login, getAuthState, onAuthStateChange } from "../firebase/authService.js";
import { onMount } from "../core/hooks.js";
import { saveAdmin, getAdmins } from "../firebase/realtimeDb.js";

export default function Login() {
  onMount(async () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
    const loadingIndicator = document.getElementById("loading-indicator");
    const submitButton = document.getElementById("submit-button");
    const initAdminButton = document.getElementById("init-admin-button");
    const initAdminSection = document.getElementById("init-admin-section");

    // SECURITY CHECK: Hide "Initialize First Admin" button if admins already exist
    try {
      const admins = await getAdmins();
      if (admins.length > 0) {
        // Admins exist - hide the initialization section permanently
        if (initAdminSection) {
          initAdminSection.style.display = 'none';
        }
        console.log(`Security: ${admins.length} admin(s) found. Initialization button hidden.`);
      } else {
        // No admins exist - show initialization option
        console.log("Security: No admins found. Showing initialization button.");
      }
    } catch (error) {
      console.error("Security check error:", error);
      // On error, hide button to be safe
      if (initAdminSection) {
        initAdminSection.style.display = 'none';
      }
    }

    // Check if already authenticated
    const authState = getAuthState();
    if (authState.isAuthenticated) {
      location.hash = "#/dashboard";
      return;
    }

    // Subscribe to auth state changes
    onAuthStateChange((state) => {
      if (state.loading) {
        loadingIndicator.classList.remove("hidden");
        submitButton.disabled = true;
      } else {
        loadingIndicator.classList.add("hidden");
        submitButton.disabled = false;
      }

      if (state.error) {
        errorMessage.textContent = state.error;
        errorMessage.classList.remove("hidden");
      } else {
        errorMessage.classList.add("hidden");
      }

      if (state.isAuthenticated) {
        // Redirect to dashboard on successful login
        location.hash = "#/dashboard";
      }
    });

    // Handle form submission
    loginForm.onsubmit = async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Client-side validation
      if (!email) {
        errorMessage.textContent = "Please enter your email";
        errorMessage.classList.remove("hidden");
        return;
      }

      if (!password) {
        errorMessage.textContent = "Please enter your password";
        errorMessage.classList.remove("hidden");
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorMessage.textContent = "Please enter a valid email address";
        errorMessage.classList.remove("hidden");
        return;
      }

      // Clear error message
      errorMessage.classList.add("hidden");

      // Attempt login
      await login(email, password);
    };
    
    // Handle initialize admin button - Simple version without Firebase Auth
    if (initAdminButton) {
      initAdminButton.onclick = async () => {
        const confirmed = confirm(
          "This will create a default admin account:\\n\\n" +
          "Email: admin@faculty.com\\n" +
          "Password: admin123\\n\\n" +
          "You can add more admins later from the Admin Panel.\\n\\n" +
          "Continue?"
        );
        
        if (!confirmed) return;
        
        try {
          initAdminButton.disabled = true;
          initAdminButton.textContent = "Creating...";
          
          // Create a simple admin entry in Realtime Database
          const adminUid = "admin_" + Date.now();
          await saveAdmin(adminUid, {
            email: "admin@faculty.com",
            password: "admin123", // In production, this should be hashed!
            role: "admin",
            created_at: Date.now()
          });
          
          alert(
            "✅ Admin account created successfully!\\n\\n" +
            "Email: admin@faculty.com\\n" +
            "Password: admin123\\n\\n" +
            "Click OK to continue, then login with these credentials."
          );
          
          // SECURITY: Hide the initialization button immediately after creating admin
          if (initAdminSection) {
            initAdminSection.style.display = 'none';
          }
          
          // Auto-fill the form
          emailInput.value = "admin@faculty.com";
          passwordInput.value = "admin123";
          
        } catch (error) {
          console.error("Error creating admin:", error);
          alert("❌ Failed to create admin account: " + error.message);
        } finally {
          initAdminButton.disabled = false;
          initAdminButton.textContent = "Initialize First Admin";
        }
      };
    }
  });

  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4">
      <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Faculty Monitoring</h1>
          <p class="text-gray-400 mt-2">Admin Login</p>
        </div>

        <form id="login-form" class="space-y-6">
          <!-- Error Message -->
          <div id="error-message" class="hidden bg-red-900/30 border border-red-500/50 rounded p-4 text-red-200 text-sm">
            Error message
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            id="submit-button"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

          <!-- Loading Indicator -->
          <div id="loading-indicator" class="hidden flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-300">Logging in...</span>
          </div>
        </form>

        <!-- Initialize Admin Button - SECURITY: Only shown if no admins exist -->
        <div id="init-admin-section" class="mt-6 pt-6 border-t border-slate-700">
          <button
            id="init-admin-button"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Initialize First Admin
          </button>
          <p class="text-xs text-gray-400 text-center mt-2">
            Click here if this is your first time setting up the system
          </p>
        </div>

        <div class="mt-6 text-center text-sm text-gray-400">
          <p>Access to administrative features requires authentication</p>
        </div>
      </div>
    </div>
  `;
}
