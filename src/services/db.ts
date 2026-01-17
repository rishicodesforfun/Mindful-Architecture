/**
 * Shared Database Connection
 * 
 * Provides a singleton IndexedDB connection for the entire application.
 * Solves the issue of multiple services trying to open/upgrade the DB independently.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { UserProgress } from './progressService';
import type { LocalUser } from './userService';

// ============================================
// Combined Database Schema
// ============================================

// ============================================
// Combined Database Schema
// ============================================

export interface MindfulDB extends DBSchema {
    progress: {
        key: string;
        value: UserProgress;
        indexes: {
            'by-name': string;
            'by-updated': string;
        };
    };
    users: {
        key: string;
        value: LocalUser;
        indexes: {
            'by-username': string;
        };
    };
    // NEW: Granular tracking
    activity_logs: {
        key: string; // UUID
        value: {
            id: string;
            userId: string;
            type: 'meditation' | 'task' | 'reflection' | 'mood';
            day: number;
            durationSeconds: number;
            completedAt: string;
            metadata?: any;
        };
        indexes: {
            'by-user': string;
            'by-type': string;
        };
    };
    journal_entries: {
        key: string; // UUID
        value: {
            id: string;
            userId: string;
            day: number;
            prompt: string;
            response: string;
            tags: string[];
            moodSnapshot: number;
            createdAt: string;
        };
        indexes: {
            'by-user': string;
        };
    };
    user_settings: {
        key: string; // userId
        value: {
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
        };
    };
}

export const DB_NAME = 'mindful-architecture-db';
export const DB_VERSION = 5; // Bumped to 5
export const STORES = {
    PROGRESS: 'progress',
    USERS: 'users',
    ACTIVITY_LOGS: 'activity_logs',
    JOURNAL_ENTRIES: 'journal_entries',
    USER_SETTINGS: 'user_settings',
} as const;

class DatabaseService {
    private db: IDBPDatabase<MindfulDB> | null = null;
    private initPromise: Promise<IDBPDatabase<MindfulDB>> | null = null;

    /**
     * Get the database instance, initializing if necessary.
     * Guaranteed to return a ready-to-use DB connection.
     */
    async getDB(): Promise<IDBPDatabase<MindfulDB>> {
        if (this.db) return this.db;

        if (!this.initPromise) {
            this.initPromise = this.initialize();
        }

        return this.initPromise;
    }

    private async initialize(): Promise<IDBPDatabase<MindfulDB>> {
        try {
            const db = await openDB<MindfulDB>(DB_NAME, DB_VERSION, {
                upgrade(db, oldVersion, newVersion) {
                    console.log(`[DatabaseService] Upgrading DB from v${oldVersion} to v${newVersion}`);

                    // Create progress store
                    if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
                        const store = db.createObjectStore(STORES.PROGRESS, {
                            keyPath: 'userKey',
                        });
                        store.createIndex('by-name', 'name');
                        store.createIndex('by-updated', 'lastUpdated');
                        console.log('[DatabaseService] Created progress store');
                    }

                    // Create users store
                    if (!db.objectStoreNames.contains(STORES.USERS)) {
                        const store = db.createObjectStore(STORES.USERS, {
                            keyPath: 'id',
                        });
                        store.createIndex('by-username', 'username', { unique: true });
                        console.log('[DatabaseService] Created users store');
                    }

                    // Create activity_logs store
                    if (!db.objectStoreNames.contains(STORES.ACTIVITY_LOGS)) {
                        const store = db.createObjectStore(STORES.ACTIVITY_LOGS, {
                            keyPath: 'id',
                        });
                        // Create compound index for querying by user
                        store.createIndex('by-user', 'userId');
                        store.createIndex('by-type', 'type');
                        console.log('[DatabaseService] Created activity_logs store');
                    }

                    // Create journal_entries store
                    if (!db.objectStoreNames.contains(STORES.JOURNAL_ENTRIES)) {
                        const store = db.createObjectStore(STORES.JOURNAL_ENTRIES, {
                            keyPath: 'id',
                        });
                        store.createIndex('by-user', 'userId');
                        console.log('[DatabaseService] Created journal_entries store');
                    }

                    // Create user_settings store
                    if (!db.objectStoreNames.contains(STORES.USER_SETTINGS)) {
                        const store = db.createObjectStore(STORES.USER_SETTINGS, {
                            keyPath: 'userId',
                        });
                        console.log('[DatabaseService] Created user_settings store');
                    }
                },
                blocked() {
                    console.warn('[DatabaseService] Database blocked by older version. Please close other tabs.');
                },
                blocking() {
                    console.warn('[DatabaseService] This connection is blocking a newer version. Closing...');
                    // Automatically close the connection if we are blocking an upgrade
                    if (this.db) {
                        this.db.close();
                        this.db = null;
                    }
                },
                terminated() {
                    console.error('[DatabaseService] Database connection terminated');
                    this.db = null;
                },
            });

            this.db = db;
            console.log('[DatabaseService] Database connected');
            return db;
        } catch (error) {
            console.error('[DatabaseService] Failed to open database:', error);
            // Reset promise so we can retry on next call
            this.initPromise = null;
            throw error;
        }
    }
}

export const dbService = new DatabaseService();
