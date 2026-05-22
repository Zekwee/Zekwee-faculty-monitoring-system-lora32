#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "PacketParser.h"
#include "LoRaManager.h"
#include "DisplayManager.h"
#include "RFIDManager.h"
#include "AntiBounceManager.h"
#include "WhitelistManager.h"
#include "OccupancyTracker.h"
#include "StateManager.h"
#include "config.h"

// OLED display dimensions
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// OLED I2C address
#define OLED_ADDR 0x3C

// I2C pins for Heltec WiFi LoRa 32 V2 OLED
#define I2C_SDA    4
#define I2C_SCL    15
#define OLED_RST   16

// RFID pins
#define RFID_SS    21
#define RFID_RST   17

// Physical button pin (built-in PROG button on Heltec)
#define MODE_BUTTON_PIN   0  // GPIO 0 - PROG button

// System modes (custom for 3-mode operation)
#define MODE_LORA_MONITORING      0  // Default: Receive LoRa packets from transmitters
#define MODE_FACULTY_ROOM         1  // Professors tap RFID on receiver for faculty room
#define MODE_ADMIN_REGISTRATION   2  // Admin taps admin card to unlock registration

// Create OLED display object
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RST);

// Create manager objects
LoRaManager loraManager;
DisplayManager displayManager;
RFIDManager rfidManager;
AntiBounceManager antiBounceManager;
WhitelistManager whitelistManager;
OccupancyTracker occupancyTracker;
StateManager stateManager;

// System state
int currentMode = MODE_LORA_MONITORING;
bool wifiConnected = false;
bool adminSessionActive = false;
unsigned long adminSessionStart = 0;
const unsigned long ADMIN_SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

// Button state tracking
bool lastButtonState = HIGH;
unsigned long buttonPressTime = 0;
const unsigned long BUTTON_DEBOUNCE_MS = 50;
const unsigned long BUTTON_HOLD_TIME_MS = 2000; // 2 seconds hold to switch mode

// Firebase REST API endpoint
String firebaseURL = String(FIREBASE_DATABASE_URL);

// Firebase queue system to prevent blocking
struct FirebaseQueueItem {
  String path;
  String jsonData;
  unsigned long timestamp;
};

const int MAX_QUEUE_SIZE = 50;
FirebaseQueueItem firebaseQueue[MAX_QUEUE_SIZE];
int queueHead = 0;
int queueTail = 0;
int queueCount = 0;

// Function to send data to Firebase using REST API
bool sendToFirebase(String path, String jsonData) {
  if (!wifiConnected) {
    Serial.println("⚠️  WiFi not connected, skipping Firebase");
    return false;
  }
  
  HTTPClient http;
  String url = firebaseURL + path + ".json";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.PUT(jsonData);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✓ Firebase: " + String(httpResponseCode));
    http.end();
    return true;
  } else {
    Serial.print("✗ Firebase Error: ");
    Serial.println(httpResponseCode);
    http.end();
    return false;
  }
}

// Add item to Firebase queue
bool queueFirebaseWrite(String path, String jsonData) {
  if (queueCount >= MAX_QUEUE_SIZE) {
    Serial.println("⚠️  Firebase queue full, dropping packet!");
    return false;
  }
  
  firebaseQueue[queueTail].path = path;
  firebaseQueue[queueTail].jsonData = jsonData;
  firebaseQueue[queueTail].timestamp = millis();
  
  queueTail = (queueTail + 1) % MAX_QUEUE_SIZE;
  queueCount++;
  
  return true;
}

// Process one item from Firebase queue (non-blocking)
void processFirebaseQueue() {
  if (queueCount == 0) return;
  if (!wifiConnected) return;
  
  // Process one item per loop iteration
  FirebaseQueueItem item = firebaseQueue[queueHead];
  
  Serial.print("📤 Processing queued Firebase write (");
  Serial.print(queueCount);
  Serial.println(" in queue)...");
  
  bool success = sendToFirebase(item.path, item.jsonData);
  
  if (success) {
    // Remove from queue
    queueHead = (queueHead + 1) % MAX_QUEUE_SIZE;
    queueCount--;
    Serial.println("✅ Queue item sent successfully");
  } else {
    // Keep in queue, will retry next time
    Serial.println("❌ Queue item failed, will retry");
  }
}

