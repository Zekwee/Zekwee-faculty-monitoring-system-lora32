# Design Document: Faculty Monitoring Dashboard

## Overview

The Faculty Monitoring Dashboard is a real-time web application built on the XUI framework that provides administrative oversight of faculty room activity. The system connects to Firebase Realtime Database to display live monitoring data collected from ESP32 LoRa receivers with RFID sensors deployed across multiple rooms.

### Purpose

This dashboard enables system administrators to:
- Monitor faculty entry/exit events in real-time
- View aggregate statistics and signal quality metrics
- Filter and search historical monitoring data
- Export data for external analysis
- Identify potential hardware or connectivity issues

### Technology Stack

- **Frontend Framework**: XUI (custom reactive JavaScript framework)
- **Styling**: Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Build Tool**: Vite
- **Target Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Key Design Principles

1. **Real-time First**: Leverage Firebase Realtime Database listeners for instant updates
2. **Performance**: Limit data queries and implement debouncing for smooth UX
3. **Responsive**: Mobile-first design using Tailwind CSS utilities
4. **Modular**: Separate concerns into distinct services and components
5. **XUI Patterns**: Follow established XUI framework conventions for state management and rendering

## Architecture

### High-Level Component Structure

```mermaid
graph TB
    subgraph "XUI Application Layer"
        Router[XUI Router]
        Login[Login Page Component]
        Dashboard[Dashboard Page Component]
        Registration[Registration Panel Component]
        AdminPanel[Admin Panel Component]
        Layout[Layout Component]
        Navigation[Navigation Component]
    end
    
    subgraph "Dashboard Components"
        Stats[Statistics Module]
        LogViewer[Log Viewer Component]
        RoomStatus[Room Status Overview]
        Filters[Filter Engine Component]
        Export[CSV Export Handler]
    end
    
    subgraph "Service Layer"
        AuthService[Auth Service]
        FirebaseService[Firebase Service]
        StateManager[XUI State Manager]
    end
    
    subgraph "External Services"
        FirebaseAuth[(Firebase Authentication)]
        Firebase[(Firebase Realtime Database)]
    end
    
    Router --> Login
    Router --> Dashboard
    Router --> Registration
    Router --> AdminPanel
    
    Login --> AuthService
    Navigation --> AuthService
    
    Dashboard --> Stats
    Dashboard --> LogViewer
    Dashboard --> RoomStatus
    Dashboard --> Filters
    Dashboard --> Export
    
    Registration --> FirebaseService
    AdminPanel --> FirebaseService
    
    Stats --> StateManager
    LogViewer --> StateManager
    RoomStatus --> StateManager
    Filters --> StateManager
    
    StateManager --> FirebaseService
    AuthService --> FirebaseAuth
    FirebaseService --> Firebase
    
    Firebase -.real-time updates.-> FirebaseService
    FirebaseAuth -.session state.-> AuthService
```

### Data Flow

#### Public User Flow (Unauthenticated)

1. **Initialization**: User accesses dashboard without authentication
2. **Connection**: Firebase Service establishes connection to Realtime Database
3. **Subscription**: Service subscribes to `/monitoring_logs/` path with public read access
4. **Data Retrieval**: Latest 50 logs retrieved and stored in XUI state
5. **Rendering**: Dashboard components render with read-only access
6. **Navigation**: Only "Monitoring" tab visible, "Login" button displayed
7. **Real-time Updates**: New logs trigger state updates, causing automatic re-render
8. **User Interactions**: Filters modify state, triggering filtered view updates
9. **Cleanup**: On navigation away, Firebase listeners are unsubscribed

#### Admin User Flow (Authenticated)

1. **Login**: User navigates to Login Page and submits credentials
2. **Authentication**: Auth Service validates credentials via Firebase Authentication
3. **Session Creation**: Firebase Auth creates session token and persists state
4. **Redirect**: User redirected to Dashboard with authenticated state
5. **Enhanced Navigation**: "Monitoring", "Registration", and "Admin Panel" tabs visible
6. **Protected Access**: User can access Registration Panel and Admin Panel
7. **Data Operations**: Admin can read/write to `/professors/` and `/admins/` paths
8. **Logout**: User clicks logout, Auth Service terminates session, redirects to Login Page

#### Registration Flow

1. **RFID Scan**: Admin scans RFID card, capturing UID
2. **Form Input**: Admin enters professor name, department, and details
3. **Validation**: Registration Panel validates required fields
4. **Save**: Professor_Record saved to `/professors/{uid}` in Firebase
5. **Confirmation**: Success message displayed to admin

#### Admin Panel Flow

1. **Data Load**: Admin Panel loads professor records from `/professors/`
2. **Display**: List of professors with details (UID, name, department, status)
3. **Edit**: Admin selects professor, modifies details, saves to Firebase
4. **Delete**: Admin deletes professor record after confirmation
5. **Statistics**: System statistics calculated and displayed
6. **Admin Management**: Admin can add/remove admin accounts in `/admins/`

### Layer Responsibilities

**Presentation Layer (Components)**
- Render UI based on state
- Handle user interactions
- Format data for display
- Provide visual feedback
- Enforce UI-level access control (show/hide based on auth state)

**State Management Layer**
- Maintain application state using XUI `createState`
- Provide computed values for derived data
- Notify subscribers of state changes
- Manage authentication state (user, isAuthenticated, isAdmin)

**Service Layer**
- Abstract Firebase Realtime Database operations
- Handle connection lifecycle
- Transform raw data into application models
- Manage real-time subscriptions
- Handle Firebase Authentication operations (login, logout, session management)
- Enforce service-level access control

**External Services Layer**
- Firebase Realtime Database for data storage and real-time sync
- Firebase Authentication for user session management

## Components and Interfaces

### 1. Auth Service

**File**: `src/firebase/authService.js`

**Purpose**: Manage Firebase Authentication operations and session state

**Responsibilities**:
- Initialize Firebase Authentication
- Handle email/password login
- Handle logout and session termination
- Maintain authentication state (user, isAuthenticated, isAdmin)
- Persist authentication state across browser refreshes
- Check admin status by querying `/admins/{uid}`

**Interface**:
```javascript
// Initialize auth service and restore session
export function initAuthService()

// Login with email and password
export async function login(email, password)

// Logout and clear session
export async function logout()

// Get current auth state
export function getAuthState()

// Subscribe to auth state changes
export function onAuthStateChange(callback)

// Check if current user is admin
export async function checkAdminStatus(uid)
```

**State Management**:
```javascript
const authState = createState({
  user: null,              // Firebase user object
  isAuthenticated: false,  // Boolean
  isAdmin: false,          // Boolean
  loading: true,           // Boolean
  error: null              // String | null
});
```

**Integration with XUI**:
- Uses XUI `createState` for reactive auth state
- Provides `onAuthStateChange` for components to subscribe
- Integrates with existing `src/firebase/auth.js` (Firebase Auth instance)

### 2. Login Page Component

**File**: `src/pages/Login.js`

**Purpose**: Provide authentication interface for admin users

**Responsibilities**:
- Render email and password input fields
- Handle form submission
- Display validation errors
- Redirect to dashboard on successful login
- Show loading state during authentication

**Interface**:
```javascript
export default function Login()
```

**State Dependencies**:
- `authState`: For authentication status and errors

**UI Structure**:
- Email input field
- Password input field
- Submit button
- Error message display
- Loading indicator

**Validation**:
- Email format validation
- Non-empty password
- Display Firebase auth errors (invalid credentials, network errors)

### 3. Navigation Component

**File**: `src/components/Navigation.js`

**Purpose**: Display navigation tabs and auth controls based on authentication state

**Responsibilities**:
- Render tabs based on auth state (public vs admin)
- Display Login button for public users
- Display Logout button for authenticated users
- Highlight active tab
- Handle tab navigation
- Handle login/logout actions

