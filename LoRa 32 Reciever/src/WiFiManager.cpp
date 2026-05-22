#include "WiFiManager.h"

/**
 * @brief Initialize WiFi manager
 * 
 * Stores credentials and initializes retry tracking.
 */
void WiFiManager::initialize(const String& ssid, const String& password) {
    this->ssid = ssid;
    this->password = password;
    this->lastConnectionAttempt = 0;
    this->retryCount = 0;
}

/**
 * @brief Connect to WiFi network
 * 
 * Attempts connection with 10-second timeout.
 */
bool WiFiManager::connect() {
    // Record connection attempt
    lastConnectionAttempt = millis();
    
    // Start WiFi connection
    WiFi.begin(ssid.c_str(), password.c_str());
    
    // Wait for connection (10 second timeout)
    int timeout = 10000;  // 10 seconds
    unsigned long startTime = millis();
    
    while (WiFi.status() != WL_CONNECTED && (millis() - startTime) < timeout) {
        delay(100);
    }
    
    // Check if connected
    if (WiFi.status() == WL_CONNECTED) {
        retryCount = 0;  // Reset retry count on successful connection
        return true;
    }
    
    // Connection failed
    retryCount++;
    return false;
}

/**
 * @brief Check if WiFi is connected
 */
bool WiFiManager::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}

/**
 * @brief Handle WiFi disconnection
 * 
 * Prepares for reconnection attempt.
 */
void WiFiManager::handleDisconnection() {
    // Disconnect cleanly
    WiFi.disconnect();
    
    // Record disconnection time
    lastConnectionAttempt = millis();
}

/**
 * @brief Check and maintain WiFi connection
 * 
 * Monitors connection status and attempts reconnection with exponential backoff.
 */
void WiFiManager::checkConnection() {
    // Check if currently connected
    if (isConnected()) {
        return;  // Connection is good
    }
    
    // Check if enough time has passed for retry
    unsigned long currentTime = millis();
    unsigned long timeSinceLastAttempt = currentTime - lastConnectionAttempt;
    unsigned long retryDelay = getRetryDelay();
    
    if (timeSinceLastAttempt >= retryDelay) {
        // Attempt reconnection
        Serial.println("WiFi disconnected. Attempting reconnection...");
        connect();
    }
}

/**
 * @brief Calculate retry delay with exponential backoff
 * 
 * Formula: min(base_delay * 2^(retryCount - 1), max_delay)
 */
unsigned long WiFiManager::getRetryDelay() {
    if (retryCount == 0) {
        return RETRY_INTERVAL_MS;
    }
    
    // Calculate exponential backoff
    unsigned long delay = RETRY_INTERVAL_MS;
    for (int i = 1; i < retryCount; i++) {
        delay *= 2;
        
        // Cap at maximum retry interval
        if (delay >= MAX_RETRY_INTERVAL_MS) {
            return MAX_RETRY_INTERVAL_MS;
        }
    }
    
    return delay;
}
