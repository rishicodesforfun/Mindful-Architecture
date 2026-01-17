/**
 * User Service - Local User Management
 * 
 * Manages user accounts in IndexedDB for local authentication.
 * Uses SHA-256 for password hashing via Web Crypto API.
 * Refactored to use shared dbService.
 */

import { dbService, STORES } from './db';

// ============================================
// Types
// ============================================

export interface LocalUser {
    id: string;           // Deterministic ID derived from username
    username: string;     // Unique username
    passwordHash: string; // SHA-256 hash, never plaintext
    createdAt: number;    // Unix timestamp
}

export interface CreateUserInput {
    username: string;
    password: string;
}

export interface LoginResult {
    success: boolean;
    user?: LocalUser;
    error?: 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'DATABASE_ERROR';
    debugMessage?: string;
}

export interface CreateUserResult {
    success: boolean;
    user?: LocalUser;
    error?: 'USERNAME_EXISTS' | 'DATABASE_ERROR' | 'INVALID_INPUT';
    debugMessage?: string;
}

// ============================================
// Crypto Utilities (Robust Fallback)
// ============================================

/**
 * Simple non-secure hash fallback for environments without crypto.subtle
 * (e.g. non-localhost HTTP, older browsers)
 */
function fallbackHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Return a hex string that looks somewhat like a hash (32 chars)
    return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Generate a deterministic user ID from username
 */
async function generateUserId(username: string): Promise<string> {
    const input = `user:${username.toLowerCase()}`;

    // Try Web Crypto API first (Secure Context only)
    if (window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
        } catch (e) {
            console.warn('[UserService] Crypto API failed, using fallback:', e);
        }
    }

    return fallbackHash(input);
}

/**
 * Hash a password using SHA-256 or fallback
 */
async function hashPassword(password: string, salt: string): Promise<string> {
    const input = `${salt}:${password}`;

    // Try Web Crypto API first
    if (window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            console.warn('[UserService] Crypto API failed, using fallback:', e);
        }
    }

    return fallbackHash(input);
}

// ============================================
// User Service Class
// ============================================

class UserService {
    /**
     * Create a new user account
     */
    async createUser(input: CreateUserInput): Promise<CreateUserResult> {
        try {
            const { username, password } = input;

            // Validate input
            if (!username || !password) {
                return { success: false, error: 'INVALID_INPUT' };
            }

            const normalizedUsername = username.trim().toLowerCase();
            const db = await dbService.getDB();

            // Check if username exists
            const existing = await db.getFromIndex(STORES.USERS, 'by-username', normalizedUsername);
            if (existing) {
                console.log(`[UserService] Username "${normalizedUsername}" already exists`);
                return { success: false, error: 'USERNAME_EXISTS' };
            }

            // Generate deterministic user ID
            const id = await generateUserId(normalizedUsername);

            // Hash password
            const passwordHash = await hashPassword(password, normalizedUsername);

            // Create user object
            const user: LocalUser = {
                id,
                username: normalizedUsername,
                passwordHash,
                createdAt: Date.now(),
            };

            // Store user
            await db.add(STORES.USERS, user);
            console.log(`[UserService] Created user "${normalizedUsername}" with ID ${id}`);

            return { success: true, user };
        } catch (error) {
            console.error('[UserService] Error creating user:', error);

            let debugMessage = 'Unknown error';
            if (error instanceof Error) {
                debugMessage = error.message;
                // Specific check for key constraints or missing stores
                if (error.name === 'NotFoundError') {
                    debugMessage = 'Database store missing. Please reload.';
                } else if (error.name === 'ConstraintError') {
                    debugMessage = 'Username already exists.';
                }
            }

            return {
                success: false,
                error: 'DATABASE_ERROR',
                debugMessage
            };
        }
    }

    /**
     * Validate login credentials
     */
    async validateLogin(username: string, password: string): Promise<LoginResult> {
        try {
            const normalizedUsername = username.trim().toLowerCase();
            const db = await dbService.getDB();

            // Find user by username
            const user = await db.getFromIndex(STORES.USERS, 'by-username', normalizedUsername);
            if (!user) {
                console.log(`[UserService] User "${normalizedUsername}" not found`);
                return { success: false, error: 'USER_NOT_FOUND' };
            }

            // Hash input password and compare
            const inputHash = await hashPassword(password, normalizedUsername);
            if (inputHash !== user.passwordHash) {
                console.log(`[UserService] Invalid password for "${normalizedUsername}"`);
                return { success: false, error: 'INVALID_PASSWORD' };
            }

            console.log(`[UserService] Login successful for "${normalizedUsername}"`);
            return { success: true, user };
        } catch (error) {
            console.error('[UserService] Error validating login:', error);
            return { success: false, error: 'DATABASE_ERROR' };
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<LocalUser | null> {
        try {
            const db = await dbService.getDB();
            const user = await db.get(STORES.USERS, id);
            return user || null;
        } catch (error) {
            console.error(`[UserService] Error getting user ${id}:`, error);
            return null;
        }
    }

    /**
     * List all users
     */
    async listUsers(): Promise<LocalUser[]> {
        try {
            const db = await dbService.getDB();
            return await db.getAll(STORES.USERS);
        } catch (error) {
            console.error('[UserService] Error listing users:', error);
            return [];
        }
    }
}

// Export singleton
export const userService = new UserService();
export { UserService };
