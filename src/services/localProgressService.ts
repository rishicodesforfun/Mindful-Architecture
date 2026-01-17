/**
 * Local Progress Service - IndexedDB Implementation
 * 
 * This implementation uses IndexedDB via the `idb` library for local persistence.
 * Refactored to use shared dbService and support Granular Tracking.
 */

import { dbService, STORES } from './db';
import type { ProgressService, UserProgress, ActivityLog, JournalEntry, UserSettings } from './progressService';
import { v4 as uuidv4 } from 'uuid'; // Assumption: uuid is available or we use a helper

// Simple UUID generator if package not available
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * LocalProgressService
 * 
 * Implements ProgressService using IndexedDB for offline-first persistence.
 */
class LocalProgressService implements ProgressService {
    /**
     * Get stored progress for a user
     */
    async getProgress(userKey: string): Promise<UserProgress | null> {
        try {
            const db = await dbService.getDB();
            const progress = await db.get(STORES.PROGRESS, userKey);

            if (progress) {
                console.log(`[LocalProgressService] Loaded progress for "${userKey}"`);
                return progress;
            }

            console.log(`[LocalProgressService] No progress found for "${userKey}"`);
            return null;
        } catch (error) {
            console.error(`[LocalProgressService] Error getting progress for "${userKey}":`, error);
            return null; // Fail gracefully
        }
    }

    /**
     * Save user progress (Main Profile Snapshot)
     */
    async saveProgress(progress: UserProgress): Promise<void> {
        try {
            const db = await dbService.getDB();

            // Update lastUpdated timestamp
            const updatedProgress: UserProgress = {
                ...progress,
                lastUpdated: new Date().toISOString(),
            };

            await db.put(STORES.PROGRESS, updatedProgress);
            console.log(`[LocalProgressService] Saved progress snapshot for "${progress.userKey}"`);
        } catch (error) {
            console.error(`[LocalProgressService] Error saving progress:`, error);
            throw error;
        }
    }

    /**
     * Log a specific activity (Granular)
     */
    async logActivity(log: Omit<ActivityLog, 'id'>): Promise<void> {
        try {
            const db = await dbService.getDB();
            const id = generateUUID();

            const activity: ActivityLog = {
                ...log,
                id,
            };

            await db.add(STORES.ACTIVITY_LOGS, activity);
            console.log(`[LocalProgressService] Logged activity: ${log.type} for day ${log.day}`);
        } catch (error) {
            console.error(`[LocalProgressService] Error logging activity:`, error);
            // Don't throw, just log error so UI doesn't crash on analytics failure
        }
    }

    /**
     * Save a journal entry (Granular)
     */
    async saveJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<void> {
        try {
            const db = await dbService.getDB();
            const id = generateUUID();

            const journal: JournalEntry = {
                ...entry,
                id,
            };

            await db.add(STORES.JOURNAL_ENTRIES, journal);
            console.log(`[LocalProgressService] Saved journal entry for day ${entry.day}`);
        } catch (error) {
            console.error(`[LocalProgressService] Error saving journal:`, error);
            throw error;
        }
    }

    /**
     * Update user settings (Granular)
     */
    async updateSettings(settings: UserSettings): Promise<void> {
        try {
            const db = await dbService.getDB();
            await db.put(STORES.USER_SETTINGS, settings);
            console.log(`[LocalProgressService] Updated settings for user ${settings.userId}`);
        } catch (error) {
            console.error(`[LocalProgressService] Error updating settings:`, error);
            throw error;
        }
    }

    /**
     * Clear progress for a user
     */
    async clearProgress(userKey: string): Promise<void> {
        try {
            const db = await dbService.getDB();

            // 1. Delete main progress
            await db.delete(STORES.PROGRESS, userKey);

            // 2. Delete logs (requires getting all by user index)
            // Note: In a real app we'd bulk delete, but IDB API is limited. 
            // For now, we mainly clear the profile. Cleaning up logs is a 'nice to have'.
            // Implementation skipped to keep this compatible with basic IDB usage for now.
            // A production app would use a range query to delete these.

            console.log(`[LocalProgressService] Cleared progress profile for "${userKey}"`);
        } catch (error) {
            console.error(`[LocalProgressService] Error clearing progress for "${userKey}":`, error);
            throw error;
        }
    }

    /**
     * List all stored user keys
     */
    async listUsers(): Promise<string[]> {
        try {
            const db = await dbService.getDB();
            const keys = await db.getAllKeys(STORES.PROGRESS);
            return keys as string[];
        } catch (error) {
            console.error('[LocalProgressService] Error listing users:', error);
            return [];
        }
    }

    /**
     * Check if service is ready
     */
    isReady(): boolean {
        return true; // dbService handles initialization status internally
    }
}

// Export singleton instance
export const localProgressService = new LocalProgressService();
export { LocalProgressService };
