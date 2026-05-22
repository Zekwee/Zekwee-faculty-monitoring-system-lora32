import { createState, computed } from "../core/state.js";
import { onMount } from "../core/hooks.js";
import { subscribeToLogs, unsubscribeFromLogs, deleteLog, clearAllLogs, getProfessors } from "../firebase/realtimeDb.js";
import Statistics from "../components/dashboard/Statistics.js";
import LogViewer from "../components/dashboard/LogViewer.js";
import RoomStatus from "../components/dashboard/RoomStatus.js";
import Filters from "../components/dashboard/Filters.js";
import { exportToCSV } from "../utils/csvExport.js";

// Create global dashboard state
const dashboardState = createState({
  logs: [],
  filters: {
    dateStart: null,
    dateEnd: null,
    roomId: "",
    uid: ""
  },
  loading: true,
  error: null,
  connected: false,
  initialized: false
});

// Computed filtered logs
const filteredLogs = computed(dashboardState, (state) => {
  let logs = state.logs;

  // Apply filters
  if (state.filters.dateStart) {
    logs = logs.filter(log => log.timestamp >= state.filters.dateStart);
  }
  if (state.filters.dateEnd) {
    logs = logs.filter(log => log.timestamp <= state.filters.dateEnd);
  }
  if (state.filters.roomId && state.filters.roomId.trim() !== '') {
    logs = logs.filter(log => 
      log.room_id && log.room_id.toLowerCase().includes(state.filters.roomId.toLowerCase())
    );
  }
  if (state.filters.uid && state.filters.uid.trim() !== '') {
    logs = logs.filter(log => 
      log.uid && log.uid.toLowerCase().includes(state.filters.uid.toLowerCase())
    );
  }

  return logs;
});

// Track if already subscribed to prevent duplicate subscriptions
let isSubscribed = false;
let unsubscribe = null;

// Professor name cache for UID lookup
let professorCache = new Map();

// Load professor names for UID lookup
async function loadProfessorCache() {
  try {
    const professors = await getProfessors();
    professorCache.clear();
    professors.forEach(prof => {
      professorCache.set(prof.uid, prof.name);
    });
    console.log(`Loaded ${professors.length} professors into cache`);
  } catch (error) {
    console.error("Error loading professor cache:", error);
  }
}

// Get professor name from cache or return formatted UID
function getProfessorDisplayName(uid) {
  if (professorCache.has(uid)) {
    return professorCache.get(uid);
  }
  // Return formatted UID if no name found
  return 'Prof. ' + uid.substring(0, 8);
}

// Initialize Firebase subscription immediately
function initializeDashboard() {
  if (isSubscribed) return;
  
  isSubscribed = true;
  console.log("Initializing dashboard, subscribing to logs...");
  
  // Set a timeout to show error if Firebase doesn't respond
  const timeoutId = setTimeout(() => {
    const state = dashboardState.get();
    if (state.loading) {
      console.error("Firebase connection timeout");
      dashboardState.update(state => ({
        ...state,
        loading: false,
        error: "Connection timeout. Please check your Firebase configuration and internet connection.",
        connected: false,
        initialized: true
      }));
      // Trigger re-render
      if (window.triggerDashboardRender) {
        window.triggerDashboardRender();
      }
    }
  }, 10000); // 10 second timeout
  
  // Initialize Firebase connection and subscribe to logs
  unsubscribe = subscribeToLogs((logs, error) => {
    clearTimeout(timeoutId);
    console.log("Firebase callback received:", { logsCount: logs.length, error });
    
    if (error) {
      console.error("Firebase error:", error);
      dashboardState.update(state => ({
        ...state,
        loading: false,
        error: "Unable to connect to Firebase. Please check your connection.",
        connected: false,
        initialized: true
      }));
    } else {
      console.log("Firebase connected successfully with", logs.length, "logs");
      dashboardState.update(state => ({
        ...state,
        logs,
        loading: false,
        error: null,
        connected: true,
        initialized: true
      }));
    }
    
    // Trigger re-render after state update
    if (window.triggerDashboardRender) {
      window.triggerDashboardRender();
    }
  });
}

