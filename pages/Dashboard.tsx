import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { getDayContent, getBlockInfo } from '../data/curriculum';
import { LogoWatermark } from '../components/Illustrations';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, getTodayCompletion, getCurrentBlock } = useUser();
    const isDark = user.nightMode;

    const todayCompletion = getTodayCompletion();
    const currentBlock = getCurrentBlock();
    const blockInfo = getBlockInfo(currentBlock);
    const todayContent = getDayContent(user.currentDay);

    // Calculate completed sessions
    const completedToday = [
        todayCompletion?.meditation,
        todayCompletion?.reflection,
        todayCompletion?.task
    ].filter(Boolean).length;

    // Journey timeline
    const journeyDays = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const completion = user.sessionCompletions.find(s => s.day === day);
        const isComplete = completion && completion.meditation && completion.reflection && completion.task;
        const isPartial = completion && (completion.meditation || completion.reflection || completion.task);
        return { day, isComplete, isPartial, isCurrent: day === user.currentDay };
    });

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'} font-['Epilogue'] pb-24 overflow-hidden transition-colors duration-300`}>

            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <header className={`sticky top-0 z-30 px-6 pt-12 pb-4 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#F5F7F4]/90'} backdrop-blur-xl`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your Journey</p>
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Dashboard
                        </h1>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${isDark ? 'bg-[#4FD1C5]/20 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'} text-sm font-bold`}>
                        Day {user.currentDay}/30
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-6 space-y-6">

                {/* Today's Progress Card */}
                <div className={`rounded-3xl p-6 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Today's Progress
                        </h2>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {completedToday}/3 complete
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden mb-4`}>
                        <div
                            className="h-full bg-gradient-to-r from-[#3D6B5B] to-[#4FD1C5] rounded-full transition-all duration-500"
                            style={{ width: `${(completedToday / 3) * 100}%` }}
                        />
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${todayCompletion?.meditation ? 'bg-[#3D6B5B] text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-[16px]">{todayCompletion?.meditation ? 'check' : 'spa'}</span>
                            </div>
                            <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Meditation</span>
                            {!todayCompletion?.meditation && (
                                <button onClick={() => navigate('/daily-session')} className={`text-sm font-medium ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>Start →</button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${todayCompletion?.reflection ? 'bg-[#3D6B5B] text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-[16px]">{todayCompletion?.reflection ? 'check' : 'edit_note'}</span>
                            </div>
                            <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Journal</span>
                            {!todayCompletion?.reflection && (
                                <button onClick={() => navigate('/journal')} className={`text-sm font-medium ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>Write →</button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${todayCompletion?.task ? 'bg-[#3D6B5B] text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-[16px]">{todayCompletion?.task ? 'check' : 'task_alt'}</span>
                            </div>
                            <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Daily Task</span>
                            {!todayCompletion?.task && (
                                <button onClick={() => navigate('/task')} className={`text-sm font-medium ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>View →</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sleep Readiness Indicator - For Rohan persona or night routine users */}
                {(user.persona === 'rohan' || user.routineTime === 'night') && (
                    <div className={`rounded-3xl p-6 ${isDark ? 'bg-gradient-to-br from-indigo-950 to-[#161B22]' : 'bg-gradient-to-br from-indigo-50 to-white'} shadow-sm ring-1 ${isDark ? 'ring-indigo-500/20' : 'ring-indigo-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                <span className={`material-symbols-outlined text-[28px] ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    bedtime
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    Sleep Readiness
                                </p>
                                {(() => {
                                    // Calculate sleep readiness score
                                    const hour = new Date().getHours();
                                    const isEvening = hour >= 18 || hour < 6;
                                    const hasMeditated = todayCompletion?.meditation;
                                    const recentMood = user.moodHistory.slice(-1)[0]?.mood || 3;

                                    let readinessScore = 0;
                                    if (hasMeditated) readinessScore += 40;
                                    if (isEvening) readinessScore += 20;
                                    if (recentMood >= 3) readinessScore += 20;
                                    if (user.nightMode) readinessScore += 20;

                                    const readinessLevel = readinessScore >= 80 ? 'Excellent' : readinessScore >= 60 ? 'Good' : readinessScore >= 40 ? 'Moderate' : 'Building';
                                    const readinessColor = readinessScore >= 80 ? 'text-green-500' : readinessScore >= 60 ? 'text-teal-500' : readinessScore >= 40 ? 'text-yellow-500' : 'text-orange-500';
                                    const readinessEmoji = readinessScore >= 80 ? '🌙' : readinessScore >= 60 ? '😌' : readinessScore >= 40 ? '🌤️' : '☀️';

                                    return (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                                    {readinessLevel}
                                                </h3>
                                                <span className="text-lg">{readinessEmoji}</span>
                                            </div>
                                            <div className={`mt-2 h-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${readinessScore >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                                        readinessScore >= 60 ? 'bg-gradient-to-r from-teal-400 to-teal-600' :
                                                            readinessScore >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                                                'bg-gradient-to-r from-orange-400 to-orange-600'
                                                        }`}
                                                    style={{ width: `${readinessScore}%` }}
                                                />
                                            </div>
                                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {!hasMeditated ? 'Complete evening meditation to improve' :
                                                    !user.nightMode ? 'Turn on night mode for better rest' :
                                                        'Ready for restful sleep'}
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* 7-Day Mood Trends Chart */}
                <div className={`rounded-3xl p-6 ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Mood Trends
                        </h2>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Last 7 days
                        </span>
                    </div>

                    {/* Mood Chart */}
                    <div className="flex items-end justify-between gap-2 h-32 mb-4">
                        {(() => {
                            const last7Days = Array.from({ length: 7 }, (_, i) => {
                                const dayNum = user.currentDay - 6 + i;
                                if (dayNum < 1) return { day: dayNum, mood: 0, label: '' };
                                const mood = user.moodHistory.find(m => m.day === dayNum);
                                const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                                const date = new Date();
                                date.setDate(date.getDate() - (6 - i));
                                return {
                                    day: dayNum,
                                    mood: mood?.mood || 0,
                                    label: dayNames[date.getDay()],
                                    isToday: i === 6
                                };
                            });

                            return last7Days.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    {/* Bar */}
                                    <div className={`w-full rounded-t-lg transition-all ${d.mood === 0
                                        ? isDark ? 'bg-gray-800' : 'bg-gray-100'
                                        : d.mood >= 4
                                            ? 'bg-gradient-to-t from-[#4b9b87] to-[#5EEAD4]'
                                            : d.mood === 3
                                                ? isDark ? 'bg-yellow-600' : 'bg-yellow-400'
                                                : isDark ? 'bg-orange-600' : 'bg-orange-400'
                                        }`} style={{
                                            height: d.mood === 0 ? '20%' : `${(d.mood / 5) * 100}%`,
                                            minHeight: '20px'
                                        }}>
                                        {d.mood > 0 && (
                                            <div className="w-full h-full flex items-start justify-center pt-1">
                                                <span className="text-xs">
                                                    {d.mood === 5 ? '😊' : d.mood === 4 ? '🙂' : d.mood === 3 ? '😐' : d.mood === 2 ? '😔' : '😫'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Day label */}
                                    <span className={`text-xs font-medium ${d.isToday
                                        ? isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'
                                        : isDark ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                        {d.label}
                                    </span>
                                </div>
                            ));
                        })()}
                    </div>

                    {/* Mood Summary */}
                    {(() => {
                        const recentMoods = user.moodHistory.slice(-7);
                        if (recentMoods.length === 0) {
                            return (
                                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Complete mood check-ins to see your trends
                                </p>
                            );
                        }
                        const avg = recentMoods.reduce((acc, m) => acc + m.mood, 0) / recentMoods.length;
                        const trend = recentMoods.length >= 2
                            ? recentMoods[recentMoods.length - 1].mood - recentMoods[0].mood
                            : 0;
                        return (
                            <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{avg >= 4 ? '😊' : avg >= 3 ? '😐' : '😔'}</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Avg: {avg.toFixed(1)}/5
                                    </span>
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0
                                    ? 'text-green-500'
                                    : trend < 0
                                        ? 'text-orange-500'
                                        : isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-[16px]">
                                        {trend > 0 ? 'trending_up' : trend < 0 ? 'trending_down' : 'trending_flat'}
                                    </span>
                                    {trend > 0 ? 'Improving' : trend < 0 ? 'Dipping' : 'Stable'}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Current Block */}
                <div className={`rounded-3xl p-6 ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#5EEAD4]/20' : 'bg-[#4b9b87]/10'}`}>
                            <span className={`material-symbols-outlined text-[28px] ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                                {currentBlock === 1 ? 'foundation' : currentBlock === 2 ? 'landscape' : 'integration_instructions'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Block {currentBlock} of 3
                            </p>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                {blockInfo?.name || 'Foundation'}
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {blockInfo?.focus || 'Building your foundation'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Journey Timeline */}
                <div className={`rounded-3xl p-6 ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}>
                    <h2 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                        30-Day Journey
                    </h2>

                    <div className="grid grid-cols-10 gap-1.5">
                        {journeyDays.map((d) => (
                            <div
                                key={d.day}
                                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${d.isCurrent
                                    ? 'bg-[#4b9b87] text-white ring-2 ring-[#4b9b87] ring-offset-2 dark:ring-offset-[#161B22]'
                                    : d.isComplete
                                        ? isDark ? 'bg-[#5EEAD4]/20 text-[#5EEAD4]' : 'bg-[#4b9b87]/20 text-[#4b9b87]'
                                        : d.isPartial
                                            ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                                            : d.day < user.currentDay
                                                ? isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                                                : isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-50 text-gray-300'
                                    }`}
                            >
                                {d.isComplete ? '✓' : d.day}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className={`flex items-center gap-4 mt-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded ${isDark ? 'bg-[#5EEAD4]/20' : 'bg-[#4b9b87]/20'}`} />
                            Complete
                        </span>
                        <span className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`} />
                            Partial
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-[#4b9b87]" />
                            Today
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate('/programs')}
                        className={`p-4 rounded-2xl ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm text-left`}
                    >
                        <span className={`material-symbols-outlined text-[24px] mb-2 ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                            grid_view
                        </span>
                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#111817]'}`}>Programs</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Browse all</p>
                    </button>

                    <button
                        onClick={() => navigate('/profile')}
                        className={`p-4 rounded-2xl ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm text-left`}
                    >
                        <span className={`material-symbols-outlined text-[24px] mb-2 ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>
                            settings
                        </span>
                        <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#111817]'}`}>Settings</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Preferences</p>
                    </button>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default Dashboard;