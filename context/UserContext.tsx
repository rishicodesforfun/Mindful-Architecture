import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { progressService, userStateToProgress, progressToUserState } from '../src/services';
import { useAuth } from './AuthContext';

// Types
export type ProgramTheme = 'anxiety' | 'focus' | 'emotional' | 'sleep' | 'confidence' | 'lifestyle';
export type RoutineTime = 'morning' | 'midday' | 'night' | 'flexible';
export type Persona = 'arjun' | 'meera' | 'rohan' | null;

export interface MoodEntry {
    day: number;
    mood: 1 | 2 | 3 | 4 | 5;
    emotion?: string;
    timestamp: Date;
}

export interface ReflectionEntry {
    day: number;
    mood?: string;
    journal: string;
    date: string;
}

export interface SessionCompletion {
    day: number;
    meditation: boolean;
    reflection: boolean;
    task: boolean;
    moodCheckin: boolean;
    timestamp: Date;
}

export type AvatarId = 'avatar1' | 'avatar2' | 'avatar3' | 'avatar4' | 'avatar5' | 'avatar6';

export interface UserState {
    // User info
    name: string;
    persona: Persona;
    avatar: AvatarId;

    // Program settings
    selectedTheme: ProgramTheme | null;
    routineTime: RoutineTime;
    currentDay: number;
    programStartDate: Date | null;

    // Progress tracking
    moodHistory: MoodEntry[];
    reflections: ReflectionEntry[];
    sessionCompletions: SessionCompletion[];
    streak: number;

    // Features
    pauseTokens: number;
    isPaused: boolean;
    pauseExpiresAt: Date | null;
    nightMode: boolean;
    shortSessionMode: boolean;

    // Subscription
    subscriptionStatus: 'free' | 'premium';

    // Favorites
    favoriteDays: number[];

    // Onboarding
    hasCompletedOnboarding: boolean;

    // Preferences
    soundPreference: SoundOption;

    // Gamification
    unlockedAchievements: string[]; // IDs of unlocked badges
}

export type SoundOption = 'nature' | 'ambient' | 'voice' | 'silent';

interface UserContextType {
    user: UserState;
    isLoading: boolean;

    // Actions
    setName: (name: string) => void;
    setPersona: (persona: Persona) => void;
    setAvatar: (avatar: AvatarId) => void;
    selectTheme: (theme: ProgramTheme) => void;
    setRoutineTime: (time: RoutineTime) => void;
    completeOnboarding: () => void;

    // Session actions
    completeMeditation: () => void;
    completeReflection: (text: string) => void;
    completeTask: () => void;
    completeMoodCheckin: (mood: 1 | 2 | 3 | 4 | 5, emotion?: string) => void;
    skipDay: () => void;

    // New unified functions
    saveReflection: (entry: { day: number; mood?: string; journal: string; date: string }) => void;
    completeSession: (type: 'meditation' | 'reflection' | 'task' | 'moodCheckin', day?: number) => void;
    advanceDay: () => void;

    // Feature toggles
    activatePause: () => boolean;
    toggleNightMode: () => void;
    toggleShortSession: () => void;

    // Favorites
    toggleFavorite: (day: number) => void;
    isFavorite: (day: number) => boolean;

    // Progress helpers
    getCurrentBlock: () => 1 | 2 | 3;
    getDaysInBlock: () => number;
    getWeeklyMoodAverage: () => number;
    getTodayCompletion: () => SessionCompletion | undefined;

    // Logout
    logout: () => Promise<void>;
    clearProgressAndLogout: () => Promise<void>;

    // Subscription
    upgradeToPremium: () => void;
    bookAppointment: () => void;

    // Preferences
    setSoundPreference: (sound: SoundOption) => void;
}

