# Implementation Plan: Faculty Monitoring Dashboard

## Overview

This implementation plan breaks down the Faculty Monitoring Dashboard feature into discrete, sequential tasks. The dashboard is a real-time web application built with the XUI framework that displays faculty room activity data from Firebase Realtime Database. The implementation follows a foundation-first approach: setting up core services, then building authentication, then implementing dashboard features, and finally adding administrative panels.

**Key Technologies**: XUI Framework, Firebase Realtime Database, Firebase Authentication, Tailwind CSS, Vite

**Implementation Language**: JavaScript

## Tasks

### Phase 1: Foundation and Firebase Setup

- [x] 1. Set up Firebase Realtime Database service
  - Create `src/firebase/realtimeDb.js` with Firebase configuration
  - Implement `initRealtimeDb()` function to initialize database connection
  - Implement `subscribeToLogs(callback, limit)` function for real-time monitoring log subscriptions
  - Implement `unsubscribeFromLogs(subscriptionRef)` function for cleanup
  - Implement `queryLogs(filters)` function for filtered log queries
  - Add error handling for connection failures
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

- [ ]* 1.1 Write property test for Firebase snapshot parsing
  - **Property 1: Firebase Snapshot Parsing Completeness**
  - **Validates: Requirements 2.3**
  - Test that parsed MonitoringLog objects contain all expected fields (uid, room_id, status, timestamp, rssi, snr, logged_at)
  - _Requirements: 2.3_

- [ ]* 1.2 Write property test for log validation
  - **Property 2: Log Validation Correctness**
  - **Validates: Requirements 2.5**
  - Test that validation returns true only when all required fields are present and non-empty
  - _Requirements: 2.5_

### Phase 2: Authentication System

- [x] 2. Implement Firebase Authentication service
  - Create `src/firebase/authService.js` with auth state management
  - Implement `initAuthService()` function to initialize auth and restore session
  - Implement `login(email, password)` function for email/password authentication
  - Implement `logout()` function to terminate session
  - Implement `getAuthState()` function to retrieve current auth state
  - Implement `onAuthStateChange(callback)` function for auth state subscriptions
  - Implement `checkAdminStatus(uid)` function to verify admin status from `/admins/` path
  - Create XUI state object for auth state (user, isAuthenticated, isAdmin, loading, error)
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 2.1 Write property test for login success state update
  - **Property 16: Login Success State Update**
  - **Validates: Requirements 13.3**
  - Test that successful login updates auth state with user object, isAuthenticated=true, and correct isAdmin value
  - _Requirements: 13.3_

- [ ]* 2.2 Write property test for login failure error message
  - **Property 17: Login Failure Error Message**
  - **Validates: Requirements 13.4**
  - Test that failed login sets error message "Invalid email or password" and isAuthenticated=false
  - _Requirements: 13.4_

- [ ]* 2.3 Write property test for logout state clearing
  - **Property 18: Logout State Clearing**
  - **Validates: Requirements 14.2, 14.4**
  - Test that logout clears user, sets isAuthenticated=false and isAdmin=false
  - _Requirements: 14.2, 14.4_

- [x] 3. Create Login page component
  - Create `src/pages/Login.js` with email and password input fields
  - Implement form submission handler that calls `login()` from authService
  - Display validation errors for empty email or password
  - Display Firebase auth errors (invalid credentials, network errors)
  - Show loading indicator during authentication
  - Redirect to dashboard on successful login
  - Use Tailwind CSS for responsive form layout
  - _Requirements: 13.2, 13.3, 13.4, 13.5_

- [x] 4. Update router with route guards
  - Update `src/router.js` to add new routes: `/login`, `/registration`, `/admin`
  - Define protected routes array: `["/registration", "/admin"]`
  - Implement route guard logic to check authentication state
  - Redirect unauthenticated users to `/login` when accessing protected routes
  - Allow authenticated admin users to access protected routes
  - Handle 404 Not Found for invalid routes
  - _Requirements: 9.1, 9.2, 16.1, 16.2, 16.3_

- [ ]* 4.1 Write property test for route guard redirect
  - **Property 19: Route Guard Redirect for Unauthenticated Users**
  - **Validates: Requirements 16.1, 16.2**
  - Test that protected routes redirect unauthenticated users to `/login`
  - _Requirements: 16.1, 16.2_

- [ ]* 4.2 Write property test for route guard access
  - **Property 20: Route Guard Access for Authenticated Admins**
  - **Validates: Requirements 16.3**
  - Test that authenticated admin users can access protected routes without redirection
  - _Requirements: 16.3_

