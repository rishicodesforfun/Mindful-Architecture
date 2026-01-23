import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayContent, getBlockInfo } from '../data/curriculum';
import { LogoWatermark } from '../components/Illustrations';
import { requestNotificationPermission, sendWelcomeNotification } from '../src/services/notificationService';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, getTodayCompletion, getCurrentBlock, advanceDay } = useUser();
    const isDark = user.nightMode;
    const [showFullJourney, setShowFullJourney] = useState(false);

    // Auto specific request: Prompt for notifications as soon as dashboard opens
    React.useEffect(() => {
        const checkPermission = async () => {
            if ('Notification' in window && Notification.permission === 'default') {
                const granted = await requestNotificationPermission();
                if (granted) sendWelcomeNotification();
            }
        };
        checkPermission();
    }, []);

    const todayCompletion = getTodayCompletion();
    const currentBlock = getCurrentBlock();
    const blockInfo = getBlockInfo(currentBlock);
    const todayContent = getDayContent(user.currentDay);

    // Determine the single "Next Step" focus
    // Priority: Meditation -> Task -> Journal -> Done
    const getFocusStatus = () => {
        if (!todayCompletion?.meditation) return 'meditation';
        if (!todayCompletion?.task) return 'task';
        if (!todayCompletion?.reflection) return 'reflection';
        return 'complete';
    };

    const focusStatus = getFocusStatus();

    // Journey timeline logic
    const journeyDays = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const completion = user.sessionCompletions.find(s => s.day === day);
        const isComplete = completion && completion.meditation && completion.reflection && completion.task;
        const isPartial = completion && (completion.meditation || completion.reflection || completion.task);
        return { day, isComplete, isPartial, isCurrent: day === user.currentDay };
    });

    // 7-Day Window View
    const getVisibleJourneyDays = () => {
        if (showFullJourney) return journeyDays;

        // Show current day centered-ish (e.g. starting from currentDay - 3)
        // Ensure we don't go below 0 or above 30
        let start = Math.max(0, user.currentDay - 4);
        const end = Math.min(30, start + 7);
        // Adjust start if end is capped at 30
        if (end === 30) start = Math.max(0, 30 - 7);

        return journeyDays.slice(start, end);
    };

    const visibleDays = getVisibleJourneyDays();

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'} font-['Epilogue'] pb-24 overflow-hidden transition-colors duration-300`}>

            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

            {/* Header: Personal & Calm */}
            <header className={`sticky top-0 z-30 px-6 pt-6 pb-2 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#F5F7F4]/90'} backdrop-blur-xl`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date().getHours() < 12 ? 'Good Morning,' : new Date().getHours() < 18 ? 'Good Afternoon,' : 'Good Evening,'}
                        </p>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            {user.name || 'Friend'}
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform hover:scale-105 ${isDark ? 'bg-[#151E32] ring-1 ring-white/10' : 'bg-white shadow-sm'}`}
                    >
                        {user.avatar ? (user.avatar === 'avatar1' ? '🧘' : user.avatar === 'avatar2' ? '🌿' : '🙂') : '🙂'}
                    </button>
                </div>
            </header>

            <main className="relative z-10 px-4 space-y-6 mt-2">

                {/* 1. HERO: The Focus Card */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className={`font-bold text-sm uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Next Step
                        </h2>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#4FD1C5]/10 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'}`}>
                            Day {user.currentDay}
                        </span>
                    </div>

                    {focusStatus === 'complete' ? (
                        <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-gradient-to-br from-[#4b9b87]/20 to-[#151E32] border border-[#4b9b87]/30' : 'bg-gradient-to-br from-[#e8f5f3] to-white border border-[#4b9b87]/10'}`}>
                            <div className="w-16 h-16 rounded-full bg-[#4b9b87] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4b9b87]/30 animate-pulse">
                                <span className="material-symbols-outlined text-[32px]">check</span>
                            </div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>Day {user.currentDay} Complete!</h3>
                            <p className={`text-sm mt-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Great work today. Rest well.</p>
                            {user.currentDay < 30 && (
                                <button
                                    onClick={() => advanceDay()}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-white text-[#111817]' : 'bg-[#111817] text-white'} hover:opacity-90 active:scale-95`}
                                >
                                    Start Day {user.currentDay + 1} →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                if (focusStatus === 'meditation') navigate('/daily-session');
                                else if (focusStatus === 'task') navigate('/task');
                                else if (focusStatus === 'reflection') navigate('/journal');
                            }}
                            className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg active:scale-[0.99] ${isDark ? 'bg-[#151E32] ring-1 ring-white/5' : 'bg-white shadow-sm ring-1 ring-black/5'
                                }`}
                        >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${focusStatus === 'meditation' ? 'bg-[#3D6B5B] dark:bg-[#4FD1C5]' :
                                    focusStatus === 'task' ? 'bg-[#60a5fa]' : 'bg-[#e57373]'
                                }`} />

                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-2 ${focusStatus === 'meditation' ? 'bg-[#3D6B5B]/10 text-[#3D6B5B] dark:text-[#4FD1C5]' :
                                            focusStatus === 'task' ? 'bg-[#60a5fa]/10 text-[#60a5fa]' :
                                                'bg-[#e57373]/10 text-[#e57373]'
                                        }`}>
                                        {focusStatus === 'meditation' ? 'Meditation' : focusStatus === 'task' ? 'Mindful Task' : 'Reflection'}
                                    </span>
                                    <h3 className={`text-2xl font-bold leading-tight mb-2 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                        {focusStatus === 'meditation' ? (todayContent?.meditation.title || 'Daily Meditation') :
                                            focusStatus === 'task' ? (todayContent?.task.title || 'Daily Task') :
                                                'Daily Journal'}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {focusStatus === 'meditation' ? `${todayContent?.meditation.duration || 10} min audio session` :
                                            focusStatus === 'task' ? 'Simple activity to practice mindfulness' :
                                                'Reflect on your day and feelings'}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'
                                    }`}>
                                    <span className={`material-symbols-outlined text-[28px] ${isDark ? 'text-white' : 'text-[#111817]'
                                        }`}>
                                        play_arrow
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. STATS SCROLL: Horizontal Strip */}
                <section>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {/* Streak */}
                        <div className={`min-w-[120px] flex-1 p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-500'}`}>
                                <span className="material-symbols-outlined">local_fire_department</span>
                            </div>
                            <div>
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>{user.streak}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Day Streak</p>
                            </div>
                        </div>
                        {/* Minutes */}
                        <div className={`min-w-[120px] flex-1 p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-500'}`}>
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div>
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>{user.sessionCompletions.length * 10}m</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Mindful Time</p>
                            </div>
                        </div>
                        {/* Achievements */}
                        <div className={`min-w-[120px] flex-1 p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-500'}`}>
                                <span className="material-symbols-outlined">emoji_events</span>
                            </div>
                            <div>
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>{user.unlockedAchievements.length}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Badges</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SIMPLIFIED JOURNEY: 7-Day Window */}
                <section className={`rounded-2xl p-5 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Your Journey
                        </h2>
                        <button
                            onClick={() => setShowFullJourney(!showFullJourney)}
                            className={`text-xs font-bold ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}
                        >
                            {showFullJourney ? 'Show Less' : 'View Full Map'}
                        </button>
                    </div>

                    <div className={`grid gap-2 ${showFullJourney ? 'grid-cols-6 sm:grid-cols-10' : 'grid-cols-7'}`}>
                        {visibleDays.map((d) => (
                            <div key={d.day} className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${d.isCurrent
                                        ? 'bg-[#3D6B5B] dark:bg-[#4FD1C5] text-white dark:text-[#0B1121] scale-110 shadow-md'
                                        : d.isComplete
                                            ? isDark ? 'bg-[#4FD1C5]/20 text-[#4FD1C5]' : 'bg-[#3D6B5B]/20 text-[#3D6B5B]'
                                            : d.isPartial
                                                ? isDark ? 'bg-yellow-500/20 text-yellow-500' : 'bg-yellow-100 text-yellow-600'
                                                : isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-300'
                                        }`}
                                >
                                    {d.isComplete ? '✓' : d.day}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. BENTO GRID: Secondary Items */}
                <section className="grid grid-cols-2 gap-3">
                    {/* Sleep Card */}
                    <div className={`col-span-1 rounded-2xl p-4 flex flex-col justify-between h-32 ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'} cursor-pointer`} onClick={() => navigate('/player')}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-200 text-indigo-700'}`}>
                            <span className="material-symbols-outlined text-[18px]">bedtime</span>
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>{user.nightMode ? 'Night Mode On' : 'Sleep Ready'}</h3>
                            <p className={`text-[10px] ${isDark ? 'text-indigo-400' : 'text-indigo-700/70'}`}>Prepare for rest</p>
                        </div>
                    </div>

                    {/* Mood Trends Card */}
                    <div className={`col-span-1 rounded-2xl p-4 flex flex-col justify-between h-32 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm cursor-pointer`} onClick={() => navigate('/journal')}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            <span className="material-symbols-outlined text-[18px]">show_chart</span>
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#111817]'}`}>Mood Trends</h3>
                            <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Check your insights</p>
                        </div>
                    </div>

                    {/* Support / Programs Link */}
                    <div className={`col-span-2 rounded-2xl p-4 flex items-center justify-between ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm cursor-pointer`} onClick={() => navigate('/programs')}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#4FD1C5]/10 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'}`}>
                                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#111817]'}`}>Browse Programs</h3>
                                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Explore guided series</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                    </div>
                </section>

                {/* Footer Quote or Decorative */}
                <div className="text-center py-6 opacity-30">
                    <p className="text-xs font-serif italic">"Breath is the bridge between mind and body."</p>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;