const defaultUserState: UserState = {
    name: '',
    persona: null,
    avatar: 'avatar1',
    selectedTheme: null,
    routineTime: 'flexible',
    currentDay: 1,
    programStartDate: null,
    moodHistory: [],
    reflections: [],
    sessionCompletions: [],
    streak: 0,
    pauseTokens: 1,
    isPaused: false,
    pauseExpiresAt: null,
    nightMode: false,
    shortSessionMode: false,
    subscriptionStatus: 'free',
    favoriteDays: [],
    hasCompletedOnboarding: false,
    soundPreference: 'nature',
    unlockedAchievements: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { session, logout: authLogout } = useAuth();
    const [user, setUser] = useState<UserState>(defaultUserState);
    const [isLoading, setIsLoading] = useState(true);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // React to session changes
    useEffect(() => {
        const loadUserData = async () => {
            if (session?.userId) {
                setIsLoading(true);
                try {
                    // Load progress for this specific user ID
                    const progress = await progressService.getProgress(session.userId);

                    if (progress) {
                        setUser(progressToUserState(progress));
                        console.log(`[UserContext] Loaded progress for user ID: ${session.userId}`);
                    } else {
                        // New user or no progress yet - reset to default but keep name from session
                        setUser({
                            ...defaultUserState,
                            name: session.username, // Use username as default name
                        });
                        console.log(`[UserContext] Initialized new user state for: ${session.username}`);
                    }
                } catch (error) {
                    console.error('[UserContext] Error loading user data:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // No session - reset state
                setUser(defaultUserState);
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [session?.userId, session?.username]); // Re-run when user changes

    // Debounced save to IndexedDB
    const saveToIndexedDB = useCallback(async (state: UserState) => {
        if (!session?.userId) return; // Don't save if not logged in

        // Clear any pending save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Debounce saves
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                // Use session.userId as the key!
                const progress = userStateToProgress(state, session.userId);
                await progressService.saveProgress(progress);
            } catch (error) {
                console.error('[UserContext] Error saving to IndexedDB:', error);
            }
        }, 300); // 300ms debounce
    }, [session?.userId]);

    // Save to IndexedDB on state changes
    useEffect(() => {
        if (!isLoading && session?.userId) {
            saveToIndexedDB(user);
        }
    }, [user, isLoading, session?.userId, saveToIndexedDB]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Actions
    const setName = (name: string) => setUser(prev => ({ ...prev, name }));
    const setPersona = (persona: Persona) => setUser(prev => ({ ...prev, persona }));
    const setAvatar = (avatar: AvatarId) => setUser(prev => ({ ...prev, avatar }));

    const selectTheme = (theme: ProgramTheme) => {
        setUser(prev => ({
            ...prev,
            selectedTheme: theme,
            currentDay: 1,
            programStartDate: new Date(),
            streak: 0,
            moodHistory: [],
            sessionCompletions: [],
        }));
    };

    const setRoutineTime = (time: RoutineTime) => setUser(prev => ({ ...prev, routineTime: time }));

    const completeOnboarding = () => setUser(prev => ({ ...prev, hasCompletedOnboarding: true }));
    const setSoundPreference = (sound: SoundOption) => setUser(prev => ({ ...prev, soundPreference: sound }));

    // Achievement Logic
    const checkAchievements = useCallback((currentState: UserState) => {
        const newUnlocks: string[] = [];
        // Default to empty array if undefined to prevent crash
        const { streak, sessionCompletions, unlockedAchievements = [] } = currentState;

        // 1. Seedling (First Session)
        if (sessionCompletions.length >= 1 && !unlockedAchievements.includes('seedling')) {
            newUnlocks.push('seedling');
        }

        // 2. On Fire (7 Day Streak)
        if (streak >= 7 && !unlockedAchievements.includes('fire')) {
            newUnlocks.push('fire');
        }

        // 3. Zen Master (10 Sessions)
        if (sessionCompletions.length >= 10 && !unlockedAchievements.includes('zen')) {
            newUnlocks.push('zen');
        }

        // 4. Star (30 Days / Program Complete) - Example logic
        if (currentState.currentDay >= 30 && !unlockedAchievements.includes('star')) {
            newUnlocks.push('star');
        }

        if (newUnlocks.length > 0) {
            setUser(prev => ({
                ...prev,
                unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks]
            }));
            // Optional: You could trigger a toast/notification here
        }
    }, []);

    // Check achievements whenever relevant state changes
    useEffect(() => {
        if (!isLoading && user.name) {
            checkAchievements(user);
        }
    }, [user.streak, user.sessionCompletions.length, user.currentDay, checkAchievements, isLoading, user.name]);

    // Session completions
    const updateSessionForDay = (day: number, updates: Partial<SessionCompletion>) => {
        setUser(prev => {
            const existing = prev.sessionCompletions.find(s => s.day === day);
            if (existing) {
                return {
                    ...prev,
                    sessionCompletions: prev.sessionCompletions.map(s =>
                        s.day === day ? { ...s, ...updates } : s
                    ),
                };
            } else {
                return {
                    ...prev,
                    sessionCompletions: [
                        ...prev.sessionCompletions,
                        {
                            day: day,
                            meditation: false,
                            reflection: false,
                            task: false,
                            moodCheckin: false,
                            timestamp: new Date(),
                            ...updates,
                        },
                    ],
                };
            }
        });
    };

    const completeMeditation = (day?: number) => completeSession('meditation', day);
    const completeReflection = (_text: string, day?: number) => completeSession('reflection', day);
    const completeTask = (day?: number) => completeSession('task', day);

    const completeMoodCheckin = (mood: 1 | 2 | 3 | 4 | 5, emotion?: string) => {
        setUser(prev => ({
            ...prev,
            moodHistory: [
                ...prev.moodHistory,
                { day: prev.currentDay, mood, emotion, timestamp: new Date() },
            ],
        }));
        updateSessionForDay(user.currentDay, { moodCheckin: true });
    };

    const skipDay = () => {
        setUser(prev => ({
            ...prev,
            currentDay: Math.min(prev.currentDay + 1, 30),
        }));
    };

    const saveReflection = (entry: { day: number; mood?: string; journal: string; date: string }) => {
        setUser(prev => ({
            ...prev,
            reflections: [...prev.reflections, entry],
        }));
    };

    const completeSession = (type: 'meditation' | 'reflection' | 'task' | 'moodCheckin', day?: number) => {
        const targetDay = day || user.currentDay;

        // 1. Update the session completion
        updateSessionForDay(targetDay, { [type]: true });

        // 2. Check if we should auto-advance (only if working on current day)
        if (targetDay === user.currentDay) {
            // We need to look at the updated state, but functional updates are batched/async.
            // So we peek at the *current* user state + this new update to decide.
            const currentCompletion = user.sessionCompletions.find(s => s.day === targetDay) || {
                day: targetDay, meditation: false, reflection: false, task: false, moodCheckin: false, timestamp: new Date()
            };

            // Apply the new update locally to check
            const updatedCompletion = { ...currentCompletion, [type]: true };

            if (updatedCompletion.meditation && updatedCompletion.reflection && updatedCompletion.task) {
                // Auto-advance if everything is done!
                // Add a small delay so the user sees the checkmark animation first
                setTimeout(() => {
                    advanceDay();
                }, 1500);
            }
        }
    };

    const advanceDay = () => {
        setUser(prev => {
            const newDay = Math.min(prev.currentDay + 1, 30);
            return {
                ...prev,
                currentDay: newDay,
                streak: prev.streak + 1,
            };
        });
    };

    const activatePause = (): boolean => {
        if (user.pauseTokens <= 0) return false;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        setUser(prev => ({
            ...prev,
            pauseTokens: prev.pauseTokens - 1,
            isPaused: true,
            pauseExpiresAt: expiresAt,
        }));
        return true;
    };

    const toggleNightMode = () => setUser(prev => ({ ...prev, nightMode: !prev.nightMode }));
    const toggleShortSession = () => setUser(prev => ({ ...prev, shortSessionMode: !prev.shortSessionMode }));

    const toggleFavorite = (day: number) => {
        setUser(prev => ({
            ...prev,
            favoriteDays: prev.favoriteDays.includes(day)
                ? prev.favoriteDays.filter(d => d !== day)
                : [...prev.favoriteDays, day]
        }));
    };
    const isFavorite = (day: number): boolean => user.favoriteDays.includes(day);

    const getCurrentBlock = (): 1 | 2 | 3 => {
        if (user.currentDay <= 10) return 1;
        if (user.currentDay <= 20) return 2;
        return 3;
    };

    const getDaysInBlock = (): number => {
        const block = getCurrentBlock();
        if (block === 1) return user.currentDay;
        if (block === 2) return user.currentDay - 10;
        return user.currentDay - 20;
    };

    const getWeeklyMoodAverage = (): number => {
        const lastWeek = user.moodHistory.slice(-7);
        if (lastWeek.length === 0) return 3;
        const sum = lastWeek.reduce((acc, m) => acc + m.mood, 0);
        return sum / lastWeek.length;
    };

    const getTodayCompletion = (): SessionCompletion | undefined => {
        return user.sessionCompletions.find(s => s.day === user.currentDay);
    };

    // Logout actions
    const logout = async () => {
        authLogout();
        // State reset handled by useEffect when session becomes null
    };

    const clearProgressAndLogout = async () => {
        if (session?.userId) {
            await progressService.clearProgress(session.userId);
        }
        authLogout();
    };

    const upgradeToPremium = () => {
        setUser(prev => ({ ...prev, subscriptionStatus: 'premium' }));
    };

    const bookAppointment = () => {
        if (user.subscriptionStatus === 'premium') {
            window.open('https://mentamind.in/', '_blank');
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            isLoading,
            setName,
            setPersona,
            setAvatar,
            selectTheme,
            setRoutineTime,
            completeOnboarding,
            completeMeditation,
            completeReflection: (text) => completeReflection(text), // adapter for interface
            completeTask,
            completeMoodCheckin,
            skipDay,
            saveReflection,
            completeSession,
            advanceDay,
            activatePause,
            toggleNightMode,
            toggleShortSession,
            toggleFavorite,
            isFavorite,
            getCurrentBlock,
            getDaysInBlock,
            getWeeklyMoodAverage,
            getTodayCompletion,
            logout,
            clearProgressAndLogout,
            upgradeToPremium,
            bookAppointment,
            setSoundPreference,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
