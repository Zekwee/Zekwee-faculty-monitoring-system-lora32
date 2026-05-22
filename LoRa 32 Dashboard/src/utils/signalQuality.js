/**
 * Classify RSSI signal quality
 * @param {number} rssi - RSSI value in dBm
 * @returns {string} Quality classification: 'good', 'fair', or 'poor'
 */
export function classifyRSSI(rssi) {
  if (rssi > -50) return 'good';
  if (rssi >= -70) return 'fair';
  return 'poor';
}

/**
 * Classify SNR signal quality
 * @param {number} snr - SNR value in dB
 * @returns {string} Quality classification: 'good', 'fair', or 'poor'
 */
export function classifySNR(snr) {
  if (snr > 8) return 'good';
  if (snr >= 5) return 'fair';
  return 'poor';
}

/**
 * Get Tailwind CSS color class for signal quality
 * @param {string} quality - Quality classification: 'good', 'fair', or 'poor'
 * @returns {string} Tailwind CSS color class
 */
export function getQualityColorClass(quality) {
  switch (quality) {
    case 'good':
      return 'text-green-600';
    case 'fair':
      return 'text-yellow-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get background color class for signal quality
 * @param {string} quality - Quality classification: 'good', 'fair', or 'poor'
 * @returns {string} Tailwind CSS background color class
 */
export function getQualityBgClass(quality) {
  switch (quality) {
    case 'good':
      return 'bg-green-100 text-green-800';
    case 'fair':
      return 'bg-yellow-100 text-yellow-800';
    case 'poor':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Format RSSI value with unit
 * @param {number} rssi - RSSI value
 * @returns {string} Formatted RSSI with unit (e.g., "-45 dBm")
 */
export function formatRSSI(rssi) {
  if (rssi === null || rssi === undefined) return 'N/A';
  return `${rssi} dBm`;
}

/**
 * Format SNR value with unit
 * @param {number} snr - SNR value
 * @returns {string} Formatted SNR with unit (e.g., "9.75 dB")
 */
export function formatSNR(snr) {
  if (snr === null || snr === undefined) return 'N/A';
  return `${snr} dB`;
}

/**
 * Check if signal quality is good (both RSSI and SNR)
 * @param {number} rssi - RSSI value in dBm
 * @param {number} snr - SNR value in dB
 * @returns {boolean} True if both RSSI > -50 and SNR > 8
 */
export function isGoodSignal(rssi, snr) {
  return rssi > -50 && snr > 8;
}
