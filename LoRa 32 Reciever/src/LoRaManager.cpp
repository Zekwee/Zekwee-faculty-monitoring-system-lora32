#include "LoRaManager.h"
#include <SPI.h>

// Pin definitions for Heltec WiFi LoRa 32 V2
#define LORA_CS    18
#define LORA_RST   14
#define LORA_DIO0  26

// SPI pins (Heltec board specific)
#define SPI_SCK    5
#define SPI_MISO   19
#define SPI_MOSI   27

/**
 * @brief Initialize LoRa radio
 * 
 * Configures SPI bus and initializes LoRa radio with proper parameters.
 */
bool LoRaManager::initialize() {
    // Initialize SPI with Heltec board specific pins
    SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, LORA_CS);
    
    // Set up LoRa pins
    LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
    
    // Initialize LoRa radio at 915 MHz
    if (!LoRa.begin(FREQUENCY)) {
        return false;  // Initialization failed
    }
    
    // Set LoRa parameters
    LoRa.setTxPower(TX_POWER);
    LoRa.setSpreadingFactor(SPREADING_FACTOR);
    LoRa.setSignalBandwidth(SIGNAL_BANDWIDTH);
    LoRa.setCodingRate4(CODING_RATE);
    
    return true;  // Initialization successful
}

/**
 * @brief Check if packet is available
 * 
 * Non-blocking check using LoRa.parsePacket().
 */
bool LoRaManager::isPacketAvailable() {
    int packetSize = LoRa.parsePacket();
    return packetSize > 0;
}

/**
 * @brief Receive packet
 * 
 * Reads packet content and extracts RSSI and SNR values.
 */
String LoRaManager::receivePacket(int& rssi, float& snr) {
    String packet = "";
    
    // Read all available bytes
    while (LoRa.available()) {
        packet += (char)LoRa.read();
    }
    
    // Get RSSI and SNR
    rssi = LoRa.packetRssi();
    snr = LoRa.packetSnr();
    
    return packet;
}

/**
 * @brief Transmit packet
 * 
 * Sends packet via LoRa radio. Blocks until transmission complete.
 */
bool LoRaManager::transmitPacket(const String& packet) {
    // Begin packet transmission
    LoRa.beginPacket();
    
    // Write packet content
    LoRa.print(packet);
    
    // End packet and transmit
    bool success = LoRa.endPacket();
    
    return success;
}

/**
 * @brief Set maximum transmission power
 * 
 * Ensures radio is at maximum power for whitelist broadcasts.
 */
void LoRaManager::setMaxPower() {
    LoRa.setTxPower(TX_POWER);
}
