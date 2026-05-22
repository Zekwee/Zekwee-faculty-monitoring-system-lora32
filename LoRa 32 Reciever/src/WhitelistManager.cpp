#include "WhitelistManager.h"

/**
 * @brief Initialize the whitelist manager
 */
void WhitelistManager::initialize() {
    // Clear any existing data
    whitelist.clear();
}

/**
 * @brief Check if UID is in whitelist
 */
bool WhitelistManager::isInWhitelist(const String& uid) {
    // Use std::map::find for efficient lookup
    return whitelist.find(uid) != whitelist.end();
}

/**
 * @brief Add professor to whitelist
 */
void WhitelistManager::addToWhitelist(const String& uid, const String& name) {
    // Insert or update UID -> Name mapping
    whitelist[uid] = name;
}

/**
 * @brief Remove professor from whitelist
 */
void WhitelistManager::removeFromWhitelist(const String& uid) {
    // Erase UID from map (no-op if UID doesn't exist)
    whitelist.erase(uid);
}

/**
 * @brief Get all UIDs in whitelist
 */
std::vector<String> WhitelistManager::getAllUIDs() {
    std::vector<String> uids;
    
    // Extract all keys from the map
    for (const auto& pair : whitelist) {
        uids.push_back(pair.first);
    }
    
    return uids;
}

/**
 * @brief Get professor name by UID
 */
String WhitelistManager::getProfessorName(const String& uid) {
    // Find UID in map
    auto it = whitelist.find(uid);
    
    if (it != whitelist.end()) {
        return it->second;  // Return name
    }
    
    return "";  // Return empty string if not found
}

/**
 * @brief Get whitelist size
 */
size_t WhitelistManager::getWhitelistSize() {
    return whitelist.size();
}

/**
 * @brief Clear whitelist
 */
void WhitelistManager::clearWhitelist() {
    whitelist.clear();
}
