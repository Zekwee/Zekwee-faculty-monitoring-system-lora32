import { onMount } from "../core/hooks.js";
import { createState } from "../core/state.js";
import { getProfessors, updateProfessor, deleteProfessor, getAdmins, saveAdmin, deleteAdmin } from "../firebase/realtimeDb.js";
import { subscribeToLogs } from "../firebase/realtimeDb.js";
import { calculateTotalLogs7Days, calculateUniqueUIDs7Days } from "../utils/statistics.js";
import { formatTimestamp } from "../utils/dateFormat.js";

const adminPanelState = createState({
  professors: [],
  admins: [],
  logs: [],
  statistics: {
    totalProfessors: 0,
    activeProfessors: 0,
    inactiveProfessors: 0,
    totalLogs7Days: 0,
    uniqueUIDs7Days: 0
  },
  loading: true,
  error: null
});

export default function AdminPanel() {
  let unsubscribeLogs = null;

  onMount(async () => {
    await loadData();

    // Subscribe to logs for statistics
    unsubscribeLogs = subscribeToLogs((logs) => {
      adminPanelState.update(state => ({
        ...state,
        logs
      }));
      updateStatistics();
    });

    // Subscribe to state changes
    adminPanelState.subscribe(() => {
      renderProfessors();
      renderAdmins();
      renderStatistics();
    });

    return () => {
      if (unsubscribeLogs) unsubscribeLogs();
    };
  });

  async function loadData() {
    try {
      const [professors, admins] = await Promise.all([
        getProfessors(),
        getAdmins()
      ]);

      adminPanelState.update(state => ({
        ...state,
        professors,
        admins,
        loading: false
      }));

      updateStatistics();
    } catch (error) {
      console.error("Error loading data:", error);
      adminPanelState.update(state => ({
        ...state,
        loading: false,
        error: "Failed to load data"
      }));
    }
  }

  function updateStatistics() {
    const state = adminPanelState.get();
    const professors = state.professors;
    const logs = state.logs;

    const statistics = {
      totalProfessors: professors.length,
      activeProfessors: professors.filter(p => p.status === 'active').length,
      inactiveProfessors: professors.filter(p => p.status === 'inactive').length,
      totalLogs7Days: calculateTotalLogs7Days(logs),
      uniqueUIDs7Days: calculateUniqueUIDs7Days(logs)
    };

    adminPanelState.update(state => ({
      ...state,
      statistics
    }));
  }

  async function handleEditProfessor(uid) {
    const state = adminPanelState.get();
    const professor = state.professors.find(p => p.uid === uid);
    if (!professor) return;

    const newName = prompt("Enter new name:", professor.name);
    if (!newName || newName.trim() === "") return;

    const newDepartment = prompt("Enter new department:", professor.department);
    if (!newDepartment || newDepartment.trim() === "") return;

    try {
      await updateProfessor(uid, {
        name: newName.trim(),
        department: newDepartment.trim()
      });
      await loadData();
      alert("Professor updated successfully");
    } catch (error) {
      console.error("Error updating professor:", error);
      alert("Failed to update professor");
    }
  }

  async function handleDeleteProfessor(uid, name) {
    if (!confirm(`Are you sure you want to delete professor "${name}"?`)) return;

    try {
      await deleteProfessor(uid);
      await loadData();
      alert("Professor deleted successfully");
    } catch (error) {
      console.error("Error deleting professor:", error);
      alert("Failed to delete professor");
    }
  }

  // Modal state for Add Admin
  let isAddAdminModalOpen = false;
  let addAdminEmail = "";
  let addAdminError = "";

  function openAddAdminModal() {
    isAddAdminModalOpen = true;
    addAdminEmail = "";
    addAdminError = "";
    renderAddAdminModal();
  }

  function closeAddAdminModal() {
    isAddAdminModalOpen = false;
    addAdminEmail = "";
    addAdminError = "";
    renderAddAdminModal();
  }

  function renderAddAdminModal() {
    const modalContainer = document.getElementById("add-admin-modal-container");
    if (!modalContainer) return;

    if (!isAddAdminModalOpen) {
      modalContainer.innerHTML = "";
      return;
    }

    modalContainer.innerHTML = `
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Add New Admin</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label for="admin-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="admin-email"
                oninput="window.updateAddAdminEmail(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            
            ${addAdminError ? `
              <div class="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                ${addAdminError}
              </div>
            ` : ''}
          </div>
          
          <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onclick="window.closeAddAdminModal()"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onclick="window.submitAddAdmin()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Add Admin
            </button>
          </div>
        </div>
      </div>
    `;

    // Focus the input
    setTimeout(() => {
      const input = document.getElementById("admin-email");
      if (input) input.focus();
    }, 100);
  }

  window.updateAddAdminEmail = (value) => {
    addAdminEmail = value;
    addAdminError = "";
    // Don't re-render on every keystroke - let the input maintain focus
    // Only re-render when there's an error to show or on submit
  };

  window.closeAddAdminModal = closeAddAdminModal;

  window.submitAddAdmin = async () => {
    // Get email directly from input to ensure we have the latest value
    const emailInput = document.getElementById("admin-email");
    const email = emailInput ? emailInput.value.trim() : addAdminEmail;
    
    if (!email || email === "") {
      addAdminError = "Please enter an email address";
      renderAddAdminModal();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addAdminError = "Please enter a valid email address";
      addAdminEmail = email; // Save current value so it's not lost
      renderAddAdminModal();
      return;
    }

    const uid = email.replace(/[@.]/g, '_');

    try {
      await saveAdmin(uid, {
        email: email,
        role: "admin"
      });
      await loadData();
      closeAddAdminModal();
      alert("Admin added successfully");
    } catch (error) {
      console.error("Error adding admin:", error);
      addAdminError = "Failed to add admin. Please try again.";
      addAdminEmail = email; // Save current value so it's not lost
      renderAddAdminModal();
    }
  };

  async function handleAddAdmin() {
    openAddAdminModal();
  }

  async function handleDeleteAdmin(uid, email) {
    if (!confirm(`Are you sure you want to delete admin "${email}"?`)) return;

    try {
      await deleteAdmin(uid);
      await loadData();
      alert("Admin deleted successfully");
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  }

  function renderStatistics() {
    const container = document.getElementById("admin-statistics");
    if (!container) return;

    const state = adminPanelState.get();
    const stats = state.statistics;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Total Professors</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">${stats.totalProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Active</div>
          <div class="text-2xl font-bold text-green-600 mt-1">${stats.activeProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Inactive</div>
          <div class="text-2xl font-bold text-gray-600 mt-1">${stats.inactiveProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Logs (7 days)</div>
          <div class="text-2xl font-bold text-blue-600 mt-1">${stats.totalLogs7Days}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Unique UIDs (7d)</div>
          <div class="text-2xl font-bold text-purple-600 mt-1">${stats.uniqueUIDs7Days}</div>
        </div>
      </div>
    `;
  }

  function renderProfessors() {
    const container = document.getElementById("professors-table");
    if (!container) return;

    const state = adminPanelState.get();

    if (state.professors.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-gray-500">No professors registered</div>`;
      return;
    }

    container.innerHTML = `
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${state.professors.map(prof => `
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">${prof.uid}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${prof.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${prof.department}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                  prof.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                  ${prof.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${formatTimestamp(prof.registered_at)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  onclick="window.editProfessor('${prof.uid}')"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onclick="window.deleteProfessor('${prof.uid}', '${prof.name}')"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    window.editProfessor = handleEditProfessor;
    window.deleteProfessor = handleDeleteProfessor;
  }

  function renderAdmins() {
    const container = document.getElementById("admins-table");
    if (!container) return;

    const state = adminPanelState.get();

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Admin Accounts</h3>
        <button
          onclick="window.addAdmin()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
        >
          Add Admin
        </button>
      </div>
      ${state.admins.length === 0 ? `
        <div class="text-center py-8 text-gray-500">No admin accounts</div>
      ` : `
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${state.admins.map(admin => `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${admin.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${admin.role}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onclick="window.deleteAdmin('${admin.uid}', '${admin.email}')"
                    class="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    `;

    window.addAdmin = handleAddAdmin;
    window.deleteAdmin = handleDeleteAdmin;
    window.openAddAdminModal = openAddAdminModal;
    window.closeAddAdminModal = closeAddAdminModal;
    window.submitAddAdmin = window.submitAddAdmin;
    window.updateAddAdminEmail = window.updateAddAdminEmail;
  }

  return `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        <!-- System Statistics -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
          <div id="admin-statistics"></div>
        </div>

        <!-- Professor Management -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Professor Management</h2>
          <div id="professors-table" class="overflow-x-auto"></div>
        </div>

        <!-- Admin Account Management -->
        <div class="bg-white rounded-lg shadow p-6">
          <div id="admins-table"></div>
        </div>
      </div>
      
      <!-- Add Admin Modal Container -->
      <div id="add-admin-modal-container"></div>
    </div>
  `;
}
