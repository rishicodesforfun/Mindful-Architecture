// Design tokens and theme configuration for Mindful Architecture
// Color Palette: Nature-Inspired (Light) + Midnight Blue (Dark)

export const colors = {
    // Primary palette - forest green (light) / bright teal (dark)
    primary: {
        50: '#E8F0ED',
        100: '#D1E2DB',
        200: '#A3C5B8',
        300: '#4FD1C5', // Dark mode primary
        400: '#4A9B8A',
        500: '#3D6B5B', // Light mode primary
        600: '#345C4E',
        700: '#2B4D41',
        800: '#223E34',
        900: '#192F27',
    },

    // Accent palette - warm sand
    accent: {
        50: '#FBF7F3',
        100: '#F5EDE3',
        200: '#E8D9C7',
        300: '#D4A574', // Main accent
        400: '#C69460',
        500: '#B8834C',
        600: '#9A6E3F',
        700: '#7C5932',
        800: '#5E4425',
        900: '#402F18',
    },

    // Background colors - Option B
    background: {
        light: '#F5F7F4',      // Warm off-white with green tint
        lightAlt: '#EEF1EC',
        dark: '#0B1121',       // Deep navy (Midnight Blue)
        darkAlt: '#0D1526',
    },

    // Surface colors (cards, modals)
    surface: {
        light: '#FFFFFF',
        lightAlt: '#F8FAF7',
        dark: '#151E32',       // Midnight Blue surface
        darkAlt: '#1A2438',
    },

    // Text colors
    text: {
        light: '#2C3E35',      // Forest charcoal
        lightMuted: '#5A6B62',
        dark: '#CBD5E1',       // Soft light for dark mode
        darkMuted: '#8B9AAB',
    },

    // Theme-specific colors
    themes: {
        anxiety: { primary: '#3D6B5B', bg: '#E8F0ED' },
        focus: { primary: '#4A9B8A', bg: '#E8F0ED' },
        emotional: { primary: '#4FD1C5', bg: '#F0F5F4' },
        sleep: { primary: '#2B4D41', bg: '#E8F0ED' },
        confidence: { primary: '#4A9B8A', bg: '#FBF7F3' },
        lifestyle: { primary: '#3D6B5B', bg: '#F5F7F4' },
    },

    // Mood colors
    moods: {
        calm: { bg: '#E8F0ED', color: '#3D6B5B' },
        energized: { bg: '#FBF7F3', color: '#D4A574' },
        anxious: { bg: '#F0E8F0', color: '#8B5CF6' },
        grateful: { bg: '#E8F5E8', color: '#22C55E' },
        tired: { bg: '#F0EDE8', color: '#6B7280' },
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
