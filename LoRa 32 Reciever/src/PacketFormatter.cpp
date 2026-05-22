#include "PacketFormatter.h"

/**
 * @brief Format RFID packet
 * 
 * Creates a packet string in the format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
 */
String PacketFormatter::formatRFIDPacket(const String& uid, unsigned long timestamp, 
                                         const String& status, const String& roomId) {
    // Build packet string with proper delimiters
    String packet = "RFID:";
    packet += uid;
    packet += ":";
    packet += String(timestamp);
    packet += ":";
    packet += status;
    packet += ":";
    packet += roomId;
    
    return packet;
}

/**
 * @brief Format whitelist update message
 * 
 * Creates a whitelist update message: "WHITELIST_UPDATE:<UID>:<action>"
 */
String PacketFormatter::formatWhitelistUpdate(const String& uid, const String& action) {
    String message = "WHITELIST_UPDATE:";
    message += uid;
    message += ":";
    message += action;
    
    return message;
}

/**
 * @brief Format whitelist sync message
 * 
 * Creates a full whitelist sync message: "WHITELIST_SYNC:<UID1>,<UID2>,...,<UIDn>"
 */
String PacketFormatter::formatWhitelistSync(const std::vector<String>& uids) {
    String message = "WHITELIST_SYNC:";
    
    // Append UIDs separated by commas
    for (size_t i = 0; i < uids.size(); i++) {
        message += uids[i];
        
        // Add comma separator except after last UID
        if (i < uids.size() - 1) {
            message += ",";
        }
    }
    
    return message;
}

/**
 * @brief Split whitelist sync into multiple packets
 * 
 * Splits a large whitelist into multiple packets, each under maxPacketSize.
 * Each packet has format: "WHITELIST_SYNC:<UID1>,<UID2>,...,<UIDn>"
 */
std::vector<String> PacketFormatter::splitWhitelistSync(const std::vector<String>& uids, 
                                                        size_t maxPacketSize) {
    std::vector<String> packets;
    
    // Handle empty whitelist
    if (uids.empty()) {
        packets.push_back("WHITELIST_SYNC:");
        return packets;
    }
    
    // Build packets incrementally
    String currentPacket = "WHITELIST_SYNC:";
    const String prefix = "WHITELIST_SYNC:";
    
    for (size_t i = 0; i < uids.size(); i++) {
        // Calculate size if we add this UID
        String testPacket = currentPacket;
        if (currentPacket != prefix) {
            testPacket += ",";  // Add comma separator
        }
        testPacket += uids[i];
        
        // Check if adding this UID would exceed max size
        if (testPacket.length() > maxPacketSize && currentPacket != prefix) {
            // Save current packet and start new one
            packets.push_back(currentPacket);
            currentPacket = prefix + uids[i];
        } else {
            // Add UID to current packet
            if (currentPacket != prefix) {
                currentPacket += ",";
            }
            currentPacket += uids[i];
        }
    }
    
    // Add final packet if not empty
    if (currentPacket != prefix) {
        packets.push_back(currentPacket);
    }
    
    return packets;
}

/**
 * @brief Validate formatted packet
 * 
 * Basic validation to ensure packet has correct structure.
 * More comprehensive validation is done by PacketParser.
 */
bool PacketFormatter::isValidPacket(const String& packet) {
    // Check for minimum length
    if (packet.length() < 5) {
        return false;
    }
    
    // Check for RFID prefix
    if (packet.startsWith("RFID:")) {
        // Count colons (should be 4 for RFID packets)
        int colonCount = 0;
        for (unsigned int i = 0; i < packet.length(); i++) {
            if (packet.charAt(i) == ':') {
                colonCount++;
            }
        }
        return colonCount == 4;
    }
    
    // Check for WHITELIST_UPDATE prefix
    if (packet.startsWith("WHITELIST_UPDATE:")) {
        // Should have 2 colons
        int colonCount = 0;
        for (unsigned int i = 0; i < packet.length(); i++) {
            if (packet.charAt(i) == ':') {
                colonCount++;
            }
        }
        return colonCount == 2;
    }
    
    // Check for WHITELIST_SYNC prefix
    if (packet.startsWith("WHITELIST_SYNC:")) {
        // Should have at least 1 colon
        return packet.indexOf(':') != -1;
    }
    
    return false;
}
