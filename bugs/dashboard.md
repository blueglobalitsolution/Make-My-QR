# User Dashboard & Admin Dashboard Bugs & Errors

This document analyzes all bugs and issues found in the User Dashboard (MyCodes) and Admin Dashboard.

---

## User Dashboard Bugs (MyCodes)

### 1. Missing Folder Count Synchronization
**Severity:** HIGH | **Location:** `Frontend/src/components/app/MyCodes.tsx:182-192`

**Issue:** Folder counts are calculated on render, not synced with actual QR counts.

```typescript
// Current: Calculated every render
<span>All ({history.length})</span>
<span>General ({history.filter(c => !folders.some(f => f.id === c.folderId)).length})</span>
```

**Problem:** If a QR is deleted, counts won't update until page refresh.

**Fix:** Use cached counts:
```typescript
const folderCounts = useMemo(() => {
    const counts = { all: history.length, general: 0 };
    history.forEach(c => {
        if (c.folderId && folders.some(f => f.id === c.folderId)) {
            counts[c.folderId] = (counts[c.folderId] || 0) + 1;
        } else {
            counts.general++;
        }
    });
    return counts;
}, [history, folders]);
```

---

### 2. Download Uses Wrong Timeout Value
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/MyCodes.tsx:58-62`

**Issue:** Toast auto-dismiss has incorrect syntax.

```typescript
// Current: Missing semicolon causes potential issues
if (toast) {
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
}
```

**Fix:**
```typescript
if (toast) {
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
}
```

---

### 3. No Error Boundary Around QR Rendering
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/MyCodes.tsx:113-125`

**Issue:** If QR code generation fails, entire component crashes.

**Fix:** Add error boundary:
```typescript
const CodeThumbnail = React.memo(({ code }: { code: GeneratedCode }) => {
    try {
        const options = React.useMemo(() => getQROptions(code, 300), [code]);
        // ... render
    } catch (error) {
        return <div>QR Error</div>;
    }
});
```

---

### 4. Search Not Debounced
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/MyCodes.tsx:150-156`

**Issue:** Search triggers on every keystroke, causing unnecessary re-renders.

```typescript
// Current: No debounce
onChange={(e) => setSearchQuery(e.target.value)}
```

**Fix:** Add debounce:
```typescript
const [searchQuery, setSearchQuery] = useState('');

const debouncedSearch = useMemo(() => 
    debounce(setSearchQuery, 300), 
[]);

onChange={(e) => debouncedSearch(e.target.value)}
```

---

### 5. Preview Code Not Cleared on Unmount
**Severity:** LOW | **Location:** `Frontend/src/components/app/MyCodes.tsx:55`

**Issue:** `previewCode` state not cleared when component unmounts.

```typescript
const [previewCode, setPreviewCode] = useState<GeneratedCode | null>(null);

// Should cleanup
useEffect(() => {
    return () => setPreviewCode(null);
}, []);
```

---

### 6. Folder Scroll Position Not Persisted
**Severity:** LOW | **Location:** `Frontend/src/components/app/MyCodes.tsx:127-135`

**Issue:** Scroll position resets on re-render.

**Fix:** Persist scroll position:
```typescript
const [folderScrollLeft, setFolderScrollLeft] = useState(0);

useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = folderScrollLeft;
    }
}, [folderScrollLeft]);
```

---

## Admin Dashboard Bugs

### 7. Permission Check Uses Wrong Class
**Severity:** CRITICAL | **Location:** `Backend/QRmaker/users/views.py:505-507`

**Issue:** Uses `IsAuthenticated` instead of `IsAdminUser`.

```python
# Current: Wrong permission class
permission_classes = [IsAuthenticated]  # Any logged-in user can access!

# Should be:
from rest_framework import permissions
permission_classes = [permissions.IsAdminUser]
```

---

### 8. No Pagination in Users List
**Severity:** HIGH | **Location:** `Backend/QRmaker/users/views.py:516-534`

**Issue:** Loading all users at once - performance issue with many users.

```python
# Current: Loads all users
users = User.objects.all().order_by("-date_joined")
```

**Fix:** Add pagination:
```python
page = int(request.query_params.get('page', 1))
page_size = 50
offset = (page - 1) * page_size

users = User.objects.all().order_by("-date_joined")[offset:offset+page_size]
total_count = User.objects.count()

return Response({
    "data": data,
    "total": total_count,
    "page": page,
    "total_pages": (total_count + page_size - 1) // page_size
})
```

---

### 9. N+1 Query Problem in Admin Users List
**Severity:** HIGH | **Location:** `Backend/QRmaker/users/views.py:518-533`

**Issue:** Separate query for each user's subscription and QR count.

```python
# Current: N+1 queries
for user in users:
    sub = UserSubscription.objects.filter(user=user).first()  # Query per user!
    qr_count = QRCode.objects.filter(user=user).count()  # Another query!
```

**Fix:** Use select_related and annotate:
```python
from django.db.models import Count

users = User.objects.annotate(
    qr_count=Count('qrcodes')
).select_related(
    'subscription__plan'
).order_by("-date_joined")
```

---

### 10. Plan Delete Doesn't Check Usage
**Severity:** HIGH | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:93-109`

**Issue:** Can delete plan even if users are on it.

```typescript
// Current: Allow delete without warning
onConfirm: async () => {
    await deleteAdminPlan(id);
    // No check if users exist on this plan!
}
```

**Fix:** Add usage check:
```typescript
const handleDeletePlan = async (id: number) => {
    const planUsers = users.filter(u => u.plan_id === id);
    if (planUsers.length > 0) {
        alert(`Cannot delete - ${planUsers.length} users on this plan!`);
        return;
    }
    // Proceed with delete
};
```

---

