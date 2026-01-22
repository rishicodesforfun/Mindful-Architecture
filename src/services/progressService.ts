/**
 * Progress Service Interface
 * 
 * Defines how user progress is read and written, now with granular tracking.
 * 
 * Current implementation: IndexedDB (localProgressService)
 * Future implementation: Supabase (when ready)
 */

import type { UserState } from '../../context/UserContext';

/**
 * UserProgress represents the persisted user data.
 * This matches UserState but with serialization-friendly types.
 */
export interface UserProgress {
    // Primary key for storage
    userKey: string;

    // User info
    name: string;
    persona: 'arjun' | 'meera' | 'rohan' | null;
    avatar: 'avatar1' | 'avatar2' | 'avatar3' | 'avatar4' | 'avatar5' | 'avatar6';

    // Program settings
    selectedTheme: 'anxiety' | 'focus' | 'emotional' | 'sleep' | 'confidence' | 'lifestyle' | null;
    routineTime: 'morning' | 'midday' | 'night' | 'flexible';
    currentDay: number;
    programStartDate: string | null; // ISO string for serialization

    // Progress tracking (Legacy/Summary)
    moodHistory: Array<{
        day: number;
        mood: 1 | 2 | 3 | 4 | 5;
        emotion?: string;
        timestamp: string; // ISO string
    }>;
    reflections: Array<{
        day: number;
        mood?: string;
        journal: string;
        date: string;
    }>;
    sessionCompletions: Array<{
        day: number;
        meditation: boolean;
        reflection: boolean;
        task: boolean;
        moodCheckin: boolean;
        timestamp: string; // ISO string
    }>;
    streak: number;

    // Features
    pauseTokens: number;
    isPaused: boolean;
    pauseExpiresAt: string | null; // ISO string
    nightMode: boolean;
    shortSessionMode: boolean;

    // Subscription
    subscriptionStatus: 'free' | 'premium';

    // Favorites
    favoriteDays: number[];

    // Onboarding
    hasCompletedOnboarding: boolean;

    // Metadata
    lastUpdated: string; // ISO string
    version: number; // For future migrations

    // Audio & Gamification (New in v2)
    soundPreference?: 'nature' | 'ambient' | 'voice' | 'silent';
    unlockedAchievements?: string[];
}

// NEW: Granular Types for Dynamic Tracking
export interface ActivityLog {
    id: string;              // UUID
    userId: string;
    type: 'meditation' | 'task' | 'reflection' | 'mood';
    day: number;
    durationSeconds: number; // Actual time spent
    completedAt: string;     // ISO Timestamp
    metadata?: any;          // Flexible extra data
}

export interface JournalEntry {
    id: string;
    userId: string;
    day: number;
    prompt: string;
    response: string;
    tags: string[];
    moodSnapshot: number;
    createdAt: string;
}

export interface UserSettings {
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

/**
 * ProgressService Interface
 * 
 * This contract is storage-agnostic. Implementations can use:
 * - IndexedDB (current: localProgressService)
 * - Supabase (future)
 */
export interface ProgressService {
    /**
     * Get stored progress for a user (Main Profile)
     */
    getProgress(userKey: string): Promise<UserProgress | null>;

    /**
     * Save user progress (Main Profile)
     */
    saveProgress(progress: UserProgress): Promise<void>;

    /**
     * Log a specific activity (Granular)
     */
    logActivity(log: Omit<ActivityLog, 'id'>): Promise<void>;

    /**
     * Save a journal entry (Granular)
     */
    saveJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<void>;

    /**
     * Update user settings (Granular)
     */
    updateSettings(settings: UserSettings): Promise<void>;

    /**
     * Clear progress for a user
     */
    clearProgress(userKey: string): Promise<void>;

    /**
     * List all stored user keys (for debugging/admin)
     */
    listUsers(): Promise<string[]>;

    /**
     * Check if service is ready
     */
    isReady(): boolean;
}

/**
 * Convert UserState to UserProgress (for storage)
 */
export function userStateToProgress(state: UserState, userKey: string): UserProgress {
    return {
        userKey,
        name: state.name,
        persona: state.persona,
        avatar: state.avatar,
        selectedTheme: state.selectedTheme,
        routineTime: state.routineTime,
        currentDay: state.currentDay,
        programStartDate: state.programStartDate?.toISOString() ?? null,
        moodHistory: state.moodHistory.map(m => ({
            ...m,
            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp as string,
        })),
        reflections: state.reflections,
        sessionCompletions: state.sessionCompletions.map(s => ({
            ...s,
            timestamp: s.timestamp instanceof Date ? s.timestamp.toISOString() : s.timestamp as string,
        })),
        streak: state.streak,
        pauseTokens: state.pauseTokens,
        isPaused: state.isPaused,
        pauseExpiresAt: state.pauseExpiresAt?.toISOString() ?? null,
        nightMode: state.nightMode,
        shortSessionMode: state.shortSessionMode,
        subscriptionStatus: state.subscriptionStatus,
        favoriteDays: state.favoriteDays,
        hasCompletedOnboarding: state.hasCompletedOnboarding,

        // New features
        soundPreference: state.soundPreference,
        unlockedAchievements: state.unlockedAchievements,

        lastUpdated: new Date().toISOString(),
        version: 2, // Bumped version
    };
}

/**
 * Convert UserProgress to UserState (for app use)
 */
export function progressToUserState(progress: UserProgress): UserState {
    return {
        name: progress.name,
        persona: progress.persona,
        avatar: progress.avatar,
        selectedTheme: progress.selectedTheme,
        routineTime: progress.routineTime,
        currentDay: progress.currentDay,
        programStartDate: progress.programStartDate ? new Date(progress.programStartDate) : null,
        moodHistory: progress.moodHistory.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
        })),
        reflections: progress.reflections,
        sessionCompletions: progress.sessionCompletions.map(s => ({
            ...s,
            timestamp: new Date(s.timestamp),
        })),
        streak: progress.streak,
        pauseTokens: progress.pauseTokens,
        isPaused: progress.isPaused,
        pauseExpiresAt: progress.pauseExpiresAt ? new Date(progress.pauseExpiresAt) : null,
        nightMode: progress.nightMode,
        shortSessionMode: progress.shortSessionMode,
        subscriptionStatus: progress.subscriptionStatus || 'free',
        favoriteDays: progress.favoriteDays,
        hasCompletedOnboarding: progress.hasCompletedOnboarding,

        // New features with defaults for migration
        soundPreference: progress.soundPreference || 'nature',
        unlockedAchievements: progress.unlockedAchievements || [],
    };
}
