# Auth System Bugs Report

## Overview
This document outlines identified bugs and inconsistencies in the authentication system of the Make-My-QR application.

## Bugs Identified

### 1. Inconsistent User Data Storage in Login Function
**File:** `Frontend/src/api/auth.ts`
**Issue:** The `login` function does not store user data in localStorage, only the token and login time.
**Location:** Lines 3-10
**Problem:** 
```typescript
export const login = async (username, password) => {
    const response = await apiClient.post('/users/login/', { username, password });
    if (response.data.token) {
        localStorage.setItem('makemyqr_token', response.data.token);
        localStorage.setItem('makemyqr_login_time', Date.now().toString());
    }
    return response.data;
};
```
**Impact:** If the login function is used directly (bypassing the useAuth hook), the user data (`makemyqr_user`) will not be stored in localStorage, leading to inconsistent state where the token exists but user data is missing.
**Expected Fix:** The login function should also store user data in localStorage, or documentation should clearly state that the login function must be used with additional logic to store user data.

### 2. Incorrect Redirect After Logout
**File:** `Frontend/src/hooks/useAuth.ts`
**Issue:** After logout, the user is redirected to the login page instead of the landing page.
**Location:** Line 198
**Problem:**
```typescript
const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('login');  // Should likely be 'landing' for better UX
};
```
**Impact:** Poor user experience - after logging out, users are shown the login page immediately instead of being given a choice to navigate to public content or log back in.
**Expected Fix:** Change `setView('login')` to `setView('landing')` to redirect users to the home/landing page after logout.

### 3. Missing Error Handling for User Data Parsing
**File:** `Frontend/src/hooks/useAuth.ts`
**Issue:** No error handling when parsing user data from localStorage in the useEffect that initializes account information.
**Location:** Lines 139-157 (useEffect that watches currentUser)
**Problem:** While not directly causing bugs in current code, if localStorage contains corrupted JSON for `makemyqr_user`, it could cause issues when the useAuth hook tries to process it.
**Impact:** Potential runtime errors if localStorage data becomes corrupted.
**Expected Fix:** Add try/catch around JSON.parse operations when reading from localStorage.

### 4. Inconsistent LocalStorage Key Usage
**Issue:** Different parts of the codebase reference different localStorage keys for similar purposes.
**Evidence from grep search:**
- `makemyqr_user` is used in multiple places (auth.ts, useAuth.ts, AdminLogin.tsx, QRViewer.tsx, client.ts)
- However, there was also a reference to `barqr_user` in QRViewer.tsx line: `const savedUser = localStorage.getItem('makemyqr_user') || localStorage.getItem('barqr_user');`
**Impact:** Legacy key `barqr_user` suggests there may have been a rebranding or inconsistent naming that could cause confusion.
**Expected Fix:** Remove references to `barqr_user` and standardize on `makemyqr_user` throughout the codebase.

## Recommendations

1. **Fix the login function** to either store user data or clearly document its limitations
2. **Change logout redirect** to go to landing page instead of login page
3. **Add error handling** for localStorage operations
4. **Clean up legacy references** to `barqr_user`
5. **Consider centralizing** localStorage operations in a utility function to prevent inconsistencies

## Files to Examine
- `Frontend/src/api/auth.ts`
- `Frontend/src/hooks/useAuth.ts`
- `Frontend/src/components/app/AdminLogin.tsx`
- `Frontend/src/components/app/QRViewer.tsx`
- `Frontend/src/api/client.ts`