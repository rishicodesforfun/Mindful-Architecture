import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayContent, getBlockInfo } from '../data/curriculum';

// Beautiful Day view page matching the reference design
const DayView: React.FC = () => {
    const navigate = useNavigate();
    const { dayNum } = useParams<{ dayNum: string }>();
    const { user, completeSession, getTodayCompletion, toggleFavorite, isFavorite } = useUser();
    const isDark = user.nightMode;

    const day = parseInt(dayNum || '1', 10);
    const content = getDayContent(day);
    console.log('[DEBUG] DayView Content:', { day, title: content?.task.title, image: content?.task.image });
    const blockInfo = getBlockInfo(content?.block || 1);
    const todayCompletion = getTodayCompletion();

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Day not found</p>
            </div>
        );
    }

    const handleCompleteTask = () => {
        completeSession('task');
        navigate('/journey');
    };

    const handleStartMeditation = () => {
        navigate(`/daily-session?day=${day}`);
    };

    const handleStartJournal = () => {
        navigate(`/journal?day=${day}`);
    };

    const isTaskComplete = todayCompletion?.task && user.currentDay === day;
    const isMeditationComplete = todayCompletion?.meditation && user.currentDay === day;
    const isReflectionComplete = todayCompletion?.reflection && user.currentDay === day;

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#fcfcfc]'} font-['Manrope'] overflow-hidden`}>

            {/* Ambient backgrounds */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3D6B5B]/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="fixed bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#E2B19F]/10 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

            {/* Header */}
            <header className={`relative z-10 flex items-center justify-between px-6 pt-12 pb-4`}>
                <button
                    onClick={() => navigate('/journey')}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white/50 hover:bg-white/80'} transition-all active:scale-95`}
                >
                    <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-[#111817]'}`}>arrow_back</span>
                </button>
                <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white/90' : 'text-[#111817]'}`}>
                    Day {content.day.toString().padStart(2, '0')} <span className="text-[#3D6B5B] mx-1">•</span> {content.title}
                </h2>
                <button
                    onClick={() => toggleFavorite(day)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white/50 hover:bg-white/80'} transition-all active:scale-95`}
                >
                    <span
                        className={`material-symbols-outlined ${isFavorite(day) ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-500'}`}
                        style={isFavorite(day) ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                        favorite
                    </span>
                </button>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-8">

                {/* Main Task Card */}
                <div className="group relative w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
                    {/* Card shadow */}
                    <div className={`absolute inset-4 rounded-3xl ${isDark ? 'bg-black/40' : 'bg-[#3D6B5B]/20'} blur-2xl transform translate-y-4 opacity-40 group-hover:opacity-50 transition-opacity`} />

                    <div className={`relative flex flex-col overflow-hidden rounded-[2rem] ${isDark ? 'bg-[#151E32] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'} shadow-xl`}>

                        {/* Illustration Section */}
                        <div className={`relative h-64 w-full ${isDark ? 'bg-[#0c111c]' : 'bg-[#F2F7F6]'} flex items-center justify-center overflow-hidden`}>
                            {content.task.image ? (
                                <img
                                    src={content.task.image}
                                    alt={content.task.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    {/* Decorative circles */}
                                    <div className={`absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full ${isDark ? 'bg-blue-500/10' : 'bg-[#3D6B5B]/10'}`} />
                                    <div className={`absolute bottom-0 left-0 h-40 w-40 -translate-x-10 translate-y-10 rounded-full ${isDark ? 'bg-indigo-500/10' : 'bg-[#E2B19F]/20'}`} />

                                    {/* Icon Illustration */}
                                    <div className={`relative z-10 w-32 h-32 rounded-full ${isDark ? 'bg-[#3D6B5B]/20' : 'bg-[#3D6B5B]/10'} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined text-[#3D6B5B] text-[64px]`}>
                                            {content.task.icon}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Bottom gradient fade */}
                            <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${isDark ? 'from-[#151E32]' : 'from-white'} to-transparent opacity-80`} />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-5 px-8 pb-8 pt-2">
                            {/* Badge */}
                            <div>
                                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#3D6B5B]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D6B5B]">
                                    <span className="material-symbols-outlined text-[16px]">footprint</span>
                                    <span>Lifestyle Task</span>
                                </div>

                                <h1 className={`text-3xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                    {content.task.title}
                                </h1>
                                <p className="mt-2 text-lg font-medium text-[#3D6B5B]">
                                    {content.task.subtitle}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />

                            {/* Description */}
                            <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {content.task.description}
                            </p>

                            {/* Duration badge */}
                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                {content.task.duration > 0 ? `${content.task.duration} minutes` : 'All day practice'}
                            </div>

                            {/* Action buttons */}
                            <div className="mt-4 flex flex-col gap-3">
                                <button
                                    onClick={handleCompleteTask}
                                    disabled={isTaskComplete}
                                    className={`group/btn relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl py-4 text-white shadow-lg transition-all active:scale-[0.98] ${isTaskComplete
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#3D6B5B] shadow-[#3D6B5B]/25 hover:shadow-[#3D6B5B]/40 hover:-translate-y-0.5'
                                        }`}
                                >
                                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                                    <span className="material-symbols-outlined relative z-10">
                                        {isTaskComplete ? 'check' : 'check_circle'}
                                    </span>
                                    <span className="relative z-10 text-base font-bold">
                                        {isTaskComplete ? 'Completed!' : 'Mark as Complete'}
                                    </span>
                                </button>

                                <button className={`w-full text-center text-sm font-medium transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                                    Remind me later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other activities for this day */}
                <div className="w-full max-w-md mt-6 space-y-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Also Today
                    </h3>

                    {/* Meditation */}
                    <button
                        onClick={handleStartMeditation}
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98] ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-white">self_improvement</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>{content.meditation.title}</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{content.meditation.duration} min meditation</p>
                        </div>
                        {isMeditationComplete ? (
                            <span className="material-symbols-outlined text-[#389485]">check_circle</span>
                        ) : (
                            <span className={`material-symbols-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>arrow_forward</span>
                        )}
                    </button>

                    {/* Reflection */}
                    <button
                        onClick={handleStartJournal}
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98] ${isDark ? 'bg-[#151E32]' : 'bg-white'} shadow-sm`}
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-white">edit_note</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>Journal</p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{content.reflection.prompt.slice(0, 40)}...</p>
                        </div>
                        {isReflectionComplete ? (
                            <span className="material-symbols-outlined text-[#389485]">check_circle</span>
                        ) : (
                            <span className={`material-symbols-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>arrow_forward</span>
                        )}
                    </button>
                </div>

                {/* Day navigation */}
                <div className="w-full max-w-md mt-8 flex items-center justify-between">
                    <button
                        onClick={() => day > 1 && navigate(`/day/${day - 1}`)}
                        disabled={day <= 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${day <= 1
                            ? 'opacity-30 cursor-not-allowed'
                            : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                            } ${isDark ? 'text-white' : 'text-gray-700'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        <span className="text-sm font-medium">Day {day - 1}</span>
                    </button>

                    <button
                        onClick={() => navigate('/journey')}
                        className={`p-2 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                    >
                        <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>grid_view</span>
                    </button>

                    <button
                        onClick={() => day < 30 && navigate(`/day/${day + 1}`)}
                        disabled={day >= 30}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${day >= 30
                            ? 'opacity-30 cursor-not-allowed'
                            : isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                            } ${isDark ? 'text-white' : 'text-gray-700'}`}
                    >
                        <span className="text-sm font-medium">Day {day + 1}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>

            </main>
        </div>
    );
};

export default DayView;
