import { calculateStatistics } from "../../utils/statistics.js";

export default function Statistics(logs) {
  const stats = calculateStatistics(logs);
  
  const isSignalQualityPoor = stats.signalQualityPercent < 50;

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Logs Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Total Logs Today</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">${stats.totalLogsToday}</div>
      </div>

      <!-- Unique UIDs Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Unique UIDs Today</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">${stats.uniqueUIDsToday}</div>
      </div>

      <!-- Average RSSI -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Average RSSI</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">
          ${stats.averageRSSI !== 0 ? stats.averageRSSI + ' dBm' : 'N/A'}
        </div>
      </div>

      <!-- Average SNR -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Average SNR</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">
          ${stats.averageSNR !== 0 ? stats.averageSNR + ' dB' : 'N/A'}
        </div>
      </div>
    </div>

    <!-- Signal Quality Summary -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-medium text-gray-600">Signal Quality</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">${stats.signalQualityPercent}%</div>
          <div class="text-sm text-gray-500 mt-1">Logs with good signal (RSSI > -50 dBm, SNR > 8 dB)</div>
        </div>
        ${isSignalQualityPoor ? `
          <div class="flex items-center text-red-600">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span class="font-medium">Poor Signal Quality</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
