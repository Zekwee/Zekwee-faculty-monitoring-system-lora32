# 🔒 Deployment Security Guide

## ⚠️ CRITICAL: Security Issues to Fix Before Deployment

### 🚨 HIGH PRIORITY (Fix ASAP)

#### 1. **Password Storage - PLAIN TEXT! ❌**
**Current Issue:**
```javascript
// src/firebase/authService.js
await saveAdmin(adminUid, {
  email: "admin@faculty.com",
  password: "admin123", // ❌ PLAIN TEXT!
  role: "admin"
});
```

**Solution: Hash Passwords**
```bash
npm install bcryptjs
```

```javascript
import bcrypt from 'bcryptjs';

// When creating admin
const hashedPassword = await bcrypt.hash(password, 10);
await saveAdmin(adminUid, {
  email: email,
  password: hashedPassword, // ✅ HASHED
  role: "admin"
});

// When logging in
const admin = admins.find(a => a.email === email);
if (!admin) return { success: false };

const isValidPassword = await bcrypt.compare(password, admin.password);
if (!isValidPassword) {
  return { success: false, error: "Invalid password" };
}
```

#### 2. **Firebase API Key Exposed in Code ❌**
**Current Issue:**
```javascript
// src/firebase/config.js - API key visible in source code
const firebaseConfig = {
  apiKey: "AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g", // ❌ PUBLIC
  authDomain: "faculty-monitoring-e00b7.firebaseapp.com",
  projectId: "faculty-monitoring-e00b7"
};
```

**Solution: Use Environment Variables**
```bash
# .env (add to .gitignore!)
VITE_FIREBASE_API_KEY=AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g
VITE_FIREBASE_AUTH_DOMAIN=faculty-monitoring-e00b7.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=faculty-monitoring-e00b7
```

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};
```

```gitignore
# .gitignore
.env
.env.local
.env.production
```

#### 3. **No Rate Limiting ❌**
**Issue:** Attackers can spam login attempts

**Solution: Add Rate Limiting**
```javascript
// Simple rate limiting
const loginAttempts = new Map();

async function login(email, password) {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  
  // Reset after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  // Block after 5 failed attempts
  if (attempts.count >= 5) {
    return { 
      success: false, 
      error: "Too many login attempts. Try again in 15 minutes." 
    };
  }
  
  // Attempt login...
  const result = await attemptLogin(email, password);
  
  if (!result.success) {
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(email, attempts);
  } else {
    loginAttempts.delete(email);
  }
  
  return result;
}
```

#### 4. **No Session Timeout ❌**
**Issue:** Users stay logged in forever

**Solution: Add Session Expiry**
```javascript
// src/firebase/authService.js
export function initAuthService() {
  const savedSession = localStorage.getItem('admin_session');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      const now = Date.now();
      const sessionAge = now - (session.timestamp || 0);
      
      // Session expires after 8 hours
      if (sessionAge > 8 * 60 * 60 * 1000) {
        localStorage.removeItem('admin_session');
        return;
      }
      
      authState.update(() => ({
        user: session.user,
        isAuthenticated: true,
        isAdmin: true,
        loading: false,
        error: null
      }));
    } catch (error) {
      localStorage.removeItem('admin_session');
    }
  }
}

