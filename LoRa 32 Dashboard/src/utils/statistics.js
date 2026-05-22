import { getStartOfToday, getEndOfToday, get7DaysAgo } from './dateFormat.js';
import { isGoodSignal } from './signalQuality.js';

/**
 * Calculate total logs for today
 * @param {Array} logs - Array of log objects
 * @returns {number} Count of logs from today
 */
export function calculateTotalLogsToday(logs) {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  return logs.filter(log => 
    log.timestamp >= startOfToday && log.timestamp <= endOfToday
  ).length;
}

/**
 * Calculate unique UIDs detected today
 * @param {Array} logs - Array of log objects
 * @returns {number} Count of unique UIDs from today
 */
export function calculateUniqueUIDsToday(logs) {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  const todayLogs = logs.filter(log => 
    log.timestamp >= startOfToday && log.timestamp <= endOfToday
  );
  
  const uniqueUIDs = new Set(todayLogs.map(log => log.uid));
  return uniqueUIDs.size;
}

/**
 * Calculate average RSSI value from logs today
 * @param {Array} logs - Array of log objects
 * @returns {number} Average RSSI value (or 0 if no logs)
 */
export function calculateAverageRSSI(logs) {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  const todayLogs = logs.filter(log => 
    log.timestamp >= startOfToday && 
    log.timestamp <= endOfToday &&
    log.rssi !== null &&
    log.rssi !== undefined
  );
  
  if (todayLogs.length === 0) return 0;
  
  const sum = todayLogs.reduce((acc, log) => acc + log.rssi, 0);
  return Math.round((sum / todayLogs.length) * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate average SNR value from logs today
 * @param {Array} logs - Array of log objects
 * @returns {number} Average SNR value (or 0 if no logs)
 */
export function calculateAverageSNR(logs) {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  const todayLogs = logs.filter(log => 
    log.timestamp >= startOfToday && 
    log.timestamp <= endOfToday &&
    log.snr !== null &&
    log.snr !== undefined
  );
  
  if (todayLogs.length === 0) return 0;
  
  const sum = todayLogs.reduce((acc, log) => acc + log.snr, 0);
  return Math.round((sum / todayLogs.length) * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate signal quality percentage (logs with good signal)
 * @param {Array} logs - Array of log objects
 * @returns {number} Percentage of logs with good signal (0-100)
 */
export function calculateSignalQualityPercent(logs) {
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();
  
  const todayLogs = logs.filter(log => 
    log.timestamp >= startOfToday && 
    log.timestamp <= endOfToday &&
    log.rssi !== null &&
    log.rssi !== undefined &&
    log.snr !== null &&
    log.snr !== undefined
  );
  
  if (todayLogs.length === 0) return 0;
  
  const goodSignalCount = todayLogs.filter(log => 
    isGoodSignal(log.rssi, log.snr)
  ).length;
  
  return Math.round((goodSignalCount / todayLogs.length) * 100);
}

/**
 * Calculate all statistics for today
 * @param {Array} logs - Array of log objects
 * @returns {Object} Statistics object
 */
export function calculateStatistics(logs) {
  return {
    totalLogsToday: calculateTotalLogsToday(logs),
    uniqueUIDsToday: calculateUniqueUIDsToday(logs),
    averageRSSI: calculateAverageRSSI(logs),
    averageSNR: calculateAverageSNR(logs),
    signalQualityPercent: calculateSignalQualityPercent(logs)
  };
}

/**
 * Calculate total logs from past 7 days
 * @param {Array} logs - Array of log objects
 * @returns {number} Count of logs from past 7 days
 */
export function calculateTotalLogs7Days(logs) {
  const sevenDaysAgo = get7DaysAgo();
  return logs.filter(log => log.timestamp >= sevenDaysAgo).length;
}

/**
 * Calculate unique UIDs detected in past 7 days
 * @param {Array} logs - Array of log objects
 * @returns {number} Count of unique UIDs from past 7 days
 */
export function calculateUniqueUIDs7Days(logs) {
  const sevenDaysAgo = get7DaysAgo();
  const recentLogs = logs.filter(log => log.timestamp >= sevenDaysAgo);
  const uniqueUIDs = new Set(recentLogs.map(log => log.uid));
  return uniqueUIDs.size;
}
