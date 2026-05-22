#include "PacketParser.h"

ParsedPacket PacketParser::parsePacket(const String& packet) {
    ParsedPacket result;
    result.rawMessage = packet;
    
    // Check if packet is RFID format
    if (isRFIDPacket(packet)) {
        result.isRFIDPacket = true;
        
        // Validate RFID format
        if (!validateRFIDFormat(packet)) {
            result.isValid = false;
            return result;
        }
        
        // Extract UID and timestamp
        result.uid = extractUID(packet);
        result.timestamp = extractTimestamp(packet);
        
        // Validate extracted data
        if (result.uid.length() > 0 && result.timestamp > 0) {
            result.isValid = true;
        } else {
            result.isValid = false;
        }
    } else {
        // Legacy message format
        result.isRFIDPacket = false;
        result.isValid = true;  // Any non-RFID message is valid legacy format
        result.uid = "";
        result.timestamp = 0;
    }
    
    return result;
}

bool PacketParser::isRFIDPacket(const String& packet) {
    // Check if packet starts with "RFID:" prefix
    return packet.startsWith("RFID:");
}

String PacketParser::extractUID(const String& packet) {
    // Expected format: "RFID:<UID_hex>:<timestamp>"
    // Find the positions of the colons
    int firstColon = packet.indexOf(':');
    if (firstColon == -1) return "";
    
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1 || lastColon == firstColon) return "";
    
    // Extract UID substring between first and last colon
    String uid = packet.substring(firstColon + 1, lastColon);
    
    // Validate UID format
    if (!validateUIDFormat(uid)) {
        return "";
    }
    
    return uid;
}

unsigned long PacketParser::extractTimestamp(const String& packet) {
    // Expected format: "RFID:<UID_hex>:<timestamp>"
    // Find the last colon
    int lastColon = packet.lastIndexOf(':');
    if (lastColon == -1) return 0;
    
    // Extract timestamp substring after last colon
    String timestampStr = packet.substring(lastColon + 1);
    
    // Convert to unsigned long
    unsigned long timestamp = timestampStr.toInt();
    
    // Validate timestamp (should be > 0)
    if (timestamp == 0 && timestampStr != "0") {
        return 0;  // Invalid conversion
    }
    
    return timestamp;
}

bool PacketParser::validateRFIDFormat(const String& packet) {
    // Expected format: "RFID:<UID_hex>:<timestamp>"
    
    // Check minimum length: "RFID:XX:XX:XX:XX:0" = 18 characters (4-byte UID, timestamp=0)
    if (packet.length() < 18) {
        return false;
    }
    
    // Check prefix
    if (!packet.startsWith("RFID:")) {
        return false;
    }
    
    // Count colons (should be at least 6 for 4-byte UID + 1 for timestamp separator)
    int colonCount = 0;
    for (unsigned int i = 0; i < packet.length(); i++) {
        if (packet.charAt(i) == ':') {
            colonCount++;
        }
    }
    
    // Minimum 5 colons: "RFID:" (1) + "XX:XX:XX:XX" (3) + ":" (1) = 5
    if (colonCount < 5) {
        return false;
    }
    
    // Extract and validate UID
    String uid = extractUID(packet);
    if (uid.length() == 0) {
        return false;
    }
    
    // Extract and validate timestamp
    unsigned long timestamp = extractTimestamp(packet);
    // Timestamp can be 0, so we just check if extraction succeeded
    // (extractTimestamp returns 0 for invalid format)
    
    return true;
}

bool PacketParser::validateUIDFormat(const String& uid) {
    // Valid UID formats:
    // 4 bytes: "XX:XX:XX:XX" (length = 11)
    // 7 bytes: "XX:XX:XX:XX:XX:XX:XX" (length = 20)
    // 10 bytes: "XX:XX:XX:XX:XX:XX:XX:XX:XX:XX" (length = 29)
    
    int length = uid.length();
    if (length != 11 && length != 20 && length != 29) {
        return false;
    }
    
    // Check format: hex digits and colons in correct positions
    for (int i = 0; i < length; i++) {
        char c = uid.charAt(i);
        
        // Every 3rd character should be a colon (positions 2, 5, 8, ...)
        if (i % 3 == 2) {
            if (c != ':') {
                return false;
            }
        } else {
            // Other positions should be hex digits (0-9, A-F, a-f)
            if (!((c >= '0' && c <= '9') || 
                  (c >= 'A' && c <= 'F') || 
                  (c >= 'a' && c <= 'f'))) {
                return false;
            }
        }
    }
    
    return true;
}
