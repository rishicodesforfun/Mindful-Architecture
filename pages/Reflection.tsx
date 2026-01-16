import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { getDayContent } from '../data/curriculum';
import {
    CalmMoodIllustration,
    EnergizedMoodIllustration,
    AnxiousMoodIllustration,
    GratefulMoodIllustration,
    LogoWatermark
} from '../components/Illustrations';

const Reflection: React.FC = () => {
    const navigate = useNavigate();
    const { user, saveReflection, completeSession } = useUser();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [journalText, setJournalText] = useState('');

    const todayContent = getDayContent(user.currentDay);
    const maxChars = 500;
    const isDark = user.darkMode;

    const moods = [
        { id: 'calm', label: 'Calm', Illustration: CalmMoodIllustration, bgLight: 'bg-blue-50', bgDark: 'bg-blue-950/30' },
        { id: 'energized', label: 'Energized', Illustration: EnergizedMoodIllustration, bgLight: 'bg-yellow-50', bgDark: 'bg-yellow-950/30' },
        { id: 'anxious', label: 'Anxious', Illustration: AnxiousMoodIllustration, bgLight: 'bg-purple-50', bgDark: 'bg-purple-950/30' },
        { id: 'grateful', label: 'Grateful', Illustration: GratefulMoodIllustration, bgLight: 'bg-green-50', bgDark: 'bg-green-950/30' },
    ];

    const handleSave = () => {
        if (selectedMood || journalText) {
            saveReflection({
                day: user.currentDay,
                mood: selectedMood as any,
                journal: journalText,
                date: new Date().toISOString()
            });
            completeSession('reflection');
            navigate('/home');
        }
    };

    const personaName = user.persona?.name || 'You';

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1015]' : 'bg-[#fafafa]'
            } font-['Epilogue'] pb-32 overflow-hidden transition-colors duration-300`}>

            {/* Logo Watermark */}
            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white'
                        } shadow-sm`}
                >
                    <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>arrow_back_ios_new</span>
                </button>

                <div className="text-center">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Day {user.currentDay.toString().padStart(2, '0')}
                    </p>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                        {todayContent?.title || 'Focus'}
                    </p>
                </div>

                <button
                    onClick={() => navigate('/home')}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white'
                        } shadow-sm`}
                >
                    <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>close</span>
                </button>
            </header>

            <main className="relative z-10 px-6">
                {/* Question */}
                <div className="text-center mb-8 mt-4">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                        How did this session
                    </h1>
                    <p className={`text-2xl font-serif italic ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                        make you feel?
                    </p>
                </div>

                {/* Mood Grid - 2x2 */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {moods.map((mood) => {
                        const isSelected = selectedMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => setSelectedMood(mood.id)}
                                className={`flex flex-col items-center justify-center py-6 rounded-2xl transition-all ${isSelected
                                        ? 'ring-2 ring-[#4b9b87] dark:ring-[#5EEAD4] scale-[1.02]'
                                        : ''
                                    } ${isDark ? mood.bgDark : mood.bgLight}`}
                            >
                                <div className="w-16 h-16 mb-3">
                                    <mood.Illustration className="w-full h-full" />
                                </div>
                                <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                    {mood.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Journal Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Take a moment for yourself, <span className={`font-bold ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>{personaName}</span>.
                        </p>
                        <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            edit_note
                        </span>
                    </div>

                    <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-[#161B22]' : 'bg-gray-50'
                        }`}>
                        <textarea
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value.slice(0, maxChars))}
                            placeholder="Write your thoughts here..."
                            rows={5}
                            className={`w-full p-4 bg-transparent resize-none focus:outline-none paper-input ${isDark
                                    ? 'text-white placeholder:text-gray-500'
                                    : 'text-[#111817] placeholder:text-gray-400'
                                }`}
                        />
                        <div className={`absolute bottom-3 right-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {journalText.length}/{maxChars}
                        </div>
                    </div>
                </div>
            </main>

            {/* Save Button - Fixed */}
            <div className={`fixed bottom-24 left-0 right-0 px-6 z-20`}>
                <button
                    onClick={handleSave}
                    disabled={!selectedMood && !journalText}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${selectedMood || journalText
                            ? 'bg-[#4b9b87] text-white shadow-lg shadow-[#4b9b87]/25 hover:shadow-[#4b9b87]/40 active:scale-[0.98]'
                            : isDark
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Save Reflection
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default Reflection;