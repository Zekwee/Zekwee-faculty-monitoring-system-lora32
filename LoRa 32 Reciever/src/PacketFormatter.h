#ifndef PACKET_FORMATTER_H
#define PACKET_FORMATTER_H

#include <Arduino.h>
#include <vector>

/**
 * @brief PacketFormatter - Pure functions for formatting LoRa packets
 * 
 * This class provides static utility functions for formatting LoRa packets
 * for transmission. Supports RFID packets, whitelist updates, and whitelist
 * sync messages. All functions are pure (no side effects) and can be tested
 * with property-based testing.
 */
class PacketFormatter {
public:
    /**
     * @brief Format RFID packet
     * 
     * Formats an RFID packet with the standard format:
     * "RFID:<UID>:<timestamp>:<status>:<room_id>"
     * 
     * @param uid RFID card UID in hex format (e.g., "A3:4F:2E:91")
     * @param timestamp Timestamp in milliseconds
     * @param status Status string ("IN" or "OUT")
     * @param roomId Room identifier string
     * @return String Formatted RFID packet
     * 
     * Requirements: 18.1
     * Property: For all valid inputs, formatting then parsing produces original data
     */
    static String formatRFIDPacket(const String& uid, unsigned long timestamp, 
                                   const String& status, const String& roomId);
    
    /**
     * @brief Format whitelist update message
     * 
     * Formats a whitelist update message for broadcasting to transmitters:
     * "WHITELIST_UPDATE:<UID>:<action>"
     * 
     * @param uid RFID card UID to add or remove
     * @param action Action string ("ADD" or "REMOVE")
     * @return String Formatted whitelist update message
     * 
     * Requirements: 18.2, 8.1, 8.2
     */
    static String formatWhitelistUpdate(const String& uid, const String& action);
    
    /**
     * @brief Format whitelist sync message
     * 
     * Formats a full whitelist sync message for broadcasting to transmitters:
     * "WHITELIST_SYNC:<UID1>,<UID2>,...,<UIDn>"
     * 
     * @param uids Vector of UIDs to include in sync
     * @return String Formatted whitelist sync message
     * 
     * Requirements: 18.3, 8.4
     */
    static String formatWhitelistSync(const std::vector<String>& uids);
    
    /**
     * @brief Split whitelist sync into multiple packets
     * 
     * Splits a large whitelist into multiple sync packets, each under the
     * maximum packet size. Used when whitelist contains more than 50 professors.
     * 
     * @param uids Vector of UIDs to split
     * @param maxPacketSize Maximum size of each packet in bytes (default 200)
     * @return std::vector<String> Vector of formatted sync packets
     * 
     * Requirements: 8.5
     * Property: All UIDs present across packets, no packet exceeds maxPacketSize
     */
    static std::vector<String> splitWhitelistSync(const std::vector<String>& uids, 
                                                   size_t maxPacketSize = 200);

private:
    /**
     * @brief Validate formatted packet
     * 
     * Checks if a formatted packet is valid according to parser rules.
     * Used internally to ensure formatted packets are parseable.
     * 
     * @param packet Formatted packet string
     * @return true if packet is valid, false otherwise
     */
    static bool isValidPacket(const String& packet);
};

#endif // PACKET_FORMATTER_H
