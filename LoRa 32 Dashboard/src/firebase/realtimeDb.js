import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, query, orderByChild, limitToLast, get, set, update, remove, off } from "firebase/database";

// Firebase configuration for Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g",
  authDomain: "faculty-monitoring-e00b7.firebaseapp.com",
  databaseURL: "https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "faculty-monitoring-e00b7"
};

// Initialize Firebase app (use existing if already initialized)
let realtimeApp;
let database;

try {
  // Check if app already exists
  const existingApps = getApps();
  if (existingApps.length > 0) {
    realtimeApp = existingApps[0];
    console.log("Using existing Firebase app");
  } else {
    realtimeApp = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully");
  }
  database = getDatabase(realtimeApp);
  console.log("Firebase Realtime Database initialized successfully");
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

/**
 * Initialize Realtime Database connection
 * @returns {Database} Firebase Realtime Database instance
 */
export function initRealtimeDb() {
  return database;
}

/**
 * Subscribe to monitoring logs with real-time updates
 * @param {Function} callback - Callback function to receive log updates
 * @param {number} limit - Maximum number of logs to retrieve (default: 50)
 * @returns {Function} Unsubscribe function to stop listening
 */
export function subscribeToLogs(callback, limit = 50) {
  console.log("Subscribing to Firebase logs...");
  
  try {
    const logsRef = ref(database, "monitoring_logs");
    const logsQuery = query(
      logsRef,
      orderByChild("timestamp"),
      limitToLast(limit)
    );

    const unsubscribe = onValue(
      logsQuery,
      (snapshot) => {
        console.log("Firebase snapshot received:", snapshot.exists());
        const logs = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const logData = childSnapshot.val();
            
            // Validate required fields
            if (validateLog(logData)) {
              logs.push({
                id: childSnapshot.key,
                ...logData
              });
            } else {
              console.warn("Invalid log data:", childSnapshot.key, logData);
            }
          });
        }

        // Sort descending (most recent first)
        logs.sort((a, b) => b.timestamp - a.timestamp);

        console.log("Calling callback with", logs.length, "logs");
        callback(logs, null);
      },
      (error) => {
        console.error("Firebase Realtime Database error:", error);
        callback([], error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up Firebase subscription:", error);
    callback([], error);
    return () => {}; // Return empty unsubscribe function
  }
}

/**
 * Unsubscribe from real-time log updates
 * @param {Function} subscriptionRef - The unsubscribe function returned by subscribeToLogs
 */
export function unsubscribeFromLogs(subscriptionRef) {
  if (subscriptionRef && typeof subscriptionRef === 'function') {
    subscriptionRef();
  }
}

/**
 * Query logs with filters
 * @param {Object} filters - Filter criteria (dateStart, dateEnd, roomId, uid)
 * @returns {Promise<Array>} Filtered logs
 */
export async function queryLogs(filters) {
  try {
    const logsRef = ref(database, "monitoring_logs");
    const snapshot = await get(logsRef);

    if (!snapshot.exists()) {
      return [];
    }

    let logs = [];
    snapshot.forEach((childSnapshot) => {
      const logData = childSnapshot.val();
      if (validateLog(logData)) {
        logs.push({
          id: childSnapshot.key,
          ...logData
        });
      }
    });

    // Apply filters
    if (filters) {
      logs = applyFilters(logs, filters);
    }

    // Sort descending (most recent first)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    return logs;
  } catch (error) {
    console.error("Error querying logs:", error);
    throw error;
  }
}

/**
 * Validate log data has required fields
 * @param {Object} log - Log object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateLog(log) {
  if (!log) return false;
  
  const requiredFields = ['uid', 'room_id', 'status', 'timestamp'];
  return requiredFields.every(field => {
    const value = log[field];
    return value !== null && value !== undefined && value !== '';
  });
}

/**
 * Apply filters to logs array
 * @param {Array} logs - Array of log objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered logs
 */
function applyFilters(logs, filters) {
  return logs.filter(log => {
    // Date range filter
    if (filters.dateStart && log.timestamp < filters.dateStart) {
      return false;
    }
    if (filters.dateEnd && log.timestamp > filters.dateEnd) {
      return false;
    }

    // Room ID filter
    if (filters.roomId && filters.roomId.trim() !== '') {
      if (!log.room_id || !log.room_id.toLowerCase().includes(filters.roomId.toLowerCase())) {
        return false;
      }
    }

    // UID filter (partial match)
    if (filters.uid && filters.uid.trim() !== '') {
      if (!log.uid || !log.uid.toLowerCase().includes(filters.uid.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

// ============================================
// Professor Management Functions
// ============================================

/**
 * Save professor record to Firebase
 * @param {string} uid - Professor UID
 * @param {Object} professorData - Professor data (name, department, status)
 * @returns {Promise<void>}
 */
export async function saveProfessor(uid, professorData) {
  try {
    const professorRef = ref(database, `professors/${uid}`);
    await set(professorRef, {
      ...professorData,
      registered_at: Date.now()
    });
  } catch (error) {
    console.error("Error saving professor:", error);
    throw error;
  }
}

/**
 * Get all professor records
 * @returns {Promise<Array>} Array of professor objects
 */
export async function getProfessors() {
  try {
    const professorsRef = ref(database, "professors");
    const snapshot = await get(professorsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const professors = [];
    snapshot.forEach((childSnapshot) => {
      professors.push({
        uid: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return professors;
  } catch (error) {
    console.error("Error getting professors:", error);
    throw error;
  }
}

/**
 * Update professor record
 * @param {string} uid - Professor UID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateProfessor(uid, updates) {
  try {
    const professorRef = ref(database, `professors/${uid}`);
    await update(professorRef, updates);
  } catch (error) {
    console.error("Error updating professor:", error);
    throw error;
  }
}

/**
 * Delete professor record
 * @param {string} uid - Professor UID
 * @returns {Promise<void>}
 */
export async function deleteProfessor(uid) {
  try {
    const professorRef = ref(database, `professors/${uid}`);
    await remove(professorRef);
  } catch (error) {
    console.error("Error deleting professor:", error);
    throw error;
  }
}

// ============================================
// Admin Management Functions
// ============================================

/**
 * Check if user is admin
 * @param {string} uid - User UID
 * @returns {Promise<boolean>} True if user is admin
 */
export async function checkIsAdmin(uid) {
  try {
    const adminRef = ref(database, `admins/${uid}`);
    const snapshot = await get(adminRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Save admin record
 * @param {string} uid - Admin UID
 * @param {Object} adminData - Admin data (email, role)
 * @returns {Promise<void>}
 */
export async function saveAdmin(uid, adminData) {
  try {
    const adminRef = ref(database, `admins/${uid}`);
    await set(adminRef, adminData);
  } catch (error) {
    console.error("Error saving admin:", error);
    throw error;
  }
}

/**
 * Get all admin records
 * @returns {Promise<Array>} Array of admin objects
 */
export async function getAdmins() {
  try {
    const adminsRef = ref(database, "admins");
    const snapshot = await get(adminsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const admins = [];
    snapshot.forEach((childSnapshot) => {
      admins.push({
        uid: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return admins;
  } catch (error) {
    console.error("Error getting admins:", error);
    throw error;
  }
}

/**
 * Delete admin record
 * @param {string} uid - Admin UID
 * @returns {Promise<void>}
 */
export async function deleteAdmin(uid) {
  try {
    const adminRef = ref(database, `admins/${uid}`);
    await remove(adminRef);
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
}

// ============================================
// Log Management Functions
// ============================================

/**
 * Delete a specific log entry
 * @param {string} logId - Log entry ID
 * @returns {Promise<void>}
 */
export async function deleteLog(logId) {
  try {
    const logRef = ref(database, `monitoring_logs/${logId}`);
    await remove(logRef);
    console.log(`Log ${logId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting log:", error);
    throw error;
  }
}

/**
 * Clear all monitoring logs
 * @returns {Promise<void>}
 */
export async function clearAllLogs() {
  try {
    const logsRef = ref(database, "monitoring_logs");
    await remove(logsRef);
    console.log("All logs cleared successfully");
  } catch (error) {
    console.error("Error clearing logs:", error);
    throw error;
  }
}

/**
 * Get professor name by UID (for log display)
 * @param {string} uid - Professor UID
 * @returns {Promise<string>} Professor name or UID if not found
 */
export async function getProfessorNameByUid(uid) {
  try {
    const professorRef = ref(database, `professors/${uid}`);
    const snapshot = await get(professorRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.name || uid;
    }
    return uid;
  } catch (error) {
    console.error("Error getting professor name:", error);
    return uid;
  }
}

// ============================================
// Pending Registrations Functions
// ============================================

/**
 * Subscribe to pending registrations (real-time)
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export function subscribeToPendingRegistrations(callback) {
  try {
    const pendingRef = ref(database, "pending_registrations");
    
    const unsubscribe = onValue(
      pendingRef,
      (snapshot) => {
        const pending = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            pending.push({
              uid: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
        }
        
        // Sort by scanned_at (most recent first)
        pending.sort((a, b) => (b.scanned_at || 0) - (a.scanned_at || 0));
        
        callback(pending, null);
      },
      (error) => {
        console.error("Error subscribing to pending registrations:", error);
        callback([], error);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up pending registrations subscription:", error);
    callback([], error);
    return () => {};
  }
}

/**
 * Approve pending registration and move to professors
 * @param {string} uid - Card UID
 * @param {Object} professorData - Professor details (name, department)
 * @returns {Promise<void>}
 */
export async function approvePendingRegistration(uid, professorData) {
  try {
    // Save to professors
    const professorRef = ref(database, `professors/${uid}`);
    await set(professorRef, {
      name: professorData.name,
      department: professorData.department,
      status: "active",
      registered_at: Date.now()
    });
    
    // Remove from pending
    const pendingRef = ref(database, `pending_registrations/${uid}`);
    await remove(pendingRef);
    
    console.log(`Registration approved for ${uid}`);
  } catch (error) {
    console.error("Error approving registration:", error);
    throw error;
  }
}

/**
 * Reject/delete pending registration
 * @param {string} uid - Card UID
 * @returns {Promise<void>}
 */
export async function rejectPendingRegistration(uid) {
  try {
    const pendingRef = ref(database, `pending_registrations/${uid}`);
    await remove(pendingRef);
    console.log(`Registration rejected for ${uid}`);
  } catch (error) {
    console.error("Error rejecting registration:", error);
    throw error;
  }
}

// ============================================
// System Config Functions
// ============================================

/**
 * Subscribe to registration mode setting
 * @param {Function} callback - Callback function receives boolean
 * @returns {Function} Unsubscribe function
 */
export function subscribeToRegistrationMode(callback) {
  try {
    const configRef = ref(database, "system_config/registration_mode");
    
    const unsubscribe = onValue(
      configRef,
      (snapshot) => {
        const isEnabled = snapshot.exists() ? snapshot.val() : false;
        callback(isEnabled, null);
      },
      (error) => {
        console.error("Error subscribing to registration mode:", error);
        callback(false, error);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up registration mode subscription:", error);
    callback(false, error);
    return () => {};
  }
}

/**
 * Set registration mode
 * @param {boolean} enabled - Enable or disable registration mode
 * @returns {Promise<void>}
 */
export async function setRegistrationMode(enabled) {
  try {
    const configRef = ref(database, "system_config/registration_mode");
    await set(configRef, enabled);
    console.log(`Registration mode ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error("Error setting registration mode:", error);
    throw error;
  }
}
