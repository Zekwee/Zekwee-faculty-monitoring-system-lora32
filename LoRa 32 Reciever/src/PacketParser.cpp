#include "PacketParser.h"

/**
 * @brief Parse received packet
 * 
 * Parses a received LoRa packet and extracts data based on packet type.
 */
ParsedPacket PacketParser::parsePacket(const String& packet) {
    ParsedPacket result;
    result.rawMessage = packet;
    
    // Check if it's an RFID packet
    if (isRFIDPacket(packet)) {
        result.isRFIDPacket = true;
        
        // Validate format
        if (validateRFIDFormat(packet)) {
            result.isValid = true;
            result.uid = extractUID(packet);
            result.timestamp = extractTimestamp(packet);
            result.status = extractStatus(packet);
            result.roomId = extractRoomId(packet);
        } else {
            result.isValid = false;
        }
    } else {
        // Legacy message format
        result.isRFIDPacket = false;
        result.isValid = true;  // Legacy messages are always "valid"
    }
    
    return result;
}

/**
 * @brief Extract status from RFID packet
 */
String PacketParser::extractStatus(const String& packet) {
    if (!isRFIDPacket(packet)) {
        return "";
    }
    
    // Format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
    // Work backwards: find last 2 colons
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1) return "";
    
    int secondLastColon = packet.lastIndexOf(':', lastColon - 1);
    if (secondLastColon == -1) return "";
    
    // Extract status between secondLastColon and lastColon
    String status = packet.substring(secondLastColon + 1, lastColon);
    return status;
}

/**
 * @brief Extract room ID from RFID packet
 */
String PacketParser::extractRoomId(const String& packet) {
    if (!isRFIDPacket(packet)) {
        return "";
    }
    
    // Format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
    // Room ID is after the last colon
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1) return "";
    
    // Extract room ID after last colon
    String roomId = packet.substring(lastColon + 1);
    return roomId;
}

/**
 * @brief Check if packet is RFID format
 */
bool PacketParser::isRFIDPacket(const String& packet) {
    return packet.startsWith("RFID:");
}

/**
 * @brief Extract UID from RFID packet
 */
String PacketParser::extractUID(const String& packet) {
    if (!isRFIDPacket(packet)) {
        return "";
    }
    
    // Format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
    // UID can contain colons, so we work backwards
    // Find the last 3 colons (room_id, status, timestamp)
    
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1) return "";
    
    int secondLastColon = packet.lastIndexOf(':', lastColon - 1);
    if (secondLastColon == -1) return "";
    
    int thirdLastColon = packet.lastIndexOf(':', secondLastColon - 1);
    if (thirdLastColon == -1) return "";
    
    // Find first colon (after "RFID")
    int firstColon = packet.indexOf(':');
    if (firstColon == -1) return "";
    
    // Extract UID between firstColon and thirdLastColon
    String uid = packet.substring(firstColon + 1, thirdLastColon);
    return uid;
}

/**
 * @brief Extract timestamp from RFID packet
 */
unsigned long PacketParser::extractTimestamp(const String& packet) {
    if (!isRFIDPacket(packet)) {
        return 0;
    }
    
    // Format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
    // UID can contain colons, so we need to find timestamp by working backwards
    // Find the last 3 colons (room_id, status, timestamp)
    
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1) return 0;
    
    int secondLastColon = packet.lastIndexOf(':', lastColon - 1);
    if (secondLastColon == -1) return 0;
    
    int thirdLastColon = packet.lastIndexOf(':', secondLastColon - 1);
    if (thirdLastColon == -1) return 0;
    
    // Extract timestamp between thirdLastColon and secondLastColon
    String timestampStr = packet.substring(thirdLastColon + 1, secondLastColon);
    
    // Convert to unsigned long
    unsigned long timestamp = timestampStr.toInt();
    return timestamp;
}

/**
 * @brief Validate RFID packet format
 */
bool PacketParser::validateRFIDFormat(const String& packet) {
    if (!isRFIDPacket(packet)) {
        return false;
    }
    
    // Format: "RFID:<UID>:<timestamp>:<status>:<room_id>"
    // UID can contain colons (e.g., "D9:1B:2E:12")
    // So we need at least 4 colons after "RFID:"
    
    int colonCount = 0;
    for (unsigned int i = 0; i < packet.length(); i++) {
        if (packet.charAt(i) == ':') {
            colonCount++;
        }
    }
    
    // Must have at least 4 colons (RFID: + UID + timestamp + status + room_id)
    // UID may have additional colons
    if (colonCount < 4) {
        return false;
    }
    
    // Extract and validate each field
    String uid = extractUID(packet);
    if (uid.length() == 0) {
        return false;
    }
    
    // Validate UID format (optional - can be made stricter)
    if (!validateUIDFormat(uid)) {
        return false;
    }
    
    // Check that we have status and room_id fields
    String status = extractStatus(packet);
    String roomId = extractRoomId(packet);
    
    if (status.length() == 0 || roomId.length() == 0) {
        return false;
    }
    
    return true;
}

/**
 * @brief Validate UID hex format
 * 
 * Checks if the UID string has valid hex format with colons.
 * Valid formats: "XX:XX:XX:XX" (4 bytes), "XX:XX:XX:XX:XX:XX:XX" (7 bytes),
 * or "XX:XX:XX:XX:XX:XX:XX:XX:XX:XX" (10 bytes)
 */
bool PacketParser::validateUIDFormat(const String& uid) {
    if (uid.length() == 0) {
        return false;
    }
    
    // Check for valid hex characters and colons
    for (unsigned int i = 0; i < uid.length(); i++) {
        char c = uid.charAt(i);
        bool isHex = (c >= '0' && c <= '9') || 
                     (c >= 'A' && c <= 'F') || 
                     (c >= 'a' && c <= 'f');
        bool isColon = (c == ':');
        
        if (!isHex && !isColon) {
            return false;
        }
    }
    
    // Count colons to determine UID length
    int colonCount = 0;
    for (unsigned int i = 0; i < uid.length(); i++) {
        if (uid.charAt(i) == ':') {
            colonCount++;
        }
    }
    
    // Valid UID formats:
    // 4 bytes: XX:XX:XX:XX (3 colons)
    // 7 bytes: XX:XX:XX:XX:XX:XX:XX (6 colons)
    // 10 bytes: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX (9 colons)
    if (colonCount == 3 || colonCount == 6 || colonCount == 9) {
        return true;
    }
    
    // Also accept any format with at least one colon (flexible validation)
    return colonCount > 0;
}