**Interface**:
```javascript
export default function Navigation(currentRoute)
```

**State Dependencies**:
- `authState`: To determine which tabs and buttons to display

**Tab Configuration**:
```javascript
// Public user (unauthenticated)
const publicTabs = [
  { path: "/dashboard", label: "Monitoring" }
];

// Admin user (authenticated)
const adminTabs = [
  { path: "/dashboard", label: "Monitoring" },
  { path: "/registration", label: "Registration" },
  { path: "/admin", label: "Admin Panel" }
];
```

**UI Structure**:
- Horizontal tab bar
- Active tab highlighting
- Login/Logout button (right-aligned)

### 4. Registration Panel Component

**File**: `src/pages/Registration.js`

**Purpose**: Enable admins to scan RFID cards and register professor information

**Responsibilities**:
- Provide RFID scanning interface
- Capture UID from scanned card
- Render form for professor details (name, department)
- Validate required fields
- Save Professor_Record to Firebase at `/professors/{uid}`
- Display success/error messages
- Show list of registered professors
- Provide whitelist management (add/remove from whitelist)

**Interface**:
```javascript
export default function Registration()
```

**State Dependencies**:
- `authState`: To verify admin access
- `registrationState`: Local state for form data and professor list

**Form Fields**:
- UID (captured from RFID scan or manual input)
- Name (text input, required)
- Department (text input, required)
- Status (default: "active")

**Professor List**:
- Display all registered professors
- Show UID, name, department, status
- Provide "Add to Whitelist" / "Remove from Whitelist" actions

**Validation**:
- UID: Non-empty, valid format (XX:XX:XX:XX)
- Name: Non-empty string
- Department: Non-empty string

### 5. Admin Panel Component

**File**: `src/pages/AdminPanel.js`

**Purpose**: Provide administrative interface for managing professors, viewing statistics, and managing admin accounts

**Responsibilities**:
- Load and display all professor records from `/professors/`
- Provide edit functionality for professor records
- Provide delete functionality with confirmation
- Display system statistics (total professors, active/inactive counts, log counts)
- Load and display admin accounts from `/admins/`
- Provide add/delete functionality for admin accounts

**Interface**:
```javascript
export default function AdminPanel()
```

**State Dependencies**:
- `authState`: To verify admin access
- `adminPanelState`: Local state for professors, admins, and statistics

**Sections**:

1. **Professor Management**:
   - Table/list of all professors
   - Edit button per professor (opens modal/form)
   - Delete button per professor (with confirmation)

2. **System Statistics**:
   - Total registered professors
   - Active professors count
   - Inactive professors count
   - Total logs (past 7 days)
   - Unique UIDs detected (past 7 days)

3. **Admin Account Management**:
   - Table/list of admin accounts
   - Add Admin button (opens form)
   - Delete button per admin (with confirmation)

**Data Operations**:
- Read from `/professors/` and `/admins/`
- Write to `/professors/{uid}` (edit/delete)
- Write to `/admins/{uid}` (add/delete)

### 6. Dashboard Page Component

**File**: `src/pages/Dashboard.js`

**Purpose**: Main container component that orchestrates all dashboard functionality (UPDATED for public access)

**Responsibilities**:
- Initialize Firebase Service on mount
- Manage global dashboard state
- Compose child components (Statistics, LogViewer, RoomStatus, Filters)
- Handle loading and error states
- Clean up Firebase subscriptions on unmount
- **NEW**: Allow public (unauthenticated) read-only access

**Interface**:
```javascript
export default function Dashboard()
```

**State Dependencies**:
- `dashboardState`: Global state object containing logs, filters, loading status, errors
- `authState`: To determine access level (public vs admin)

**Access Control**:
- Public users: Read-only access to monitoring logs
- Admin users: Same read-only access (write operations in Registration/Admin panels)

**Lifecycle**:
- Uses `onMount` hook to initialize Firebase connection
- Subscribes to state changes for reactive updates
- Cleans up listeners when navigating away

### 7. Router Configuration (UPDATED)

**File**: `src/router.js`

**Purpose**: Define application routes and implement route guards for protected pages

**Responsibilities**:
- Map routes to components
- Implement route guards for admin-only pages
- Redirect unauthenticated users to Login page when accessing protected routes
- Handle 404 Not Found

**Route Configuration**:
```javascript
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import AdminPanel from "./pages/AdminPanel.js";

const routes = {
  "/": Home,
  "/dashboard": Dashboard,        // Public access
  "/login": Login,                // Public access
  "/registration": Registration,  // Protected (admin only)
  "/admin": AdminPanel            // Protected (admin only)
};

// Protected routes requiring authentication
const protectedRoutes = ["/registration", "/admin"];
```

**Route Guard Logic**:
```javascript
export function router() {
  let path = location.hash.slice(1) || "/";
  if (!path.startsWith("/")) path = "/" + path;
  
  // Check if route is protected
  if (protectedRoutes.includes(path)) {
    const authState = getAuthState();
    if (!authState.isAuthenticated || !authState.isAdmin) {
      // Redirect to login
      location.hash = "#/login";
      return Login();
    }
  }
  
  return (routes[path] || NotFound)();
}
```

### 1. Dashboard Page Component

**File**: `src/pages/Dashboard.js`

**Purpose**: Main container component that orchestrates all dashboard functionality

**Responsibilities**:
- Initialize Firebase Service on mount
- Manage global dashboard state
- Compose child components (Statistics, LogViewer, RoomStatus, Filters)
- Handle loading and error states
- Clean up Firebase subscriptions on unmount

**Interface**:
```javascript
export default function Dashboard()
```

**State Dependencies**:
- `dashboardState`: Global state object containing logs, filters, loading status, errors

**Lifecycle**:
- Uses `onMount` hook to initialize Firebase connection
- Subscribes to state changes for reactive updates
- Cleans up listeners when navigating away

### 8. Firebase Service (UPDATED)

**File**: `src/firebase/realtimeDb.js`

**Purpose**: Encapsulate all Firebase Realtime Database operations (UPDATED for new data paths)

**Responsibilities**:
- Initialize Firebase Realtime Database connection
- Subscribe to real-time updates at `/monitoring_logs/`
- Query and retrieve monitoring logs
- **NEW**: Read/write professor records at `/professors/{uid}`
- **NEW**: Read/write admin records at `/admins/{uid}`
- Transform Firebase snapshots into application data models
- Provide error handling for connection failures

**Interface**:
```javascript
// Initialize connection
export function initRealtimeDb()

// Subscribe to monitoring logs with callback
export function subscribeToLogs(callback, limit = 50)

// Unsubscribe from real-time updates
export function unsubscribeFromLogs(subscriptionRef)

// Query logs with filters
export function queryLogs(filters)

// NEW: Professor management
export async function saveProfessor(uid, professorData)
export async function getProfessors()
export async function updateProfessor(uid, updates)
export async function deleteProfessor(uid)

// NEW: Admin management
export async function saveAdmin(uid, adminData)
export async function getAdmins()
export async function deleteAdmin(uid)
export async function checkIsAdmin(uid)
```

**Data Transformation**:
- Input: Firebase snapshot with nested objects
- Output: Array of MonitoringLog, Professor_Record, or Admin_Record objects

### 9. Statistics Module Component

**File**: `src/components/dashboard/Statistics.js`

**Purpose**: Calculate and display aggregate metrics

**Responsibilities**:
- Compute total logs for current day
- Count unique UIDs detected today
- Calculate average RSSI and SNR values
- Display signal quality percentage
- Show warning indicator for poor signal quality

**Interface**:
```javascript
export default function Statistics(logs)
```

**Computed Values**:
- `totalLogsToday`: Count of logs with today's date
- `uniqueUIDsToday`: Set size of unique UIDs from today
- `averageRSSI`: Mean RSSI value from all logs today
- `averageSNR`: Mean SNR value from all logs today
- `signalQualityPercent`: Percentage of logs with RSSI > -50 and SNR > 8

