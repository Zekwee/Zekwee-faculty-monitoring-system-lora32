#ifndef PACKET_PARSER_H
#define PACKET_PARSER_H

#include <Arduino.h>

/**
 * @brief ParsedPacket - Structure to hold parsed packet data
 * 
 * Contains the results of parsing a received LoRa packet, including
 * validation status, packet type, and extracted data.
 */
struct ParsedPacket {
    bool isValid;           // True if packet was successfully parsed
    bool isRFIDPacket;      // True if packet is RFID format, false if legacy
    String uid;             // Extracted UID in hex format (e.g., "A3:4F:2E:91")
    unsigned long timestamp; // Extracted timestamp (milliseconds)
    String status;          // Extracted status ("IN" or "OUT")
    String roomId;          // Extracted room ID
    String rawMessage;      // Original raw message
    
    // Constructor
    ParsedPacket() : isValid(false), isRFIDPacket(false), timestamp(0), status(""), roomId("") {}
};

/**
 * @brief PacketParser - Pure functions for parsing received LoRa packets
 * 
 * This class provides static utility functions for parsing received LoRa packets,
 * supporting both RFID packet format and legacy test messages. All functions are
 * pure (no side effects) and can be tested with property-based testing.
 */
class PacketParser {
public:
    /**
     * @brief Parse received packet
     * 
     * Parses a received LoRa packet and extracts data based on packet type.
     * Supports two formats:
     * - RFID: "RFID:<UID_hex>:<timestamp>:<status>:<room_id>"
     * - Legacy: "Hello from TX #N" (or any non-RFID message)
     * 
     * @param packet Raw packet string
     * @return ParsedPacket Structure with parsed data and validation status
     * 
     * Requirements: 5.1, 5.7, 9.3
     * Property: parse(format(uid, ts, status, room)) == (uid, ts, status, room) for valid RFID packets
     */
    static ParsedPacket parsePacket(const String& packet);
    
    /**
     * @brief Extract status from RFID packet
     * 
     * Extracts the status string from an RFID packet.
     * Expected format: "RFID:<UID_hex>:<timestamp>:<status>:<room_id>"
     * 
     * @param packet RFID packet string
     * @return String Status string ("IN" or "OUT"), or empty string if invalid
     */
    static String extractStatus(const String& packet);
    
    /**
     * @brief Extract room ID from RFID packet
     * 
     * Extracts the room ID from an RFID packet.
     * Expected format: "RFID:<UID_hex>:<timestamp>:<status>:<room_id>"
     * 
     * @param packet RFID packet string
     * @return String Room ID, or empty string if invalid
     */
    static String extractRoomId(const String& packet);
    
    /**
     * @brief Check if packet is RFID format
     * 
     * Checks if the packet starts with "RFID:" prefix.
     * 
     * @param packet Raw packet string
     * @return true if packet starts with "RFID:", false otherwise
     * 
     * Requirements: 9.3
     * Property: isRFIDPacket(p) ⟺ p.startsWith("RFID:")
     */
    static bool isRFIDPacket(const String& packet);
    
    /**
     * @brief Extract UID from RFID packet
     * 
     * Extracts the UID hex string from an RFID packet.
     * Expected format: "RFID:<UID_hex>:<timestamp>"
     * 
     * @param packet RFID packet string
     * @return String UID hex string, or empty string if invalid
     * 
     * Requirements: 5.1
     */
    static String extractUID(const String& packet);
    
    /**
     * @brief Extract timestamp from RFID packet
     * 
     * Extracts the timestamp value from an RFID packet.
     * Expected format: "RFID:<UID_hex>:<timestamp>"
     * 
     * @param packet RFID packet string
     * @return unsigned long Timestamp value, or 0 if invalid
     * 
     * Requirements: 5.1
     */
    static unsigned long extractTimestamp(const String& packet);

private:
    /**
     * @brief Validate RFID packet format
     * 
     * Checks if the packet has valid RFID format with all required components.
     * 
     * @param packet RFID packet string
     * @return true if format is valid, false otherwise
     */
    static bool validateRFIDFormat(const String& packet);
    
    /**
     * @brief Validate UID hex format
     * 
     * Checks if the UID string has valid hex format with colons.
     * Valid formats: "XX:XX:XX:XX" (4 bytes), "XX:XX:XX:XX:XX:XX:XX" (7 bytes),
     * or "XX:XX:XX:XX:XX:XX:XX:XX:XX:XX" (10 bytes)
     * 
     * @param uid UID hex string
     * @return true if format is valid, false otherwise
     */
    static bool validateUIDFormat(const String& uid);
};

#endif // PACKET_PARSER_H
