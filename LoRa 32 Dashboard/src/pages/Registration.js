import { onMount } from "../core/hooks.js";
import { createState } from "../core/state.js";
import { saveProfessor, getProfessors, updateProfessor } from "../firebase/realtimeDb.js";
import { subscribeToPendingRegistrations, approvePendingRegistration, rejectPendingRegistration, subscribeToRegistrationMode, setRegistrationMode } from "../firebase/realtimeDb.js";

const registrationState = createState({
  professors: [],
  pendingRegistrations: [],
  registrationMode: false,
  loading: true,
  error: null,
  successMessage: null
});

export default function Registration() {
  let unsubscribePending = null;
  let unsubscribeMode = null;

  onMount(async () => {
    // Load professors
    await loadProfessors();

    // Handle registration form submission
    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) {
      registrationForm.onsubmit = async (e) => {
        e.preventDefault();
        await handleRegistration();
      };
    }

    // Subscribe to pending registrations
    unsubscribePending = subscribeToPendingRegistrations((pending, error) => {
      if (error) {
        console.error("Error loading pending registrations:", error);
        return;
      }
      registrationState.update(state => ({
        ...state,
        pendingRegistrations: pending
      }));
      renderPendingRegistrations();
    });

    // Subscribe to registration mode
    unsubscribeMode = subscribeToRegistrationMode((isEnabled, error) => {
      if (error) {
        console.error("Error loading registration mode:", error);
        return;
      }
      registrationState.update(state => ({
        ...state,
        registrationMode: isEnabled
      }));
      renderRegistrationModeToggle();
    });

    // Subscribe to state changes
    registrationState.subscribe(() => {
      renderProfessorList();
      renderPendingRegistrations();
      renderRegistrationModeToggle();
    });

    return () => {
      if (unsubscribePending) unsubscribePending();
      if (unsubscribeMode) unsubscribeMode();
    };
  });

  async function loadProfessors() {
    try {
      const professors = await getProfessors();
      registrationState.update(state => ({
        ...state,
        professors,
        loading: false
      }));
      renderProfessorList();
    } catch (error) {
      console.error("Error loading professors:", error);
      registrationState.update(state => ({
        ...state,
        loading: false,
        error: "Failed to load professors"
      }));
    }
  }

  async function handleRegistration() {
    const uidInput = document.getElementById("uid-input");
    const nameInput = document.getElementById("name-input");
    const departmentInput = document.getElementById("department-input");
    const errorDiv = document.getElementById("registration-error");
    const successDiv = document.getElementById("registration-success");

    // Clear messages
    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    const uid = uidInput.value.trim();
    const name = nameInput.value.trim();
    const department = departmentInput.value.trim();

    // Validation
    if (!uid || !name || !department) {
      errorDiv.textContent = "All fields are required";
      errorDiv.classList.remove("hidden");
      return;
    }

    // UID format validation (XX:XX:XX:XX)
    const uidRegex = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
    if (!uidRegex.test(uid)) {
      errorDiv.textContent = "Invalid UID format. Expected format: XX:XX:XX:XX";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      await saveProfessor(uid, {
        name,
        department,
        status: "active"
      });

      successDiv.textContent = "Professor registered successfully";
      successDiv.classList.remove("hidden");

      // Clear form
      uidInput.value = "";
      nameInput.value = "";
      departmentInput.value = "";

      // Reload professors
      await loadProfessors();
    } catch (error) {
      console.error("Error saving professor:", error);
      errorDiv.textContent = "Failed to register professor: " + error.message;
      errorDiv.classList.remove("hidden");
    }
  }

  async function toggleWhitelist(uid, currentStatus) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    try {
      await updateProfessor(uid, { status: newStatus });
      await loadProfessors();
    } catch (error) {
      console.error("Error updating professor status:", error);
      alert("Failed to update whitelist status");
    }
  }

  function renderProfessorList() {
    const listContainer = document.getElementById("professor-list");
    if (!listContainer) return;

    const state = registrationState.get();

    if (state.loading) {
      listContainer.innerHTML = `
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading professors...</p>
        </div>
      `;
      return;
    }

    if (state.professors.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>No professors registered yet</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = `
      <div class="space-y-3">
        ${state.professors.map(prof => `
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-mono text-sm font-medium text-gray-900">${prof.uid}</div>
                <div class="text-gray-900 font-medium mt-1">${prof.name}</div>
                <div class="text-sm text-gray-600">${prof.department}</div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                  prof.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                  ${prof.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <button
                  onclick="window.toggleProfessorWhitelist('${prof.uid}', '${prof.status}')"
                  class="px-3 py-1 text-sm ${
                    prof.status === 'active' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white rounded transition-colors"
                >
                  ${prof.status === 'active' ? 'Remove from Whitelist' : 'Add to Whitelist'}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Expose toggle function globally
    window.toggleProfessorWhitelist = toggleWhitelist;
  }

  function renderRegistrationModeToggle() {
    const container = document.getElementById("registration-mode-section");
    if (!container) return;

    const state = registrationState.get();
    const isEnabled = state.registrationMode;

    container.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Registration Mode</h2>
          <p class="text-sm text-gray-600 mt-1">
            ${isEnabled 
              ? '✅ Receiver is in REGISTRATION MODE. New cards will appear in Pending Registrations below.' 
              : '❌ Registration Mode is OFF. Enable to register new professor cards via the receiver.'}
          </p>
        </div>
        <button
          onclick="window.toggleRegistrationMode()"
          class="px-6 py-3 rounded-lg font-medium transition-colors ${
            isEnabled
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }"
        >
          ${isEnabled ? '⏹ Disable Registration Mode' : '▶ Enable Registration Mode'}
        </button>
      </div>
    `;
  }

  async function toggleRegistrationMode() {
    const state = registrationState.get();
    const newMode = !state.registrationMode;
    
    try {
      await setRegistrationMode(newMode);
      // State will update via subscription
    } catch (error) {
      console.error("Error toggling registration mode:", error);
      alert("Failed to toggle registration mode. Please try again.");
    }
  }

  function renderPendingRegistrations() {
    const container = document.getElementById("pending-registrations-section");
    if (!container) return;

    const state = registrationState.get();
    const pending = state.pendingRegistrations;

    if (pending.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">⏳ Pending Registrations</h2>
          <p class="text-sm text-gray-600 mt-1">
            ${pending.length} card${pending.length > 1 ? 's' : ''} scanned in Registration Mode. Approve to add to whitelist.
          </p>
        </div>
        <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          ${pending.length} pending
        </span>
      </div>
      
      <div class="space-y-3">
        ${pending.map(reg => `
          <div class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-mono text-lg font-bold text-gray-900">${reg.uid}</div>
                <div class="text-sm text-gray-600 mt-1">
                  Scanned: ${new Date(reg.scanned_at).toLocaleString()}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  onclick="window.approveRegistration('${reg.uid}')"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onclick="window.rejectRegistration('${reg.uid}')"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Modal state for approving registrations
  let approveModalOpen = false;
  let approveUid = '';
  let approveName = '';
  let approveDepartment = '';

  function openApproveModal(uid) {
    approveModalOpen = true;
    approveUid = uid;
    approveName = '';
    approveDepartment = '';
    renderApproveModal();
  }

  function closeApproveModal() {
    approveModalOpen = false;
    approveUid = '';
    approveName = '';
    approveDepartment = '';
    renderApproveModal();
  }

  function renderApproveModal() {
    const modalContainer = document.getElementById("approve-modal-container");
    if (!modalContainer) return;

    if (!approveModalOpen) {
      modalContainer.innerHTML = '';
      return;
    }

    modalContainer.innerHTML = `
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Approve Registration</h3>
            <p class="text-sm text-gray-600 mt-1">Card UID: <span class="font-mono font-medium">${approveUid}</span></p>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Professor Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="approve-name-input"
                oninput="window.updateApproveName(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Juan Dela Cruz"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="approve-dept-input"
                oninput="window.updateApproveDept(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Computer Science"
              />
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onclick="window.closeApproveModal()"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onclick="window.submitApproveRegistration()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Approve & Register
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const input = document.getElementById("approve-name-input");
      if (input) input.focus();
    }, 100);
  }

  window.updateApproveName = (value) => { approveName = value; };
  window.updateApproveDept = (value) => { approveDepartment = value; };
  window.closeApproveModal = closeApproveModal;
  
  window.submitApproveRegistration = async () => {
    const nameInput = document.getElementById("approve-name-input");
    const deptInput = document.getElementById("approve-dept-input");
    const name = nameInput ? nameInput.value.trim() : approveName;
    const department = deptInput ? deptInput.value.trim() : approveDepartment;
    
    if (!name || !department) {
      alert("Please enter both name and department");
      return;
    }
    
    try {
      await approvePendingRegistration(approveUid, { name, department });
      await loadProfessors();
      closeApproveModal();
      alert("Professor registered successfully!");
    } catch (error) {
      console.error("Error approving registration:", error);
      alert("Failed to approve registration: " + error.message);
    }
  };

  async function handleApprove(uid) {
    openApproveModal(uid);
  }

  async function handleReject(uid) {
    if (!confirm(`Are you sure you want to reject registration for ${uid}?`)) return;
    
    try {
      await rejectPendingRegistration(uid);
      alert("Registration rejected");
    } catch (error) {
      console.error("Error rejecting registration:", error);
      alert("Failed to reject registration");
    }
  }

  // Expose functions globally
  window.toggleRegistrationMode = toggleRegistrationMode;
  window.approveRegistration = handleApprove;
  window.rejectRegistration = handleReject;

  return `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">RFID Registration</h1>

        <!-- Registration Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Register New Professor</h2>
          
          <div id="registration-error" class="hidden bg-red-50 border border-red-200 rounded p-4 text-red-800 text-sm mb-4"></div>
          <div id="registration-success" class="hidden bg-green-50 border border-green-200 rounded p-4 text-green-800 text-sm mb-4"></div>

          <form id="registration-form" class="space-y-4">
            <div>
              <label for="uid-input" class="block text-sm font-medium text-gray-700 mb-2">
                UID <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="uid-input"
                placeholder="XX:XX:XX:XX (e.g., D9:1B:2E:12)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Format: XX:XX:XX:XX (hexadecimal)</p>
            </div>

            <div>
              <label for="name-input" class="block text-sm font-medium text-gray-700 mb-2">
                Professor Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name-input"
                placeholder="Juan Dela Cruz"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label for="department-input" class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department-input"
                placeholder="Computer Science"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Register Professor
            </button>
          </form>
        </div>

        <!-- Registration Mode Toggle -->
        <div id="registration-mode-section" class="bg-white rounded-lg shadow p-6 mb-6">
          <!-- Dynamically rendered -->
        </div>

        <!-- Pending Registrations -->
        <div id="pending-registrations-section" class="bg-white rounded-lg shadow p-6 mb-6">
          <!-- Dynamically rendered -->
        </div>

        <!-- Registered Professors List -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Registered Professors</h2>
          <div id="professor-list">
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading professors...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Approve Modal Container -->
      <div id="approve-modal-container"></div>
    </div>
  `;
}
