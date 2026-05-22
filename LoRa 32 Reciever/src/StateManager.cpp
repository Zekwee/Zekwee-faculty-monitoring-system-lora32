#include "StateManager.h"

/**
 * @brief Initialize the state manager
 * 
 * Starts in INITIALIZING mode. System will transition to MONITORING
 * mode after successful hardware initialization.
 */
void StateManager::initialize() {
    currentMode = MODE_INITIALIZING;
    lastModeChange = millis();
}

/**
 * @brief Get current system mode
 */
SystemMode StateManager::getCurrentMode() {
    return currentMode;
}

/**
 * @brief Set system mode
 * 
 * Changes the operating mode and records the timestamp.
 */
void StateManager::setMode(SystemMode mode) {
    currentMode = mode;
    lastModeChange = millis();
}

/**
 * @brief Check if in monitoring mode
 */
bool StateManager::isInMonitoringMode() {
    return currentMode == MODE_MONITORING;
}

/**
 * @brief Check if in registration mode
 */
bool StateManager::isInRegistrationMode() {
    return currentMode == MODE_REGISTRATION;
}

/**
 * @brief Handle mode change from Firebase
 * 
 * Switches between MONITORING and REGISTRATION modes based on
 * Firebase configuration flag.
 */
void StateManager::handleModeChange(bool registrationEnabled) {
    if (registrationEnabled) {
        // Switch to registration mode
        if (currentMode != MODE_REGISTRATION) {
            setMode(MODE_REGISTRATION);
        }
    } else {
        // Switch to monitoring mode
        if (currentMode != MODE_MONITORING) {
            setMode(MODE_MONITORING);
        }
    }
}
