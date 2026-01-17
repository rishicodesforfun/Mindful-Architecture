import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../src/services/authService';
import { Session } from '../src/services/sessionService';
import { CreateUserInput, LoginResult, CreateUserResult } from '../src/services/userService';

// ============================================
// Types
// ============================================

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<LoginResult>;
    signup: (input: CreateUserInput) => Promise<CreateUserResult>;
    logout: () => void;
}

// ============================================
// Context Setup
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const loadSession = () => {
            const currentSession = authService.getSession();
            if (currentSession) {
                setSession(currentSession);
                console.log(`[AuthContext] Session restored for user: ${currentSession.username}`);
            } else {
                console.log('[AuthContext] No active session found');
            }
            setIsLoading(false);
        };

        loadSession();
    }, []);

    // Login wrapper
    const login = async (username: string, password: string): Promise<LoginResult> => {
        setIsLoading(true);
        try {
            const result = await authService.login(username, password);

            if (result.success && result.user) {
                // Refresh session state from service
                const newSession = authService.getSession();
                setSession(newSession);
            }

            return result;
        } finally {
            setIsLoading(false);
        }
    };

    // Signup wrapper
    const signup = async (input: CreateUserInput): Promise<CreateUserResult> => {
        setIsLoading(true);
        try {
            const result = await authService.signup(input);

            if (result.success && result.user) {
                // Refresh session state from service
                const newSession = authService.getSession();
                setSession(newSession);
            }

            return result;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout wrapper
    const logout = () => {
        authService.logout();
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{
            session,
            isLoading,
            isAuthenticated: !!session,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
