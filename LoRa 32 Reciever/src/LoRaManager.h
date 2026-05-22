#ifndef LORA_MANAGER_H
#define LORA_MANAGER_H

#include <Arduino.h>
#include <LoRa.h>

/**
 * @brief LoRaManager - Manages LoRa radio operations
 * 
 * This class handles all LoRa radio communication including initialization,
 * packet reception, and transmission. Configured for 915 MHz frequency with
 * maximum transmission power for whitelist broadcasting.
 */
class LoRaManager {
public:
    /**
     * @brief Initialize LoRa radio
     * 
     * Initializes SPI bus and LoRa radio with proper pin configuration.
     * Sets frequency to 915 MHz and configures radio parameters.
     * 
     * @return true if initialization successful, false otherwise
     * 
     * Requirements: 1.4, 14.1, 14.3
     */
    bool initialize();
    
    /**
     * @brief Check if packet is available
     * 
     * Non-blocking check for incoming LoRa packet.
     * 
     * @return true if packet available, false otherwise
     * 
     * Requirements: 1.4
     */
    bool isPacketAvailable();
    
    /**
     * @brief Receive packet
     * 
     * Reads incoming LoRa packet and extracts RSSI and SNR values.
     * Should only be called after isPacketAvailable() returns true.
     * 
     * @param rssi Reference to store RSSI value (signal strength in dBm)
     * @param snr Reference to store SNR value (signal-to-noise ratio in dB)
     * @return String Received packet content
     * 
     * Requirements: 1.1, 11.6
     */
    String receivePacket(int& rssi, float& snr);
    
    /**
     * @brief Transmit packet
     * 
     * Sends a packet via LoRa radio.
     * Used for whitelist update and sync broadcasts.
     * 
     * @param packet Packet string to transmit
     * @return true if transmission successful, false otherwise
     * 
     * Requirements: 8.1, 8.2, 8.4
     */
    bool transmitPacket(const String& packet);
    
    /**
     * @brief Set maximum transmission power
     * 
     * Sets LoRa radio to maximum power (20 dBm) for whitelist broadcasts.
     * 
     * Requirements: 8.6
     */
    void setMaxPower();

private:
    static const long FREQUENCY = 915E6;      // 915 MHz frequency
    static const int TX_POWER = 20;           // Maximum transmission power (20 dBm)
    static const int SPREADING_FACTOR = 7;    // Spreading factor
    static const long SIGNAL_BANDWIDTH = 125E3; // 125 kHz bandwidth
    static const int CODING_RATE = 5;         // Coding rate 4/5
};

#endif // LORA_MANAGER_H
