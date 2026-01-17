/**
 * Session Service
 * 
 * Manages the active user session in localStorage.
 * This persists the login state across browser refreshes.
 * 
 * Does NOT store sensitive user data, only the session token/state.
 */

// ============================================
// Types
// ============================================

export interface Session {
    userId: string;
    username: string;
    loggedInAt: number;
    expiresAt: number;
}

const SESSION_KEY = 'mindful_architecture_session';

// Session duration: 30 days
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

class SessionService {
    /**
     * Create and store a new session
     */
    createSession(userId: string, username: string): Session {
        const now = Date.now();
        const session: Session = {
            userId,
            username,
            loggedInAt: now,
            expiresAt: now + SESSION_DURATION,
        };

        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            console.error('[SessionService] Failed to save session:', error);
        }

        return session;
    }

    /**
     * Get the current active session
     */
    getSession(): Session | null {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            if (!stored) return null;

            const session: Session = JSON.parse(stored);

            // Check expiry
            if (Date.now() > session.expiresAt) {
                this.clearSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('[SessionService] Failed to parse session:', error);
            this.clearSession(); // Clear corrupted session
            return null;
        }
    }

    /**
     * Clear the current session (Logout)
     */
    clearSession(): void {
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error('[SessionService] Failed to clear session:', error);
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getSession();
    }
}

export const sessionService = new SessionService();