**UI Structure**:
- Grid of statistic cards
- Each card shows label, value, and unit
- Warning indicator when signal quality < 50%

### 10. Log Viewer Component

**File**: `src/components/dashboard/LogViewer.js`

**Purpose**: Display monitoring logs in table format

**Responsibilities**:
- Render logs in responsive table
- Format timestamps as human-readable strings
- Apply color coding to status values (IN/OUT)
- Display RSSI and SNR with units and color coding
- Handle empty state when no logs available

**Interface**:
```javascript
export default function LogViewer(logs)
```

**Table Columns**:
1. UID (format: XX:XX:XX:XX)
2. Room ID
3. Status (IN/OUT with color indicator)
4. Timestamp (formatted: YYYY-MM-DD HH:MM:SS)
5. RSSI (dBm, color-coded)
6. SNR (dB, color-coded)

**Color Coding**:
- Status: Green for IN, Red for OUT
- RSSI: Green (> -50), Yellow (-70 to -50), Red (< -70)
- SNR: Green (> 8), Yellow (5 to 8), Red (< 5)

**Responsive Behavior**:
- Desktop: Full table layout
- Mobile (< 768px): Card-based layout with stacked fields

### 11. Room Status Overview Component

**File**: `src/components/dashboard/RoomStatus.js`

**Purpose**: Display active rooms with recent activity

**Responsibilities**:
- Filter logs from past 24 hours
- Group logs by room_id
- Show most recent status and timestamp per room
- Display log count per room

**Interface**:
```javascript
export default function RoomStatus(logs)
```

**Data Processing**:
- Filter logs where `timestamp > (now - 24 hours)`
- Group by `room_id`
- For each room, extract: latest status, latest timestamp, log count

**UI Structure**:
- List or grid of room cards
- Each card shows: Room ID, Status, Timestamp, Log Count

### 12. Filter Engine Component

**File**: `src/components/dashboard/Filters.js`

**Purpose**: Provide filtering and search capabilities

**Responsibilities**:
- Render filter input controls
- Update filter state on user input
- Apply debouncing to text inputs (300ms)
- Provide "Clear Filters" action

**Interface**:
```javascript
export default function Filters(filterState, onFilterChange)
```

**Filter Types**:
1. **Date Range**: Start date and end date inputs
2. **Room ID**: Dropdown or text input
3. **UID**: Text input with partial match support

**Filter Logic**:
- AND logic: All active filters must match
- Applied in computed state value
- Results update reactively

**State Structure**:
```javascript
{
  dateStart: null,
  dateEnd: null,
  roomId: "",
  uid: ""
}
```

### 13. CSV Export Handler

**File**: `src/utils/csvExport.js`

**Purpose**: Generate and download CSV files from log data

**Responsibilities**:
- Convert log array to CSV format
- Include headers: UID, Room ID, Status, Timestamp, RSSI, SNR, Logged At
- Generate filename with current timestamp
- Trigger browser download

**Interface**:
```javascript
export function exportToCSV(logs)
```

**CSV Format**:
```
UID,Room ID,Status,Timestamp,RSSI,SNR,Logged At
12:34:56:78,Room101,IN,2024-01-15 14:30:25,-45,10,2024-01-15T14:30:25Z
```

## Data Models

### MonitoringLog

Represents a single faculty monitoring event.

```javascript
{
  uid: String,           // RFID tag UID (format: "XX:XX:XX:XX")
  room_id: String,       // Room identifier (e.g., "Room101")
  status: String,        // "IN" or "OUT"
  timestamp: Number,     // Unix timestamp in milliseconds
  rssi: Number,          // Received Signal Strength Indicator (dBm)
  snr: Number,           // Signal-to-Noise Ratio (dB)
  logged_at: String      // ISO 8601 timestamp string
}
```

**Validation Rules**:
- `uid`: Required, non-empty string
- `room_id`: Required, non-empty string
- `status`: Required, must be "IN" or "OUT"
- `timestamp`: Required, positive number
- `rssi`: Optional, number (typically negative)
- `snr`: Optional, number
- `logged_at`: Optional, ISO 8601 string

### Professor_Record

Represents a registered professor in the system.

```javascript
{
  uid: String,           // RFID tag UID (format: "XX:XX:XX:XX")
  name: String,          // Professor's full name
  department: String,    // Department name
  status: String,        // "active" or "inactive"
  registered_at: Number  // Unix timestamp in milliseconds
}
```

**Validation Rules**:
- `uid`: Required, non-empty string, format "XX:XX:XX:XX"
- `name`: Required, non-empty string
- `department`: Required, non-empty string
- `status`: Required, must be "active" or "inactive"
- `registered_at`: Required, positive number

**Firebase Path**: `/professors/{uid}`

### Admin_Record

Represents an admin user account.

```javascript
{
  uid: String,     // Firebase Auth UID
  email: String,   // Admin email address
  role: String     // "admin"
}
```

**Validation Rules**:
- `uid`: Required, non-empty string (Firebase Auth UID)
- `email`: Required, valid email format
- `role`: Required, must be "admin"

**Firebase Path**: `/admins/{uid}`

### Auth_State

Represents the current authentication state.

```javascript
{
  user: Object | null,      // Firebase user object (uid, email, etc.)
  isAuthenticated: Boolean, // True if user is logged in
  isAdmin: Boolean,         // True if user is in /admins/
  loading: Boolean,         // True during auth operations
  error: String | null      // Error message if auth fails
}
```

**User Object Structure** (when authenticated):
```javascript
{
  uid: String,
  email: String,
  displayName: String | null,
  photoURL: String | null
}
```

### DashboardState

Global state object for the dashboard.

```javascript
{
  logs: Array<MonitoringLog>,     // All retrieved logs
  filteredLogs: Array<MonitoringLog>, // Logs after applying filters
  filters: FilterState,            // Current filter values
  loading: Boolean,                // Loading indicator
  error: String | null,            // Error message if any
  connected: Boolean               // Firebase connection status
}
```

### FilterState

Filter criteria for log queries.

```javascript
{
  dateStart: Date | null,    // Start date for range filter
  dateEnd: Date | null,      // End date for range filter
  roomId: String,            // Room ID filter (empty = no filter)
  uid: String                // UID filter (partial match, empty = no filter)
}
```

### StatisticsData

Computed statistics from logs.

```javascript
{
  totalLogsToday: Number,        // Count of logs from today
  uniqueUIDsToday: Number,       // Count of unique UIDs today
  averageRSSI: Number,           // Mean RSSI value
  averageSNR: Number,            // Mean SNR value
  signalQualityPercent: Number   // Percentage of good signals
}
```

### RegistrationState

State for the Registration Panel.

```javascript
{
  professors: Array<Professor_Record>,  // All registered professors
  formData: {
    uid: String,
    name: String,
    department: String,
    status: String
  },
  loading: Boolean,
  error: String | null,
  successMessage: String | null
}
```

### AdminPanelState

State for the Admin Panel.

```javascript
{
  professors: Array<Professor_Record>,  // All professors
  admins: Array<Admin_Record>,          // All admin accounts
  statistics: {
    totalProfessors: Number,
    activeProfessors: Number,
    inactiveProfessors: Number,
    totalLogs7Days: Number,
    uniqueUIDs7Days: Number
  },
  loading: Boolean,
  error: String | null
}
```

## XUI Framework Integration

### Router Configuration

**File**: `src/router.js`

Add new routes and implement route guards:

