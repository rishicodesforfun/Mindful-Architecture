import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import curriculum, { getBlockInfo } from '../data/curriculum';
import { LogoWatermark } from '../components/Illustrations';

const Journey: React.FC = () => {
    const navigate = useNavigate();
    const { user, getTodayCompletion } = useUser();
    const isDark = user.nightMode;
    const [selectedBlock, setSelectedBlock] = useState<1 | 2 | 3 | null>(null);

    // Group days by block
    const block1Days = curriculum.filter(d => d.block === 1);
    const block2Days = curriculum.filter(d => d.block === 2);
    const block3Days = curriculum.filter(d => d.block === 3);

    const getDayStatus = (day: number) => {
        const completion = user.sessionCompletions.find(s => s.day === day);
        if (!completion) return 'upcoming';
        if (completion.meditation && completion.reflection && completion.task) return 'complete';
        if (completion.meditation || completion.reflection || completion.task) return 'partial';
        return 'upcoming';
    };

    const handleDaySelect = (day: number) => {
        navigate(`/day/${day}`);
    };

    const BlockCard = ({ block, name, days, color }: { block: 1 | 2 | 3, name: string, days: typeof block1Days, color: string }) => {
        const info = getBlockInfo(block);

        // Calculate granular progress (sessions vs days)
        // Total possible checkmarks = days * 3 (meditation + reflection + task)
        const totalItems = days.length * 3;
        const completedItems = days.reduce((acc, day) => {
            const s = user.sessionCompletions.find(sc => sc.day === day.day);
            if (!s) return acc;
            return acc + (s.meditation ? 1 : 0) + (s.reflection ? 1 : 0) + (s.task ? 1 : 0);
        }, 0);

        const percentComplete = Math.round((completedItems / totalItems) * 100);

        // For the text logic, we still show "Days Completed" or maybe "Activities Completed"?
        // User asked for progress bar to keep up.
        // Let's keep "X/10" as days purely for the text label if that's preferred, OR switch to %.
        // The screenshot shows "2/10". This likely refers to days. 
        // Let's keep the text as "Days Fully Complete" but the *bar* as granular?
        // Actually, "2/10" is misleading if I have done 9.9 days of work.
        // Let's change the text to show percentage or be more nuanced?
        // Design constraints: existing UI shows "2/10". 
        // Let's stick to days for the text count, but update the BAR width to be granular.

        const fullyCompletedDays = days.filter(d => getDayStatus(d.day) === 'complete').length;
        const isActive = block === Math.ceil(user.currentDay / 10) || (user.currentDay > 20 && block === 3);

        return (
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-lg`}>
                {/* Block Header */}
                <button
                    onClick={() => setSelectedBlock(selectedBlock === block ? null : block)}
                    className={`w-full p-4 text-left transition-all`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    {block === 1 ? 'foundation' : block === 2 ? 'landscape' : 'integration_instructions'}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                        Block {block}: {name}
                                    </h3>
                                    {isActive && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#3D6B5B]/20 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'}`}>
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {info?.focus}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {fullyCompletedDays}/{days.length} days
                            </span>
                            <span className={`material-symbols-outlined transition-transform ${selectedBlock === block ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                expand_more
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className={`h-1.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
                        <div
                            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentComplete}%` }}
                        />
                    </div>
                </button>

                {/* Days List */}
                {selectedBlock === block && (
                    <div className={`px-4 pb-4 space-y-2 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {days.map((day) => {
                                const status = getDayStatus(day.day);
                                const isCurrent = day.day === user.currentDay;

                                return (
                                    <button
                                        key={day.day}
                                        onClick={() => handleDaySelect(day.day)}
                                        className={`p-4 rounded-2xl text-left transition-all active:scale-[0.98] ${isCurrent
                                            ? isDark ? 'bg-[#3D6B5B]/20 ring-2 ring-[#3D6B5B]' : 'bg-[#3D6B5B]/10 ring-2 ring-[#3D6B5B]'
                                            : status === 'complete'
                                                ? isDark ? 'bg-[#3D6B5B]/10' : 'bg-green-50'
                                                : status === 'partial'
                                                    ? isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'
                                                    : isDark ? 'bg-white/5' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Day {day.day}
                                            </span>
                                            {status === 'complete' && (
                                                <span className="material-symbols-outlined text-[#3D6B5B] text-[16px]">check_circle</span>
                                            )}
                                            {status === 'partial' && (
                                                <span className={`material-symbols-outlined text-[16px] ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>pending</span>
                                            )}
                                            {isCurrent && status !== 'complete' && (
                                                <span className="w-2 h-2 rounded-full bg-[#3D6B5B] animate-pulse" />
                                            )}
                                        </div>
                                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                            {day.title}
                                        </p>
                                        <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {day.theme}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#fcfcfc]'} font-['Manrope'] pb-16 overflow-hidden transition-colors duration-300`}>

            {/* Ambient background */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3D6B5B]/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="fixed bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#E2B19F]/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <header className={`sticky top-0 z-30 px-4 pt-4 pb-3 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#fcfcfc]/90'} backdrop-blur-xl`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>30-Day Program</p>
                        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Your Journey
                        </h1>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${isDark ? 'bg-[#3D6B5B]/20 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'} text-sm font-bold`}>
                        Day {user.currentDay}/30
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-4 space-y-3">

                {/* Progress Overview */}
                <div className={`rounded-xl p-4 ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            Overall Progress
                        </h2>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round((user.sessionCompletions.reduce((acc, s) => acc + (s.meditation ? 1 : 0) + (s.task ? 1 : 0) + (s.reflection ? 1 : 0), 0) / (30 * 3)) * 100)}%
                        </span>
                    </div>

                    <div className={`h-3 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
                        <div
                            className="h-full bg-gradient-to-r from-[#3D6B5B] to-[#4FD1C5] rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((user.sessionCompletions.reduce((acc, s) => acc + (s.meditation ? 1 : 0) + (s.task ? 1 : 0) + (s.reflection ? 1 : 0), 0) / (30 * 3)) * 100)}%` }}
                        />
                    </div>

                    <div className="flex justify-between mt-3">
                        {[1, 2, 3].map((block) => (
                            <div key={block} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${block === 1 ? 'bg-gradient-to-r from-teal-400 to-teal-600' :
                                    block === 2 ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' :
                                        'bg-gradient-to-r from-purple-400 to-purple-600'
                                    }`} />
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Block {block}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blocks */}
                <BlockCard block={1} name="Foundation" days={block1Days} color="from-teal-400 to-teal-600" />
                <BlockCard block={2} name="Depth" days={block2Days} color="from-indigo-400 to-indigo-600" />
                <BlockCard block={3} name="Integration" days={block3Days} color="from-purple-400 to-purple-600" />

            </main>
        </div>
    );
};

export default Journey;
