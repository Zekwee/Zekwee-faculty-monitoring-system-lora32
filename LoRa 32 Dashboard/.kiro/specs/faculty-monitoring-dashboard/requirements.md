# Requirements Document

## Introduction

The Faculty Monitoring Dashboard is a real-time web application built with the XUI framework that displays faculty room activity data collected from ESP32 LoRa receivers with RFID sensors. The dashboard connects to Firebase Realtime Database to monitor faculty entry/exit events across multiple rooms, providing live statistics, filtering capabilities, and signal quality metrics for administrative oversight.

## Glossary

- **Dashboard**: The web application interface displaying faculty monitoring data
- **Firebase_Service**: The module responsible for connecting to and reading from Firebase Realtime Database
- **Log_Viewer**: The component displaying the latest monitoring log entries in table format
- **Statistics_Module**: The component calculating and displaying aggregate metrics (total logs, unique UIDs, signal quality)
- **Filter_Engine**: The component handling search and filter operations on log data
- **Monitoring_Log**: A single record containing UID, room_id, status, timestamp, RSSI, SNR, and logged_at fields
- **RSSI**: Received Signal Strength Indicator, measured in dBm
- **SNR**: Signal-to-Noise Ratio, measured in dB
- **UID**: Unique Identifier from RFID tag (format: "XX:XX:XX:XX")
- **Room_Status**: The current activity state of a room based on recent logs
- **XUI_Framework**: The custom JavaScript framework providing state management, routing, and component rendering
- **Auth_Service**: The module responsible for Firebase Authentication operations (login, logout, session management)
- **Admin_User**: A user with authenticated access to protected features (Registration Panel and Admin Panel)
- **Public_User**: An unauthenticated user with read-only access to the Monitoring Dashboard
- **Registration_Panel**: The component for scanning RFID cards and registering professor information
- **Admin_Panel**: The component for managing registered professors, viewing statistics, and configuring system settings
- **Professor_Record**: A database record containing professor information (uid, name, department, status, registered_at)
- **Login_Page**: The authentication interface for admin users to sign in with email and password
- **Navigation_Component**: The component displaying available tabs based on authentication state
- **Firebase_Auth**: Firebase Authentication service for managing user sessions
- **Security_Rules**: Firebase database rules controlling read/write access based on authentication state

## Requirements

### Requirement 1: Firebase Realtime Database Connection

**User Story:** As a system administrator, I want the dashboard to connect to Firebase Realtime Database, so that I can access real-time faculty monitoring data.

#### Acceptance Criteria

1. THE Firebase_Service SHALL connect to the Firebase Realtime Database at URL "https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app"
2. THE Firebase_Service SHALL use API key "AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g" and project ID "faculty-monitoring-e00b7"
3. WHEN the Firebase_Service initializes, THE Firebase_Service SHALL verify the connection is established
4. IF the connection fails, THEN THE Firebase_Service SHALL return a descriptive error message
5. THE Firebase_Service SHALL read data from the "/monitoring_logs/" path

### Requirement 2: Real-Time Log Retrieval

**User Story:** As a system administrator, I want to see the latest monitoring logs automatically, so that I can track faculty activity as it happens.

#### Acceptance Criteria

1. WHEN new data is added to "/monitoring_logs/", THE Firebase_Service SHALL retrieve the update within 2 seconds
2. THE Firebase_Service SHALL retrieve the latest 50 monitoring logs ordered by timestamp descending
3. WHEN a Monitoring_Log is retrieved, THE Firebase_Service SHALL parse all fields (uid, room_id, status, timestamp, rssi, snr, logged_at)
4. THE Firebase_Service SHALL provide a subscription mechanism for real-time updates
5. FOR ALL retrieved logs, THE Firebase_Service SHALL validate that required fields (uid, room_id, status, timestamp) are present

### Requirement 3: Log Viewer Display

**User Story:** As a system administrator, I want to view monitoring logs in a table format, so that I can easily read and understand faculty activity.

#### Acceptance Criteria

1. THE Log_Viewer SHALL display monitoring logs in a table with columns: UID, Room ID, Status, Timestamp, RSSI, SNR
2. THE Log_Viewer SHALL display the latest 50 logs ordered by most recent first
3. WHEN a new log arrives, THE Log_Viewer SHALL update the display within 2 seconds
4. THE Log_Viewer SHALL format timestamps as human-readable date and time (e.g., "2024-01-15 14:30:25")
5. THE Log_Viewer SHALL display status values as "IN" or "OUT" with visual indicators (green for IN, red for OUT)
6. THE Log_Viewer SHALL display RSSI values with units "dBm"
7. THE Log_Viewer SHALL display SNR values with units "dB"

