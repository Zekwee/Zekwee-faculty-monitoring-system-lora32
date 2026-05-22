#ifndef ANTI_BOUNCE_MANAGER_H
#define ANTI_BOUNCE_MANAGER_H

#include <Arduino.h>
#include <map>

/**
 * @brief AntiBounceManager - Prevents duplicate RFID card reads
 * 
 * This class implements a cooldown mechanism to prevent duplicate card reads
 * within a specified time window. Each UID has an independent cooldown timer.
 */
class AntiBounceManager {
public:
    /**
     * @brief Initialize the anti-bounce manager
     * 
     * Initializes internal data structures. Should be called once at startup.
     */
    void initialize();
    
    /**
     * @brief Check if card should be processed
     * 
     * Checks if enough time has passed since the last read of this UID.
     * Returns true if the card should be processed (cooldown expired or first read).
     * Returns false if the card is still in cooldown period.
     * 
     * @param uid RFID card UID
     * @return true if card should be processed, false if in cooldown
     * 
     * Requirements: 5.2, 5.3
     * Property: UIDs in cooldown are ignored
     */
    bool shouldProcessCard(const String& uid);
    
    /**
     * @brief Record card read
     * 
     * Records the current time as the last read time for this UID.
     * Should be called after successfully processing a card.
     * 
     * @param uid RFID card UID
     * 
     * Requirements: 5.2
     */
    void recordCardRead(const String& uid);
    
    /**
     * @brief Clear all cooldowns
     * 
     * Removes all cooldown timers.
     * Used for testing or system reset.
     */
    void clearCooldowns();

private:
    std::map<String, unsigned long> lastReadTimes;  // UID -> Last read timestamp mapping
    static const unsigned long COOLDOWN_MS = 5000;  // 5-second cooldown period
};

#endif // ANTI_BOUNCE_MANAGER_H
