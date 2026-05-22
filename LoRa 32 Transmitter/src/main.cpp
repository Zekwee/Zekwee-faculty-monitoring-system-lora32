#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <MFRC522.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <Wire.h>
#include "data/PacketFormatter.h"

// OLED display dimensions
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// OLED I2C address
#define OLED_ADDR 0x3C

// LoRa pins for Heltec WiFi LoRa 32
#define LORA_CS    18
#define LORA_RST   14
#define LORA_DIO0  26

// RFID pins (conflict-free)
#define RFID_SS    21   // GPIO21 - Available
#define RFID_RST   17   // GPIO17 - Available

// I2C pins for Heltec WiFi LoRa 32 V2 OLED
#define I2C_SDA    4
#define I2C_SCL    15
#define OLED_RST   16

// SPI pins (Heltec board specific - CRITICAL)
#define SPI_SCK    5
#define SPI_MISO   19
#define SPI_MOSI   27

// LoRa Frequency
#define LORA_FREQ  915E6

// ═══════════════════════════════════════════════════════════
// 🏫 ROOM CONFIGURATION - CHANGE THIS FOR EACH TRANSMITTER
// ═══════════════════════════════════════════════════════════
const String ROOM_ID = "room_205";      // Change to: room_201, room_202, room_203, room_204, room_205
const String ROOM_NAME = "Room 205";    // Change to your room name
// ═══════════════════════════════════════════════════════════

// Create objects
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RST);
MFRC522 rfid(RFID_SS, RFID_RST);

// State tracking structure for each card
struct CardState {
  uint8_t uid[10];
  uint8_t uidLength;
  bool isInside;  // true = IN, false = OUT
  unsigned long lastTapTime;
};

// Track up to 10 different cards
CardState cardStates[10];
int cardStateCount = 0;

// Global room occupancy tracking
bool roomOccupied = false;
uint8_t occupiedByUID[10] = {0};
uint8_t occupiedByUIDLength = 0;

// State variables
uint8_t lastUID[10] = {0};
uint8_t lastUIDLength = 0;
unsigned long lastScanTime = 0;
const long scanInterval = 200;  // Scan every 200ms
const long tapCooldown = 5000;  // 5 seconds cooldown between taps
int messageCount = 0;
bool rfidEnabled = false;
bool displayEnabled = false;

// RFID reader health check
unsigned long lastSuccessfulScan = 0;
unsigned long lastCardDetection = 0;
int consecutiveFailedReads = 0;
const long rfidResetInterval = 30000;  // Reset RFID if no successful scan for 30 seconds
const int maxFailedReads = 5;  // Reset after 5 consecutive failed reads

void initializeDisplay() {
  Serial.println("\n--- OLED Display Initialization ---");
  
  // Initialize I2C with custom pins
  Serial.print("I2C Pins: SDA=");
  Serial.print(I2C_SDA);
  Serial.print(", SCL=");
  Serial.println(I2C_SCL);
  
  Wire.begin(I2C_SDA, I2C_SCL);
  delay(100);
  
  Serial.println("Scanning I2C bus...");
  
  // Try both possible I2C addresses
  Serial.println("Trying address 0x3C...");
  if (display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    displayEnabled = true;
    Serial.println("✓ Display found at 0x3C");
  } else {
    Serial.println("✗ No display at 0x3C");
    Serial.println("Trying address 0x3D...");
    
    Adafruit_SSD1306 display2(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
    if (display2.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
      displayEnabled = true;
      display = display2;
      Serial.println("✓ Display found at 0x3D");
    } else {
      Serial.println("✗ No display at 0x3D");
    }
  }
  
  if (!displayEnabled) {
    Serial.println("✗ SSD1306 not found! Continuing without display.");
    Serial.println("Check wiring:");
    Serial.println("  - SDA → GPIO 4");
    Serial.println("  - SCL → GPIO 15");
    Serial.println("  - RST → GPIO 16");
    Serial.println("  - VCC → 3.3V");
    Serial.println("  - GND → GND");
    return;
  }
  
  // Clear display and set text properties
  Serial.println("Initializing display content...");
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("LoRa TX + RFID");
  display.println("Initializing...");
  display.display();
  Serial.println("✓ Display initialized!");
  Serial.println("-----------------------------------\n");
}

void initializeSPI() {
  // CRITICAL: Initialize SPI with Heltec board specific pins
  SPI.begin(SPI_SCK, SPI_MISO, SPI_MOSI, LORA_CS);
  Serial.println("SPI initialized: SCK=5, MISO=19, MOSI=27, SS=18");
  delay(100);
}

void initializeLoRa() {
  // Set up LoRa pins
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);
  
  // Initialize LoRa
  if (!LoRa.begin(LORA_FREQ)) {
    Serial.println("ERROR: LoRa initialization failed!");
    if (displayEnabled) {
      display.clearDisplay();
      display.setCursor(0, 0);
      display.println("LoRa TX + RFID");
      display.println("LoRa INIT FAILED");
      display.display();
    }
    while (1) { delay(1000); }  // Halt - LoRa is critical
  }
  
  Serial.println("LoRa initialized successfully!");
  
  // Set LoRa parameters
  LoRa.setTxPower(20);
  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
}

