# Data Persistence Plan: "Literally Everything"

To achieve your goal of storing **absolutely everything** dynamically as the user progresses, we need to move beyond simple "checkbox" tracking.

Based on your `curriculum.ts` (which has rich data like techniques, varying durations, and specific tasks), here is the database structure required to capture the full user journey.

## 1. Current vs. Ideal Architecture

| Feature | Current Storage (`UserProgress`) | Ideal Dynamic Storage |
|---------|----------------------------------|-----------------------|
| **Meditation** | `boolean` (Done/Not Done) | **`activity_logs`**: Actual duration, timestamp, specific technique practiced. |
| **Journaling** | `reflections` array (Big List) | **`journal_entries`**: Separate table, easier to search/filter by theme. |
| **Daily Tasks** | `boolean` (Done/Not Done) | **`task_completions`**: User notes, verified completion, time spent. |
| **Settings** | Mixed in user profile | **`user_settings`**: Granular preferences (notifications, accessibility). |
| **Analytics** | Calculated on fly | **`stats_snapshots`**: Weekly/Monthly summaries stored permanently. |

## 2. Recommended Database Schema (IndexedDB + Supabase Compatible)

To make everything dynamic, we should add these specific object stores (tables):

### A. `activity_logs` (The "Black Box" Recorder)
Records every meaningful interaction.
```typescript
interface ActivityLog {
  id: string;              // UUID
  userId: string;
  type: 'meditation' | 'task' | 'reflection' | 'mood';
  day: number;
  durationSeconds: number; // Actual time spent (e.g. 300s)
  completedAt: string;     // ISO Timestamp
  metadata: {              // Dynamic extra data
    technique?: string;    // e.g. "body scan"
    difficulty?: 'easy' | 'hard';
    skipped?: boolean;
  };
}
```

### B. `journal_entries` (Rich Text History)
Stores user reflections separate from the main profile to allow for long history without bloating the user object.
```typescript
interface JournalEntry {
  id: string;
  userId: string;
  day: number;
  prompt: string;         // "What triggers impatience?"
  response: string;       // User's full text
  tags: string[];         // e.g. ["patience", "block-1"]
  moodSnapshot: number;   // Mood during writing
  createdAt: string;
}
```

### C. `user_settings` (Dynamic Preferences)
Allows adding new settings without breaking the user schema.
```typescript
interface UserSettings {
  userId: string;
  theme: 'system' | 'light' | 'dark';
  notifications: {
    reminderTime: string;
    enabled: boolean;
  };
  audioPreferences: {
    backgroundVolume: number;
    voiceVolume: number;
  };
}
```

## 3. Implementation Plan

To get there from our current state, we need to:

1.  **Update `db.ts`** to include these new stores (`activity_logs`, `journal_entries`).
2.  **Update `progressService.ts`** to separate high-volume data (logs/journals) from the main `UserProgress` object.
3.  **Refactor `UserContext`** to write to these new specific tables instead of just updating the big user object.

### Is our program structured like this now?
**Partially.**
- ✅ We **do** capture the core data (completion, basic mood, basic journal).
- ❌ We **do not** yet capture "meta" data like: *How long did they actually meditate?* (We just assume the full duration).
- ❌ We **do not** separate high-volume data (logs), which will make the app slower after 6 months of usage.

**Recommendation:** Proceed with creating the `activity_logs` store first. This gives you the highest value "dynamic" tracking immediately.
