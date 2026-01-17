import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Types for our database tables
export interface Profile {
    id: string;
    name: string;
    email: string;
    current_day: number;
    night_mode: boolean;
    created_at: string;
    updated_at: string;
}

export interface DailyCompletion {
    id: string;
    user_id: string;
    day: number;
    date: string;
    meditation: boolean;
    meditation_duration: number | null;
    task: boolean;
    reflection: boolean;
    created_at: string;
}

export interface MeditationSession {
    id: string;
    user_id: string;
    day: number;
    duration: number;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
}