### Requirement 4: Statistics Dashboard

**User Story:** As a system administrator, I want to see aggregate statistics, so that I can understand overall system activity at a glance.

#### Acceptance Criteria

1. THE Statistics_Module SHALL calculate and display the total number of logs for the current day
2. THE Statistics_Module SHALL calculate and display the count of unique UIDs detected today
3. THE Statistics_Module SHALL calculate and display the average RSSI value from all logs today
4. THE Statistics_Module SHALL calculate and display the average SNR value from all logs today
5. WHEN new logs arrive, THE Statistics_Module SHALL recalculate statistics within 2 seconds
6. THE Statistics_Module SHALL display statistics in card components with labels and values
7. THE Statistics_Module SHALL display "0" or "N/A" when no data is available for a statistic

### Requirement 5: Room Status Overview

**User Story:** As a system administrator, I want to see which rooms have recent activity, so that I can identify active monitoring locations.

#### Acceptance Criteria

1. THE Dashboard SHALL display a list of all rooms that have logs in the past 24 hours
2. WHEN a room has logs, THE Dashboard SHALL display the room identifier and the count of logs for that room
3. THE Dashboard SHALL display the most recent status (IN or OUT) for each room
4. THE Dashboard SHALL display the timestamp of the most recent log for each room
5. WHEN a room has no activity in the past 24 hours, THE Dashboard SHALL not display that room in the active list

### Requirement 6: Filter and Search Functionality

**User Story:** As a system administrator, I want to filter logs by date, room, or UID, so that I can find specific monitoring events.

#### Acceptance Criteria

1. THE Filter_Engine SHALL provide a date range filter with start date and end date inputs
2. THE Filter_Engine SHALL provide a room ID filter with dropdown or text input
3. THE Filter_Engine SHALL provide a UID filter with text input supporting partial matches
4. WHEN a filter is applied, THE Filter_Engine SHALL display only logs matching all active filter criteria
5. WHEN multiple filters are active, THE Filter_Engine SHALL apply AND logic (all conditions must match)
6. THE Filter_Engine SHALL provide a "Clear Filters" action that removes all active filters
7. WHEN filters are cleared, THE Log_Viewer SHALL display all available logs

### Requirement 7: Signal Quality Visualization

**User Story:** As a system administrator, I want to see signal quality indicators, so that I can identify potential hardware or connectivity issues.

#### Acceptance Criteria

1. THE Dashboard SHALL display RSSI values with color coding: green for RSSI > -50 dBm, yellow for -70 to -50 dBm, red for < -70 dBm
2. THE Dashboard SHALL display SNR values with color coding: green for SNR > 8 dB, yellow for 5 to 8 dB, red for < 5 dB
3. THE Statistics_Module SHALL display a signal quality summary showing percentage of logs with good signal (RSSI > -50 and SNR > 8)
4. WHEN signal quality is poor (< 50% good signals), THE Dashboard SHALL display a warning indicator
5. THE Dashboard SHALL provide a tooltip or legend explaining signal quality thresholds

### Requirement 8: Responsive Design

**User Story:** As a system administrator, I want the dashboard to work on mobile devices, so that I can monitor faculty activity from anywhere.

#### Acceptance Criteria

1. THE Dashboard SHALL display correctly on screen widths from 320px to 1920px
2. WHEN viewed on screens smaller than 768px, THE Dashboard SHALL stack components vertically
3. WHEN viewed on screens smaller than 768px, THE Log_Viewer SHALL display a simplified table or card layout
4. THE Dashboard SHALL use responsive Tailwind CSS classes for layout
5. THE Dashboard SHALL maintain readability and usability on touch devices

### Requirement 9: Dashboard Routing and Navigation

**User Story:** As a system administrator, I want to navigate to the dashboard from the main application, so that I can access monitoring features.

#### Acceptance Criteria

1. THE XUI_Framework router SHALL include a route "/dashboard" that renders the Dashboard component
2. THE Dashboard SHALL be accessible via the hash route "#/dashboard"
3. WHEN the Dashboard route is accessed, THE Dashboard SHALL initialize the Firebase_Service connection
4. THE Dashboard SHALL display a loading indicator while initial data is being fetched
5. WHEN the Dashboard is navigated away from, THE Dashboard SHALL unsubscribe from Firebase real-time listeners

