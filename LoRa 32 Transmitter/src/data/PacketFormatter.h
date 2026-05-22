#ifndef PACKET_FORMATTER_H
#define PACKET_FORMATTER_H

#include <Arduino.h>

/**
 * @brief PacketFormatter - Pure functions for formatting RFID data into LoRa packets
 * 
 * This class provides static utility functions for formatting RFID card UIDs
 * into hexadecimal strings and LoRa packet formats. All functions are pure
 * (no side effects) and can be tested with property-based testing.
 */
class PacketFormatter {
public:
    /**
     * @brief Format UID bytes into hex string with colon separators
     * 
     * Converts a byte array UID into a hexadecimal string with colons between bytes.
     * Example: [0xA3, 0x4F, 0x2E, 0x91] -> "A3:4F:2E:91"
     * 
     * @param uid Pointer to byte array containing UID
     * @param length Number of bytes in UID (must be 4, 7, or 10)
     * @return String Formatted hex string with colons, or empty string if invalid
     * 
     * Requirements: 3.2, 5.2
     * Property: len(formatHex(uid)) == (len(uid) * 3 - 1) for valid UIDs
     */
    static String formatHex(const uint8_t* uid, uint8_t length);
    
    /**
     * @brief Format RFID packet for LoRa transmission
     * 
     * Creates a packet string in the format: "RFID:<UID_hex>:<timestamp>"
     * Example: "RFID:A3:4F:2E:91:12345"
     * 
     * @param uid Pointer to byte array containing UID
     * @param length Number of bytes in UID (must be 4, 7, or 10)
     * @param timestamp Milliseconds since boot
     * @return String Formatted packet string, or empty string if invalid
     * 
     * Requirements: 4.3
     * Property: parse(format(uid, ts)) == (uid, ts) for valid inputs
     */
    static String formatPacket(const uint8_t* uid, uint8_t length, unsigned long timestamp);
    
    /**
     * @brief Validate UID length
     * 
     * Checks if the UID length is valid (4, 7, or 10 bytes).
     * 
     * @param length UID length in bytes
     * @return true if length is 4, 7, or 10; false otherwise
     * 
     * Requirements: 2.3
     * Property: isValidUIDLength(n) ⟺ (n ∈ {4, 7, 10})
     */
    static bool isValidUIDLength(uint8_t length);

private:
    // Helper function to convert byte to 2-character hex string
    static String byteToHex(uint8_t byte);
};

#endif // PACKET_FORMATTER_H