```javascript
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";
import AdminPanel from "./pages/AdminPanel.js";
import { getAuthState } from "./firebase/authService.js";

const routes = {
  "/": Home,
  "/dashboard": Dashboard,        // Public access
  "/login": Login,                // Public access
  "/registration": Registration,  // Protected (admin only)
  "/admin": AdminPanel            // Protected (admin only)
};

// Protected routes requiring admin authentication
const protectedRoutes = ["/registration", "/admin"];

function NotFound() {
  return `
    <div class="p-6 text-center">
      <h2 class="text-xl font-bold">404 - Page Not Found</h2>
    </div>
  `;
}

export function router() {
  let path = location.hash.slice(1) || "/";
  if (!path.startsWith("/")) path = "/" + path;
  
  // Check if route is protected
  if (protectedRoutes.includes(path)) {
    const authState = getAuthState();
    if (!authState.isAuthenticated || !authState.isAdmin) {
      // Redirect to login
      location.hash = "#/login";
      return Login();
    }
  }
  
  return (routes[path] || NotFound)();
}

export function initRouter(render) {
  const update = () => render(router());
  window.addEventListener("hashchange", update);
  update();
}
```

### Authentication State Management

**Pattern**: Use XUI's `createState` for reactive auth state management

**Auth State Setup**:

```javascript
import { createState } from "../core/state.js";
import { auth } from "./auth.js";
import { onAuthStateChanged } from "firebase/auth";
import { checkIsAdmin } from "./realtimeDb.js";

// Create global auth state
const authState = createState({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  error: null
});

// Initialize auth service
export function initAuthService() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const isAdmin = await checkIsAdmin(user.uid);
      authState.update({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        isAuthenticated: true,
        isAdmin: isAdmin,
        loading: false,
        error: null
      });
    } else {
      // User is signed out
      authState.update({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null
      });
    }
  });
}

// Get current auth state
export function getAuthState() {
  return authState.get();
}

// Subscribe to auth state changes
export function onAuthStateChange(callback) {
  return authState.subscribe(callback);
}
```

### Login/Logout Operations

**Pattern**: Use Firebase Auth methods with XUI state updates

```javascript
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Login with email and password
export async function login(email, password) {
  try {
    authState.update(state => ({ ...state, loading: true, error: null }));
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Auth state will be updated by onAuthStateChanged listener
    return { success: true, user: userCredential.user };
  } catch (error) {
    authState.update(state => ({ 
      ...state, 
      loading: false, 
      error: "Invalid email or password" 
    }));
    return { success: false, error: error.message };
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    // Auth state will be updated by onAuthStateChanged listener
    location.hash = "#/login";
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
}
```

### State Management

**Pattern**: Use XUI's `createState` for reactive state management

**Dashboard State Setup**:

```javascript
import { createState, computed } from "../core/state.js";

// Create global dashboard state
const dashboardState = createState({
  logs: [],
  filters: {
    dateStart: null,
    dateEnd: null,
    roomId: "",
    uid: ""
  },
  loading: true,
  error: null,
  connected: false
});

// Computed filtered logs
const filteredLogs = computed(dashboardState, (state) => {
  return applyFilters(state.logs, state.filters);
});

// Computed statistics
const statistics = computed(dashboardState, (state) => {
  return calculateStatistics(state.logs);
});
```

### Lifecycle Hooks

**Pattern**: Use `onMount` for initialization and cleanup

**Example**:

```javascript
import { onMount } from "../core/hooks.js";

export default function Dashboard() {
  onMount(() => {
    // Initialize Firebase connection
    initRealtimeDb();
    
    // Subscribe to logs
    const unsubscribe = subscribeToLogs((logs) => {
      dashboardState.update(state => ({
        ...state,
        logs,
        loading: false,
        connected: true
      }));
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  });
  
  // Component rendering...
}
```

### Reactive Rendering

**Pattern**: Subscribe to state changes and trigger re-renders

**Note**: XUI uses string-based rendering. For real-time updates, components should:
1. Subscribe to state changes in `onMount`
2. Manually update DOM elements when state changes
3. Or trigger full re-render via router update

**Example**:

```javascript
onMount(() => {
  dashboardState.subscribe((state) => {
    // Update specific DOM elements
    const logTable = document.getElementById("log-table");
    if (logTable) {
      logTable.innerHTML = renderLogRows(state.logs);
    }
  });
});
```

## Firebase Realtime Database Integration

### Connection Setup

**File**: `src/firebase/realtimeDb.js`

```javascript
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, query, orderByChild, limitToLast, set, update, remove, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g",
  authDomain: "faculty-monitoring-e00b7.firebaseapp.com",
  databaseURL: "https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "faculty-monitoring-e00b7"
};

const app = initializeApp(firebaseConfig, "realtimeDb");
const database = getDatabase(app);

export function initRealtimeDb() {
  return database;
}
```

### Firebase Security Rules

**Critical**: The following security rules MUST be configured in the Firebase Console to enforce access control.

**File**: Firebase Console → Realtime Database → Rules

```json
{
  "rules": {
    "monitoring_logs": {
      ".read": true,
      ".write": false,
      ".indexOn": ["timestamp", "room_id", "uid"]
    },
    "professors": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()",
      "$uid": {
        ".validate": "newData.hasChildren(['name', 'department', 'status', 'registered_at'])",
        "name": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "department": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "status": {
          ".validate": "newData.val() === 'active' || newData.val() === 'inactive'"
        },
        "registered_at": {
          ".validate": "newData.isNumber()"
        }
      }
    },
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()",
      "$uid": {
        ".validate": "newData.hasChildren(['email', 'role'])",
        "email": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "role": {
          ".validate": "newData.val() === 'admin'"
        }
      }
    }
  }
}
```

**Security Rules Explanation**:

1. **`/monitoring_logs/`**:
   - **Read**: Public access (`.read: true`) - allows unauthenticated users to view monitoring data
   - **Write**: Denied (`.write: false`) - data written by ESP32 devices via separate credentials
   - **Indexes**: On `timestamp`, `room_id`, `uid` for efficient queries

2. **`/professors/`**:
   - **Read**: Authenticated users only (`auth != null`)
   - **Write**: Admin users only (checks if user exists in `/admins/`)
   - **Validation**: Enforces required fields and data types
   - **Status**: Must be "active" or "inactive"

3. **`/admins/`**:
   - **Read**: Admin users only (checks if user exists in `/admins/`)
   - **Write**: Admin users only
   - **Validation**: Enforces email and role fields
   - **Role**: Must be "admin"

### Real-Time Listeners

**Pattern**: Use `onValue` for real-time subscriptions

```javascript
export function subscribeToLogs(callback, limit = 50) {
  const logsRef = ref(database, "monitoring_logs");
  const logsQuery = query(
    logsRef,
    orderByChild("timestamp"),
    limitToLast(limit)
  );
  
  const unsubscribe = onValue(logsQuery, (snapshot) => {
    const logs = [];
    snapshot.forEach((childSnapshot) => {
      logs.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort descending (most recent first)
    logs.sort((a, b) => b.timestamp - a.timestamp);
    
    callback(logs);
  }, (error) => {
    console.error("Firebase error:", error);
    callback([], error);
  });
  
  return unsubscribe;
}
```

### Query Optimization

**Strategies**:

1. **Limit Results**: Always use `limitToLast(50)` to minimize data transfer
2. **Index on Timestamp**: Ensure Firebase has index on `timestamp` field
3. **Pagination**: For historical data, implement pagination with `startAt` and `endAt`
4. **Selective Fields**: If possible, structure data to avoid retrieving unnecessary fields

**Firebase Rules** (configured above):

```json
{
  "rules": {
    "monitoring_logs": {
      ".read": true,
      ".indexOn": ["timestamp", "room_id", "uid"]
    }
  }
}
```

### Professor and Admin Data Operations

**Professor Management**:

```javascript
// Save new professor
export async function saveProfessor(uid, professorData) {
  const professorRef = ref(database, `professors/${uid}`);
  await set(professorRef, {
    ...professorData,
    registered_at: Date.now()
  });
}

// Get all professors
export async function getProfessors() {
  const professorsRef = ref(database, "professors");
  const snapshot = await get(professorsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(uid => ({ uid, ...data[uid] }));
  }
  return [];
}

// Update professor
export async function updateProfessor(uid, updates) {
  const professorRef = ref(database, `professors/${uid}`);
  await update(professorRef, updates);
}

// Delete professor
export async function deleteProfessor(uid) {
  const professorRef = ref(database, `professors/${uid}`);
  await remove(professorRef);
}
```