- [x] 5. Create Navigation component
  - Create `src/components/Navigation.js` with dynamic tab rendering
  - Display "Monitoring" tab for all users
  - Display "Registration" and "Admin Panel" tabs only for authenticated admin users
  - Display "Login" button for unauthenticated users
  - Display "Logout" button for authenticated users
  - Implement logout handler that calls `logout()` from authService
  - Highlight currently active tab
  - Use Tailwind CSS for responsive horizontal tab bar
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7_

- [ ]* 5.1 Write property test for navigation tab visibility
  - **Property 27: Navigation Tab Visibility Based on Auth State**
  - **Validates: Requirements 22.1, 22.2**
  - Test that tab visibility changes based on authentication state
  - _Requirements: 22.1, 22.2_

### Phase 3: Utility Functions

- [x] 6. Create utility functions for data formatting and calculations
  - Create `src/utils/dateFormat.js` with timestamp formatting function
  - Create `src/utils/signalQuality.js` with RSSI/SNR classification functions
  - Create `src/utils/statistics.js` with statistics calculation functions
  - Implement date formatting (Unix timestamp → "YYYY-MM-DD HH:MM:SS")
  - Implement signal quality classification (RSSI and SNR thresholds)
  - Implement statistics calculations (total logs, unique UIDs, averages, signal quality percentage)
  - _Requirements: 3.4, 4.1, 4.2, 4.3, 4.4, 7.1, 7.2, 7.3_

- [ ]* 6.1 Write property test for timestamp formatting reversibility
  - **Property 3: Timestamp Formatting Reversibility**
  - **Validates: Requirements 3.4**
  - Test that formatted timestamps can be parsed back to equivalent values
  - _Requirements: 3.4_

- [ ]* 6.2 Write property test for unit formatting consistency
  - **Property 4: Unit Formatting Consistency**
  - **Validates: Requirements 3.6, 3.7**
  - Test that RSSI values are formatted with " dBm" and SNR values with " dB"
  - _Requirements: 3.6, 3.7_

- [ ]* 6.3 Write property test for daily log count accuracy
  - **Property 5: Daily Log Count Accuracy**
  - **Validates: Requirements 4.1**
  - Test that daily log count equals logs with today's date
  - _Requirements: 4.1_

- [ ]* 6.4 Write property test for unique UID count accuracy
  - **Property 6: Unique UID Count Accuracy**
  - **Validates: Requirements 4.2**
  - Test that unique UID count equals the size of distinct uid set
  - _Requirements: 4.2_

- [ ]* 6.5 Write property test for average RSSI calculation
  - **Property 7: Average RSSI Calculation Correctness**
  - **Validates: Requirements 4.3**
  - Test that average RSSI equals sum divided by count (within floating-point tolerance)
  - _Requirements: 4.3_

- [ ]* 6.6 Write property test for average SNR calculation
  - **Property 8: Average SNR Calculation Correctness**
  - **Validates: Requirements 4.4**
  - Test that average SNR equals sum divided by count (within floating-point tolerance)
  - _Requirements: 4.4_

- [ ]* 6.7 Write property test for signal quality classification
  - **Property 12: Signal Quality Classification Correctness**
  - **Validates: Requirements 7.1, 7.2**
  - Test that RSSI and SNR values are classified correctly (good/fair/poor)
  - _Requirements: 7.1, 7.2_

- [ ]* 6.8 Write property test for signal quality percentage
  - **Property 13: Signal Quality Percentage Calculation**
  - **Validates: Requirements 7.3**
  - Test that signal quality percentage equals (good signals / total) × 100
  - _Requirements: 7.3_

### Phase 4: Dashboard Components

- [ ] 7. Create Statistics Module component
  - Create `src/components/dashboard/Statistics.js`
  - Implement computed values for total logs today, unique UIDs today, average RSSI, average SNR
  - Calculate signal quality percentage (logs with RSSI > -50 AND SNR > 8)
  - Display statistics in grid of cards (2x2 on tablet, 4 columns on desktop)
  - Display warning indicator when signal quality < 50%
  - Use Tailwind CSS for responsive card grid
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 7.3, 7.4, 7.5_

