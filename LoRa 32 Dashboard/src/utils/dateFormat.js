/**
 * Format Unix timestamp to human-readable date and time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string (YYYY-MM-DD HH:MM:SS)
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse formatted date string back to Unix timestamp
 * @param {string} dateString - Formatted date string (YYYY-MM-DD HH:MM:SS)
 * @returns {number} Unix timestamp in milliseconds
 */
export function parseFormattedDate(dateString) {
  return new Date(dateString).getTime();
}

/**
 * Get start of today (midnight) as Unix timestamp
 * @returns {number} Unix timestamp in milliseconds
 */
export function getStartOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

/**
 * Get end of today (23:59:59) as Unix timestamp
 * @returns {number} Unix timestamp in milliseconds
 */
export function getEndOfToday() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

/**
 * Get timestamp for 24 hours ago
 * @returns {number} Unix timestamp in milliseconds
 */
export function get24HoursAgo() {
  return Date.now() - (24 * 60 * 60 * 1000);
}

/**
 * Get timestamp for 7 days ago
 * @returns {number} Unix timestamp in milliseconds
 */
export function get7DaysAgo() {
  return Date.now() - (7 * 24 * 60 * 60 * 1000);
}