// Function to get data from Firebase
String getFromFirebase(String path) {
  if (!wifiConnected) {
    Serial.println("⚠️  WiFi not connected, skipping Firebase");
    return "";
  }
  
  HTTPClient http;
  String url = firebaseURL + path + ".json";
  
  http.begin(url);
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    http.end();
    return response;
  } else {
    Serial.print("✗ Firebase GET Error: ");
    Serial.println(httpResponseCode);
    http.end();
    return "";
  }
}

// Function to check if UID is an admin card
bool isAdminCard(String uid) {
  if (!wifiConnected) return false;
  
  String response = getFromFirebase("/admins/" + uid);
  
  // If response is not "null" and not empty, admin exists
  if (response.length() > 0 && response != "null") {
    return true;
  }
  
  return false;
}

// Function to check if UID is in professor whitelist
bool isProfessorCard(String uid) {
  if (!wifiConnected) return false;
  
  String response = getFromFirebase("/professors/" + uid);
  
  // If response is not "null" and not empty, professor exists
  if (response.length() > 0 && response != "null") {
    return true;
  }
  
  return false;
}

// Function to create admin session in Firebase
bool createAdminSession(String uid) {
  if (!wifiConnected) return false;
  
  StaticJsonDocument<256> doc;
  doc["uid"] = uid;
  doc["started_at"] = millis();
  doc["expires_at"] = millis() + ADMIN_SESSION_TIMEOUT;
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  String sessionId = String(millis());
  return sendToFirebase("/admin_sessions/" + sessionId, jsonData);
}

// Function to log attendance to Firebase (non-blocking - uses queue)
bool logAttendance(String uid, String roomId, String status, unsigned long timestamp) {
  if (!wifiConnected) return false;
  
  // Create JSON document
  StaticJsonDocument<256> doc;
  doc["uid"] = uid;
  doc["room_id"] = roomId;
  doc["status"] = status;
  doc["timestamp"] = timestamp;
  doc["rssi"] = LoRa.packetRssi();
  doc["snr"] = LoRa.packetSnr();
  doc["logged_at"] = millis();
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  // Generate unique log ID using timestamp
  String logPath = "/monitoring_logs/" + String(timestamp);
  
  Serial.println("📤 Queueing Firebase write...");
  Serial.println("   Path: " + logPath);
  Serial.println("   Data: " + jsonData);
  
  // Queue instead of sending immediately (non-blocking)
  return queueFirebaseWrite(logPath, jsonData);
}

// Function to log faculty room tap (non-blocking - uses queue)
bool logFacultyRoomTap(String uid, String status) {
  if (!wifiConnected) return false;
  
  unsigned long timestamp = millis();
  
  StaticJsonDocument<256> doc;
  doc["uid"] = uid;
  doc["room_id"] = "faculty_room";
  doc["status"] = status;
  doc["timestamp"] = timestamp;
  doc["logged_at"] = millis();
  doc["source"] = "receiver_rfid";
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  String logPath = "/monitoring_logs/" + String(timestamp);
  
  Serial.println("📤 Queueing faculty room tap...");
  Serial.println("   UID: " + uid);
  Serial.println("   Status: " + status);
  
  // Queue instead of sending immediately (non-blocking)
  return queueFirebaseWrite(logPath, jsonData);
}

// Function to send pending registration to Firebase (non-blocking - uses queue)
bool sendPendingRegistration(String uid) {
  if (!wifiConnected) return false;
  
  StaticJsonDocument<256> doc;
  doc["uid"] = uid;
  doc["scanned_at"] = millis();
  doc["status"] = "pending";
  
  String jsonData;
  serializeJson(doc, jsonData);
  
  // Queue instead of sending immediately (non-blocking)
  return queueFirebaseWrite("/pending_registrations/" + uid, jsonData);
}

// State tracking
unsigned long lastDisplayUpdate = 0;
const long displayUpdateInterval = 3000;  // Clear message after 3 seconds
bool messageReceived = false;
int messageCount = 0;
String lastRoomId = "";
String lastUID = "";

// Non-blocking display state
bool showingCardMessage = false;
unsigned long cardMessageStartTime = 0;
const long CARD_MESSAGE_DURATION = 2000;  // Show card message for 2 seconds

