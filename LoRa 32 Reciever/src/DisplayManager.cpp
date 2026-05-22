#include "DisplayManager.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

/**
 * @brief Initialize display manager
 */
void DisplayManager::initialize(Adafruit_SSD1306& display) {
    this->display = &display;
    this->scrollOffset = 0;
}

/**
 * @brief Clear display and set cursor to origin
 */
void DisplayManager::clearAndSetCursor() {
    display->clearDisplay();
    display->setTextSize(1);
    display->setTextColor(SSD1306_WHITE);
    display->setCursor(0, 0);
}

/**
 * @brief Draw header with title
 */
void DisplayManager::drawHeader(const String& title) {
    display->println(title);
    display->drawLine(0, 10, SCREEN_WIDTH, 10, SSD1306_WHITE);
}

/**
 * @brief Show initializing screen
 */
void DisplayManager::showInitializing() {
    clearAndSetCursor();
    drawHeader("System");
    display->setCursor(0, 15);
    display->println("Initializing...");
    display->display();
}

/**
 * @brief Show ready screen
 */
void DisplayManager::showReady() {
    clearAndSetCursor();
    drawHeader("System");
    display->setCursor(0, 15);
    display->println("Ready!");
    display->setCursor(0, 30);
    display->println("Listening...");
    display->display();
}

/**
 * @brief Show monitoring mode screen
 * 
 * Displays list of professors currently IN.
 * Shows up to 4 names, scrolls if more.
 */
void DisplayManager::showMonitoringMode(const std::vector<OccupancyStatus>& occupants) {
    clearAndSetCursor();
    drawHeader("Faculty Room");
    
    display->setCursor(0, 15);
    
    if (occupants.empty()) {
        display->println("No one inside");
    } else {
        display->print("Inside (");
        display->print(occupants.size());
        display->println("):");
        
        // Display up to 4 names
        int maxDisplay = 4;
        int startIndex = scrollOffset;
        int endIndex = min(startIndex + maxDisplay, (int)occupants.size());
        
        for (int i = startIndex; i < endIndex; i++) {
            display->setCursor(0, 25 + (i - startIndex) * 10);
            
            // Truncate long names to fit screen (16 chars max)
            String name = occupants[i].name;
            if (name.length() > 16) {
                name = name.substring(0, 13) + "...";
            }
            display->println(name);
        }
        
        // Show scroll indicator if more names exist
        if (occupants.size() > maxDisplay) {
            display->setCursor(120, 55);
            display->print(">");
        }
    }
    
    display->display();
}

/**
 * @brief Show registration mode screen
 */
void DisplayManager::showRegistrationMode() {
    clearAndSetCursor();
    drawHeader("REGISTRATION");
    display->setCursor(0, 15);
    display->println("Scan card to");
    display->setCursor(0, 25);
    display->println("register...");
    display->display();
}

/**
 * @brief Show card detected message
 */
void DisplayManager::showCardDetected(const String& uid) {
    clearAndSetCursor();
    drawHeader("Card Detected");
    display->setCursor(0, 15);
    display->println("UID:");
    display->setCursor(0, 30);
    
    // Display UID (wrap if necessary)
    if (uid.length() <= 16) {
        display->println(uid);
    } else {
        display->println(uid.substring(0, 16));
        display->setCursor(0, 40);
        display->println(uid.substring(16));
    }
    
    display->display();
}

/**
 * @brief Show access granted message
 */
void DisplayManager::showAccessGranted(const String& name, const String& action) {
    clearAndSetCursor();
    drawHeader("Access Granted");
    display->setCursor(0, 15);
    
    // Truncate long names
    String displayName = name;
    if (displayName.length() > 16) {
        displayName = displayName.substring(0, 13) + "...";
    }
    display->println(displayName);
    
    display->setCursor(0, 30);
    display->print("Status: ");
    display->println(action);
    
    display->display();
}

/**
 * @brief Show access denied message
 */
void DisplayManager::showAccessDenied() {
    clearAndSetCursor();
    drawHeader("Access Denied");
    display->setCursor(0, 15);
    display->println("Unauthorized");
    display->setCursor(0, 25);
    display->println("card!");
    display->display();
}

/**
 * @brief Show LoRa packet received message
 */
void DisplayManager::showLoRaPacket(const String& roomId, const String& name) {
    clearAndSetCursor();
    drawHeader("LoRa RX");
    display->setCursor(0, 15);
    display->print("Room: ");
    display->println(roomId);
    
    display->setCursor(0, 30);
    // Truncate long names
    String displayName = name;
    if (displayName.length() > 16) {
        displayName = displayName.substring(0, 13) + "...";
    }
    display->println(displayName);
    
    display->display();
}

/**
 * @brief Show WiFi connection status
 */
void DisplayManager::showWiFiStatus(bool connected) {
    // Display WiFi status in top-right corner
    display->setCursor(100, 0);
    if (connected) {
        display->print("WiFi");
    } else {
        display->print("NoWF");
    }
    display->display();
}

/**
 * @brief Show Firebase connection status
 */
void DisplayManager::showFirebaseStatus(bool connected) {
    clearAndSetCursor();
    drawHeader("Firebase");
    display->setCursor(0, 15);
    if (connected) {
        display->println("Connected");
    } else {
        display->println("Auth Failed");
    }
    display->display();
}

/**
 * @brief Show error message
 */
void DisplayManager::showError(const String& message) {
    clearAndSetCursor();
    drawHeader("ERROR");
    display->setCursor(0, 15);
    
    // Word wrap error message
    int lineLength = 16;
    int startPos = 0;
    int yPos = 15;
    
    while (startPos < message.length() && yPos < 60) {
        int endPos = min(startPos + lineLength, (int)message.length());
        String line = message.substring(startPos, endPos);
        
        display->setCursor(0, yPos);
        display->println(line);
        
        startPos = endPos;
        yPos += 10;
    }
    
    display->display();
}

/**
 * @brief Scroll text for long lists
 */
void DisplayManager::scrollText(const std::vector<String>& lines) {
    // TODO: Implement auto-scrolling for long lists
    // This would cycle through names automatically
}
