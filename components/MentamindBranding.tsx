import React from 'react';

// Mentamind brain-heart logo
const MentamindLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="50%" stopColor="#2d1b4e" />
                <stop offset="100%" stopColor="#1e3a5f" />
            </linearGradient>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#e91e63" />
                <stop offset="100%" stopColor="#ff6b35" />
            </linearGradient>
            <linearGradient id="neuronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="50%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
        </defs>
        {/* Brain-heart base */}
        <path
            d="M50 90 L20 60 Q10 50 20 35 Q25 25 40 25 Q45 20 50 20 Q55 20 60 25 Q75 25 80 35 Q90 50 80 60 L50 90 Z"
            fill="url(#brainGradient)"
        />
        {/* Heart bottom glow */}
        <path
            d="M50 85 L25 58 Q50 75 75 58 L50 85 Z"
            fill="url(#heartGradient)"
            opacity="0.9"
        />
        {/* Neural network pattern */}
        <g stroke="url(#neuronGradient)" strokeWidth="1.5" fill="none" opacity="0.8">
            {/* Left brain */}
            <path d="M30 45 Q25 40 30 35 Q35 30 40 35" />
            <path d="M35 50 Q30 45 35 40" />
            <path d="M40 55 Q35 50 38 45" />
            {/* Center spine */}
            <path d="M50 30 L50 55" />
            <path d="M45 35 L55 35" />
            <path d="M45 45 L55 45" />
            {/* Right brain */}
            <path d="M70 45 Q75 40 70 35 Q65 30 60 35" />
            <path d="M65 50 Q70 45 65 40" />
            <path d="M60 55 Q65 50 62 45" />
        </g>
    </svg>
);

interface MentamindBrandingProps {
    variant?: 'footer' | 'watermark' | 'header' | 'nav';
    showText?: boolean;
}

const MentamindBranding: React.FC<MentamindBrandingProps> = ({
    variant = 'footer',
    showText = true
}) => {
    if (variant === 'nav') {
        // Center nav button with logo
        return (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d1b4e] flex items-center justify-center shadow-lg -mt-6">
                <MentamindLogo size={32} />
            </div>
        );
    }

    if (variant === 'watermark') {
        // Subtle watermark in corner
        return (
            <div className="fixed bottom-24 right-4 z-10 opacity-30 dark:opacity-20 pointer-events-none">
                <MentamindLogo size={48} />
            </div>
        );
    }

    if (variant === 'header') {
        // Logo in header
        return (
            <div className="flex items-center gap-2">
                <MentamindLogo size={32} />
                {showText && (
                    <span className="font-bold text-[#111618] dark:text-white text-lg tracking-tight">Mentamind</span>
                )}
            </div>
        );
    }

    // Default: footer branding
    return (
        <div className="flex items-center justify-center gap-2 py-4 px-6">
            <MentamindLogo size={24} />
            {showText && (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    Powered by <span className="text-gray-600 dark:text-gray-400 font-semibold">Mentamind</span>
                </span>
            )}
        </div>
    );
};

export { MentamindLogo };
export default MentamindBranding;