### Requirement 10: CSV Export Functionality

**User Story:** As a system administrator, I want to export logs to CSV format, so that I can analyze data in external tools.

#### Acceptance Criteria

1. WHERE the export feature is enabled, THE Dashboard SHALL provide an "Export to CSV" button
2. WHEN the export button is clicked, THE Dashboard SHALL generate a CSV file containing all currently filtered logs
3. THE Dashboard SHALL include CSV headers: UID, Room ID, Status, Timestamp, RSSI, SNR, Logged At
4. THE Dashboard SHALL format the CSV filename as "faculty_logs_YYYY-MM-DD_HH-MM-SS.csv"
5. WHEN the CSV is generated, THE Dashboard SHALL trigger a browser download of the file

### Requirement 11: Error Handling and User Feedback

**User Story:** As a system administrator, I want to see clear error messages when issues occur, so that I can understand and resolve problems.

#### Acceptance Criteria

1. IF the Firebase connection fails, THEN THE Dashboard SHALL display an error message "Unable to connect to Firebase. Please check your connection."
2. IF no logs are available, THEN THE Dashboard SHALL display a message "No monitoring logs found."
3. IF a filter returns no results, THEN THE Dashboard SHALL display a message "No logs match the current filters."
4. WHEN data is loading, THE Dashboard SHALL display a loading spinner or skeleton UI
5. IF an unexpected error occurs, THEN THE Dashboard SHALL log the error to the browser console and display a generic error message

### Requirement 12: Performance and Optimization

**User Story:** As a system administrator, I want the dashboard to load quickly and respond smoothly, so that I can work efficiently.

#### Acceptance Criteria

1. THE Dashboard SHALL render the initial view within 2 seconds on a standard broadband connection
2. THE Dashboard SHALL limit Firebase queries to the latest 50 logs to minimize data transfer
3. WHEN filtering logs, THE Filter_Engine SHALL process and display results within 500 milliseconds
4. THE Dashboard SHALL debounce text input filters with a 300 millisecond delay
5. THE Dashboard SHALL display render time in the UI for performance monitoring

### Requirement 13: Admin Authentication System

**User Story:** As an administrator, I want to log in with my email and password, so that I can access protected administrative features.

#### Acceptance Criteria

1. THE Auth_Service SHALL integrate with Firebase Authentication for user authentication
2. THE Login_Page SHALL provide email and password input fields
3. WHEN an Admin_User submits valid credentials, THE Auth_Service SHALL authenticate the user and create a session
4. WHEN an Admin_User submits invalid credentials, THE Auth_Service SHALL return an error message "Invalid email or password"
5. WHEN authentication succeeds, THE Dashboard SHALL redirect the user to the Monitoring Dashboard
6. THE Auth_Service SHALL maintain the authentication session until the user logs out or the session expires
7. WHEN the session expires, THE Dashboard SHALL redirect the user to the Login_Page

### Requirement 14: Session Management and Logout

**User Story:** As an administrator, I want to log out of my session, so that I can secure my account when finished.

#### Acceptance Criteria

1. WHEN an Admin_User is authenticated, THE Navigation_Component SHALL display a logout button
2. WHEN the logout button is clicked, THE Auth_Service SHALL terminate the current session
3. WHEN the session is terminated, THE Dashboard SHALL redirect the user to the Login_Page
4. WHEN the session is terminated, THE Dashboard SHALL clear all cached authentication state
5. THE Auth_Service SHALL persist authentication state across browser refreshes until logout

### Requirement 15: Access Control for Monitoring Dashboard

**User Story:** As a public user, I want to view the monitoring dashboard without logging in, so that I can see real-time faculty activity.

#### Acceptance Criteria

1. THE Dashboard SHALL allow Public_User access to the Monitoring Dashboard without authentication
2. THE Dashboard SHALL provide read-only access to "/monitoring_logs/" for Public_User
3. WHEN a Public_User accesses the Monitoring Dashboard, THE Dashboard SHALL display all monitoring features (Log_Viewer, Statistics_Module, Room_Status, Filter_Engine)
4. THE Dashboard SHALL not display the Registration_Panel or Admin_Panel to Public_User
5. THE Firebase_Service SHALL enforce read-only access to "/monitoring_logs/" through Firebase Security Rules

### Requirement 16: Access Control for Administrative Features