export default function Dashboard() {
  // Initialize on first call
  if (!dashboardState.get().initialized) {
    initializeDashboard();
  }

  onMount(() => {
    console.log("Dashboard mounted");
    
    // Re-initialize if needed
    if (!isSubscribed) {
      initializeDashboard();
    }

    // Handle filter changes
    function handleFilterChange(newFilters) {
      dashboardState.update(state => ({
        ...state,
        filters: {
          ...state.filters,
          ...newFilters
        }
      }));
      renderDashboard();
    }

    // Expose filter change handler globally for Filters component
    window.handleDashboardFilterChange = handleFilterChange;
    
    // Room details modal functions
    window.showRoomDetails = (roomId) => {
      const modal = document.getElementById('room-details-modal');
      const title = document.getElementById('modal-room-title');
      const content = document.getElementById('modal-room-content');
      
      if (!modal || !title || !content) return;
      
      title.textContent = roomId;
      
      // Get professors in this room
      const state = dashboardState.get();
      const professorsInRoom = state.logs
        .filter(log => log.status === 'in_room' && log.room_id === roomId)
        .reduce((acc, log) => {
          if (!acc.find(p => p.uid === log.uid)) {
            acc.push(log);
          }
          return acc;
        }, [])
        .sort((a, b) => b.timestamp - a.timestamp);
      
      if (professorsInRoom.length === 0) {
        content.innerHTML = `
          <div class="text-center py-8 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <p class="text-lg">No professors currently in this room</p>
          </div>
        `;
      } else {
        const profListHTML = professorsInRoom.map((log, index) => {
          const timeAgo = formatTimeAgo(log.timestamp);
          const displayName = getProfessorDisplayName(log.uid);
          return `
            <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P${index + 1}
                </div>
                <div>
                  <div class="font-medium text-lg">${displayName}</div>
                  <div class="text-sm text-gray-400">${log.uid}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-emerald-400 font-medium">IN ROOM</div>
                <div class="text-xs text-gray-400">${timeAgo}</div>
              </div>
            </div>
          `;
        }).join('');
        
        content.innerHTML = `
          <div class="mb-4">
            <div class="text-4xl font-bold text-center mb-2">${professorsInRoom.length}</div>
            <div class="text-center text-gray-400">${professorsInRoom.length === 1 ? 'Professor' : 'Professors'} in room</div>
          </div>
          <div class="space-y-3 mt-6">
            ${profListHTML}
          </div>
        `;
      }
      
      modal.classList.remove('hidden');
    };
    
    window.closeRoomDetails = () => {
      const modal = document.getElementById('room-details-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    };
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeRoomDetails();
      }
    });

    // Load professor cache on mount
    loadProfessorCache();

    // Expose delete log function for admin
    window.deleteLogEntry = async (logId) => {
      if (!confirm('Are you sure you want to delete this log entry?')) return;
      
      try {
        await deleteLog(logId);
        console.log(`Log ${logId} deleted`);
      } catch (error) {
        console.error('Error deleting log:', error);
        alert('Failed to delete log entry');
      }
    };

    // Expose clear all logs function for admin
    window.clearAllLogs = async () => {
      if (!confirm('WARNING: This will delete ALL log entries. Are you sure?')) return;
      if (!confirm('This action cannot be undone. Confirm to clear all logs?')) return;
      
      try {
        await clearAllLogs();
        console.log('All logs cleared');
        alert('All logs have been cleared successfully');
      } catch (error) {
        console.error('Error clearing logs:', error);
        alert('Failed to clear logs');
      }
    };

    // Handle CSV export button
    const exportBtn = document.getElementById("export-csv-btn");
    if (exportBtn) {
      exportBtn.onclick = () => {
        const currentFilteredLogs = filteredLogs.get();
        if (currentFilteredLogs.length === 0) {
          alert("No logs to export. Try adjusting your filters.");
        } else {
          exportToCSV(currentFilteredLogs);
        }
      };
    }

    // Subscribe to state changes for reactive updates
    dashboardState.subscribe(() => {
      renderDashboard();
    });

    // Cleanup on unmount
    const cleanup = () => {
      if (unsubscribe) {
        unsubscribeFromLogs(unsubscribe);
        unsubscribe = null;
      }
      isSubscribed = false;
      dashboardState.update(state => ({
        ...state,
        initialized: false,
        loading: true
      }));
      delete window.handleDashboardFilterChange;
      delete window.dashboardCleanup;
    };
    
    // Store cleanup function globally so router can call it
    window.dashboardCleanup = cleanup;
    
    return cleanup;
  });

  function renderDashboard() {
    const state = dashboardState.get();
    const currentFilteredLogs = filteredLogs.get();

    // Update statistics
    const statsContainer = document.getElementById("statistics-container");
    if (statsContainer) {
      statsContainer.innerHTML = Statistics(currentFilteredLogs);
    }

    // Update log viewer
    const logViewerContainer = document.getElementById("log-viewer-container");
    if (logViewerContainer) {
      if (currentFilteredLogs.length === 0 && (state.filters.dateStart || state.filters.dateEnd || state.filters.roomId || state.filters.uid)) {
        logViewerContainer.innerHTML = `
          <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-lg font-medium">No logs match the current filters</p>
            <p class="text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        `;
      } else {
        logViewerContainer.innerHTML = LogViewer(currentFilteredLogs);
      }
    }

    // Update room status
    const roomStatusContainer = document.getElementById("room-status-container");
    if (roomStatusContainer) {
      roomStatusContainer.innerHTML = RoomStatus(state.logs);
    }
    
    // Re-attach export button handler
    const exportBtn = document.getElementById("export-csv-btn");
    if (exportBtn && !exportBtn.onclick) {
      exportBtn.onclick = () => {
        const logs = filteredLogs.get();
        if (logs.length === 0) {
          alert("No logs to export. Try adjusting your filters.");
        } else {
          exportToCSV(logs);
        }
      };
    }
  }

  const state = dashboardState.get();

  // Loading state
  if (state.loading) {
    return `
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-300">Loading dashboard...</span>
          </div>
        </div>
      </div>
    `;
  }

  // Error state
  if (state.error) {
    return `
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-red-200">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <div>
                <strong>Error:</strong> ${state.error}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const currentFilteredLogs = filteredLogs.get();
  
  // Get current time
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  // Calculate room statistics
  const roomStats = {};
  const facultyRoomCount = { count: 0, professors: [] };
  
  currentFilteredLogs.forEach(log => {
    if (log.status === 'in_room') {
      if (log.room_id === 'Faculty Room') {
        facultyRoomCount.count++;
        if (!facultyRoomCount.professors.find(p => p.uid === log.uid)) {
          facultyRoomCount.professors.push({
            uid: log.uid,
            name: log.name || log.uid,
            timestamp: log.timestamp
          });
        }
      } else {
        if (!roomStats[log.room_id]) {
          roomStats[log.room_id] = { count: 0, professors: [] };
        }
        roomStats[log.room_id].count++;
        if (!roomStats[log.room_id].professors.find(p => p.uid === log.uid)) {
          roomStats[log.room_id].professors.push({
            uid: log.uid,
            name: log.name || log.uid,
            timestamp: log.timestamp
          });
        }
      }
    }
  });
  
  // Get all unique rooms from logs
  const allRooms = ['202', '203 (1st Comlab)', '204 (2nd Comlab)', '205'];
  
  // Create room cards HTML
  const roomCardsHTML = allRooms.map(roomId => {
    const roomData = roomStats[roomId] || { count: 0, professors: [] };
    const isOccupied = roomData.count > 0;
    const cardColor = isOccupied ? 'from-emerald-900/40 to-emerald-800/40 border-emerald-500/50' : 'from-slate-800/40 to-slate-700/40 border-slate-600/30';
    const dotColor = isOccupied ? 'bg-emerald-400' : 'bg-slate-500';
    const textColor = isOccupied ? 'text-emerald-400' : 'text-slate-400';
    
    return `
      <div class="bg-gradient-to-br ${cardColor} border rounded-lg p-3 hover:scale-105 transition-transform cursor-pointer room-card" 
           data-room-id="${roomId}"
           onclick="window.showRoomDetails('${roomId}')">
        <div class="flex justify-between items-start mb-2">
          <div class="text-${isOccupied ? 'emerald' : 'slate'}-400 text-xs font-medium">${roomId}</div>
          <div class="w-1.5 h-1.5 ${dotColor} rounded-full ${isOccupied ? 'animate-pulse' : ''}"></div>
        </div>
        <div class="flex flex-col items-center justify-center py-2">
          <svg class="w-10 h-10 ${textColor} mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
          </svg>
          <div class="text-4xl font-bold ${textColor} mb-1">${roomData.count}</div>
          <div class="text-xs ${textColor}">
            ${roomData.count === 1 ? 'Prof.' : 'Profs'}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-4">
      <div class="h-full flex flex-col max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold">IT Faculty Monitoring System</h1>
                <p class="text-xs text-gray-400">RFID-BASED REAL-TIME ROOM TRACKING</p>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold">${timeString}</div>
            <div class="text-xs text-gray-400">${dateString}</div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="flex-1 grid grid-cols-5 gap-3 min-h-0">
          <!-- Left Side: Faculty Room + Other Rooms -->
          <div class="col-span-2 flex flex-col gap-3">
            <!-- Faculty Room Card -->
            <div class="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50 rounded-lg p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                 onclick="window.showRoomDetails('Faculty Room')">
              <div class="text-center">
                <div class="text-blue-400 text-xs font-medium mb-2">FACULTY ROOM</div>
                <svg class="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <div class="text-5xl font-bold text-blue-400 mb-1">${facultyRoomCount.count}</div>
                <div class="text-sm text-blue-400">Teachers inside</div>
                <button class="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors">
                  + ${facultyRoomCount.count} INSIDE
                </button>
              </div>
            </div>

            <!-- Room Cards Grid -->
            <div class="grid grid-cols-2 gap-2 flex-1">
              ${roomCardsHTML}
            </div>
          </div>

          <!-- Right Side: Faculty Location Table -->
          <div class="col-span-3 bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col">
            <div class="p-3 border-b border-slate-700/50">
              <h2 class="text-base font-bold">CURRENT FACULTY LOCATION</h2>
              <p class="text-xs text-gray-400 mt-1">Updated 5s ago</p>
            </div>
            <div class="flex-1 overflow-auto">
              <div class="flex justify-between items-center mb-3">
                <div></div>
                <button onclick="window.clearAllLogs()" class="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Clear All Logs
                </button>
              </div>
              <table class="w-full">
                <thead class="bg-slate-900/50 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">#</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Teacher</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Room</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Last Scanned</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50" id="faculty-location-tbody">
                  ${generateFacultyLocationRows(currentFilteredLogs)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Details Modal -->
    <div id="room-details-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 class="text-2xl font-bold" id="modal-room-title">Room Details</h2>
          <button onclick="window.closeRoomDetails()" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]" id="modal-room-content">
          <!-- Content will be populated by JavaScript -->
        </div>
      </div>
    </div>
  `;
}

// Helper function to generate faculty location table rows
function generateFacultyLocationRows(logs) {
  if (logs.length === 0) {
    return `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p>No faculty members currently tracked</p>
        </td>
      </tr>
    `;
  }
  
  // Get latest status for each faculty member
  const facultyMap = new Map();
  logs.forEach(log => {
    if (!facultyMap.has(log.uid) || log.timestamp > facultyMap.get(log.uid).timestamp) {
      facultyMap.set(log.uid, log);
    }
  });
  
  const sortedFaculty = Array.from(facultyMap.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Show only latest 10
  
  return sortedFaculty.map((log, index) => {
    const isInRoom = log.status === 'in_room';
    const statusBadge = isInRoom 
      ? `<span class="px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/50">+ IN ROOM</span>`
      : `<span class="px-3 py-1 bg-blue-900/50 text-blue-400 text-xs font-medium rounded-full border border-blue-500/50">+ FACULTY ROOM</span>`;
    
    const roomBadge = isInRoom && log.room_id !== 'Faculty Room'
      ? `<span class="flex items-center gap-2 text-emerald-400"><span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>${log.room_id}</span>`
      : `<span class="flex items-center gap-2 text-blue-400"><span class="w-2 h-2 bg-blue-400 rounded-full"></span>Faculty Room</span>`;
    
    const timeAgo = formatTimeAgo(log.timestamp);
    const displayName = getProfessorDisplayName(log.uid);
    
    return `
      <tr class="hover:bg-slate-700/30 transition-colors">
        <td class="px-3 py-2 text-gray-400 text-sm">P${index + 1}</td>
        <td class="px-3 py-2">
          <div class="font-medium text-sm">${displayName}</div>
          <div class="text-xs text-gray-400">${log.uid.substring(0, 12)}...</div>
        </td>
        <td class="px-3 py-2">${roomBadge}</td>
        <td class="px-3 py-2">${statusBadge}</td>
        <td class="px-3 py-2 text-gray-400 text-sm">${timeAgo}</td>
        <td class="px-3 py-2">
          <button onclick="window.deleteLogEntry('${log.id}')" class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors" title="Delete this log entry">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Helper function to format timestamp as "time ago"
function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
