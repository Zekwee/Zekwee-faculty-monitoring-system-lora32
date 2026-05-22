#include "RFIDManager.h"

RFIDManager::RFIDManager() 
    : mfrc522(nullptr), ssPin(-1), rstPin(-1), 
      consecutiveFailures(0), lastCardDetected(0) {
}

RFIDManager::~RFIDManager() {
    if (mfrc522 != nullptr) {
        delete mfrc522;
        mfrc522 = nullptr;
    }
}

bool RFIDManager::initialize(int ss, int rst) {
    ssPin = ss;
    rstPin = rst;
    
    // Create MFRC522 instance
    mfrc522 = new MFRC522(ssPin, rstPin);
    
    // Initialize MFRC522
    mfrc522->PCD_Init();
    delay(50); // Give reader time to initialize
    
    // Check if reader is responding
    byte version = mfrc522->PCD_ReadRegister(mfrc522->VersionReg);
    if (version == 0x00 || version == 0xFF) {
        Serial.println("✗ MFRC522 not responding!");
        return false;
    }
    
    Serial.print("✓ MFRC522 initialized! Version: 0x");
    Serial.println(version, HEX);
    
    consecutiveFailures = 0;
    lastCardDetected = millis();
    
    return true;
}

bool RFIDManager::isCardPresent() {
    if (mfrc522 == nullptr) {
        return false;
    }
    
    // Check for new cards
    if (!mfrc522->PICC_IsNewCardPresent()) {
        return false;
    }
    
    // Try to read card serial
    if (!mfrc522->PICC_ReadCardSerial()) {
        consecutiveFailures++;
        return false;
    }
    
    // Card detected successfully
    consecutiveFailures = 0;
    lastCardDetected = millis();
    
    return true;
}

String RFIDManager::readCardUID() {
    if (mfrc522 == nullptr) {
        return "";
    }
    
    // Build UID string in format "XX:XX:XX:XX"
    String uid = "";
    for (byte i = 0; i < mfrc522->uid.size; i++) {
        if (i > 0) {
            uid += ":";
        }
        if (mfrc522->uid.uidByte[i] < 0x10) {
            uid += "0";
        }
        uid += String(mfrc522->uid.uidByte[i], HEX);
    }
    
    // Convert to uppercase
    uid.toUpperCase();
    
    // Halt PICC
    mfrc522->PICC_HaltA();
    
    // Stop encryption on PCD
    mfrc522->PCD_StopCrypto1();
    
    return uid;
}

void RFIDManager::reset() {
    if (mfrc522 == nullptr) {
        return;
    }
    
    Serial.println("🔄 Resetting RFID reader...");
    
    // Soft reset
    mfrc522->PCD_Reset();
    delay(50);
    
    // Re-initialize
    mfrc522->PCD_Init();
    delay(50);
    
    consecutiveFailures = 0;
    lastCardDetected = millis();
    
    Serial.println("✓ RFID reader reset complete");
}

int RFIDManager::getConsecutiveFailures() const {
    return consecutiveFailures;
}

bool RFIDManager::needsReset() {
    // Reset if too many consecutive failures
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        Serial.println("⚠️  RFID: Too many consecutive failures");
        return true;
    }
    
    // Reset if no card detected for too long
    if (millis() - lastCardDetected > RESET_TIMEOUT_MS) {
        Serial.println("⚠️  RFID: Timeout - no card detected");
        return true;
    }
    
    return false;
}