**Admin Management**:

```javascript
// Check if user is admin
export async function checkIsAdmin(uid) {
  const adminRef = ref(database, `admins/${uid}`);
  const snapshot = await get(adminRef);
  return snapshot.exists();
}

// Save new admin
export async function saveAdmin(uid, adminData) {
  const adminRef = ref(database, `admins/${uid}`);
  await set(adminRef, adminData);
}

// Get all admins
export async function getAdmins() {
  const adminsRef = ref(database, "admins");
  const snapshot = await get(adminsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(uid => ({ uid, ...data[uid] }));
  }
  return [];
}

// Delete admin
export async function deleteAdmin(uid) {
  const adminRef = ref(database, `admins/${uid}`);
  await remove(adminRef);
}
```

### Error Handling

**Connection Errors**:
- Catch errors in `onValue` callback
- Update state with error message
- Display user-friendly error in UI

**Data Validation**:
- Validate required fields exist in each log
- Filter out malformed logs
- Log validation errors to console

## UI/UX Design

### Layout Structure

**Desktop Layout - Public User** (≥ 768px, unauthenticated):

```
┌─────────────────────────────────────────┐
│  Navbar [Monitoring] [Login Button]    │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │   Statistics Cards (Grid 2x2)   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   Filters (Horizontal)          │   │
│  └─────────────────────────────────┘   │
│  ┌──────────────┬──────────────────┐   │
│  │ Room Status  │  Log Viewer      │   │
│  │ (Sidebar)    │  (Table)         │   │
│  │              │                  │   │
│  └──────────────┴──────────────────┘   │
└─────────────────────────────────────────┘
```

**Desktop Layout - Admin User** (≥ 768px, authenticated):

```
┌─────────────────────────────────────────────────────────┐
│  Navbar [Monitoring] [Registration] [Admin] [Logout]   │
├─────────────────────────────────────────────────────────┤
│  [Active Tab Content]                                   │
│  - Monitoring: Statistics + Filters + Logs             │
│  - Registration: RFID Scanner + Professor Form + List  │
│  - Admin: Professor Management + Statistics + Admins   │
└─────────────────────────────────────────────────────────┘
```

**Login Page Layout**:

```
┌─────────────────────────────────────────┐
│           Faculty Monitoring            │
│           Admin Login                   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Email: [________________]        │ │
│  │  Password: [________________]     │ │
│  │  [Login Button]                   │ │
│  │  [Error Message Area]             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Registration Panel Layout**:

```
┌─────────────────────────────────────────┐
│  RFID Registration                      │
│  ┌───────────────────────────────────┐ │
│  │  UID: [________________] [Scan]   │ │
│  │  Name: [________________]         │ │
│  │  Department: [________________]   │ │
│  │  [Register Professor]             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Registered Professors                  │
│  ┌───────────────────────────────────┐ │
│  │  UID | Name | Dept | Status       │ │
│  │  12:34:56:78 | John | CS | Active │ │
│  │  [Add to Whitelist] [Remove]      │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Admin Panel Layout**:

```
┌─────────────────────────────────────────┐
│  System Statistics                      │
│  [Total: 50] [Active: 45] [Inactive: 5]│
│  [Logs 7d: 1234] [Unique UIDs: 42]     │
│                                         │
│  Professor Management                   │
│  ┌───────────────────────────────────┐ │
│  │  UID | Name | Dept | Status       │ │
│  │  [Edit] [Delete]                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Admin Accounts                         │
│  ┌───────────────────────────────────┐ │
│  │  Email | Role                     │ │
│  │  [Add Admin] [Delete]             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Mobile Layout** (< 768px):

```
┌─────────────────┐
│  Navbar (☰)     │
│  [Login/Logout] │
├─────────────────┤
│  [Active Tab]   │
│  (Stacked)      │
└─────────────────┘
```

### Responsive Design Approach

**Tailwind CSS Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Component Responsiveness**:

1. **Statistics Cards**:
   - Mobile: Single column stack
   - Tablet: 2-column grid
   - Desktop: 4-column grid

2. **Log Viewer**:
   - Mobile: Card layout with stacked fields
   - Desktop: Full table with all columns

3. **Filters**:
   - Mobile: Vertical stack
   - Desktop: Horizontal row

4. **Navigation**:
   - Mobile: Hamburger menu with dropdown
   - Desktop: Horizontal tab bar

5. **Forms (Login, Registration)**:
   - Mobile: Full-width inputs, stacked
   - Desktop: Centered form with max-width

**Tailwind Classes**:
```html
<!-- Statistics Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

<!-- Log Table (hidden on mobile) -->
<table class="hidden md:table">

<!-- Log Cards (visible on mobile) -->
<div class="md:hidden space-y-4">

<!-- Navigation Tabs -->
<nav class="flex flex-wrap gap-2 md:gap-4">

<!-- Login Form -->
<form class="w-full max-w-md mx-auto p-6">
```

### Color Coding System

**Status Indicators**:
- IN: `bg-green-100 text-green-800`
- OUT: `bg-red-100 text-red-800`
- Active: `bg-green-100 text-green-800`
- Inactive: `bg-gray-100 text-gray-800`

**Signal Quality (RSSI)**:
- Good (> -50 dBm): `text-green-600`
- Fair (-70 to -50 dBm): `text-yellow-600`
- Poor (< -70 dBm): `text-red-600`

**Signal Quality (SNR)**:
- Good (> 8 dB): `text-green-600`
- Fair (5 to 8 dB): `text-yellow-600`
- Poor (< 5 dB): `text-red-600`

**Authentication States**:
- Authenticated: `bg-blue-100 text-blue-800`
- Unauthenticated: `bg-gray-100 text-gray-800`

**Action Buttons**:
- Primary (Login, Register): `bg-blue-600 hover:bg-blue-700 text-white`
- Danger (Delete, Logout): `bg-red-600 hover:bg-red-700 text-white`
- Secondary (Edit, Cancel): `bg-gray-600 hover:bg-gray-700 text-white`

### Loading and Error States

**Loading Indicator**:
```html
<div class="flex items-center justify-center p-8">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  <span class="ml-3 text-gray-600">Loading dashboard...</span>
</div>
```

**Error Message**:
```html
<div class="bg-red-50 border border-red-200 rounded p-4 text-red-800">
  <strong>Error:</strong> Unable to connect to Firebase. Please check your connection.
</div>
```

**Authentication Error**:
```html
<div class="bg-red-50 border border-red-200 rounded p-4 text-red-800 mb-4">
  <strong>Error:</strong> Invalid email or password.
</div>
```

**Success Message**:
```html
<div class="bg-green-50 border border-green-200 rounded p-4 text-green-800">
  <strong>Success:</strong> Professor registered successfully.
</div>
```

**Empty State**:
```html
<div class="text-center p-8 text-gray-500">
  <p>No monitoring logs found.</p>
</div>
```

**Unauthorized Access**:
```html
<div class="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
  <strong>Access Denied:</strong> You must be logged in as an admin to access this page.
</div>
```

## Performance Considerations

### Data Limiting

**Strategy**: Limit Firebase queries to latest 50 logs

**Implementation**:
```javascript
const logsQuery = query(
  logsRef,
  orderByChild("timestamp"),
  limitToLast(50)
);
```

**Rationale**:
- Reduces initial load time
- Minimizes bandwidth usage
- Sufficient for real-time monitoring
- Historical data accessible via filters/export

### Debouncing

**Strategy**: Debounce text input filters with 300ms delay

**Implementation**:
```javascript
let debounceTimer;

