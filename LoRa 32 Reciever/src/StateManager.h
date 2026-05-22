#ifndef STATE_MANAGER_H
#define STATE_MANAGER_H

#include <Arduino.h>

/**
 * @brief SystemMode - Enumeration of system operating modes
 */
enum SystemMode {
    MODE_INITIALIZING,   // System is booting and initializing hardware
    MODE_MONITORING,     // Normal operation - tracking faculty room occupancy
    MODE_REGISTRATION,   // Registration mode - scanning new RFID cards
    MODE_ERROR           // Error state - critical failure occurred
};

/**
 * @brief StateManager - Coordinates system mode and state transitions
 * 
 * This class manages the current operating mode of the system and handles
 * transitions between modes. Supports Monitoring mode (default) and
 * Registration mode (admin-triggered via Firebase).
 */
class StateManager {
public:
    /**
     * @brief Initialize the state manager
     * 
     * Initializes the system in INITIALIZING mode.
     * Should be called once at startup.
     */
    void initialize();
    
    /**
     * @brief Get current system mode
     * 
     * Returns the current operating mode.
     * 
     * @return SystemMode Current mode
     * 
     * Requirements: 15.1
     */
    SystemMode getCurrentMode();
    
    /**
     * @brief Set system mode
     * 
     * Changes the system to a new operating mode.
     * Records the timestamp of the mode change.
     * 
     * @param mode New mode to set
     * 
     * Requirements: 15.2, 15.3, 15.4
     */
    void setMode(SystemMode mode);
    
    /**
     * @brief Check if in monitoring mode
     * 
     * Convenience method to check if system is in monitoring mode.
     * 
     * @return true if in MODE_MONITORING, false otherwise
     * 
     * Requirements: 15.1
     */
    bool isInMonitoringMode();
    
    /**
     * @brief Check if in registration mode
     * 
     * Convenience method to check if system is in registration mode.
     * 
     * @return true if in MODE_REGISTRATION, false otherwise
     * 
     * Requirements: 7.2
     */
    bool isInRegistrationMode();
    
    /**
     * @brief Handle mode change from Firebase
     * 
     * Processes a mode change request from Firebase configuration.
     * If registrationEnabled is true, switches to REGISTRATION mode.
     * If registrationEnabled is false, switches to MONITORING mode.
     * 
     * @param registrationEnabled Registration mode flag from Firebase
     * 
     * Requirements: 7.1, 7.5, 15.2
     */
    void handleModeChange(bool registrationEnabled);

private:
    SystemMode currentMode;           // Current operating mode
    unsigned long lastModeChange;     // Timestamp of last mode change
};

#endif // STATE_MANAGER_H
