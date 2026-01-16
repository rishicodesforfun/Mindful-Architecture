// Design tokens and theme configuration for Mindful Architecture
// Matches the HTML theme examples provided

export const colors = {
    // Primary palette - teal/sage green
    primary: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#37a49f', // Main primary
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
    },

    // Accent palette - warm beige/gold
    accent: {
        50: '#fffbf5',
        100: '#fff7ed',
        200: '#EEDDD2',
        300: '#D7C29E',
        400: '#c4a676',
        500: '#B8A078',
        600: '#a08968',
        700: '#7c6a50',
        800: '#5c4f3b',
        900: '#3d3528',
    },

    // Background colors
    background: {
        light: '#fafafa',
        lightAlt: '#f6f7f8',
        dark: '#1d1e20',
        darkAlt: '#22262a',
    },

    // Surface colors (cards, modals)
    surface: {
        light: '#ffffff',
        lightAlt: '#fafaf9',
        dark: '#2a2c30',
        darkAlt: '#23262b',
    },

    // Theme-specific colors
    themes: {
        anxiety: { primary: '#389485', bg: '#e8f5f3' },
        focus: { primary: '#4b9b87', bg: '#EBF0FF' },
        emotional: { primary: '#6bc7b8', bg: '#F5E8ED' },
        sleep: { primary: '#2b5664', bg: '#EBF5F4' },
        confidence: { primary: '#54aba2', bg: '#FFF4E5' },
        lifestyle: { primary: '#37a49f', bg: '#F3EBF5' },
    },

    // Mood colors
    moods: {
        calm: { bg: '#EBF0FF', color: '#4b9b87' },
        energized: { bg: '#FFF4E5', color: '#f59e0b' },
        anxious: { bg: '#F3EBF5', color: '#8b5cf6' },
        grateful: { bg: '#e8f5f3', color: '#22c55e' },
        tired: { bg: '#F5E8ED', color: '#6b7280' },
    },
};

export const typography = {
    fonts: {
        display: "'Epilogue', sans-serif",
        body: "'Manrope', sans-serif",
        alt: "'Work Sans', sans-serif",
        jakarta: "'Plus Jakarta Sans', sans-serif",
    },

    sizes: {
        xs: '0.625rem',    // 10px
        sm: '0.75rem',     // 12px
        base: '0.875rem',  // 14px
        md: '1rem',        // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
        '4xl': '2.5rem',   // 40px
    },
};

export const shadows = {
    soft: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    card: '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
    glow: (color: string) => `0 0 20px ${color}`,
    neumorph: {
        light: '20px 20px 60px #d6d6d6, -20px -20px 60px #ffffff',
        dark: '20px 20px 60px #1a1d20, -20px -20px 60px #2a2f34',
        pressed: 'inset 6px 6px 12px #d1d9d6, inset -6px -6px 12px #ffffff',
    },
};

export const borderRadius = {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    full: '9999px',
};

export const animations = {
    durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        breath: '8s',
        float: '6s',
    },
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
};

// Persona-specific configurations
export const personas = {
    arjun: {
        name: 'Arjun',
        type: 'Professional',
        preferredTime: ['midday', 'night'],
        sessionLength: 'short', // 5-8 min
        themes: ['anxiety', 'focus', 'sleep'],
        features: ['quickStart'],
    },
    meera: {
        name: 'Meera',
        type: 'Student',
        preferredTime: ['flexible'],
        sessionLength: 'standard',
        themes: ['focus', 'emotional', 'confidence', 'lifestyle'],
        features: ['skipWithoutPenalty', 'pauseMode'],
    },
    rohan: {
        name: 'Rohan',
        type: 'Sleep-Focused',
        preferredTime: ['night'],
        sessionLength: 'standard',
        themes: ['sleep', 'anxiety'],
        features: ['nightMode', 'lateNightStart'],
    },
};

// Program themes
export const programThemes = [
    {
        id: 'anxiety',
        name: 'Anxiety Relief',
        subtitle: 'Stress Management',
        description: 'Learn to calm your mind and reduce daily stress through grounding techniques.',
        icon: 'self_improvement',
        color: colors.themes.anxiety.primary,
        bgColor: colors.themes.anxiety.bg,
        personas: ['arjun', 'rohan'],
    },
    {
        id: 'focus',
        name: 'Deep Focus',
        subtitle: 'Attention & Organization',
        description: 'Sharpen your concentration and build sustainable attention habits.',
        icon: 'center_focus_strong',
        color: colors.themes.focus.primary,
        bgColor: colors.themes.focus.bg,
        personas: ['arjun', 'meera'],
    },
    {
        id: 'emotional',
        name: 'Emotional Healing',
        subtitle: 'Awareness & Processing',
        description: 'Develop emotional intelligence and process feelings mindfully.',
        icon: 'favorite',
        color: colors.themes.emotional.primary,
        bgColor: colors.themes.emotional.bg,
        personas: ['meera'],
    },
    {
        id: 'sleep',
        name: 'Better Sleep',
        subtitle: 'Routine Support',
        description: 'Build calming bedtime routines for deeper, more restful sleep.',
        icon: 'bedtime',
        color: colors.themes.sleep.primary,
        bgColor: colors.themes.sleep.bg,
        personas: ['rohan'],
    },
    {
        id: 'confidence',
        name: 'Inner Confidence',
        subtitle: 'Self-Support',
        description: 'Cultivate self-compassion and build lasting inner strength.',
        icon: 'psychology',
        color: colors.themes.confidence.primary,
        bgColor: colors.themes.confidence.bg,
        personas: ['meera'],
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle Reset',
        subtitle: 'Habit Cleanup',
        description: 'Simplify your routines and create space for what matters.',
        icon: 'restart_alt',
        color: colors.themes.lifestyle.primary,
        bgColor: colors.themes.lifestyle.bg,
        personas: ['meera'],
    },
];

export default {
    colors,
    typography,
    shadows,
    borderRadius,
    animations,
    personas,
    programThemes,
};
