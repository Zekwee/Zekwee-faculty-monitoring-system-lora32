#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>

/**
 * @brief WiFiManager - Manages WiFi connection and reconnection
 * 
 * This class handles WiFi network connection with automatic reconnection
 * on failure. Implements exponential backoff for retry attempts.
 */
class WiFiManager {
public:
    /**
     * @brief Initialize WiFi manager
     * 
     * Stores WiFi credentials for connection attempts.
     * 
     * @param ssid WiFi network SSID
     * @param password WiFi network password
     * 
     * Requirements: 12.1
     */
    void initialize(const String& ssid, const String& password);
    
    /**
     * @brief Connect to WiFi network
     * 
     * Attempts to connect to the configured WiFi network.
     * Blocks until connection succeeds or timeout occurs.
     * 
     * @return true if connection successful, false otherwise
     * 
     * Requirements: 2.1, 12.2
     */
    bool connect();
    
    /**
     * @brief Check if WiFi is connected
     * 
     * Returns current WiFi connection status.
     * 
     * @return true if connected, false otherwise
     * 
     * Requirements: 12.4, 12.6
     */
    bool isConnected();
    
    /**
     * @brief Handle WiFi disconnection
     * 
     * Called when WiFi connection is lost.
     * Initiates reconnection attempt with exponential backoff.
     * 
     * Requirements: 12.5
     */
    void handleDisconnection();
    
    /**
     * @brief Check and maintain WiFi connection
     * 
     * Monitors WiFi status and attempts reconnection if disconnected.
     * Should be called periodically in main loop.
     * 
     * Requirements: 12.3, 12.5
     */
    void checkConnection();

private:
    String ssid;                                    // WiFi SSID
    String password;                                // WiFi password
    unsigned long lastConnectionAttempt;            // Timestamp of last connection attempt
    static const unsigned long RETRY_INTERVAL_MS = 30000;  // 30 seconds base retry interval
    static const unsigned long MAX_RETRY_INTERVAL_MS = 300000;  // 5 minutes max retry interval
    int retryCount;                                 // Number of consecutive retry attempts
    
    /**
     * @brief Calculate retry delay with exponential backoff
     * 
     * @return unsigned long Delay in milliseconds before next retry
     */
    unsigned long getRetryDelay();
};

#endif // WIFI_MANAGER_H