**User Story:** As an administrator, I want administrative features to be protected by authentication, so that only authorized users can modify system data.

#### Acceptance Criteria

1. WHEN a Public_User attempts to access the Registration_Panel, THE Dashboard SHALL redirect to the Login_Page
2. WHEN a Public_User attempts to access the Admin_Panel, THE Dashboard SHALL redirect to the Login_Page
3. WHEN an Admin_User is authenticated, THE Dashboard SHALL grant access to the Registration_Panel and Admin_Panel
4. THE Firebase_Service SHALL enforce write access to "/professors/" only for authenticated Admin_User through Firebase Security Rules
5. THE Firebase_Service SHALL enforce read access to "/admins/" only for authenticated Admin_User through Firebase Security Rules

### Requirement 17: RFID Card Registration

**User Story:** As an administrator, I want to scan new RFID cards and register professor information, so that I can add faculty members to the monitoring system.

#### Acceptance Criteria

1. WHERE the Registration_Panel is accessed by an Admin_User, THE Registration_Panel SHALL provide an interface to scan RFID cards
2. WHEN an RFID card is scanned, THE Registration_Panel SHALL capture the UID
3. THE Registration_Panel SHALL provide input fields for professor name, department, and additional details
4. WHEN the administrator submits the registration form, THE Registration_Panel SHALL validate that all required fields (UID, name, department) are non-empty
5. WHEN validation succeeds, THE Registration_Panel SHALL save the Professor_Record to Firebase at path "/professors/{uid}"
6. THE Professor_Record SHALL include fields: name, department, status (default "active"), and registered_at (timestamp)
7. WHEN the save operation succeeds, THE Registration_Panel SHALL display a success message "Professor registered successfully"
8. IF the save operation fails, THEN THE Registration_Panel SHALL display an error message with the failure reason

### Requirement 18: Professor Whitelist Management

**User Story:** As an administrator, I want to add and remove UIDs from the whitelist, so that I can control which RFID cards are authorized.

#### Acceptance Criteria

1. WHERE the Registration_Panel is accessed by an Admin_User, THE Registration_Panel SHALL display a list of all registered professor UIDs
2. THE Registration_Panel SHALL provide an "Add to Whitelist" action for each UID not currently whitelisted
3. WHEN the "Add to Whitelist" action is triggered, THE Registration_Panel SHALL update the Professor_Record status to "active"
4. THE Registration_Panel SHALL provide a "Remove from Whitelist" action for each UID currently whitelisted
5. WHEN the "Remove from Whitelist" action is triggered, THE Registration_Panel SHALL update the Professor_Record status to "inactive"
6. WHEN the whitelist status changes, THE Registration_Panel SHALL save the updated Professor_Record to Firebase

### Requirement 19: Professor Record Management

**User Story:** As an administrator, I want to view, edit, and delete professor records, so that I can maintain accurate faculty information.

#### Acceptance Criteria

1. WHERE the Admin_Panel is accessed by an Admin_User, THE Admin_Panel SHALL display a list of all registered professors from "/professors/"
2. THE Admin_Panel SHALL display professor details including UID, name, department, status, and registered_at for each professor
3. THE Admin_Panel SHALL provide an "Edit" action for each professor record
4. WHEN the "Edit" action is triggered, THE Admin_Panel SHALL display a form with current professor details
5. WHEN the administrator submits the edit form, THE Admin_Panel SHALL validate all required fields and save the updated Professor_Record to Firebase
6. THE Admin_Panel SHALL provide a "Delete" action for each professor record
7. WHEN the "Delete" action is triggered, THE Admin_Panel SHALL prompt for confirmation
8. WHEN deletion is confirmed, THE Admin_Panel SHALL remove the Professor_Record from Firebase at path "/professors/{uid}"

### Requirement 20: System Statistics Dashboard

**User Story:** As an administrator, I want to view system statistics in the Admin Panel, so that I can monitor overall system health and usage.

#### Acceptance Criteria

1. WHERE the Admin_Panel is accessed by an Admin_User, THE Admin_Panel SHALL display the total count of registered professors
2. THE Admin_Panel SHALL display the count of active professors (status = "active")
3. THE Admin_Panel SHALL display the count of inactive professors (status = "inactive")
4. THE Admin_Panel SHALL display the total count of monitoring logs from the past 7 days
5. THE Admin_Panel SHALL display the count of unique UIDs detected in the past 7 days
6. WHEN new data is added to Firebase, THE Admin_Panel SHALL update statistics within 5 seconds