void initializeDisplay() {
  // Initialize I2C with custom pins
  Wire.begin(I2C_SDA, I2C_SCL);
  delay(100);
  
  // Try both possible I2C addresses
  bool displayFound = false;
  
  // Try address 0x3C first
  if (display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    displayFound = true;
    Serial.println("✓ Display found at 0x3C");
  }
  // Try address 0x3D if 0x3C fails
  else {
    Adafruit_SSD1306 display2(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
    if (display2.begin(SSD1306_SWITCHCAPVCC, 0x3D)) {
      displayFound = true;
      display = display2;
      Serial.println("✓ Display found at 0x3D");
    }
  }
  
  if (!displayFound) {
    Serial.println("✗ SSD1306 not found!");
    return;
  }
  
  // Initialize DisplayManager
  displayManager.initialize(display);
  displayManager.showInitializing();
  Serial.println("✓ Display initialized!");
}

void displayWaiting() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Title with mode indicator
  display.setCursor(0, 0);
  if (currentMode == MODE_LORA_MONITORING) {
    display.println("LoRa Monitoring");
  } else if (currentMode == MODE_FACULTY_ROOM) {
    display.println("Faculty Room");
  } else if (currentMode == MODE_ADMIN_REGISTRATION) {
    display.println("ADMIN MODE");
  }
  
  // Separator
  display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
  
  // Connection status icons (top right)
  display.setCursor(100, 0);
  if (wifiConnected) {
    display.print("W");
  }
  
  // RFID status indicator
  display.setCursor(110, 0);
  if (rfidManager.getConsecutiveFailures() == 0) {
    display.print("R");  // RFID OK
  } else {
    display.print("!");  // RFID issue
  }
  
  // Mode-specific content
  if (currentMode == MODE_LORA_MONITORING) {
    display.setCursor(0, 15);
    display.println("Listening...");
    
    display.setCursor(0, 30);
    display.print("Packets: ");
    display.println(messageCount);
    
    if (messageCount > 0) {
      display.setCursor(0, 45);
      display.println("Last:");
      display.setCursor(0, 55);
      if (lastRoomId.length() > 0) {
        display.print("Room ");
        display.println(lastRoomId);
      } else {
        display.println(lastUID.substring(0, 16));
      }
    }
  } else if (currentMode == MODE_FACULTY_ROOM) {
    display.setCursor(0, 15);
    display.println("Tap your card");
    display.setCursor(0, 25);
    display.println("to toggle IN/OUT");
    
    display.setCursor(0, 45);
    display.print("Occupants: ");
    display.println(occupancyTracker.getOccupantCount());
  } else if (currentMode == MODE_ADMIN_REGISTRATION) {
    display.setCursor(0, 15);
    display.println("REGISTRATION MODE");
    
    display.setCursor(0, 30);
    display.println("Scan card to");
    display.setCursor(0, 40);
    display.println("register");
    
    // Show session timeout
    if (adminSessionActive) {
      unsigned long remaining = (ADMIN_SESSION_TIMEOUT - (millis() - adminSessionStart)) / 1000;
      display.setCursor(0, 55);
      display.print("Time: ");
      display.print(remaining / 60);
      display.print("m");
    }
  }
  
  display.display();
}

void displayCardScanned(String uid, String message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  display.setCursor(0, 0);
  display.println("Card Detected!");
  display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
  
  display.setCursor(0, 15);
  display.println("UID:");
  display.setCursor(0, 25);
  display.println(uid);
  
  display.setCursor(0, 40);
  display.println(message);
  
  display.display();
  
  // Set non-blocking timer
  showingCardMessage = true;
  cardMessageStartTime = millis();
}

// Check if card message should be cleared
void updateCardMessageDisplay() {
  if (showingCardMessage && (millis() - cardMessageStartTime >= CARD_MESSAGE_DURATION)) {
    showingCardMessage = false;
    displayWaiting();
  }
}