- [x] 8. Create Log Viewer component
  - Create `src/components/dashboard/LogViewer.js`
  - Render logs in table format with columns: UID, Room ID, Status, Timestamp, RSSI, SNR
  - Format timestamps using dateFormat utility
  - Apply color coding to status values (green for IN, red for OUT)
  - Apply color coding to RSSI values (green/yellow/red based on thresholds)
  - Apply color coding to SNR values (green/yellow/red based on thresholds)
  - Display RSSI with "dBm" unit and SNR with "dB" unit
  - Implement responsive layout (table on desktop, cards on mobile < 768px)
  - Display empty state message when no logs available
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 7.1, 7.2, 8.2, 8.3, 11.2_

- [x] 9. Create Room Status Overview component
  - Create `src/components/dashboard/RoomStatus.js`
  - Filter logs from past 24 hours
  - Group logs by room_id
  - For each room, extract: latest status, latest timestamp, log count
  - Display room cards with room ID, status, timestamp, and log count
  - Use Tailwind CSS for responsive card layout
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 9.1 Write property test for 24-hour activity filter
  - **Property 9: 24-Hour Activity Filter Correctness**
  - **Validates: Requirements 5.1, 5.5**
  - Test that filtered logs contain only logs from past 24 hours
  - _Requirements: 5.1, 5.5_

- [ ]* 9.2 Write property test for room grouping and aggregation
  - **Property 10: Room Grouping and Aggregation Completeness**
  - **Validates: Requirements 5.2, 5.3, 5.4**
  - Test that room groups have correct count, most recent status, and most recent timestamp
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 10. Create Filter Engine component
  - Create `src/components/dashboard/Filters.js`
  - Implement date range filter with start date and end date inputs
  - Implement room ID filter with text input
  - Implement UID filter with text input (partial match support)
  - Apply debouncing to text inputs (300ms delay)
  - Implement "Clear Filters" button to reset all filters
  - Update filter state on user input
  - Use Tailwind CSS for responsive horizontal filter layout (vertical stack on mobile)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 12.4_

- [ ]* 10.1 Write property test for filter application completeness
  - **Property 11: Filter Application Completeness**
  - **Validates: Requirements 6.4, 6.5**
  - Test that filtered results contain only logs matching all active criteria
  - _Requirements: 6.4, 6.5_

- [x] 11. Create CSV Export utility
  - Create `src/utils/csvExport.js` with `exportToCSV(logs)` function
  - Generate CSV header row: "UID,Room ID,Status,Timestamp,RSSI,SNR,Logged At"
  - Generate one data row per log with all field values
  - Format filename as "faculty_logs_YYYY-MM-DD_HH-MM-SS.csv"
  - Trigger browser download of CSV file
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 11.1 Write property test for CSV generation completeness
  - **Property 14: CSV Generation Completeness**
  - **Validates: Requirements 10.2, 10.3**
  - Test that CSV contains header row, one row per log, all field values preserved, and is valid CSV
  - _Requirements: 10.2, 10.3_

- [ ]* 11.2 Write property test for CSV filename format
  - **Property 15: CSV Filename Format Correctness**
  - **Validates: Requirements 10.4**
  - Test that filename matches pattern "faculty_logs_YYYY-MM-DD_HH-MM-SS.csv"
  - _Requirements: 10.4_

### Phase 5: Dashboard Page Integration

- [x] 12. Create Dashboard page component
  - Create `src/pages/Dashboard.js` as main container component
  - Create XUI state object for dashboard (logs, filters, loading, error, connected)
  - Implement `onMount` hook to initialize Firebase connection
  - Subscribe to monitoring logs using `subscribeToLogs()` from realtimeDb service
  - Update dashboard state when new logs arrive
  - Compose child components: Statistics, LogViewer, RoomStatus, Filters
  - Implement computed filtered logs based on filter state
  - Display loading indicator while fetching initial data
  - Display error message if Firebase connection fails
  - Implement cleanup to unsubscribe from Firebase listeners on unmount
  - Allow public (unauthenticated) read-only access
  - Use Tailwind CSS for responsive layout
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 15.1, 15.2, 15.3, 15.4, 11.1, 11.3, 11.4, 11.5, 12.1, 12.2_

- [x] 13. Checkpoint - Ensure dashboard displays correctly
  - Verify dashboard loads without errors
  - Verify statistics display correctly
  - Verify log table shows latest logs
  - Verify real-time updates appear
  - Verify filters work correctly
  - Verify CSV export downloads
  - Ensure all tests pass, ask the user if questions arise.

### Phase 6: Registration Panel (Admin Only)