// Save with timestamp
localStorage.setItem('admin_session', JSON.stringify({ 
  user, 
  timestamp: Date.now() 
}));
```

---

## 🛡️ Firebase Security Rules (MUST CONFIGURE!)

### Current Rules (Too Open!)
```json
{
  "rules": {
    ".read": true,
    ".write": true  // ❌ ANYONE CAN WRITE!
  }
}
```

### ✅ Secure Rules (Use This!)
```json
{
  "rules": {
    "monitoring_logs": {
      ".read": true,  // Public can read dashboard
      ".write": false,  // Only ESP32 with service account
      ".indexOn": ["timestamp", "room_id", "uid", "status"]
    },
    "professors": {
      ".read": true,  // Public can see professor list
      ".write": "root.child('admins').child($uid).exists()",  // Only admins
      "$uid": {
        ".validate": "newData.hasChildren(['name', 'department', 'status', 'registered_at'])"
      }
    },
    "admins": {
      ".read": "root.child('admins').child(auth.uid).exists()",  // Only admins
      ".write": "root.child('admins').child(auth.uid).exists()",  // Only admins
      "$uid": {
        ".validate": "newData.hasChildren(['email', 'password', 'role'])"
      }
    }
  }
}
```

**How to Apply:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `faculty-monitoring-e00b7`
3. Realtime Database → Rules
4. Paste the secure rules above
5. Click **Publish**

---

## 🔐 Additional Security Measures

### 5. **Input Validation & Sanitization**
```javascript
// Prevent XSS attacks
function sanitizeInput(input) {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate UID format
function validateUID(uid) {
  const uidRegex = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
  return uidRegex.test(uid);
}

// Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### 6. **HTTPS Only (Production)**
```javascript
// vite.config.js
export default {
  server: {
    https: true  // Force HTTPS in production
  }
}
```

### 7. **Content Security Policy (CSP)**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;">
```

### 8. **Prevent Clickjacking**
```html
<!-- index.html -->
<meta http-equiv="X-Frame-Options" content="DENY">
```

### 9. **SQL Injection Prevention**
✅ Already safe! Firebase Realtime Database is NoSQL and doesn't use SQL queries.

### 10. **CORS Configuration**
```javascript
// Firebase Hosting (firebase.json)
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "https://yourdomain.com"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

---

## 📋 Pre-Deployment Checklist

### Before Going Live:

- [ ] **Hash all passwords** (use bcrypt)
- [ ] **Move API keys to .env** (add .env to .gitignore)
- [ ] **Configure Firebase Security Rules** (restrict write access)
- [ ] **Add rate limiting** (prevent brute force)
- [ ] **Add session timeout** (8 hours max)
- [ ] **Enable HTTPS only** (no HTTP)
- [ ] **Add input validation** (prevent XSS/injection)
- [ ] **Add CSP headers** (prevent XSS)
- [ ] **Test all security rules** (try to bypass as attacker)
- [ ] **Remove console.log** (no sensitive data in logs)
- [ ] **Add error logging** (monitor attacks)
- [ ] **Backup database** (before deployment)
- [ ] **Test on staging first** (not production)

---

## 🚀 Deployment Steps (Secure)

### 1. **Build for Production**
```bash
npm run build
```

### 2. **Deploy to Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 3. **Configure Custom Domain (Optional)**
```bash
firebase hosting:channel:deploy production
```

### 4. **Monitor Security**
- Firebase Console → Analytics
- Check for unusual activity
- Monitor failed login attempts
- Review database access logs

---

## 🔍 Testing Security

### Test as Attacker:
1. **Try SQL Injection:** `admin' OR '1'='1` (should fail)
2. **Try XSS:** `<script>alert('XSS')</script>` (should be sanitized)
3. **Try Brute Force:** Multiple wrong passwords (should be rate limited)
4. **Try Direct Database Access:** Without authentication (should be blocked)
5. **Try Session Hijacking:** Copy session token (should expire)

---

## 📞 Security Incident Response

If compromised:
1. **Immediately revoke all admin sessions**
2. **Change all passwords**
3. **Review Firebase logs** for unauthorized access
4. **Update security rules** to block attacker
5. **Notify users** if data was accessed
6. **Restore from backup** if needed

---

## 🎯 Summary

**Current Security Level:** 🔴 **UNSAFE FOR PRODUCTION**

**Issues:**
- ❌ Plain text passwords
- ❌ Exposed API keys
- ❌ No rate limiting
- ❌ No session timeout
- ❌ Weak Firebase rules

**After Fixes:** 🟢 **PRODUCTION READY**

**Estimated Time to Secure:** 2-3 hours

---

**IMPORTANT:** Do NOT deploy to production until all HIGH PRIORITY issues are fixed!
