# Local Data Architecture

This document explains the offline-first data persistence layer used in Mindful Architecture.

## Overview

The app uses **IndexedDB** for local data persistence, abstracted behind a service interface that can be swapped for cloud storage (e.g., Supabase) in the future without changing UI code.

## Why IndexedDB?

| Feature | localStorage | IndexedDB |
|---------|-------------|-----------|
| Storage Limit | ~5MB | 50MB+ (browser-dependent) |
| Data Types | Strings only | Any serializable type |
| Async API | No | Yes |
| Transactions | No | Yes |
| Indexes | No | Yes |
| Large Data | Poor | Excellent |

**IndexedDB is chosen because:**
- ✅ Much larger storage limits
- ✅ Native browser API (no external dependencies except `idb` wrapper)
- ✅ Supports complex data structures
- ✅ Transaction support for data integrity
- ✅ Works offline

## Architecture

```
┌──────────────────────────────────────────────────┐
│                    UI Layer                       │
│  (React Components, Pages, Context)              │
└─────────────────────┬────────────────────────────┘
                      │ uses
                      ▼
┌──────────────────────────────────────────────────┐
│              UserContext.tsx                      │
│  - Manages React state                           │
│  - Calls progressService for persistence         │
│  - Debounced auto-save                           │
└─────────────────────┬────────────────────────────┘
                      │ imports from
                      ▼
┌──────────────────────────────────────────────────┐
│         src/services/index.ts                     │
│  Service Selector (single point of change)       │
│  export const progressService = localProgressService;
└─────────────────────┬────────────────────────────┘
                      │ currently uses
                      ▼
┌──────────────────────────────────────────────────┐
│    src/services/localProgressService.ts          │
│  IndexedDB Implementation                        │
│  - Database: mindful-architecture-db             │
│  - Store: progress                               │
│  - Primary Key: userKey (user name)              │
└──────────────────────────────────────────────────┘
```

## Files Involved

### Service Layer

| File | Purpose |
|------|---------|
| `src/services/progressService.ts` | Interface definition & types |
| `src/services/localProgressService.ts` | IndexedDB implementation |
| `src/services/index.ts` | Service selector (swap point) |

### Integration

| File | Changes |
|------|---------|
| `context/UserContext.tsx` | Uses progressService instead of localStorage |
| `pages/ProfilePage.tsx` | Uses LogoutModal for logout options |
| `components/LogoutModal.tsx` | Logout confirmation UI |

## Data Storage

### Database Structure

```
Database: mindful-architecture-db (version 1)
└── Object Store: progress
    ├── Primary Key: userKey (string)
    └── Indexes:
        ├── by-name: name
        └── by-updated: lastUpdated
```

### UserProgress Schema

```typescript
interface UserProgress {
  userKey: string;        // Primary key
  name: string;
  persona: 'arjun' | 'meera' | 'rohan' | null;
  avatar: AvatarId;
  selectedTheme: ProgramTheme | null;
  routineTime: RoutineTime;
  currentDay: number;
  programStartDate: string | null;  // ISO string
  moodHistory: MoodEntry[];
  reflections: ReflectionEntry[];
  sessionCompletions: SessionCompletion[];
  streak: number;
  pauseTokens: number;
  isPaused: boolean;
  pauseExpiresAt: string | null;    // ISO string
  nightMode: boolean;
  shortSessionMode: boolean;
  favoriteDays: number[];
  hasCompletedOnboarding: boolean;
  lastUpdated: string;              // ISO string
  version: number;                   // For migrations
}
```

## How Data Flows

### On App Load
1. `UserProvider` mounts
2. Checks for legacy localStorage data → migrates if found
3. Loads most recent user from IndexedDB
4. Sets React state

### On User Action
1. React state updates via `setUser()`
2. `useEffect` detects change
3. Debounced save (300ms) to prevent excessive writes
4. `progressService.saveProgress()` called
5. Data persisted to IndexedDB

### On Logout
1. User clicks "Sign Out"
2. `LogoutModal` appears with options:
   - **Keep Progress**: Clears React state, IndexedDB data remains
   - **Clear Progress**: Clears both React state and IndexedDB

## Swapping to Supabase

When ready for cloud storage:

### 1. Create Supabase Implementation

```typescript
// src/services/supabaseProgressService.ts
import { supabase } from '../lib/supabase';
import type { ProgressService, UserProgress } from './progressService';

class SupabaseProgressService implements ProgressService {
  async getProgress(userKey: string): Promise<UserProgress | null> {
    const { data } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', supabase.auth.user()?.id)
      .single();
    return data;
  }
  
  async saveProgress(progress: UserProgress): Promise<void> {
    await supabase.from('progress').upsert({
      user_id: supabase.auth.user()?.id,
      ...progress,
    });
  }
  
  async clearProgress(userKey: string): Promise<void> {
    await supabase
      .from('progress')
      .delete()
      .eq('user_id', supabase.auth.user()?.id);
  }
  
  async listUsers(): Promise<string[]> {
    return []; // Not applicable for single-user auth
  }
  
  isReady(): boolean {
    return !!supabase.auth.user();
  }
}

export const supabaseProgressService = new SupabaseProgressService();
```

### 2. Update Service Selector

```typescript
// src/services/index.ts
import { localProgressService } from './localProgressService';
import { supabaseProgressService } from './supabaseProgressService';

// Environment-based switching
export const progressService = import.meta.env.VITE_USE_SUPABASE
  ? supabaseProgressService
  : localProgressService;

// Or auth-based switching
export const progressService = supabase.auth.user() 
  ? supabaseProgressService 
  : localProgressService;
```

### 3. No UI Changes Needed

The `UserContext` and all components use the `ProgressService` interface, so they work unchanged with any implementation.

## Error Handling

### Graceful Degradation

- If IndexedDB fails to open → app still works (no persistence)
- If save fails → logged to console, app continues
- If load fails → returns null, starts fresh
- If corrupted data → caught and returns default state

### Console Logging

All service operations log to console with `[LocalProgressService]` prefix:
- Success operations
- Warnings
- Errors with full stack traces

## Migration

### From localStorage (Automatic)

The app automatically migrates from the legacy `mindful_architecture_user` localStorage key:

1. On first load, checks for localStorage data
2. If found, parses and converts to UserProgress
3. Saves to IndexedDB
4. Deletes localStorage entry
5. Continues with IndexedDB from then on

### Future Database Migrations

The `UserProgress.version` field tracks schema version. Future migrations can:

1. Check version on load
2. Transform data to new schema
3. Update version number
4. Save migrated data

## Security Notes

- All data is stored locally on the user's device
- No data is transmitted over the network (currently)
- No authentication required
- IndexedDB follows same-origin policy

## Testing

### Manual Testing

1. Enter a name and complete some sessions
2. Refresh the page → progress should persist
3. Sign out with "Keep Progress"
4. Enter the same name → progress should restore
5. Sign out with "Clear Progress"
6. Enter the same name → should start fresh

### Debug Commands (Browser Console)

```javascript
// List all stored users
(await progressService.listUsers())

// Get specific user's progress
(await progressService.getProgress('UserName'))

// View all progress (debug)
(await localProgressService.getAllProgress())

// Clear all IndexedDB data (caution!)
indexedDB.deleteDatabase('mindful-architecture-db')
```

## Dependencies

- `idb` (^8.0.0) - Promise-based IndexedDB wrapper
  - Lightweight (~1KB gzipped)
  - TypeScript support
  - Browser-native (no polyfills needed for modern browsers)

## Browser Support

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- iOS Safari 10+
- Android Browser 4.4+

---

*Last updated: January 2026*