function handleFilterInput(value) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateFilter(value);
  }, 300);
}
```

**Applied To**:
- UID text input
- Room ID text input

**Rationale**:
- Prevents excessive state updates during typing
- Reduces unnecessary re-renders
- Improves perceived performance

### Caching Strategies

**Computed Values**:
- Use XUI's `computed` for derived data
- Automatically cached until dependencies change
- Examples: filtered logs, statistics

**Memoization**:
- Cache expensive calculations (e.g., statistics)
- Invalidate cache when logs array changes

**Local Storage** (Future Enhancement):
- Cache recent logs for offline viewing
- Sync with Firebase when connection restored

### Render Optimization

**Strategies**:

1. **Partial DOM Updates**: Update only changed elements instead of full re-render
2. **Virtual Scrolling** (Future): For large log lists, render only visible rows
3. **Lazy Loading**: Load room status and statistics after initial render
4. **Throttle Updates**: Batch rapid Firebase updates (e.g., multiple logs arriving simultaneously)

**Performance Monitoring**:
- Display render time in UI (already implemented in XUI)
- Log slow operations to console
- Monitor Firebase read operations

### Firebase Optimization

**Best Practices**:

1. **Indexed Queries**: Ensure Firebase indexes on `timestamp`, `room_id`, `uid`
2. **Shallow Queries**: Use `.shallow=true` for counting without retrieving data (if needed)
3. **Connection Pooling**: Reuse Firebase connection across components
4. **Offline Persistence**: Enable Firebase offline persistence for better UX

```javascript
import { enableDatabase } from "firebase/database";

enableDatabase(database);
```

## Error Handling

### Error Categories

1. **Connection Errors**: Firebase connection failures
2. **Data Errors**: Malformed or missing data
3. **Query Errors**: Invalid filter parameters
4. **Export Errors**: CSV generation failures

### Error Handling Strategy

**Firebase Connection**:
```javascript
onValue(logsQuery, 
  (snapshot) => { /* success */ },
  (error) => {
    console.error("Firebase error:", error);
    dashboardState.update(state => ({
      ...state,
      error: "Unable to connect to Firebase. Please check your connection.",
      loading: false
    }));
  }
);
```

**Data Validation**:
```javascript
function validateLog(log) {
  if (!log.uid || !log.room_id || !log.status || !log.timestamp) {
    console.warn("Invalid log:", log);
    return false;
  }
  return true;
}

const validLogs = logs.filter(validateLog);
```

**User Feedback**:
- Display error messages in UI
- Provide actionable guidance (e.g., "Check your connection")
- Log detailed errors to console for debugging

## Testing Strategy

### Unit Testing

**Test Framework**: Vitest (recommended for Vite projects)

**Test Coverage**:

1. **Utility Functions**:
   - Date formatting
   - Signal quality calculation
   - Filter logic
   - CSV export generation

2. **Data Transformations**:
   - Firebase snapshot to MonitoringLog conversion
   - Statistics calculations
   - Filter application

3. **Component Logic**:
   - State updates
   - Computed values
   - Event handlers

**Example Test**:
```javascript
import { describe, it, expect } from 'vitest';
import { calculateStatistics } from '../utils/statistics';

describe('calculateStatistics', () => {
  it('should calculate total logs correctly', () => {
    const logs = [
      { timestamp: Date.now(), uid: '12:34:56:78' },
      { timestamp: Date.now(), uid: '12:34:56:78' }
    ];
    const stats = calculateStatistics(logs);
    expect(stats.totalLogsToday).toBe(2);
  });
  
  it('should count unique UIDs', () => {
    const logs = [
      { timestamp: Date.now(), uid: '12:34:56:78' },
      { timestamp: Date.now(), uid: '12:34:56:78' },
      { timestamp: Date.now(), uid: 'AA:BB:CC:DD' }
    ];
    const stats = calculateStatistics(logs);
    expect(stats.uniqueUIDsToday).toBe(2);
  });
});
```

### Integration Testing

**Test Scenarios**:

1. **Firebase Connection**: Verify connection to Realtime Database
2. **Real-time Updates**: Simulate log additions and verify UI updates
3. **Filter Application**: Apply filters and verify correct results
4. **CSV Export**: Generate CSV and verify format

**Mocking Strategy**:
- Mock Firebase SDK for predictable testing
- Use test data fixtures for consistent results

### Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Statistics display correctly
- [ ] Log table shows latest 50 logs
- [ ] Real-time updates appear within 2 seconds
- [ ] Filters work correctly (date, room, UID)
- [ ] Clear filters resets view
- [ ] CSV export downloads correct file
- [ ] Signal quality color coding is accurate
- [ ] Responsive layout works on mobile
- [ ] Error messages display for connection failures
- [ ] Loading indicator shows during data fetch

### Performance Testing

**Metrics to Monitor**:
- Initial page load time (target: < 2 seconds)
- Time to first render (target: < 1 second)
- Filter response time (target: < 500ms)
- Real-time update latency (target: < 2 seconds)

**Tools**:
- Chrome DevTools Performance tab
- Lighthouse for overall performance score
- Firebase console for read operation counts

## Security Considerations

### Firebase Security Rules

**Implemented Rules** (see Firebase Realtime Database Integration section for full rules):

1. **Public Read Access to Monitoring Logs**:
   - `/monitoring_logs/`: Public read, no write
   - Allows unauthenticated users to view real-time monitoring data
   - Write access restricted to ESP32 devices via separate credentials

2. **Protected Professor Data**:
   - `/professors/`: Authenticated read, admin-only write
   - Validates required fields and data types
   - Enforces status values ("active" or "inactive")

3. **Protected Admin Data**:
   - `/admins/`: Admin-only read and write
   - Only admins can view and manage admin accounts
   - Validates email and role fields

**Rule Enforcement**:
- `auth != null`: Checks if user is authenticated
- `root.child('admins').child(auth.uid).exists()`: Checks if user is in admin list
- `.validate`: Enforces data structure and types

### Authentication

**Current Implementation**: Firebase Authentication with email/password

**Auth Flow**:
1. User submits email and password on Login Page
2. Firebase Auth validates credentials
3. On success, session token created and persisted
4. Auth state updated with user info and admin status
5. User redirected to Dashboard with appropriate access

**Session Management**:
- Firebase Auth handles session persistence
- Sessions persist across browser refreshes
- Sessions expire based on Firebase Auth settings (default: 1 hour)
- Manual logout terminates session immediately

**Admin Status Check**:
```javascript
export async function checkIsAdmin(uid) {
  const adminRef = ref(database, `admins/${uid}`);
  const snapshot = await get(adminRef);
  return snapshot.exists();
}
```

**Route Guards**:
- Protected routes: `/registration`, `/admin`
- Redirect to `/login` if unauthenticated or not admin
- Implemented in router function

### Data Privacy

**Considerations**:
- UIDs are anonymized identifiers (not personal data)
- Room IDs are generic (e.g., "Room101")
- Professor names and departments stored in protected `/professors/` path
- Admin emails stored in protected `/admins/` path
- No personally identifiable information (PII) in public monitoring logs
- CSV exports should be handled securely (not shared publicly)

**Access Control Summary**:

| Path | Public Read | Public Write | Auth Read | Auth Write | Admin Read | Admin Write |
|------|-------------|--------------|-----------|------------|------------|-------------|
| `/monitoring_logs/` | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ |
| `/professors/` | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ |
| `/admins/` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |

### Input Validation

**Client-Side Validation**:
- Email format validation on login form
- Non-empty password validation
- UID format validation (XX:XX:XX:XX) on registration form
- Required field validation (name, department)

**Server-Side Validation** (Firebase Rules):
- Data type validation (string, number, boolean)
- Required field validation
- Enum validation (status: "active" or "inactive")
- String length validation (non-empty)

### XSS Prevention

**Strategies**:
- XUI framework escapes HTML by default in string rendering
- User input sanitized before display
- No `innerHTML` usage with user-provided content
- Use text content methods for dynamic data

### CSRF Protection

**Firebase Auth CSRF Protection**:
- Firebase Auth tokens include CSRF protection
- Tokens validated on every request
- Short-lived tokens (1 hour default)

### Password Security

**Firebase Auth Handles**:
- Password hashing (bcrypt)
- Secure password storage
- Password strength requirements (configurable in Firebase Console)
- Account lockout after failed attempts (configurable)

**Recommendations**:
- Enforce strong password policy in Firebase Console
- Enable multi-factor authentication (future enhancement)
- Implement password reset flow (future enhancement)

## Deployment Considerations

### Build Configuration

**Vite Build**:
```bash
npm run build
```

**Output**: `dist/` directory with optimized assets

### Environment Variables

**Firebase Config**: Currently hardcoded, should be moved to environment variables

**Recommended**:
```javascript
// .env
VITE_FIREBASE_API_KEY=AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g
VITE_FIREBASE_DATABASE_URL=https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=faculty-monitoring-e00b7

