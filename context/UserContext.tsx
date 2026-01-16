import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

    // Onboarding
    hasCompletedOnboarding: boolean;
}

interface UserContextType {
    user: UserState;

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
    completeSession: (type: 'meditation' | 'reflection' | 'task' | 'moodCheckin') => void;
    advanceDay: () => void;

    // Feature toggles
    activatePause: () => boolean;
    toggleNightMode: () => void;
    toggleShortSession: () => void;

    // Progress helpers
    getCurrentBlock: () => 1 | 2 | 3;
    getDaysInBlock: () => number;
    getWeeklyMoodAverage: () => number;
    getTodayCompletion: () => SessionCompletion | undefined;
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
    hasCompletedOnboarding: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'mindful_architecture_user';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserState>(() => {
        // Try to load from localStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Convert date strings back to Date objects
                if (parsed.programStartDate) parsed.programStartDate = new Date(parsed.programStartDate);
                if (parsed.pauseExpiresAt) parsed.pauseExpiresAt = new Date(parsed.pauseExpiresAt);
                return { ...defaultUserState, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load user state:', e);
        }
        return defaultUserState;
    });

    // Save to localStorage on changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
            console.error('Failed to save user state:', e);
        }
    }, [user]);

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

    // Session completions
    const updateTodaySession = (updates: Partial<SessionCompletion>) => {
        setUser(prev => {
            const existing = prev.sessionCompletions.find(s => s.day === prev.currentDay);
            if (existing) {
                return {
                    ...prev,
                    sessionCompletions: prev.sessionCompletions.map(s =>
                        s.day === prev.currentDay ? { ...s, ...updates } : s
                    ),
                };
            } else {
                return {
                    ...prev,
                    sessionCompletions: [
                        ...prev.sessionCompletions,
                        {
                            day: prev.currentDay,
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

    const completeMeditation = () => updateTodaySession({ meditation: true });
    const completeReflection = (_text: string) => updateTodaySession({ reflection: true });
    const completeTask = () => updateTodaySession({ task: true });

    const completeMoodCheckin = (mood: 1 | 2 | 3 | 4 | 5, emotion?: string) => {
        setUser(prev => ({
            ...prev,
            moodHistory: [
                ...prev.moodHistory,
                { day: prev.currentDay, mood, emotion, timestamp: new Date() },
            ],
        }));
        updateTodaySession({ moodCheckin: true });
    };

    const skipDay = () => {
        // Skip without breaking streak (for Meera persona)
        setUser(prev => ({
            ...prev,
            currentDay: Math.min(prev.currentDay + 1, 30),
        }));
    };

    // NEW: Save reflection with journal entry
    const saveReflection = (entry: { day: number; mood?: string; journal: string; date: string }) => {
        setUser(prev => ({
            ...prev,
            reflections: [...prev.reflections, entry],
        }));
    };

    // NEW: Generic complete session function
    const completeSession = (type: 'meditation' | 'reflection' | 'task' | 'moodCheckin') => {
        updateTodaySession({ [type]: true });
    };

    // NEW: Advance to next day after completing all tasks
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

    // Pause mode
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

    // Toggles
    const toggleNightMode = () => setUser(prev => ({ ...prev, nightMode: !prev.nightMode }));
    const toggleShortSession = () => setUser(prev => ({ ...prev, shortSessionMode: !prev.shortSessionMode }));

    // Helpers
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

    return (
        <UserContext.Provider value={{
            user,
            setName,
            setPersona,
            setAvatar,
            selectTheme,
            setRoutineTime,
            completeOnboarding,
            completeMeditation,
            completeReflection,
            completeTask,
            completeMoodCheckin,
            skipDay,
            saveReflection,
            completeSession,
            advanceDay,
            activatePause,
            toggleNightMode,
            toggleShortSession,
            getCurrentBlock,
            getDaysInBlock,
            getWeeklyMoodAverage,
            getTodayCompletion,
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
