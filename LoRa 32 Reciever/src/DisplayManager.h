#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <Arduino.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <vector>
#include "OccupancyTracker.h"

/**
 * @brief DisplayManager - Renders UI states on OLED display
 * 
 * This class manages all OLED display rendering including system status,
 * occupancy lists, activity notifications, and error messages. Handles
 * text scrolling for long lists.
 */
class DisplayManager {
public:
    /**
     * @brief Initialize display manager
     * 
     * Stores reference to OLED display object.
     * 
     * @param display Reference to Adafruit_SSD1306 display object
     * 
     * Requirements: 14.4
     */
    void initialize(Adafruit_SSD1306& display);
    
    /**
     * @brief Show initializing screen
     * 
     * Displays "Initializing..." message during system startup.
     * 
     * Requirements: 14.6
     */
    void showInitializing();
    
    /**
     * @brief Show ready screen
     * 
     * Displays "System Ready" message after successful initialization.
     * 
     * Requirements: 14.6
     */
    void showReady();
    
    /**
     * @brief Show monitoring mode screen
     * 
     * Displays list of professors currently IN the faculty room.
     * Scrolls if more than 4 professors.
     * 
     * @param occupants Vector of current occupants
     * 
     * Requirements: 9.1, 9.2
     */
    void showMonitoringMode(const std::vector<OccupancyStatus>& occupants);
    
    /**
     * @brief Show registration mode screen
     * 
     * Displays "REGISTRATION MODE" message.
     * 
     * Requirements: 7.2
     */
    void showRegistrationMode();
    
    /**
     * @brief Show card detected message
     * 
     * Displays detected UID on screen.
     * 
     * @param uid RFID card UID
     * 
     * Requirements: 5.6, 7.4
     */
    void showCardDetected(const String& uid);
    
    /**
     * @brief Show access granted message
     * 
     * Displays professor name and action (IN/OUT).
     * 
     * @param name Professor name
     * @param action Action string ("IN" or "OUT")
     * 
     * Requirements: 9.3
     */
    void showAccessGranted(const String& name, const String& action);
    
    /**
     * @brief Show access denied message
     * 
     * Displays "Access Denied" for unauthorized cards.
     * 
     * Requirements: 6.2
     */
    void showAccessDenied();
    
    /**
     * @brief Show LoRa packet received message
     * 
     * Displays room ID and professor name from received packet.
     * 
     * @param roomId Room identifier
     * @param name Professor name
     * 
     * Requirements: 9.4
     */
    void showLoRaPacket(const String& roomId, const String& name);
    
    /**
     * @brief Show WiFi connection status
     * 
     * Displays WiFi status icon/message.
     * 
     * @param connected true if WiFi connected, false otherwise
     * 
     * Requirements: 9.6, 12.4, 12.5
     */
    void showWiFiStatus(bool connected);
    
    /**
     * @brief Show Firebase connection status
     * 
     * Displays Firebase status message.
     * 
     * @param connected true if Firebase connected, false otherwise
     * 
     * Requirements: 13.3, 13.4
     */
    void showFirebaseStatus(bool connected);
    
    /**
     * @brief Show error message
     * 
     * Displays error message on screen.
     * 
     * @param message Error message to display
     * 
     * Requirements: 16.5
     */
    void showError(const String& message);

private:
    Adafruit_SSD1306* display;  // Pointer to OLED display object
    int scrollOffset;           // Current scroll offset for long lists
    
    /**
     * @brief Clear display and set cursor to origin
     */
    void clearAndSetCursor();
    
    /**
     * @brief Draw header with title
     * 
     * @param title Header title text
     */
    void drawHeader(const String& title);
    
    /**
     * @brief Scroll text for long lists
     * 
     * @param lines Vector of text lines to display
     */
    void scrollText(const std::vector<String>& lines);
};

#endif // DISPLAY_MANAGER_H
