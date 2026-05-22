#include "OccupancyTracker.h"

/**
 * @brief Initialize the occupancy tracker
 */
void OccupancyTracker::initialize() {
    // Clear any existing data
    occupancyMap.clear();
}

/**
 * @brief Toggle occupancy status for a professor
 * 
 * Toggles between IN and OUT status. If professor doesn't exist in map,
 * creates new entry with IN status.
 */
bool OccupancyTracker::toggleOccupancy(const String& uid, const String& name) {
    // Check if professor exists in map
    auto it = occupancyMap.find(uid);
    
    if (it != occupancyMap.end()) {
        // Professor exists - toggle status
        it->second.isIn = !it->second.isIn;
        it->second.lastToggleTime = millis();
        return it->second.isIn;
    } else {
        // Professor doesn't exist - create new entry with IN status
        OccupancyStatus status(uid, name, true, millis());
        occupancyMap[uid] = status;
        return true;
    }
}

/**
 * @brief Check if professor is currently IN
 */
bool OccupancyTracker::isCurrentlyIn(const String& uid) {
    // Find professor in map
    auto it = occupancyMap.find(uid);
    
    if (it != occupancyMap.end()) {
        return it->second.isIn;
    }
    
    return false;  // Not tracked or OUT
}

/**
 * @brief Get list of current occupants
 * 
 * Returns only professors with IN status.
 */
std::vector<OccupancyStatus> OccupancyTracker::getCurrentOccupants() {
    std::vector<OccupancyStatus> occupants;
    
    // Iterate through all professors and collect those with IN status
    for (const auto& pair : occupancyMap) {
        if (pair.second.isIn) {
            occupants.push_back(pair.second);
        }
    }
    
    return occupants;
}

/**
 * @brief Get occupancy count
 * 
 * Counts the number of professors with IN status.
 */
int OccupancyTracker::getOccupantCount() {
    int count = 0;
    
    // Count professors with IN status
    for (const auto& pair : occupancyMap) {
        if (pair.second.isIn) {
            count++;
        }
    }
    
    return count;
}

/**
 * @brief Clear all occupancy data
 */
void OccupancyTracker::clearOccupancy() {
    occupancyMap.clear();
}