### 11. Stats Has Division by Zero
**Severity:** MEDIUM | **Location:** `Backend/QRmaker/payments/views.py:164-166`

**Issue:** Division by zero if no trial users.

```python
# Current: Can cause ZeroDivisionError
conversion_rate = (ever_paid_users_count / total_trial_users_count) * 100
```

**Fix:** Add check:
```python
if total_trial_users_count > 0:
    conversion_rate = (ever_paid_users_count / total_trial_users_count) * 100
else:
    conversion_rate = 0
```

---

### 12. No Loading State for Plan Actions
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:75-91`

**Issue:** No feedback when saving plan.

```typescript
const handleSavePlan = async () => {
    try {
        // No loading state!
        await updateAdminPlan(...) || createAdminPlan(...);
    } catch (err) {
        alert("Error saving plan");
    }
};
```

**Fix:** Add loading state:
```typescript
const [savingPlan, setSavingPlan] = useState(false);

const handleSavePlan = async () => {
    setSavingPlan(true);
    try {
        // ... save
    } finally {
        setSavingPlan(false);
    }
};
```

---

### 13. Webhook Doesn't Verify Payment
**Severity:** HIGH | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:600-608`

**Issue:** Expires soon warning uses wrong condition.

```typescript
// Current: Wrong date comparison
new Date(sub.expiry_date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
// Should be positive check
```

**Fix:**
```typescript
const daysUntilExpiry = sub.expiry_date 
    ? Math.ceil((new Date(sub.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    : null;

<span className={daysUntilExpiry && daysUntilExpiry < 7 ? 'text-red-500' : ''}>
    {daysUntilExpiry} days remaining
</span>
```

---

### 14. Duplicate Plan Name Allowed
**Severity:** HIGH | **Location:** N/A - Database

**Issue:** Can create multiple plans with same name.

**Fix:** Add unique constraint in model (mentioned in subscription.md).

---

### 15. No Search/Filter in Users Table
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:632-675`

**Issue:** Users table has no search functionality.

**Fix:** Add search:
```typescript
const [userSearch, setUserSearch] = useState('');

const filteredUsers = users.filter(u => 
    userSearch === '' || 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
);
```

---

### 16. No Bulk Actions for Users
**Severity:** LOW | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:647-675`

**Issue:** Can only manage one user at a time.

**Fix:** Add bulk actions:
```typescript
const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

const handleBulkAction = async (action: string) => {
    for (const userId of selectedUsers) {
        await manageAdminUser(userId, action as any);
    }
};
```

---

### 17. Actions Column Does Nothing
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:610-614`

**Issue:** Arrow button in subscriptions table has no action.

```typescript
// Current: Button does nothing
<button className="p-2 ...">
    <ArrowRight className="w-4 h-4" />
</button>
```

**Fix:** Add click handler:
```typescript
<button 
    onClick={() => viewSubscriptionDetails(sub)}
    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
>
    <ArrowRight className="w-4 h-4" />
</button>
```

---

### 18. Plan Features Array Not Validated
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:75-91`

**Issue:** Features array can be any array, no validation.

```typescript
// Current: No validation
features: [] as string[],

// Should validate
features: Array.isArray(planForm.features) ? planForm.features : [],
```

---

### 19. No Confirmation for User Toggle Active
**Severity:** MEDIUM | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:131-137`

**Issue:** Toggling user active without confirmation.

```typescript
// Current: No confirmation
await manageAdminUser(userId, action);
```

**Fix:** Add confirmation modal:
```typescript
if (action === 'toggle_active') {
    setConfirmModal({
        isOpen: true,
        title: 'Toggle User Status?',
        message: 'Are you sure you want to change this user\'s status?',
        onConfirm: async () => {
            // toggle
        }
    });
}
```

---

### 20. Admin Dashboard Mobile Navigation Broken
**Severity:** LOW | **Location:** `Frontend/src/components/app/AdminDashboard.tsx:192-217`

**Issue:** Navigation not scrollable on mobile.

```typescript
// Current: hidden md:flex
<nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
```

**Fix:** Add mobile navigation:
```typescript
<nav className="flex md:flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto">
```

---

## Summary Table

| # | Bug | Severity | Not Fixed |
|---|-----|----------|----------|
| 1 | Folder count not synced | HIGH | ✓ |
| 2 | Toast syntax error | MEDIUM | ✓ |
| 3 | No QR error boundary | MEDIUM | ✓ |
| 4 | Search not debounced | MEDIUM | ✓ |
| 5 | Preview not cleared | LOW | ✓ |
| 6 | Scroll not persisted | LOW | �� |
| 7 | Wrong permission class | CRITICAL | ✓ |
| 8 | No pagination | HIGH | ✓ |
| 9 | N+1 queries | HIGH | ✓ |
| 10 | Plan delete no check | HIGH | ✓ |
| 11 | Division by zero | MEDIUM | ✓ |
| 12 | No loading state | MEDIUM | ✓ |
| 13 | Expiry check wrong | MEDIUM | ✓ |
| 14 | Duplicate names | HIGH | ✓ |
| 15 | No user search | MEDIUM | ✓ |
| 16 | No bulk actions | LOW | ✓ |
| 17 | Arrow does nothing | MEDIUM | ✓ |
| 18 | No feature validation | MEDIUM | ✓ |
| 19 | No toggle confirm | MEDIUM | ✓ |
| 20 | Mobile nav broken | LOW | ✓ |

---

## Recommended Priority

1. **Immediate (Critical):** Permission class fix, N+1 queries
2. **This Sprint (High):** Pagination, plan delete check, folder counts
3. **Next Sprint (Medium):** Debounce search, loading states, expiry check
4. **Backlog:** Mobile nav, bulk actions, error boundaries