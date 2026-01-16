import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, ProgramTheme } from '../context/UserContext';
import { programThemes } from '../theme';

const ThemeSelection: React.FC = () => {
    const navigate = useNavigate();
    const { selectTheme, user, setPersona } = useUser();

    const handleSelectTheme = (themeId: ProgramTheme) => {
        selectTheme(themeId);

        // Auto-suggest persona based on theme
        const theme = programThemes.find(t => t.id === themeId);
        if (theme?.personas.includes('arjun')) {
            setPersona('arjun');
        } else if (theme?.personas.includes('rohan')) {
            setPersona('rohan');
        } else {
            setPersona('meera');
        }

        navigate('/onboarding');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#fafafa] text-[#111618] font-['Epilogue'] overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-[#37a49f]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-[#D7C29E]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <header className="relative px-6 pt-14 pb-6 z-10">
                <div className="text-center">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#37a49f]/80 border border-[#37a49f]/20 rounded-full bg-white/50 backdrop-blur-sm">
                        Choose Your Path
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight leading-[1.15] text-[#111618] mb-2">
                        What brings you<br />here today?
                    </h1>
                    <p className="text-gray-500 text-sm font-normal leading-relaxed max-w-[280px] mx-auto">
                        Select a focus area for your 30-day journey. You can always change this later.
                    </p>
                </div>
            </header>

            {/* Theme Grid */}
            <main className="flex-1 relative overflow-y-auto no-scrollbar px-6 pb-8 z-10">
                <div className="grid grid-cols-2 gap-4">
                    {programThemes.map((theme, index) => (
                        <button
                            key={theme.id}
                            onClick={() => handleSelectTheme(theme.id as ProgramTheme)}
                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 transition-all hover:shadow-lg hover:border-transparent hover:scale-[1.02] active:scale-[0.98] text-left animate-fade-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Colored accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: theme.color }}
                            />

                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors"
                                style={{ backgroundColor: `${theme.color}15` }}
                            >
                                <span
                                    className="material-symbols-outlined text-[24px]"
                                    style={{ color: theme.color }}
                                >
                                    {theme.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-base font-bold text-[#111618] mb-0.5 leading-tight">
                                {theme.name}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium">
                                {theme.subtitle}
                            </p>

                            {/* Persona hints */}
                            <div className="flex gap-1 mt-3">
                                {theme.personas.map(p => (
                                    <span
                                        key={p}
                                        className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 capitalize font-medium"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </main>

            {/* Footer hint */}
            <div className="px-6 pb-8 z-10">
                <p className="text-center text-xs text-gray-400">
                    Recommended: <span className="text-[#37a49f] font-semibold">{user.persona === 'rohan' ? 'Sleep' : user.persona === 'arjun' ? 'Focus' : 'Emotional Healing'}</span> for your profile
                </p>
            </div>
        </div>
    );
};

export default ThemeSelection;
