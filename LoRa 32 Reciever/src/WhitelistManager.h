#ifndef WHITELIST_MANAGER_H
#define WHITELIST_MANAGER_H

#include <Arduino.h>
#include <map>
#include <vector>

/**
 * @brief WhitelistManager - Manages professor whitelist and verification
 * 
 * This class maintains an in-memory whitelist of authorized professors,
 * mapping RFID UIDs to professor names. Provides methods for adding,
 * removing, and verifying UIDs against the whitelist.
 */
class WhitelistManager {
public:
    /**
     * @brief Initialize the whitelist manager
     * 
     * Initializes internal data structures. Should be called once at startup.
     */
    void initialize();
    
    /**
     * @brief Check if UID is in whitelist
     * 
     * Verifies if a given UID exists in the whitelist.
     * 
     * @param uid RFID card UID to check
     * @return true if UID is in whitelist, false otherwise
     * 
     * Requirements: 4.1, 6.1
     * Property: Returns true iff UID exists in whitelist
     */
    bool isInWhitelist(const String& uid);
    
    /**
     * @brief Add professor to whitelist
     * 
     * Adds a professor's UID and name to the whitelist.
     * If UID already exists, updates the name.
     * 
     * @param uid RFID card UID
     * @param name Professor name
     * 
     * Requirements: 3.2, 3.4
     */
    void addToWhitelist(const String& uid, const String& name);
    
    /**
     * @brief Remove professor from whitelist
     * 
     * Removes a professor's UID from the whitelist.
     * If UID doesn't exist, no action is taken.
     * 
     * @param uid RFID card UID to remove
     * 
     * Requirements: 3.5
     */
    void removeFromWhitelist(const String& uid);
    
    /**
     * @brief Get all UIDs in whitelist
     * 
     * Returns a vector of all UIDs currently in the whitelist.
     * Used for whitelist sync broadcasting.
     * 
     * @return std::vector<String> Vector of all UIDs
     * 
     * Requirements: 8.4
     */
    std::vector<String> getAllUIDs();
    
    /**
     * @brief Get professor name by UID
     * 
     * Retrieves the professor name associated with a UID.
     * 
     * @param uid RFID card UID
     * @return String Professor name, or empty string if UID not found
     * 
     * Requirements: 9.3, 10.2
     */
    String getProfessorName(const String& uid);
    
    /**
     * @brief Get whitelist size
     * 
     * Returns the number of professors in the whitelist.
     * 
     * @return size_t Number of professors
     * 
     * Requirements: 8.5
     */
    size_t getWhitelistSize();
    
    /**
     * @brief Clear whitelist
     * 
     * Removes all professors from the whitelist.
     * Used for testing or full whitelist reload.
     */
    void clearWhitelist();

private:
    std::map<String, String> whitelist;  // UID -> Name mapping
};

#endif // WHITELIST_MANAGER_H
