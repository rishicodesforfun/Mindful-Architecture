import React from 'react';

// ============================================
// CARD ILLUSTRATIONS - Easily Modifiable SVGs
// ============================================

// Meditation Card - Sage Green Waves
export const MeditationIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="url(#meditationGrad)" rx="16" />
        <path d="M0 60 Q30 45 60 55 T120 50 V120 H0 Z" fill="#4b9b87" opacity="0.3" />
        <path d="M0 70 Q40 55 80 65 T120 60 V120 H0 Z" fill="#4b9b87" opacity="0.4" />
        <path d="M0 80 Q35 70 70 78 T120 75 V120 H0 Z" fill="#4b9b87" opacity="0.5" />
        <path d="M0 90 Q30 85 60 88 T120 85 V120 H0 Z" fill="#4b9b87" opacity="0.6" />
        <defs>
            <linearGradient id="meditationGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#e8f5f3" />
                <stop offset="100%" stopColor="#d0ebe6" />
            </linearGradient>
        </defs>
    </svg>
);

// Reflection Card - Coral/Peach Abstract
export const ReflectionIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="url(#reflectionGrad)" rx="16" />
        {/* Coral branch pattern */}
        <g opacity="0.7">
            <path d="M60 100 Q60 80 55 70 Q50 60 55 50 Q58 45 60 40" stroke="#d4a59a" strokeWidth="3" fill="none" />
            <path d="M60 70 Q50 65 45 55" stroke="#d4a59a" strokeWidth="2" fill="none" />
            <path d="M60 70 Q70 65 75 55" stroke="#d4a59a" strokeWidth="2" fill="none" />
            <path d="M55 50 Q45 48 40 40" stroke="#d4a59a" strokeWidth="1.5" fill="none" />
            <path d="M55 50 Q58 42 55 35" stroke="#d4a59a" strokeWidth="1.5" fill="none" />
            <path d="M60 55 Q65 50 70 45" stroke="#d4a59a" strokeWidth="1.5" fill="none" />
            <path d="M70 45 Q75 42 80 40" stroke="#d4a59a" strokeWidth="1" fill="none" />
            <path d="M45 55 Q40 52 35 50" stroke="#d4a59a" strokeWidth="1" fill="none" />
        </g>
        <defs>
            <linearGradient id="reflectionGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#fff5f3" />
                <stop offset="100%" stopColor="#ffe8e3" />
            </linearGradient>
        </defs>
    </svg>
);

// Task Card - Blue Abstract Path
export const TaskIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="url(#taskGrad)" rx="16" />
        {/* Abstract blue shapes */}
        <circle cx="60" cy="60" r="35" fill="url(#taskCircleGrad)" opacity="0.4" />
        <circle cx="75" cy="45" r="20" fill="#93c5fd" opacity="0.3" />
        <ellipse cx="50" cy="70" rx="25" ry="15" fill="#60a5fa" opacity="0.25" />
        <defs>
            <linearGradient id="taskGrad" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
            <linearGradient id="taskCircleGrad" x1="30" y1="30" x2="90" y2="90">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// MOOD ILLUSTRATIONS
// ============================================

export const CalmMoodIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="30" fill="url(#calmGrad)" opacity="0.8" />
        <circle cx="40" cy="40" r="20" fill="url(#calmGrad2)" opacity="0.6" />
        <defs>
            <linearGradient id="calmGrad" x1="10" y1="10" x2="70" y2="70">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="calmGrad2" x1="20" y1="20" x2="60" y2="60">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
        </defs>
    </svg>
);

export const EnergizedMoodIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" fill="url(#energizedGrad)" opacity="0.9" />
        <circle cx="40" cy="40" r="18" fill="#fef3c7" opacity="0.8" />
        <defs>
            <linearGradient id="energizedGrad" x1="10" y1="10" x2="70" y2="70">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
        </defs>
    </svg>
);

export const AnxiousMoodIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" fill="url(#anxiousGrad)" opacity="0.7" />
        {/* Person silhouette */}
        <circle cx="40" cy="30" r="8" fill="#a78bfa" opacity="0.6" />
        <ellipse cx="40" cy="50" rx="10" ry="12" fill="#a78bfa" opacity="0.5" />
        <defs>
            <linearGradient id="anxiousGrad" x1="10" y1="10" x2="70" y2="70">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
        </defs>
    </svg>
);

export const GratefulMoodIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" fill="url(#gratefulGrad)" opacity="0.7" />
        <text x="40" y="48" textAnchor="middle" fontSize="16" fill="#059669" fontStyle="italic" opacity="0.6">grateful</text>
        <defs>
            <linearGradient id="gratefulGrad" x1="10" y1="10" x2="70" y2="70">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// CATEGORY ICONS (for Library)
// ============================================

export const SleepCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#sleepBg)" />
        {/* Cloud shape */}
        <ellipse cx="35" cy="45" rx="18" ry="12" fill="#e5e7eb" />
        <ellipse cx="48" cy="42" rx="14" ry="10" fill="#f3f4f6" />
        <ellipse cx="30" cy="42" rx="10" ry="8" fill="#f9fafb" />
        <defs>
            <linearGradient id="sleepBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fce7d6" />
                <stop offset="100%" stopColor="#fbd5b5" />
            </linearGradient>
        </defs>
    </svg>
);

export const AnxietyCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#anxietyBg)" />
        {/* Stacked stones */}
        <ellipse cx="40" cy="55" rx="12" ry="6" fill="#9ca3af" />
        <ellipse cx="40" cy="45" rx="10" ry="5" fill="#a1a1aa" />
        <ellipse cx="40" cy="36" rx="8" ry="4" fill="#b4b4b4" />
        <ellipse cx="40" cy="28" rx="5" ry="3" fill="#d4d4d8" />
        <defs>
            <linearGradient id="anxietyBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fce7d6" />
                <stop offset="100%" stopColor="#fbd5b5" />
            </linearGradient>
        </defs>
    </svg>
);

