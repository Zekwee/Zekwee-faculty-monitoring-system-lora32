import { formatTimestamp } from './dateFormat.js';

/**
 * Export logs to CSV format and trigger download
 * @param {Array} logs - Array of log objects to export
 */
export function exportToCSV(logs) {
  if (!logs || logs.length === 0) {
    alert('No logs to export');
    return;
  }

  // CSV header row
  const headers = ['UID', 'Room ID', 'Status', 'Timestamp', 'RSSI', 'SNR', 'Logged At'];
  
  // Convert logs to CSV rows
  const rows = logs.map(log => [
    log.uid || '',
    log.room_id || '',
    log.status || '',
    formatTimestamp(log.timestamp),
    log.rssi !== null && log.rssi !== undefined ? log.rssi : '',
    log.snr !== null && log.snr !== undefined ? log.snr : '',
    log.logged_at || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape cells containing commas or quotes
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(','))
  ].join('\n');

  // Generate filename with current timestamp
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const filename = `faculty_logs_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.csv`;

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
