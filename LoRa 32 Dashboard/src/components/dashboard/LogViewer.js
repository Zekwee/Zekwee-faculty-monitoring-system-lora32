import { formatTimestamp } from "../../utils/dateFormat.js";
import { classifyRSSI, classifySNR, getQualityColorClass, formatRSSI, formatSNR } from "../../utils/signalQuality.js";

export default function LogViewer(logs) {
  if (!logs || logs.length === 0) {
    return `
      <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg font-medium">No monitoring logs found</p>
        <p class="text-sm mt-2">Logs will appear here when faculty activity is detected</p>
      </div>
    `;
  }

  // Desktop table view
  const tableView = `
    <div class="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSSI</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNR</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${logs.map(log => {
            const rssiQuality = classifyRSSI(log.rssi);
            const snrQuality = classifySNR(log.snr);
            const rssiColorClass = getQualityColorClass(rssiQuality);
            const snrColorClass = getQualityColorClass(snrQuality);
            
            return `
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${log.uid || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.room_id || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.status === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }">
                    ${log.status || 'N/A'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${rssiColorClass}">${formatRSSI(log.rssi)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${snrColorClass}">${formatSNR(log.snr)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Mobile card view
  const cardView = `
    <div class="md:hidden space-y-4">
      ${logs.map(log => {
        const rssiQuality = classifyRSSI(log.rssi);
        const snrQuality = classifySNR(log.snr);
        const rssiColorClass = getQualityColorClass(rssiQuality);
        const snrColorClass = getQualityColorClass(snrQuality);
        
        return `
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-start mb-3">
              <div class="font-mono text-sm font-medium text-gray-900">${log.uid || 'N/A'}</div>
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                log.status === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }">
                ${log.status || 'N/A'}
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Room:</span>
                <span class="font-medium text-gray-900">${log.room_id || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Time:</span>
                <span class="font-medium text-gray-900">${formatTimestamp(log.timestamp)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">RSSI:</span>
                <span class="font-medium ${rssiColorClass}">${formatRSSI(log.rssi)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">SNR:</span>
                <span class="font-medium ${snrColorClass}">${formatSNR(log.snr)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return `
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Monitoring Logs</h2>
        <span class="text-sm text-gray-600">Latest ${logs.length} entries</span>
      </div>
      ${tableView}
      ${cardView}
    </div>
  `;
}
