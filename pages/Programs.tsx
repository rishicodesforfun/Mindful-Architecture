import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { LogoWatermark } from '../components/Illustrations';

const Programs: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const isDark = user.nightMode;

    const programs = [
        {
            id: 'anxiety',
            title: 'Calm',
            subtitle: 'Reduce Anxiety & Stress',
            duration: '30 days',
            sessions: 30,
            icon: 'spa',
            color: 'from-teal-400 to-teal-600',
            bgLight: 'bg-teal-50',
            bgDark: 'bg-teal-900/20',
            description: 'A comprehensive program to help you manage anxiety and find inner peace through guided meditation and breathing exercises.'
        },
        {
            id: 'sleep',
            title: 'Sleep',
            subtitle: 'Better Rest & Recovery',
            duration: '21 days',
            sessions: 21,
            icon: 'bedtime',
            color: 'from-indigo-400 to-indigo-600',
            bgLight: 'bg-indigo-50',
            bgDark: 'bg-indigo-900/20',
            description: 'Wind down with sleep stories, relaxation techniques, and evening rituals designed to improve your sleep quality.'
        },
        {
            id: 'focus',
            title: 'Focus',
            subtitle: 'Sharpen Your Mind',
            duration: '14 days',
            sessions: 14,
            icon: 'center_focus_strong',
            color: 'from-amber-400 to-amber-600',
            bgLight: 'bg-amber-50',
            bgDark: 'bg-amber-900/20',
            description: 'Enhance concentration and productivity with mindfulness practices designed for busy professionals.'
        },
        {
            id: 'beginners',
            title: 'Foundations',
            subtitle: 'Start Your Journey',
            duration: '7 days',
            sessions: 7,
            icon: 'self_improvement',
            color: 'from-green-400 to-green-600',
            bgLight: 'bg-green-50',
            bgDark: 'bg-green-900/20',
            description: 'Perfect for beginners. Learn the basics of meditation with simple, guided sessions.'
        },
        {
            id: 'confidence',
            title: 'Confidence',
            subtitle: 'Build Self-Esteem',
            duration: '21 days',
            sessions: 21,
            icon: 'psychology',
            color: 'from-purple-400 to-purple-600',
            bgLight: 'bg-purple-50',
            bgDark: 'bg-purple-900/20',
            description: 'Develop inner strength and self-confidence through positive affirmations and visualization.'
        },
        {
            id: 'lifestyle',
            title: 'Balance',
            subtitle: 'Mindful Living',
            duration: '30 days',
            sessions: 30,
            icon: 'balance',
            color: 'from-rose-400 to-rose-600',
            bgLight: 'bg-rose-50',
            bgDark: 'bg-rose-900/20',
            description: 'Integrate mindfulness into daily life with practical exercises and lifestyle habits.'
        }
    ];

    const handleProgramSelect = (programId: string) => {
        // Navigate to daily session with selected program
        navigate(`/daily-session?program=${programId}`);
    };

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'} font-['Epilogue'] pb-16 overflow-hidden transition-colors duration-300`}>

            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <header className={`sticky top-0 z-30 px-4 pt-4 pb-3 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#F5F7F4]/90'} backdrop-blur-xl`}>
                <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                    Programs
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Choose your path to mindfulness
                </p>
            </header>

            {/* Programs Grid */}
            <main className="relative z-10 px-4 space-y-3">
                {programs.map((program) => (
                    <div
                        key={program.id}
                        onClick={() => handleProgramSelect(program.id)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center flex-shrink-0`}>
                                    <span className="material-symbols-outlined text-white text-[24px]">{program.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                            {program.title}
                                        </h3>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                            {program.duration}
                                        </span>
                                    </div>

                                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                                        {program.subtitle}
                                    </p>

                                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {program.description}
                                    </p>

                                    <div className={`flex items-center gap-4 mt-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                            {program.sessions} sessions
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            10-15 min each
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current program indicator */}
                        {user.selectedTheme === program.id && (
                            <div className={`px-4 py-2 ${isDark ? 'bg-[#5EEAD4]/10' : 'bg-[#4b9b87]/10'} border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                <span className={`text-xs font-bold ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                                    ✓ Currently Active • Day {user.currentDay}/30
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Programs;
