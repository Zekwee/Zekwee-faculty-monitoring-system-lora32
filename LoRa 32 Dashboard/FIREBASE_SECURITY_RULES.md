# Firebase Security Rules Configuration

## Instructions

To configure Firebase Security Rules for the Faculty Monitoring Dashboard:

1. Open Firebase Console: https://console.firebase.google.com/
2. Select your project: **faculty-monitoring-e00b7**
3. Navigate to **Realtime Database** → **Rules**
4. Replace the existing rules with the configuration below
5. Click **Publish** to apply the rules

## Security Rules Configuration

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

## Rules Explanation

### `/monitoring_logs/`
- **Read**: Public access (anyone can read)
- **Write**: Denied (only ESP32 devices can write via separate credentials)
- **Indexes**: On `timestamp`, `room_id`, `uid` for efficient queries

### `/professors/`
- **Read**: Authenticated users only
- **Write**: Admin users only (checks if user exists in `/admins/`)
- **Validation**: Enforces required fields and data types
- **Status**: Must be "active" or "inactive"

### `/admins/`
- **Read**: Admin users only
- **Write**: Admin users only
- **Validation**: Enforces email and role fields
- **Role**: Must be "admin"

## Initial Admin Setup

After configuring the rules, you need to manually create the first admin account:

1. Go to **Realtime Database** → **Data**
2. Click on the root node
3. Click **+** to add a child
4. Name: `admins`
5. Click **+** to add a child under `admins`
6. Name: Your Firebase Auth UID (get from Authentication → Users)
7. Add two children:
   - `email`: "your-email@example.com"
   - `role`: "admin"

## Testing

After configuration:
1. Test public access to monitoring dashboard (no login required)
2. Test admin login with your credentials
3. Test professor registration (admin only)
4. Test admin panel access (admin only)

## Security Notes

- Public users can only read `/monitoring_logs/`
- All write operations to `/professors/` and `/admins/` require admin authentication
- Firebase Auth handles session management and token validation
- Rules are enforced at the database level for maximum security