- [ ] 14. Implement professor data operations in Firebase service
  - Update `src/firebase/realtimeDb.js` with professor management functions
  - Implement `saveProfessor(uid, professorData)` to save professor record to `/professors/{uid}`
  - Implement `getProfessors()` to retrieve all professor records
  - Implement `updateProfessor(uid, updates)` to update professor record
  - Implement `deleteProfessor(uid)` to remove professor record
  - Add error handling for all operations
  - _Requirements: 17.5, 17.6, 18.6, 19.5, 19.8, 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7_

- [ ]* 14.1 Write property test for professor registration validation
  - **Property 21: Professor Registration Form Validation**
  - **Validates: Requirements 17.4**
  - Test that validation returns false if any required field is empty
  - _Requirements: 17.4_

- [ ]* 14.2 Write property test for professor record structure
  - **Property 22: Professor Record Structure Validation**
  - **Validates: Requirements 17.6**
  - Test that professor records include all required fields with correct data types
  - _Requirements: 17.6_

- [ ]* 14.3 Write property test for professor record field validation
  - **Property 28: Professor Record Field Validation**
  - **Validates: Requirements 23.2, 23.3, 23.4**
  - Test that validation checks name, department, and status fields correctly
  - _Requirements: 23.2, 23.3, 23.4_

- [x] 15. Create Registration Panel component
  - Create `src/pages/Registration.js` with RFID registration interface
  - Implement form with UID input (manual or scanned), name input, department input
  - Implement form validation for required fields (UID, name, department)
  - Validate UID format (XX:XX:XX:XX)
  - Implement form submission handler that calls `saveProfessor()` from realtimeDb service
  - Set default status to "active" and registered_at to current timestamp
  - Display success message "Professor registered successfully" on save
  - Display error message if save operation fails
  - Load and display list of all registered professors
  - Implement "Add to Whitelist" action to set status to "active"
  - Implement "Remove from Whitelist" action to set status to "inactive"
  - Use Tailwind CSS for responsive form and list layout
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [ ]* 15.1 Write property test for whitelist status toggle
  - **Property 23: Whitelist Status Toggle**
  - **Validates: Requirements 18.3, 18.5**
  - Test that status toggles between "active" and "inactive" while preserving other fields
  - _Requirements: 18.3, 18.5_

### Phase 7: Admin Panel

- [x] 16. Implement admin data operations in Firebase service
  - Update `src/firebase/realtimeDb.js` with admin management functions
  - Implement `saveAdmin(uid, adminData)` to save admin record to `/admins/{uid}`
  - Implement `getAdmins()` to retrieve all admin records
  - Implement `deleteAdmin(uid)` to remove admin record
  - Implement `checkIsAdmin(uid)` to verify if user is admin
  - Add error handling for all operations
  - _Requirements: 21.5, 21.6, 21.7, 24.1, 24.2, 24.3, 24.4, 24.5, 24.6_

- [ ]* 16.1 Write property test for admin record field validation
  - **Property 29: Admin Record Field Validation**
  - **Validates: Requirements 24.2, 24.3**
  - Test that validation checks email format and role field correctly
  - _Requirements: 24.2, 24.3_

- [x] 17. Create Admin Panel component
  - Create `src/pages/AdminPanel.js` with three sections: Professor Management, System Statistics, Admin Account Management
  - **Professor Management Section**:
    - Load and display all professor records from `/professors/`
    - Display table with columns: UID, Name, Department, Status, Registered At
    - Implement "Edit" action that opens form with current professor details
    - Implement edit form submission that calls `updateProfessor()` from realtimeDb service
    - Implement "Delete" action with confirmation prompt
    - Call `deleteProfessor()` on confirmed deletion
  - **System Statistics Section**:
    - Calculate and display total registered professors count
    - Calculate and display active professors count (status = "active")
    - Calculate and display inactive professors count (status = "inactive")
    - Calculate and display total logs from past 7 days
    - Calculate and display unique UIDs detected in past 7 days
    - Update statistics within 5 seconds when new data arrives
  - **Admin Account Management Section**:
    - Load and display all admin accounts from `/admins/`
    - Display table with columns: Email, Role
    - Implement "Add Admin" action that opens form with email and role inputs
    - Implement add admin form submission that calls `saveAdmin()` from realtimeDb service
    - Implement "Delete Admin" action with confirmation prompt
    - Call `deleteAdmin()` on confirmed deletion
  - Use Tailwind CSS for responsive layout
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7_