void initializeRFID() {
  Serial.println("\n--- RFID Initialization ---");
  Serial.print("RFID SS Pin: ");
  Serial.println(RFID_SS);
  Serial.print("RFID RST Pin: ");
  Serial.println(RFID_RST);
  
  // Initialize RFID reader
  rfid.PCD_Init();
  delay(100);
  
  // Check firmware version
  byte version = rfid.PCD_ReadRegister(rfid.VersionReg);
  Serial.print("MFRC522 Firmware Version: 0x");
  Serial.print(version, HEX);
  
  if (version == 0x91) {
    Serial.println(" (v1.0)");
    rfidEnabled = true;
    Serial.println("✓ RFID initialized successfully!");
  } else if (version == 0x92) {
    Serial.println(" (v2.0)");
    rfidEnabled = true;
    Serial.println("✓ RFID initialized successfully!");
  } else if (version == 0x00 || version == 0xFF) {
    Serial.println(" (NOT DETECTED)");
    rfidEnabled = false;
    Serial.println("✗ WARNING: RFID initialization failed!");
    Serial.println("  Check wiring:");
    Serial.println("  - SDA → GPIO 15");
    Serial.println("  - SCK → GPIO 5");
    Serial.println("  - MOSI → GPIO 27");
    Serial.println("  - MISO → GPIO 19");
    Serial.println("  - RST → GPIO 2");
    Serial.println("  - 3.3V and GND");
  } else {
    Serial.print(" (Unknown version)");
    rfidEnabled = true;
    Serial.println("\n⚠ RFID initialized (unknown firmware version)");
  }
  
  // Perform self-test
  if (rfidEnabled) {
    Serial.println("Running RFID self-test...");
    bool selfTestResult = rfid.PCD_PerformSelfTest();
    rfid.PCD_Init(); // Re-init after self-test
    
    if (selfTestResult) {
      Serial.println("✓ RFID self-test PASSED");
    } else {
      Serial.println("✗ RFID self-test FAILED");
    }
  }
  
  Serial.println("---------------------------\n");
}

void displayStatus(const String& status, const String& uid = "") {
  if (!displayEnabled) return;
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Title
  display.setCursor(0, 0);
  display.println("LoRa TX + RFID");
  
  // Separator
  display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
  
  // Status
  display.setCursor(0, 15);
  display.println(status);
  
  // UID if provided
  if (uid.length() > 0) {
    display.setCursor(0, 30);
    display.println("UID:");
    display.setCursor(0, 40);
    // Wrap long UIDs
    if (uid.length() <= 16) {
      display.println(uid);
    } else {
      display.println(uid.substring(0, 16));
      display.setCursor(0, 50);
      display.println(uid.substring(16));
    }
  }
  
  // Statistics
  display.setCursor(0, 55);
  display.println("Count: " + String(messageCount));
  
  display.display();
}

bool compareUID(const uint8_t* uid1, uint8_t len1, const uint8_t* uid2, uint8_t len2) {
  if (len1 != len2) return false;
  for (uint8_t i = 0; i < len1; i++) {
    if (uid1[i] != uid2[i]) return false;
  }
  return true;
}

// Find card state by UID, returns index or -1 if not found
int findCardState(const uint8_t* uid, uint8_t uidLength) {
  for (int i = 0; i < cardStateCount; i++) {
    if (compareUID(cardStates[i].uid, cardStates[i].uidLength, uid, uidLength)) {
      return i;
    }
  }
  return -1;
}

// Get or create card state
CardState* getCardState(const uint8_t* uid, uint8_t uidLength) {
  int index = findCardState(uid, uidLength);
  
  if (index >= 0) {
    // Card exists, return it
    return &cardStates[index];
  }
  
  // New card, add it
  if (cardStateCount < 10) {
    memcpy(cardStates[cardStateCount].uid, uid, uidLength);
    cardStates[cardStateCount].uidLength = uidLength;
    cardStates[cardStateCount].isInside = false;  // Start with OUT
    cardStates[cardStateCount].lastTapTime = 0;
    return &cardStates[cardStateCount++];
  }
  
  // Array full, overwrite oldest
  return &cardStates[0];
}