// Function to handle physical button press for mode switching
void handleModeButton() {
  bool currentButtonState = digitalRead(MODE_BUTTON_PIN);
  
  // Button pressed (LOW because of pull-up)
  if (currentButtonState == LOW && lastButtonState == HIGH) {
    buttonPressTime = millis();
  }
  
  // Button held for 2 seconds
  if (currentButtonState == LOW && lastButtonState == LOW) {
    if (millis() - buttonPressTime >= BUTTON_HOLD_TIME_MS) {
      // Cycle through all 3 modes: LoRa Monitoring → Faculty Room → Registration → LoRa Monitoring
      if (currentMode == MODE_LORA_MONITORING) {
        currentMode = MODE_FACULTY_ROOM;
        Serial.println("\n🔘 Button: Switched to Faculty Room Mode");
        
        // Reset RFID reader after mode change
        rfidManager.reset();
        delay(100);
        
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("MODE CHANGED");
        display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
        display.setCursor(0, 20);
        display.println("Faculty Room");
        display.setCursor(0, 35);
        display.println("Mode Activated");
        display.display();
        delay(2000);
        
      } else if (currentMode == MODE_FACULTY_ROOM) {
        currentMode = MODE_ADMIN_REGISTRATION;
        adminSessionActive = true;
        adminSessionStart = millis();
        Serial.println("\n🔘 Button: Switched to Registration Mode");
        
        // Reset RFID reader after mode change
        rfidManager.reset();
        delay(100);
        
        // Update Firebase to sync with dashboard
        if (wifiConnected) {
          sendToFirebase("/system_config/registration_mode", "true");
        }
        
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("MODE CHANGED");
        display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
        display.setCursor(0, 20);
        display.println("Registration");
        display.setCursor(0, 35);
        display.println("Mode Activated");
        display.display();
        delay(2000);
        
      } else if (currentMode == MODE_ADMIN_REGISTRATION) {
        currentMode = MODE_LORA_MONITORING;
        adminSessionActive = false;
        Serial.println("\n🔘 Button: Switched to LoRa Monitoring Mode");
        
        // Reset RFID reader after mode change
        rfidManager.reset();
        delay(100);
        
        // Update Firebase to sync with dashboard
        if (wifiConnected) {
          sendToFirebase("/system_config/registration_mode", "false");
        }
        
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("MODE CHANGED");
        display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
        display.setCursor(0, 20);
        display.println("LoRa Monitoring");
        display.setCursor(0, 35);
        display.println("Mode Activated");
        display.display();
        delay(2000);
      }
      
      displayWaiting();
      buttonPressTime = millis() + 10000; // Prevent multiple triggers
    }
  }
  
  lastButtonState = currentButtonState;
}