- [ ]* 17.1 Write property test for professor edit validation
  - **Property 24: Professor Edit Validation**
  - **Validates: Requirements 19.5**
  - Test that validation returns false if required fields are empty
  - _Requirements: 19.5_

- [ ]* 17.2 Write property test for professor count calculation
  - **Property 25: Professor Count Calculation**
  - **Validates: Requirements 20.1**
  - Test that total count equals array length
  - _Requirements: 20.1_

- [ ]* 17.3 Write property test for professor status count calculation
  - **Property 26: Professor Status Count Calculation**
  - **Validates: Requirements 20.2, 20.3**
  - Test that active/inactive counts match records with corresponding status
  - _Requirements: 20.2, 20.3_

### Phase 8: Firebase Security Rules

- [x] 18. Configure Firebase Security Rules
  - Open Firebase Console → Realtime Database → Rules
  - Configure `/monitoring_logs/` path:
    - Allow public read access (`.read: true`)
    - Deny public write access (`.write: false`)
    - Add indexes on `timestamp`, `room_id`, `uid`
  - Configure `/professors/` path:
    - Allow read access for authenticated users (`.read: "auth != null"`)
    - Allow write access for admin users only (`.write: "auth != null && root.child('admins').child(auth.uid).exists()"`)
    - Add validation rules for required fields (name, department, status, registered_at)
    - Add validation for status values ("active" or "inactive")
  - Configure `/admins/` path:
    - Allow read access for admin users only (`.read: "auth != null && root.child('admins').child(auth.uid).exists()"`)
    - Allow write access for admin users only (`.write: "auth != null && root.child('admins').child(auth.uid).exists()"`)
    - Add validation rules for required fields (email, role)
    - Add validation for role value ("admin")
  - Publish security rules to Firebase
  - _Requirements: 15.2, 15.5, 16.4, 16.5, 23.6, 23.7, 24.4, 24.5, 24.6, 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7_

### Phase 9: Integration and Testing

- [x] 19. Update main app entry point
  - Update `src/app.js` to initialize auth service on app startup
  - Call `initAuthService()` before initializing router
  - Ensure auth state is restored from session before rendering
  - _Requirements: 13.1, 14.5_

- [x] 20. Update Layout component
  - Update `src/components/Layout.js` to include Navigation component
  - Pass current route to Navigation component
  - Ensure Navigation displays correctly in layout
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7_

- [x] 21. Responsive design verification
  - Test dashboard on screen widths from 320px to 1920px
  - Verify statistics cards stack correctly on mobile (single column)
  - Verify log viewer switches to card layout on mobile (< 768px)
  - Verify filters stack vertically on mobile
  - Verify navigation works on mobile (hamburger menu if needed)
  - Verify login form is centered and responsive
  - Verify registration and admin panels are responsive
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 22. Performance optimization
  - Verify Firebase queries limit to latest 50 logs
  - Verify text input filters use 300ms debouncing
  - Verify filter processing completes within 500ms
  - Verify initial dashboard render within 2 seconds
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 23. Error handling verification
  - Test Firebase connection failure displays error message
  - Test empty logs state displays "No monitoring logs found"
  - Test filter with no results displays "No logs match the current filters"
  - Test loading state displays spinner during data fetch
  - Test login with invalid credentials displays error message
  - Test registration with invalid data displays validation errors
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 24. Final checkpoint - Complete end-to-end testing
  - **Public User Flow**:
    - Access dashboard without authentication
    - Verify read-only access to monitoring logs
    - Verify statistics, log viewer, room status, and filters work
    - Verify navigation shows only "Monitoring" tab and "Login" button
    - Verify cannot access Registration or Admin panels (redirects to login)
  - **Admin User Flow**:
    - Login with admin credentials
    - Verify redirect to dashboard after successful login
    - Verify navigation shows "Monitoring", "Registration", "Admin Panel" tabs and "Logout" button
    - Access Registration panel and register a professor
    - Access Admin panel and manage professors and admins
    - Logout and verify redirect to login page
  - **Real-time Updates**:
    - Verify new logs appear within 2 seconds
    - Verify statistics update automatically
  - **CSV Export**:
    - Apply filters and export to CSV
    - Verify CSV file downloads with correct filename and content
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- The implementation follows XUI framework patterns for state management and component rendering
- Firebase Security Rules must be configured in Firebase Console (task 18)
- All components use Tailwind CSS for responsive design
- Authentication is required for Registration Panel and Admin Panel access
- Dashboard (Monitoring) is publicly accessible without authentication
