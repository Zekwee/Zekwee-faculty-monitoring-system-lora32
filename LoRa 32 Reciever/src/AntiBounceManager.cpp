#include "AntiBounceManager.h"

/**
 * @brief Initialize the anti-bounce manager
 */
void AntiBounceManager::initialize() {
    // Clear any existing data
    lastReadTimes.clear();
}

/**
 * @brief Check if card should be processed
 * 
 * Returns true if:
 * - This is the first read of this UID, OR
 * - More than COOLDOWN_MS milliseconds have passed since last read
 */
bool AntiBounceManager::shouldProcessCard(const String& uid) {
    // Get current time
    unsigned long currentTime = millis();
    
    // Check if UID exists in map
    auto it = lastReadTimes.find(uid);
    
    if (it == lastReadTimes.end()) {
        // First read of this UID - should process
        return true;
    }
    
    // Check if cooldown period has expired
    unsigned long lastReadTime = it->second;
    unsigned long timeSinceLastRead = currentTime - lastReadTime;
    
    // Handle millis() overflow (wraps around every ~50 days)
    // If currentTime < lastReadTime, overflow occurred
    if (currentTime < lastReadTime) {
        // After overflow, allow processing
        return true;
    }
    
    // Check if cooldown has expired
    return timeSinceLastRead >= COOLDOWN_MS;
}

/**
 * @brief Record card read
 * 
 * Updates the last read time for this UID to the current time.
 */
void AntiBounceManager::recordCardRead(const String& uid) {
    lastReadTimes[uid] = millis();
}

/**
 * @brief Clear all cooldowns
 */
void AntiBounceManager::clearCooldowns() {
    lastReadTimes.clear();
}
