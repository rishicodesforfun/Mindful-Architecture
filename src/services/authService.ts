/**
 * Auth Service
 * 
 * High-level authentication operations that coordinate between
 * UserService (IndexedDB) and SessionService (localStorage).
 */

import { userService, CreateUserInput, LoginResult, CreateUserResult } from './userService';
import { sessionService, Session } from './sessionService';

class AuthService {
    /**
     * Sign up a new user
     */
    async signup(input: CreateUserInput): Promise<CreateUserResult> {
        // 1. Create user in IndexedDB
        const result = await userService.createUser(input);

        if (result.success && result.user) {
            // 2. Create session automatically on signup
            sessionService.createSession(result.user.id, result.user.username);
        }

        return result;
    }

    /**
     * Log in an existing user
     */
    async login(username: string, password: string): Promise<LoginResult> {
        // 1. Validate credentials against IndexedDB
        const result = await userService.validateLogin(username, password);

        if (result.success && result.user) {
            // 2. Create session
            sessionService.createSession(result.user.id, result.user.username);
        }

        return result;
    }

    /**
     * Log out
     */
    logout(): void {
        sessionService.clearSession();
    }

    /**
     * Get current session
     */
    getSession(): Session | null {
        return sessionService.getSession();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return sessionService.isAuthenticated();
    }
}

export const authService = new AuthService();
