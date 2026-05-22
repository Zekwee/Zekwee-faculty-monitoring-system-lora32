import { createState } from "../core/state.js";
import { getAdmins } from "./realtimeDb.js";

// Create global auth state
const authState = createState({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null
});

/**
 * Initialize auth service and restore session
 */
export function initAuthService() {
  // Check for existing session in localStorage
  const savedSession = localStorage.getItem('admin_session');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      authState.update(() => ({
        user: session.user,
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error("Failed to restore session:", error);
      localStorage.removeItem('admin_session');
    }
  }
}

/**
 * Login with email and password (simple database check)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object with success status
 */
export async function login(email, password) {
  try {
    authState.update(state => ({ ...state, loading: true, error: null }));
    
    // Get all admins from database
    const admins = await getAdmins();
    
    // Find matching admin
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (!admin) {
      authState.update(state => ({
        ...state,
        loading: false,
        error: "Invalid email or password"
      }));
      return { success: false, error: "Invalid email or password" };
    }
    
    // Create session
    const user = {
      uid: admin.uid,
      email: admin.email,
      role: admin.role
    };
    
    // Save session to localStorage
    localStorage.setItem('admin_session', JSON.stringify({ user }));
    
    authState.update(() => ({
      user,
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      error: null
    }));
    
    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    
    authState.update(state => ({
      ...state,
      loading: false,
      error: "Login failed. Please try again."
    }));
    
    return { success: false, error: error.message };
  }
}

/**
 * Logout and clear session
 * @returns {Promise<Object>} Result object with success status
 */
export async function logout() {
  try {
    // Clear session
    localStorage.removeItem('admin_session');
    
    authState.update(() => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null
    }));
    
    // Redirect to login page
    location.hash = "#/login";
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current auth state
 * @returns {Object} Current auth state
 */
export function getAuthState() {
  return authState.get();
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function to receive auth state updates
 * @returns {void}
 */
export function onAuthStateChange(callback) {
  authState.subscribe(callback);
}

/**
 * Check if current user is admin
 * @param {string} uid - User UID
 * @returns {Promise<boolean>} True if user is admin
 */
export async function checkAdminStatus(uid) {
  try {
    const admins = await getAdmins();
    return admins.some(a => a.uid === uid);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