export const FocusCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#focusBg)" />
        {/* Geometric sphere */}
        <circle cx="40" cy="40" r="18" fill="url(#focusSphere)" />
        <circle cx="35" cy="35" r="4" fill="#fef3c7" opacity="0.6" />
        <defs>
            <linearGradient id="focusBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fce7d6" />
                <stop offset="100%" stopColor="#fbd5b5" />
            </linearGradient>
            <radialGradient id="focusSphere" cx="35%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
        </defs>
    </svg>
);

export const BeginnersCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#beginnersBg)" />
        {/* Donut shape */}
        <circle cx="40" cy="40" r="16" fill="#f59e0b" opacity="0.8" />
        <circle cx="40" cy="40" r="6" fill="url(#beginnersBg)" />
        <defs>
            <linearGradient id="beginnersBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fce7d6" />
                <stop offset="100%" stopColor="#fbd5b5" />
            </linearGradient>
        </defs>
    </svg>
);

export const SoundsCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#soundsBg)" />
        {/* Sound waves */}
        <path d="M25 40 Q30 30 35 40 Q40 50 45 40 Q50 30 55 40" stroke="#0d9488" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M20 45 Q28 35 36 45 Q44 55 52 45 Q60 35 60 45" stroke="#14b8a6" strokeWidth="1.5" fill="none" opacity="0.5" />
        <defs>
            <linearGradient id="soundsBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#115e59" />
            </linearGradient>
        </defs>
    </svg>
);

export const KidsCategoryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="url(#kidsBg)" />
        {/* Simple character */}
        <circle cx="40" cy="32" r="10" fill="#fcd34d" />
        <ellipse cx="40" cy="52" rx="12" ry="10" fill="#fcd34d" />
        <circle cx="36" cy="30" r="2" fill="#1f2937" />
        <circle cx="44" cy="30" r="2" fill="#1f2937" />
        <path d="M37 36 Q40 39 43 36" stroke="#1f2937" strokeWidth="1.5" fill="none" />
        <defs>
            <linearGradient id="kidsBg" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// WALKING PERSON ILLUSTRATION (for Task page)
// ============================================

export const WalkingPersonIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="100" cy="80" r="60" fill="url(#walkingBg)" opacity="0.4" />

        {/* Person */}
        <g transform="translate(70, 30)">
            {/* Head */}
            <circle cx="30" cy="20" r="12" fill="#fcd9bd" />
            {/* Hair */}
            <path d="M20 15 Q25 8 35 10 Q42 12 40 20" fill="#374151" />
            {/* Body - Orange shirt */}
            <path d="M18 35 Q20 32 30 32 Q40 32 42 35 L45 70 Q42 75 30 75 Q18 75 15 70 Z" fill="#f59e0b" />
            {/* Arms */}
            <path d="M18 38 L8 55" stroke="#fcd9bd" strokeWidth="4" strokeLinecap="round" />
            <path d="M42 38 L52 50" stroke="#fcd9bd" strokeWidth="4" strokeLinecap="round" />
            {/* Legs - Dark pants */}
            <path d="M22 75 L18 110" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
            <path d="M38 75 L45 105" stroke="#374151" strokeWidth="8" strokeLinecap="round" />
            {/* Shoes */}
            <ellipse cx="18" cy="112" rx="6" ry="3" fill="#1f2937" />
            <ellipse cx="46" cy="107" rx="6" ry="3" fill="#1f2937" />
        </g>

        <defs>
            <radialGradient id="walkingBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="100%" stopColor="#a7f3d0" />
            </radialGradient>
        </defs>
    </svg>
);

// ============================================
// FLOATING ORBS (for Player background)
// ============================================

export const FloatingOrbs: React.FC<{ variant?: 'light' | 'dark'; className?: string }> = ({
    variant = 'light',
    className = ''
}) => {
    const colors = variant === 'light'
        ? { orb1: '#fce7d6', orb2: '#5eead4', orb3: '#fcd5b5' }
        : { orb1: '#6366f1', orb2: '#5eead4', orb3: '#8b5cf6' };

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Top right orb */}
            <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-xl animate-float"
                style={{ backgroundColor: colors.orb1, opacity: 0.6 }}
            />
            {/* Bottom left orb */}
            <div
                className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-xl animate-float"
                style={{ backgroundColor: colors.orb2, opacity: 0.5, animationDelay: '1s' }}
            />
            {/* Small accent orb */}
            <div
                className="absolute top-1/4 left-10 w-8 h-8 rounded-full blur-sm animate-float"
                style={{ backgroundColor: colors.orb3, opacity: 0.4, animationDelay: '2s' }}
            />
        </div>
    );
};

// ============================================
// BACKGROUND LOGO WATERMARK
// ============================================

export const LogoWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`fixed pointer-events-none z-0 opacity-[0.03] ${className}`}>
        <img
            src="/assets/images/logo-background.png"
            alt=""
            className="w-[600px] h-[600px] object-contain"
            style={{ filter: 'grayscale(100%)' }}
        />
    </div>
);

export default {
    MeditationIllustration,
    ReflectionIllustration,
    TaskIllustration,
    CalmMoodIllustration,
    EnergizedMoodIllustration,
    AnxiousMoodIllustration,
    GratefulMoodIllustration,
    SleepCategoryIcon,
    AnxietyCategoryIcon,
    FocusCategoryIcon,
    BeginnersCategoryIcon,
    SoundsCategoryIcon,
    KidsCategoryIcon,
    WalkingPersonIllustration,
    FloatingOrbs,
    LogoWatermark
};