// src/firebase/realtimeDb.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};
```

### Hosting Options

1. **Firebase Hosting**: Integrated with Firebase services
2. **Vercel**: Easy deployment with Vite support
3. **Netlify**: Simple static site hosting
4. **GitHub Pages**: Free hosting for public repos

### PWA Considerations

**Current State**: PWA infrastructure exists (`src/pwa.js`, `public/sw.js`)

**Dashboard Integration**:
- Service worker should cache dashboard assets
- Offline fallback for when Firebase unavailable
- Background sync for pending exports

## Future Enhancements

### Phase 2 Features

1. **Historical Data Pagination**: Load older logs beyond latest 50
2. **Advanced Analytics**: Charts and graphs for trends over time
3. **Notifications**: Alert administrators of unusual activity
4. **Custom Date Ranges**: More flexible date filtering
5. **Export Formats**: PDF and Excel in addition to CSV
6. **Real-time Alerts**: Push notifications for specific events
7. **Room Maps**: Visual representation of room locations
8. **Offline Mode**: Full offline functionality with sync
9. **Multi-Factor Authentication**: Add MFA for admin accounts
10. **Password Reset Flow**: Allow admins to reset forgotten passwords
11. **Audit Logging**: Track all admin actions (edits, deletes, whitelist changes)
12. **Bulk Professor Import**: CSV import for registering multiple professors
13. **Professor Search**: Search and filter professors by name, department, or UID
14. **Role-Based Access Control**: Multiple admin roles (super admin, moderator, viewer)

### Technical Debt

1. **Type Safety**: Consider migrating to TypeScript
2. **Component Library**: Extract reusable components
3. **State Management**: Evaluate more robust state management (if needed)
4. **Testing Coverage**: Increase unit and integration test coverage
5. **Accessibility**: ARIA labels and keyboard navigation
6. **Internationalization**: Support multiple languages
7. **Error Boundary**: Implement error boundaries for graceful error handling
8. **Loading States**: Improve loading state UX with skeleton screens

## Appendix

### File Structure

```
src/
├── pages/
│   ├── Home.js                   # Home page
│   ├── Dashboard.js              # Main dashboard page (public access)
│   ├── Login.js                  # Login page (NEW)
│   ├── Registration.js           # Registration panel (NEW, admin only)
│   └── AdminPanel.js             # Admin panel (NEW, admin only)
├── components/
│   ├── Navigation.js             # Navigation component (NEW)
│   ├── Layout.js                 # Layout wrapper
│   ├── Navbar.js                 # Navbar component
│   └── dashboard/
│       ├── Statistics.js         # Statistics module
│       ├── LogViewer.js          # Log table/cards
│       ├── RoomStatus.js         # Room status overview
│       └── Filters.js            # Filter controls
├── firebase/
│   ├── config.js                 # Firebase config
│   ├── auth.js                   # Firebase Auth instance
│   ├── authService.js            # Auth service (NEW)
│   ├── realtimeDb.js             # Firebase Realtime DB service (UPDATED)
│   ├── db.js                     # Firestore (if used)
│   └── push.js                   # Push notifications
├── utils/
│   ├── csvExport.js              # CSV export utility
│   ├── dateFormat.js             # Date formatting
│   ├── signalQuality.js          # Signal quality calculations
│   └── statistics.js             # Statistics calculations
├── core/
│   ├── state.js                  # XUI state management
│   ├── hooks.js                  # XUI lifecycle hooks
│   └── bindings.js               # XUI data bindings
├── security/
│   └── initUsers.js              # Initial user setup
├── router.js                     # Router with route guards (UPDATED)
├── app.js                        # Main app entry
├── pwa.js                        # PWA service worker
└── styles.css                    # Global styles
```

### Key Dependencies

```json
{
  "dependencies": {
    "firebase": "^10.x",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "vitest": "^1.x"
  }
}
```

### Glossary Reference

- **Dashboard**: Main application interface
- **Firebase_Service**: `src/firebase/realtimeDb.js`
- **Auth_Service**: `src/firebase/authService.js` (NEW)
- **Login_Page**: `src/pages/Login.js` (NEW)
- **Registration_Panel**: `src/pages/Registration.js` (NEW)
- **Admin_Panel**: `src/pages/AdminPanel.js` (NEW)
- **Navigation_Component**: `src/components/Navigation.js` (NEW)
- **Log_Viewer**: `src/components/dashboard/LogViewer.js`
- **Statistics_Module**: `src/components/dashboard/Statistics.js`
- **Filter_Engine**: `src/components/dashboard/Filters.js`
- **Monitoring_Log**: Data model defined in Data Models section
- **Professor_Record**: Data model defined in Data Models section (NEW)
- **Admin_Record**: Data model defined in Data Models section (NEW)
- **Auth_State**: Data model defined in Data Models section (NEW)
- **XUI_Framework**: Custom framework in `src/core/`

---

**Document Version**: 2.0  
**Last Updated**: 2024-01-15  
**Author**: System Design Team  
**Status**: Ready for Implementation  
**Changelog**:
- v2.0: Added authentication and authorization features (Login, Registration Panel, Admin Panel, Navigation, Security Rules)
- v1.0: Initial design with monitoring dashboard features


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following properties suitable for property-based testing. Several properties were combined or refined to eliminate redundancy:

**Redundancy Analysis**:
- Properties 4.1 and 4.2 (counting logs and unique UIDs) can be tested separately as they validate different aspects
- Properties 4.3 and 4.4 (average RSSI and SNR) follow the same pattern but test different fields - keep separate
- Properties 5.2, 5.3, and 5.4 all involve grouping by room and extracting different attributes - can be combined into one comprehensive property
- Properties 3.6 and 3.7 (unit formatting) follow the same pattern - can be combined into one property
- Properties 7.1 and 7.2 (signal quality classification) follow the same pattern - can be combined into one property
- Property 5.5 is redundant with 5.1 (filtering by date range)
- Property 6.5 is redundant with 6.4 (AND logic is implicit in "matching all criteria")
- Properties 16.1 and 16.2 (route guards for protected routes) can be combined into one property
- Properties 18.3 and 18.5 (whitelist add/remove) follow the same pattern - can be combined into one property
- Properties 20.2 and 20.3 (active/inactive counts) follow the same pattern - can be combined into one property
- Properties 23.2 and 23.3 (name and department validation) follow the same pattern - can be combined into one property
- Properties 24.2 and 24.3 (email and role validation) follow the same pattern - can be combined into one property
- Property 14.4 is redundant with 14.2 (clearing auth state is part of logout)

**Final Property Set**: 15 original properties + 13 new properties for authentication/authorization = 28 total unique properties covering data transformation, validation, calculations, filtering, formatting, classification, authentication, authorization, and access control logic.

### Property 1: Firebase Snapshot Parsing Completeness

*For any* valid Firebase snapshot containing monitoring log data, when parsed by the Firebase Service, the resulting MonitoringLog object SHALL contain all expected fields (uid, room_id, status, timestamp, rssi, snr, logged_at) with values matching the snapshot data.

**Validates: Requirements 2.3**

### Property 2: Log Validation Correctness

*For any* log object, the validation function SHALL return true if and only if all required fields (uid, room_id, status, timestamp) are present and non-empty, and SHALL return false otherwise.

**Validates: Requirements 2.5**

### Property 3: Timestamp Formatting Reversibility

*For any* valid Unix timestamp in milliseconds, when formatted to human-readable string (YYYY-MM-DD HH:MM:SS) and parsed back, the resulting timestamp SHALL be equivalent to the original (within the same second).

**Validates: Requirements 3.4**

### Property 4: Unit Formatting Consistency

*For any* numeric RSSI value, the formatted string SHALL contain the value followed by " dBm", and *for any* numeric SNR value, the formatted string SHALL contain the value followed by " dB".

**Validates: Requirements 3.6, 3.7**

### Property 5: Daily Log Count Accuracy

*For any* array of monitoring logs with varying timestamps, the count of logs from the current day SHALL equal the number of logs where the date portion of the timestamp matches today's date.

**Validates: Requirements 4.1**

### Property 6: Unique UID Count Accuracy

*For any* array of monitoring logs, the count of unique UIDs SHALL equal the size of the set of distinct uid values present in the logs.

**Validates: Requirements 4.2**

### Property 7: Average RSSI Calculation Correctness

*For any* non-empty array of monitoring logs containing RSSI values, the calculated average RSSI SHALL equal the sum of all RSSI values divided by the count of logs, within floating-point precision tolerance.

**Validates: Requirements 4.3**

### Property 8: Average SNR Calculation Correctness

*For any* non-empty array of monitoring logs containing SNR values, the calculated average SNR SHALL equal the sum of all SNR values divided by the count of logs, within floating-point precision tolerance.

**Validates: Requirements 4.4**

### Property 9: 24-Hour Activity Filter Correctness

*For any* array of monitoring logs with varying timestamps, the filtered list of logs from the past 24 hours SHALL contain only logs where (current_time - log_timestamp) ≤ 24 hours, and SHALL contain all such logs.

**Validates: Requirements 5.1, 5.5**

### Property 10: Room Grouping and Aggregation Completeness

*For any* array of monitoring logs, when grouped by room_id, each room group SHALL have: (1) a count equal to the number of logs for that room, (2) the most recent status matching the status of the log with the maximum timestamp for that room, and (3) the most recent timestamp equal to the maximum timestamp for that room.

**Validates: Requirements 5.2, 5.3, 5.4**

### Property 11: Filter Application Completeness

*For any* array of monitoring logs and any combination of filter criteria (date range, room_id, uid), the filtered results SHALL contain only logs matching all active filter criteria, and SHALL contain all logs that match all criteria.

**Validates: Requirements 6.4, 6.5**

### Property 12: Signal Quality Classification Correctness

*For any* RSSI value, the signal quality classifier SHALL return "good" if RSSI > -50, "fair" if -70 ≤ RSSI ≤ -50, and "poor" if RSSI < -70. *For any* SNR value, the classifier SHALL return "good" if SNR > 8, "fair" if 5 ≤ SNR ≤ 8, and "poor" if SNR < 5.

**Validates: Requirements 7.1, 7.2**

### Property 13: Signal Quality Percentage Calculation

*For any* array of monitoring logs with RSSI and SNR values, the signal quality percentage SHALL equal (count of logs where RSSI > -50 AND SNR > 8) / (total count of logs) × 100, within floating-point precision tolerance.

**Validates: Requirements 7.3**

### Property 14: CSV Generation Completeness

*For any* array of monitoring logs, the generated CSV string SHALL: (1) contain a header row with columns "UID,Room ID,Status,Timestamp,RSSI,SNR,Logged At", (2) contain one data row per log, (3) preserve all field values from each log in the corresponding CSV columns, and (4) be parseable as valid CSV.

**Validates: Requirements 10.2, 10.3**

### Property 15: CSV Filename Format Correctness

*For any* timestamp, the generated CSV filename SHALL match the pattern "faculty_logs_YYYY-MM-DD_HH-MM-SS.csv" where YYYY, MM, DD, HH, MM, SS are zero-padded numeric values representing the year, month, day, hour, minute, and second of the timestamp.

**Validates: Requirements 10.4**

---

## Authentication and Authorization Properties

### Property 16: Login Success State Update

*For any* valid email and password credentials, when the login function is called, the authentication state SHALL be updated to include the user object, isAuthenticated set to true, and isAdmin set based on the user's presence in `/admins/`.

**Validates: Requirements 13.3**

### Property 17: Login Failure Error Message

*For any* invalid email or password credentials, when the login function is called, the authentication state SHALL include an error message "Invalid email or password" and isAuthenticated SHALL remain false.

**Validates: Requirements 13.4**

### Property 18: Logout State Clearing

*For any* authenticated user state, when the logout function is called, the authentication state SHALL be updated to set user to null, isAuthenticated to false, and isAdmin to false.

**Validates: Requirements 14.2, 14.4**

### Property 19: Route Guard Redirect for Unauthenticated Users

*For any* protected route path (e.g., "/registration", "/admin"), when accessed by an unauthenticated user, the router SHALL redirect to the "/login" route.

**Validates: Requirements 16.1, 16.2**

### Property 20: Route Guard Access for Authenticated Admins

*For any* protected route path, when accessed by an authenticated admin user, the router SHALL grant access and render the requested component without redirection.

**Validates: Requirements 16.3**

### Property 21: Professor Registration Form Validation

*For any* professor registration form data, the validation function SHALL return false if any required field (uid, name, department) is empty or missing, and SHALL return true if all required fields are non-empty.

**Validates: Requirements 17.4**

### Property 22: Professor Record Structure Validation

*For any* professor record, the record SHALL include all required fields (uid, name, department, status, registered_at) with correct data types (strings for uid/name/department/status, number for registered_at).

**Validates: Requirements 17.6**

### Property 23: Whitelist Status Toggle

*For any* professor record, when the whitelist status is toggled, the status field SHALL change from "active" to "inactive" or from "inactive" to "active", and all other fields SHALL remain unchanged.

**Validates: Requirements 18.3, 18.5**

### Property 24: Professor Edit Validation

*For any* professor edit form data, the validation function SHALL return false if any required field (name, department) is empty, and SHALL return true if all required fields are non-empty.

**Validates: Requirements 19.5**

### Property 25: Professor Count Calculation

*For any* array of professor records, the total count SHALL equal the length of the array.

**Validates: Requirements 20.1**

### Property 26: Professor Status Count Calculation

*For any* array of professor records, the count of active professors SHALL equal the number of records where status equals "active", and the count of inactive professors SHALL equal the number of records where status equals "inactive".

**Validates: Requirements 20.2, 20.3**

### Property 27: Navigation Tab Visibility Based on Auth State

*For any* authentication state, when isAuthenticated is false, the navigation component SHALL display only the "Monitoring" tab, and when isAuthenticated is true and isAdmin is true, the navigation component SHALL display "Monitoring", "Registration", and "Admin Panel" tabs.

**Validates: Requirements 22.1, 22.2**

### Property 28: Professor Record Field Validation

*For any* professor record data, the validation function SHALL return false if the name field is empty, or if the department field is empty, or if the status field is not "active" or "inactive", and SHALL return true if all fields meet their validation criteria.

**Validates: Requirements 23.2, 23.3, 23.4**

### Property 29: Admin Record Field Validation

*For any* admin record data, the validation function SHALL return false if the email field is empty or invalid format, or if the role field is not "admin", and SHALL return true if all fields meet their validation criteria.

**Validates: Requirements 24.2, 24.3**