### Requirement 21: Admin Account Management

**User Story:** As an administrator, I want to manage admin accounts, so that I can control who has administrative access to the system.

#### Acceptance Criteria

1. WHERE the Admin_Panel is accessed by an Admin_User, THE Admin_Panel SHALL display a list of all admin accounts from "/admins/"
2. THE Admin_Panel SHALL display admin details including email and role for each admin account
3. THE Admin_Panel SHALL provide an "Add Admin" action to create new admin accounts
4. WHEN the "Add Admin" action is triggered, THE Admin_Panel SHALL display a form with email and role input fields
5. WHEN the administrator submits the add admin form, THE Admin_Panel SHALL create a new admin record at "/admins/{uid}"
6. THE Admin_Panel SHALL provide a "Delete Admin" action for each admin account
7. WHEN the "Delete Admin" action is triggered and confirmed, THE Admin_Panel SHALL remove the admin record from Firebase

### Requirement 22: Navigation Based on Authentication State

**User Story:** As a user, I want to see only the navigation options available to me, so that I understand what features I can access.

#### Acceptance Criteria

1. WHEN a Public_User accesses the Dashboard, THE Navigation_Component SHALL display only the "Monitoring" tab
2. WHEN an Admin_User is authenticated, THE Navigation_Component SHALL display "Monitoring", "Registration", and "Admin Panel" tabs
3. THE Navigation_Component SHALL highlight the currently active tab
4. WHEN a Public_User accesses the Dashboard, THE Navigation_Component SHALL display a "Login" button
5. WHEN an Admin_User is authenticated, THE Navigation_Component SHALL display a "Logout" button instead of the "Login" button
6. WHEN the "Login" button is clicked, THE Dashboard SHALL navigate to the Login_Page
7. WHEN the "Logout" button is clicked, THE Auth_Service SHALL terminate the session and THE Dashboard SHALL navigate to the Login_Page

### Requirement 23: Firebase Database Structure for Professors

**User Story:** As a system developer, I want a well-defined database structure for professor records, so that data is organized consistently.

#### Acceptance Criteria

1. THE Firebase_Service SHALL store professor records at path "/professors/{uid}"
2. THE Professor_Record SHALL include field "name" as a non-empty string
3. THE Professor_Record SHALL include field "department" as a non-empty string
4. THE Professor_Record SHALL include field "status" with value "active" or "inactive"
5. THE Professor_Record SHALL include field "registered_at" as a Unix timestamp in milliseconds
6. THE Firebase_Service SHALL enforce that Admin_User has read and write access to "/professors/" through Security_Rules
7. THE Firebase_Service SHALL enforce that Public_User has no access to "/professors/" through Security_Rules

### Requirement 24: Firebase Database Structure for Admins

**User Story:** As a system developer, I want a well-defined database structure for admin accounts, so that administrative access is properly controlled.

#### Acceptance Criteria

1. THE Firebase_Service SHALL store admin records at path "/admins/{uid}"
2. THE admin record SHALL include field "email" as a non-empty string
3. THE admin record SHALL include field "role" with value "admin"
4. THE Firebase_Service SHALL enforce that only authenticated Admin_User has read access to "/admins/" through Security_Rules
5. THE Firebase_Service SHALL enforce that only authenticated Admin_User has write access to "/admins/" through Security_Rules
6. THE Firebase_Service SHALL enforce that Public_User has no access to "/admins/" through Security_Rules

### Requirement 25: Firebase Security Rules Configuration

**User Story:** As a system developer, I want Firebase Security Rules configured correctly, so that data access is properly controlled based on authentication state.

#### Acceptance Criteria

1. THE Firebase_Service SHALL configure Security_Rules to allow public read access to "/monitoring_logs/"
2. THE Firebase_Service SHALL configure Security_Rules to deny public write access to "/monitoring_logs/"
3. THE Firebase_Service SHALL configure Security_Rules to allow authenticated Admin_User read and write access to "/professors/"
4. THE Firebase_Service SHALL configure Security_Rules to deny Public_User access to "/professors/"
5. THE Firebase_Service SHALL configure Security_Rules to allow authenticated Admin_User read and write access to "/admins/"
6. THE Firebase_Service SHALL configure Security_Rules to deny Public_User access to "/admins/"
7. THE Security_Rules SHALL use "auth != null" to verify authentication state
