#ifndef OCCUPANCY_TRACKER_H
#define OCCUPANCY_TRACKER_H

#include <Arduino.h>
#include <map>
#include <vector>

/**
 * @brief OccupancyStatus - Structure to hold occupancy data for a professor
 */
struct OccupancyStatus {
    String uid;                    // RFID card UID
    String name;                   // Professor name
    bool isIn;                     // Current IN/OUT status
    unsigned long lastToggleTime;  // Timestamp of last status change
    
    // Constructor
    OccupancyStatus() : isIn(false), lastToggleTime(0) {}
    
    OccupancyStatus(const String& uid, const String& name, bool isIn, unsigned long lastToggleTime)
        : uid(uid), name(name), isIn(isIn), lastToggleTime(lastToggleTime) {}
};

/**
 * @brief OccupancyTracker - Tracks faculty room occupancy state
 * 
 * This class manages the IN/OUT status of professors in the faculty room.
 * Supports multiple professors being IN simultaneously without limit.
 * Provides toggle functionality for status changes on card tap.
 */
class OccupancyTracker {
public:
    /**
     * @brief Initialize the occupancy tracker
     * 
     * Initializes internal data structures. Should be called once at startup.
     */
    void initialize();
    
    /**
     * @brief Toggle occupancy status for a professor
     * 
     * Toggles the professor's status between IN and OUT.
     * If professor is OUT, sets to IN. If professor is IN, sets to OUT.
     * 
     * @param uid RFID card UID
     * @param name Professor name
     * @return bool New status after toggle (true = IN, false = OUT)
     * 
     * Requirements: 4.2, 4.3
     * Property: Tapping toggles status between IN and OUT
     */
    bool toggleOccupancy(const String& uid, const String& name);
    
    /**
     * @brief Check if professor is currently IN
     * 
     * Checks the current IN/OUT status of a professor.
     * 
     * @param uid RFID card UID
     * @return true if professor is IN, false if OUT or not tracked
     * 
     * Requirements: 4.2, 4.3
     */
    bool isCurrentlyIn(const String& uid);
    
    /**
     * @brief Get list of current occupants
     * 
     * Returns a vector of all professors currently IN.
     * 
     * @return std::vector<OccupancyStatus> Vector of occupancy status for all IN professors
     * 
     * Requirements: 4.4, 9.1
     */
    std::vector<OccupancyStatus> getCurrentOccupants();
    
    /**
     * @brief Get occupancy count
     * 
     * Returns the number of professors currently IN.
     * 
     * @return int Number of professors with IN status
     * 
     * Requirements: 4.6, 19.1, 19.2, 19.5
     * Property: Count equals number of professors with IN status
     */
    int getOccupantCount();
    
    /**
     * @brief Clear all occupancy data
     * 
     * Removes all professors from tracking.
     * Used for testing or system reset.
     */
    void clearOccupancy();

private:
    std::map<String, OccupancyStatus> occupancyMap;  // UID -> OccupancyStatus mapping
};

#endif // OCCUPANCY_TRACKER_H
