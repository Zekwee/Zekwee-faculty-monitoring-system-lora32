import { get24HoursAgo } from "../../utils/dateFormat.js";
import { formatTimestamp } from "../../utils/dateFormat.js";

export default function RoomStatus(logs) {
  // Filter logs from past 24 hours
  const twentyFourHoursAgo = get24HoursAgo();
  const recentLogs = logs.filter(log => log.timestamp >= twentyFourHoursAgo);

  if (recentLogs.length === 0) {
    return `
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Room Activity (24h)</h2>
        <div class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p>No room activity in the past 24 hours</p>
        </div>
      </div>
    `;
  }

  // Group logs by room_id
  const roomGroups = {};
  recentLogs.forEach(log => {
    if (!roomGroups[log.room_id]) {
      roomGroups[log.room_id] = [];
    }
    roomGroups[log.room_id].push(log);
  });

  // Calculate room statistics
  const roomStats = Object.keys(roomGroups).map(roomId => {
    const roomLogs = roomGroups[roomId];
    
    // Sort by timestamp descending to get most recent
    roomLogs.sort((a, b) => b.timestamp - a.timestamp);
    
    const latestLog = roomLogs[0];
    
    return {
      roomId: roomId,
      logCount: roomLogs.length,
      latestStatus: latestLog.status,
      latestTimestamp: latestLog.timestamp
    };
  });

  // Sort rooms by most recent activity
  roomStats.sort((a, b) => b.latestTimestamp - a.latestTimestamp);

  return `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Room Activity (24h)</h2>
      <div class="space-y-3">
        ${roomStats.map(room => `
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <div class="font-medium text-gray-900">${room.roomId}</div>
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                room.latestStatus === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }">
                ${room.latestStatus}
              </span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <div class="flex justify-between">
                <span>Total Logs:</span>
                <span class="font-medium text-gray-900">${room.logCount}</span>
              </div>
              <div class="flex justify-between">
                <span>Last Activity:</span>
                <span class="font-medium text-gray-900">${formatTimestamp(room.latestTimestamp)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
