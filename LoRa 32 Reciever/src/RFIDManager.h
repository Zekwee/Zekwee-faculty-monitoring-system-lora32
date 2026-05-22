#ifndef RFID_MANAGER_H
#define RFID_MANAGER_H

#include <Arduino.h>
#include <MFRC522.h>
#include <SPI.h>

class RFIDManager {
private:
    MFRC522* mfrc522;
    int ssPin;
    int rstPin;
    int consecutiveFailures;
    unsigned long lastCardDetected;
    static const int MAX_CONSECUTIVE_FAILURES = 5;
    static const unsigned long RESET_TIMEOUT_MS = 30000; // 30 seconds
    
public:
    RFIDManager();
    ~RFIDManager();
    
    // Initialize RFID reader with specified pins
    bool initialize(int ss, int rst);
    
    // Check if a card is present
    bool isCardPresent();
    
    // Read UID from card (returns empty string if failed)
    String readCardUID();
    
    // Reset the RFID reader
    void reset();
    
    // Get consecutive failure count
    int getConsecutiveFailures() const;
    
    // Check if reader needs reset (based on failures or timeout)
    bool needsReset();
};

#endif // RFID_MANAGER_H
