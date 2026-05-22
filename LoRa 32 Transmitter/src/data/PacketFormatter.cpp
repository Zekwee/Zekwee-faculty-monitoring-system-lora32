#include "PacketFormatter.h"

String PacketFormatter::formatHex(const uint8_t* uid, uint8_t length) {
    // Validate UID length
    if (!isValidUIDLength(length)) {
        return "";  // Return empty string for invalid length
    }
    
    // Calculate expected string length: (length * 3 - 1)
    // Each byte = 2 hex chars + 1 colon, except last byte has no colon
    String result = "";
    result.reserve(length * 3);  // Pre-allocate memory for efficiency
    
    for (uint8_t i = 0; i < length; i++) {
        result += byteToHex(uid[i]);
        
        // Add colon separator except after last byte
        if (i < length - 1) {
            result += ":";
        }
    }
    
    return result;
}

String PacketFormatter::formatPacket(const uint8_t* uid, uint8_t length, unsigned long timestamp) {
    // Validate UID length
    if (!isValidUIDLength(length)) {
        return "";  // Return empty string for invalid length
    }
    
    // Format: "RFID:<UID_hex>:<timestamp>"
    String packet = "RFID:";
    packet += formatHex(uid, length);
    packet += ":";
    packet += String(timestamp);
    
    return packet;
}

bool PacketFormatter::isValidUIDLength(uint8_t length) {
    // Valid UID lengths are 4, 7, or 10 bytes
    return (length == 4 || length == 7 || length == 10);
}

String PacketFormatter::byteToHex(uint8_t byte) {
    // Convert byte to 2-character uppercase hex string
    String hex = "";
    
    // High nibble (4 bits)
    uint8_t highNibble = (byte >> 4) & 0x0F;
    if (highNibble < 10) {
        hex += (char)('0' + highNibble);
    } else {
        hex += (char)('A' + (highNibble - 10));
    }
    
    // Low nibble (4 bits)
    uint8_t lowNibble = byte & 0x0F;
    if (lowNibble < 10) {
        hex += (char)('0' + lowNibble);
    } else {
        hex += (char)('A' + (lowNibble - 10));
    }
    
    return hex;
}