void handleRFIDScan() {
  static unsigned long lastDebugTime = 0;
  static int scanAttempts = 0;
  
  // Check if enough time has passed since last scan
  if (millis() - lastScanTime < scanInterval) {
    return;
  }
  lastScanTime = millis();
  scanAttempts++;
  
  // Print debug info every 5 seconds
  if (millis() - lastDebugTime > 5000) {
    Serial.print("[RFID] Scanning... (");
    Serial.print(scanAttempts);
    Serial.println(" attempts)");
    lastDebugTime = millis();
    scanAttempts = 0;
  }
  
  // Check for new card
  if (!rfid.PICC_IsNewCardPresent()) {
    // No card present - reset last UID after cooldown
    if (lastUIDLength > 0 && millis() - lastScanTime > tapCooldown) {
      lastUIDLength = 0;  // Reset to allow re-scanning same card
      displayStatus("Scanning...");
      Serial.println("[RFID] Ready for next card");
    }
    return;
  }
  
  Serial.println("\n[RFID] Card detected in field!");
  lastCardDetection = millis();  // Track card detection time
  
  // Read card serial
  if (!rfid.PICC_ReadCardSerial()) {
    Serial.println("[RFID] ✗ WARNING: Card read failed");
    consecutiveFailedReads++;
    
    // If too many consecutive failures, reset the reader
    if (consecutiveFailedReads >= maxFailedReads) {
      Serial.println("[RFID] Too many failed reads - resetting reader...");
      rfid.PCD_Init();
      consecutiveFailedReads = 0;
      Serial.println("[RFID] Reader reset complete");
    }
    return;
  }
  
  // Successful read - reset failure counter
  consecutiveFailedReads = 0;
  
  // Get UID
  uint8_t uidLength = rfid.uid.size;
  uint8_t* uid = rfid.uid.uidByte;
  
  Serial.print("[RFID] Card type: ");
  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.println(rfid.PICC_GetTypeName(piccType));
  
  // Validate UID length
  if (!PacketFormatter::isValidUIDLength(uidLength)) {
    Serial.print("[RFID] ✗ ERROR: Invalid UID length: ");
    Serial.println(uidLength);
    displayStatus("Invalid Card");
    rfid.PICC_HaltA();
    return;
  }
  
  // Get or create card state FIRST (before anti-bounce check)
  CardState* cardState = getCardState(uid, uidLength);
  
  // Format UID for display
  String uidHex = PacketFormatter::formatHex(uid, uidLength);
  
  // Determine what action this card wants to do
  bool wantsToEnter = !cardState->isInside;  // If currently OUT, wants to go IN
  String action = wantsToEnter ? "IN" : "OUT";
  
  // SMART ANTI-BOUNCE: Only block if trying to repeat the SAME action within cooldown
  if (compareUID(uid, uidLength, lastUID, lastUIDLength)) {
    // Same card tapped again - check if it's a valid state transition
    unsigned long timeSinceLastTap = millis() - cardState->lastTapTime;
    
    if (timeSinceLastTap < tapCooldown) {
      // Within cooldown - this is a duplicate tap (trying to do same action twice)
      Serial.print("[RFID] Duplicate tap ignored (cooldown: ");
      Serial.print((tapCooldown - timeSinceLastTap) / 1000);
      Serial.println("s remaining)");
      rfid.PICC_HaltA();
      return;
    }
  }
  
  // GLOBAL ROOM OCCUPANCY CHECK
  if (wantsToEnter) {
    // Trying to enter (IN)
    if (roomOccupied) {
      // Room is occupied by someone
      // Check if it's occupied by THIS card
      if (!compareUID(occupiedByUID, occupiedByUIDLength, uid, uidLength)) {
        // Room occupied by DIFFERENT card - REJECT!
        Serial.println("\n╔═══════════════════════════════╗");
        Serial.println("║   ✗ ROOM OCCUPIED!            ║");
        Serial.println("╚═══════════════════════════════╝");
        Serial.print("[RFID] Cannot enter - Room occupied by: ");
        String occupiedUID = PacketFormatter::formatHex(occupiedByUID, occupiedByUIDLength);
        Serial.println(occupiedUID);
        Serial.print("[RFID] Your UID: ");
        Serial.println(uidHex);
        
        if (displayEnabled) {
          displayStatus("Room Occupied!", "Wait for OUT");
        }
        
        rfid.PICC_HaltA();
        delay(1000);
        return;
      }
      // else: Room occupied by THIS card (shouldn't happen with toggle, but handle it)
    }
  }
  
  // Valid action - update state
  cardState->isInside = wantsToEnter;
  cardState->lastTapTime = millis();
  lastSuccessfulScan = millis();  // Update health check timer
  
  // Update global room occupancy
  if (wantsToEnter) {
    // Going IN - mark room as occupied
    roomOccupied = true;
    memcpy(occupiedByUID, uid, uidLength);
    occupiedByUIDLength = uidLength;
  } else {
    // Going OUT - mark room as empty
    roomOccupied = false;
    occupiedByUIDLength = 0;
  }
  
  String status = cardState->isInside ? "IN" : "OUT";
  
  // New card detected!
  Serial.println("\n╔═══════════════════════════════╗");
  Serial.print("║     ");
  Serial.print(status);
  Serial.println(" - CARD DETECTED!        ║");
  Serial.println("╚═══════════════════════════════╝");
  Serial.print("Status: ");
  Serial.println(status);
  Serial.print("UID Length: ");
  Serial.print(uidLength);
  Serial.println(" bytes");
  
  // uidHex already defined above
  Serial.print("UID (HEX): ");
  Serial.println(uidHex);
  
  // Print raw bytes
  Serial.print("UID (RAW): ");
  for (uint8_t i = 0; i < uidLength; i++) {
    if (uid[i] < 0x10) Serial.print("0");
    Serial.print(uid[i], HEX);
    if (i < uidLength - 1) Serial.print(" ");
  }
  Serial.println();
  
  // Display on OLED
  displayStatus(status + " - Card Read:", uidHex);
  
  // Format packet for LoRa transmission with IN/OUT status and room_id
  unsigned long timestamp = millis();
  String packet = "RFID:" + uidHex + ":" + String(timestamp) + ":" + status + ":" + ROOM_ID;
  Serial.print("Packet Format: ");
  Serial.println(packet);
  Serial.print("Packet Length: ");
  Serial.print(packet.length());
  Serial.println(" bytes");
  Serial.print("Room ID: ");
  Serial.println(ROOM_ID);
  
  // Transmit via LoRa (CRITICAL: Ensure RFID SS is HIGH)
  digitalWrite(RFID_SS, HIGH);  // Deassert RFID
  delay(10);
  
  Serial.println("\n[LoRa] Transmitting packet...");
  unsigned long txStart = millis();
  LoRa.beginPacket();
  LoRa.print(packet);
  LoRa.endPacket();
  unsigned long txDuration = millis() - txStart;
  
  messageCount++;
  Serial.print("[LoRa] ✓ Transmission complete! (");
  Serial.print(txDuration);
  Serial.println(" ms)");
  Serial.print("[Stats] Total transmissions: ");
  Serial.println(messageCount);
  Serial.println("═══════════════════════════════\n");
  
  // Save last UID for anti-bounce
  memcpy(lastUID, uid, uidLength);
  lastUIDLength = uidLength;
  
  // Halt PICC
  rfid.PICC_HaltA();
  
  // Brief delay to show status
  delay(500);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("LoRa Transmitter + RFID Startup");
  Serial.println("=================================");
  Serial.println("Board: Heltec WiFi LoRa 32 V2");
  Serial.println("Frequency: 915 MHz");
  Serial.println("SPI Config: SCK=5, MISO=19, MOSI=27");
  Serial.println("LoRa CS=18, RFID SS=21");
  Serial.print("Room ID: ");
  Serial.println(ROOM_ID);
  Serial.print("Room Name: ");
  Serial.println(ROOM_NAME);
  Serial.println("=================================\n");
  
  // Initialize hardware in correct order
  initializeDisplay();
  initializeSPI();      // CRITICAL: Initialize SPI first
  initializeLoRa();     // Then LoRa
  initializeRFID();     // Then RFID
  
  // Display ready status
  if (displayEnabled) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("LoRa TX + RFID");
    display.println("Ready!");
    if (rfidEnabled) {
      display.println("RFID: OK");
    } else {
      display.println("RFID: DISABLED");
    }
    display.println("Scanning...");
    display.display();
  }
  
  Serial.println("System ready!");
  if (rfidEnabled) {
    Serial.println("Place RFID card near reader...\n");
  } else {
    Serial.println("RFID disabled - LoRa only mode\n");
  }
  
  delay(1000);
}

void loop() {
  if (rfidEnabled) {
    handleRFIDScan();
    
    // RFID health check - reset if stuck
    if (millis() - lastSuccessfulScan > rfidResetInterval) {
      Serial.println("\n[RFID] No successful scan for 30s - resetting reader...");
      rfid.PCD_Init();
      lastSuccessfulScan = millis();
      Serial.println("[RFID] Reader reset complete");
    }
  }
  
  delay(10);  // Small delay to prevent tight loop
}