// Function to check dashboard mode setting from Firebase
void checkDashboardModeControl() {
  if (!wifiConnected) return;
  
  String response = getFromFirebase("/system_config/registration_mode");
  
  // Parse response
  if (response.length() > 0 && response != "null") {
    // Check if registration mode is enabled
    if (response.indexOf("true") >= 0) {
      if (currentMode != MODE_ADMIN_REGISTRATION) {
        Serial.println("\n📱 Dashboard: Registration mode enabled");
        currentMode = MODE_ADMIN_REGISTRATION;
        adminSessionActive = true;
        adminSessionStart = millis();
        
        // Reset RFID reader when entering registration mode
        rfidManager.reset();
        delay(100);
        
        displayWaiting();
      }
    } else {
      if (currentMode == MODE_ADMIN_REGISTRATION && adminSessionActive) {
        Serial.println("\n📱 Dashboard: Registration mode disabled");
        currentMode = MODE_LORA_MONITORING;
        adminSessionActive = false;
        displayWaiting();
      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("🚀 LoRa Receiver Faculty Monitoring");
  Serial.println("========================================");
  Serial.println("Board: Heltec WiFi LoRa 32 V2");
  Serial.println("Frequency: 915 MHz");
  Serial.println("Mode: WiFi + Firebase REST API");
  Serial.println("========================================\n");
  
  // Initialize mode button (built-in PROG button)
  pinMode(MODE_BUTTON_PIN, INPUT_PULLUP);
  Serial.println("✓ Mode button initialized (GPIO 0 - PROG button)");
  Serial.println("   Hold for 2 seconds to toggle mode\n");
  
  // Initialize display
  Serial.println("Initializing display...");
  initializeDisplay();
  delay(500);
  
  // Initialize LoRa
  Serial.println("Initializing LoRa...");
  if (!loraManager.initialize()) {
    Serial.println("✗ LoRa initialization FAILED!");
    displayManager.showError("LoRa Init Failed");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("✓ LoRa initialized!");
  
  // Connect to WiFi
  Serial.println("\n========================================");
  Serial.println("📡 WiFi Connection Test");
  Serial.println("========================================");
  Serial.print("SSID: ");
  Serial.println(WIFI_SSID);
  Serial.print("Password: ");
  for (int i = 0; i < strlen(WIFI_PASSWORD); i++) {
    Serial.print("*");
  }
  Serial.println();
  
  displayManager.showError("Connecting WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.println("\nConnecting");
  int wifiTimeout = 30; // 30 seconds timeout
  int dots = 0;
  while (WiFi.status() != WL_CONNECTED && wifiTimeout > 0) {
    delay(500);
    Serial.print(".");
    dots++;
    if (dots % 10 == 0) {
      Serial.print(" ");
      Serial.print(wifiTimeout);
      Serial.println("s");
    }
    wifiTimeout--;
  }
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("========================================");
    Serial.println("✅ WiFi Connected Successfully!");
    Serial.println("========================================");
    Serial.print("📍 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("📶 Signal Strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.print("🌐 Gateway: ");
    Serial.println(WiFi.gatewayIP());
    Serial.print("🔒 Subnet Mask: ");
    Serial.println(WiFi.subnetMask());
    Serial.print("📡 MAC Address: ");
    Serial.println(WiFi.macAddress());
    Serial.println("========================================\n");
    
    // Show success on display
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("WiFi Connected!");
    display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
    display.setCursor(0, 15);
    display.println("IP:");
    display.setCursor(0, 25);
    display.println(WiFi.localIP());
    display.setCursor(0, 40);
    display.print("RSSI: ");
    display.print(WiFi.RSSI());
    display.println(" dBm");
    display.display();
    delay(5000);
  } else {
    wifiConnected = false;
    Serial.println("========================================");
    Serial.println("❌ WiFi Connection Failed!");
    Serial.println("========================================");
    Serial.println("Possible reasons:");
    Serial.println("1. Wrong SSID or password");
    Serial.println("2. Router out of range");
    Serial.println("3. 2.4GHz WiFi not enabled");
    Serial.println("4. Special characters in password");
    Serial.println("========================================\n");
    
    displayManager.showError("WiFi Failed!");
    delay(3000);
  }
  
  // Show ready screen
  displayManager.showReady();
  Serial.println("\n✓ System Ready!");
  if (wifiConnected) {
    Serial.println("✓ WiFi: Connected");
  } else {
    Serial.println("✗ WiFi: Disconnected (will work offline)");
  }
  
  // Initialize RFID reader
  Serial.println("\nInitializing RFID reader...");
  if (!rfidManager.initialize(RFID_SS, RFID_RST)) {
    Serial.println("✗ RFID initialization FAILED!");
    Serial.println("⚠️  System will continue without RFID support");
    
    // Show error on display
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("RFID ERROR!");
    display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
    display.setCursor(0, 15);
    display.println("Check wiring:");
    display.setCursor(0, 25);
    display.println("SS=21, RST=17");
    display.setCursor(0, 40);
    display.println("Continuing...");
    display.display();
    delay(3000);
  } else {
    Serial.println("✓ RFID initialized!");
    
    // Test RFID reader
    Serial.println("\n🧪 Testing RFID reader...");
    Serial.println("   Please tap a card within 5 seconds...");
    
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("RFID Test");
    display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
    display.setCursor(0, 20);
    display.println("Tap a card");
    display.setCursor(0, 35);
    display.println("within 5 sec...");
    display.display();
    
    bool cardDetected = false;
    unsigned long testStart = millis();
    while (millis() - testStart < 5000) {
      if (rfidManager.isCardPresent()) {
        String testUID = rfidManager.readCardUID();
        if (testUID.length() > 0) {
          Serial.println("✅ RFID reader working!");
          Serial.print("   Test card UID: ");
          Serial.println(testUID);
          
          display.clearDisplay();
          display.setTextSize(1);
          display.setTextColor(SSD1306_WHITE);
          display.setCursor(0, 0);
          display.println("RFID OK!");
          display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
          display.setCursor(0, 20);
          display.println("Card detected:");
          display.setCursor(0, 35);
          display.println(testUID);
          display.display();
          
          cardDetected = true;
          delay(2000);
          break;
        }
      }
      delay(100);
    }
    
    if (!cardDetected) {
      Serial.println("⚠️  No card detected during test");
      Serial.println("   RFID reader initialized but not tested");
      
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SSD1306_WHITE);
      display.setCursor(0, 0);
      display.println("RFID Ready");
      display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
      display.setCursor(0, 20);
      display.println("No card tapped");
      display.setCursor(0, 35);
      display.println("Continuing...");
      display.display();
      delay(2000);
    }
  }
  
  // Initialize managers
  Serial.println("\nInitializing managers...");
  antiBounceManager.initialize();
  whitelistManager.initialize();
  occupancyTracker.initialize();
  stateManager.initialize();
  Serial.println("✓ All managers initialized!");
  
  Serial.println("\n========================================");
  Serial.println("🎯 SYSTEM MODES:");
  Serial.println("========================================");
  Serial.println("1. LoRa Monitoring (default)");
  Serial.println("   - Receives packets from transmitters");
  Serial.println("2. Faculty Room Mode");
  Serial.println("   - Tap professor card for IN/OUT");
  Serial.println("3. Admin/Registration Mode");
  Serial.println("   - Register new RFID cards");
  Serial.println("");
  Serial.println("🔘 PROG Button (hold 2s):");
  Serial.println("   Cycle: LoRa → Faculty → Registration → LoRa");
  Serial.println("");
  Serial.println("💳 Admin Card:");
  Serial.println("   Toggle Registration Mode ON/OFF");
  Serial.println("========================================\n");
  
  Serial.println("\nListening for LoRa packets and RFID cards...\n");
  delay(2000);
  
  // Show waiting screen
  displayWaiting();
}

void loop() {
  // ===== NON-BLOCKING DISPLAY UPDATE =====
  updateCardMessageDisplay();
  
  // ===== FIREBASE QUEUE PROCESSING (NON-BLOCKING) =====
  // Process one Firebase write per loop iteration
  static unsigned long lastFirebaseProcess = 0;
  if (millis() - lastFirebaseProcess >= 100) {  // Process every 100ms
    lastFirebaseProcess = millis();
    processFirebaseQueue();
  }
  
  // ===== PHYSICAL BUTTON HANDLING =====
  handleModeButton();
  
  // ===== DASHBOARD MODE CONTROL =====
  // Check Firebase for mode changes from dashboard (every 5 seconds)
  static unsigned long lastDashboardCheck = 0;
  if (millis() - lastDashboardCheck >= 5000) {
    lastDashboardCheck = millis();
    checkDashboardModeControl();
  }
  
  // Monitor WiFi connection status
  static unsigned long lastWiFiCheck = 0;
  if (millis() - lastWiFiCheck >= 10000) { // Check every 10 seconds
    lastWiFiCheck = millis();
    if (WiFi.status() == WL_CONNECTED && !wifiConnected) {
      wifiConnected = true;
      Serial.println("✓ WiFi reconnected!");
    } else if (WiFi.status() != WL_CONNECTED && wifiConnected) {
      wifiConnected = false;
      Serial.println("✗ WiFi disconnected!");
    }
  }
  
  // Check admin session timeout
  if (adminSessionActive && (millis() - adminSessionStart > ADMIN_SESSION_TIMEOUT)) {
    Serial.println("⏱️  Admin session expired");
    adminSessionActive = false;
    currentMode = MODE_LORA_MONITORING;
    displayWaiting();
  }
  
  // Check RFID reader health
  if (rfidManager.needsReset()) {
    rfidManager.reset();
  }
  
  // ===== RFID CARD READING (ALL MODES) =====
  if (rfidManager.isCardPresent()) {
    String uid = rfidManager.readCardUID();
    
    if (uid.length() > 0) {
      Serial.println("\n========================================");
      Serial.println("💳 RFID CARD DETECTED");
      Serial.println("========================================");
      Serial.print("UID: ");
      Serial.println(uid);
      
      // Check anti-bounce
      if (!antiBounceManager.shouldProcessCard(uid)) {
        Serial.println("⚠️  Card in cooldown period, ignoring");
        Serial.println("========================================\n");
        return;
      }
      
      // Record card read
      antiBounceManager.recordCardRead(uid);
      
      // Check if admin card
      bool isAdmin = isAdminCard(uid);
      bool isProfessor = isProfessorCard(uid);
      
      Serial.print("Admin card: ");
      Serial.println(isAdmin ? "YES" : "NO");
      Serial.print("Professor card: ");
      Serial.println(isProfessor ? "YES" : "NO");
      
      // ===== ADMIN CARD HANDLING =====
      if (isAdmin) {
        Serial.println("🔑 Admin card detected!");
        
        if (currentMode == MODE_ADMIN_REGISTRATION) {
          // Exit admin mode
          Serial.println("👋 Exiting admin mode");
          adminSessionActive = false;
          currentMode = MODE_LORA_MONITORING;
          displayCardScanned(uid, "Admin Logout");
        } else {
          // Enter admin mode
          Serial.println("🔓 Entering admin/registration mode");
          adminSessionActive = true;
          adminSessionStart = millis();
          currentMode = MODE_ADMIN_REGISTRATION;
          
          // Reset RFID reader when entering admin mode
          rfidManager.reset();
          delay(100);
          
          // Create session in Firebase
          if (createAdminSession(uid)) {
            Serial.println("✅ Admin session created in Firebase");
          }
          
          displayCardScanned(uid, "Admin Login");
        }
        
        // Removed blocking delay - display will auto-clear after 2s
        Serial.println("========================================\n");
        return;
      }
      
      // ===== MODE-SPECIFIC CARD HANDLING =====
      if (currentMode == MODE_LORA_MONITORING) {
        // In LoRa monitoring mode, switch to faculty room mode on professor card
        if (isProfessor) {
          Serial.println("👤 Professor card - switching to Faculty Room mode");
          currentMode = MODE_FACULTY_ROOM;
          displayCardScanned(uid, "Faculty Room Mode");
          // Removed blocking delay
          
          // Process the tap immediately
          String status = occupancyTracker.isCurrentlyIn(uid) ? "OUT" : "IN";
          occupancyTracker.toggleOccupancy(uid, uid); // Use UID as name for now
          
          Serial.print("Status toggled to: ");
          Serial.println(status);
          
          // Log to Firebase
          if (logFacultyRoomTap(uid, status)) {
            Serial.println("✅ Faculty room tap logged");
          }
          
          displayCardScanned(uid, "Status: " + status);
          // Removed blocking delay
        } else {
          Serial.println("❌ Unknown card");
          displayCardScanned(uid, "Access Denied");
          // Removed blocking delay
        }
      }
      else if (currentMode == MODE_FACULTY_ROOM) {
        // In faculty room mode, handle professor taps
        if (isProfessor) {
          String status = occupancyTracker.isCurrentlyIn(uid) ? "OUT" : "IN";
          occupancyTracker.toggleOccupancy(uid, uid);
          
          Serial.print("👤 Professor tap - Status: ");
          Serial.println(status);
          
          // Log to Firebase
          if (logFacultyRoomTap(uid, status)) {
            Serial.println("✅ Faculty room tap logged");
          }
          
          displayCardScanned(uid, "Status: " + status);
          // Removed blocking delay
        } else {
          Serial.println("❌ Not a professor card");
          displayCardScanned(uid, "Access Denied");
          // Removed blocking delay
        }
      }
      else if (currentMode == MODE_ADMIN_REGISTRATION) {
        // In registration mode, register any card
        Serial.println("📝 Registering card...");
        
        if (sendPendingRegistration(uid)) {
          Serial.println("✅ Card sent to pending registrations");
          displayCardScanned(uid, "Registered!");
        } else {
          Serial.println("❌ Failed to register card");
          displayCardScanned(uid, "Registration Failed");
        }
        
        // Removed blocking delay
      }
      
      Serial.println("========================================\n");
    }
  }
  
  // ===== LORA PACKET RECEPTION (ALWAYS ACTIVE) =====
  if (loraManager.isPacketAvailable()) {
    // Receive packet with RSSI and SNR
    int rssi = 0;
    float snr = 0;
    String incoming = loraManager.receivePacket(rssi, snr);
    
    // Update counters
    messageCount++;
    messageReceived = true;
    lastDisplayUpdate = millis();
    
    // Parse packet
    ParsedPacket parsed = PacketParser::parsePacket(incoming);
    
    // Store last received info
    if (parsed.isRFIDPacket && parsed.isValid) {
      lastUID = parsed.uid;
      lastRoomId = parsed.roomId;
    } else {
      lastUID = incoming.substring(0, 16);
      lastRoomId = "";
    }
    
    // ===== DETAILED SERIAL MONITOR OUTPUT =====
    Serial.println("========================================");
    Serial.print("📦 PACKET #");
    Serial.println(messageCount);
    Serial.println("========================================");
    
    Serial.print("📡 Raw Data: ");
    Serial.println(incoming);
    Serial.print("📏 Size: ");
    Serial.print(incoming.length());
    Serial.println(" bytes");
    
    if (parsed.isRFIDPacket && parsed.isValid) {
      Serial.println("🔖 Type: RFID Packet");
      Serial.print("   UID: ");
      Serial.println(parsed.uid);
      Serial.print("   Timestamp: ");
      Serial.print(parsed.timestamp);
      Serial.println(" ms");
      Serial.print("   Status: ");
      Serial.println(parsed.status);
      Serial.print("   Room ID: ");
      Serial.println(parsed.roomId);
      
      // Log to Firebase
      if (wifiConnected) {
        Serial.println("\n🔥 Queueing to Firebase...");
        bool success = logAttendance(parsed.uid, parsed.roomId, parsed.status, parsed.timestamp);
        if (success) {
          Serial.println("✅ Firebase: Queued successfully!");
        } else {
          Serial.println("❌ Firebase: Queue full!");
        }
      } else {
        Serial.println("⚠️  Firebase: Skipped (WiFi offline)");
      }
    } else if (parsed.isRFIDPacket && !parsed.isValid) {
      Serial.println("⚠️  Type: Invalid RFID Packet");
    } else {
      Serial.println("💬 Type: Legacy Message");
    }
    
    Serial.print("📶 RSSI: ");
    Serial.print(rssi);
    Serial.println(" dBm");
    Serial.print("📊 SNR: ");
    Serial.print(snr);
    Serial.println(" dB");
    
    // Signal quality indicator
    if (rssi > -50) {
      Serial.println("✅ Signal: EXCELLENT");
    } else if (rssi > -80) {
      Serial.println("✅ Signal: GOOD");
    } else if (rssi > -100) {
      Serial.println("⚠️  Signal: FAIR");
    } else {
      Serial.println("❌ Signal: WEAK");
    }
    
    Serial.print("⏱️  Time: ");
    Serial.print(millis());
    Serial.println(" ms");
    Serial.println("========================================\n");
    
    // Display message on OLED (only in LoRa monitoring mode)
    if (currentMode == MODE_LORA_MONITORING) {
      if (parsed.isRFIDPacket && parsed.isValid) {
        displayManager.showLoRaPacket(parsed.roomId, parsed.uid);
      } else {
        // Show raw message for legacy packets
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("LoRa RX");
        display.drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
        display.setCursor(0, 15);
        display.println("Received:");
        display.setCursor(0, 30);
        if (incoming.length() <= 16) {
          display.println(incoming);
        } else {
          display.println(incoming.substring(0, 16));
          display.setCursor(0, 40);
          display.println(incoming.substring(16, min(32, (int)incoming.length())));
        }
        display.setCursor(0, 55);
        display.print("RSSI: ");
        display.print(rssi);
        display.display();
      }
    }
  } 
  else {
    // No packet received
    if (messageReceived && currentMode == MODE_LORA_MONITORING) {
      // Check if it's time to clear the message
      if (millis() - lastDisplayUpdate >= displayUpdateInterval) {
        messageReceived = false;
        displayWaiting();
      }
    } else {
      // Just waiting - update display occasionally
      if (millis() - lastDisplayUpdate >= 10000) {
        lastDisplayUpdate = millis();
        displayWaiting();
        
        // Heartbeat on serial monitor
        Serial.print("💓 System running... (");
        Serial.print(millis() / 1000);
        Serial.print("s) Mode: ");
        if (currentMode == MODE_LORA_MONITORING) {
          Serial.println("LoRa Monitoring");
        } else if (currentMode == MODE_FACULTY_ROOM) {
          Serial.println("Faculty Room");
        } else {
          Serial.println("Admin/Registration");
        }
      }
    }
  }
  
  // No delay - instant packet and card reception!
}
