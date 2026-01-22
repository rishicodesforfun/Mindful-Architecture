import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayContent } from '../data/curriculum';
import {
  MeditationIllustration,
  ReflectionIllustration,
  TaskIllustration,
  LogoWatermark
} from '../components/Illustrations';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, getTodayCompletion } = useUser();
  const todayCompletion = getTodayCompletion();
  const todayContent = getDayContent(user.currentDay);

  // Generate week dates
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = -1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        isToday: i === 0,
        isPast: i < 0
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="relative min-h-screen bg-[#F5F7F4] dark:bg-[#0B1121] font-['Epilogue'] pb-16 overflow-hidden transition-colors duration-300">

      {/* Logo Watermark Background */}
      <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <header className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Journey</p>
            <h1 className="text-2xl font-bold text-[#111818] dark:text-white">
              Day <span className="text-[#2B4D41] dark:text-[#4FD1C5]">{user.currentDay}</span> of 30
            </h1>
          </div>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e8f5f3] to-[#d0ebe6] dark:from-[#1e3a3a] dark:to-[#0d2626] flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-800"
          >
            <span className="text-xl">
              {user.avatar ? (user.avatar === 'avatar1' ? '🧘' : user.avatar === 'avatar2' ? '🌿' : '🙂') : '🙂'}
            </span>
          </button>
        </div>
      </header>

      {/* Week Calendar */}
      <div className="relative z-10 px-4 mb-3">
        <div className="flex justify-between items-center gap-2">
          {weekDates.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${d.isToday
                ? 'bg-[#2B4D41] dark:bg-[#4FD1C5] text-white dark:text-[#0B1121]'
                : d.isPast
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              <span className={`text-xs font-medium ${d.isToday ? 'text-white/80 dark:text-[#0B1121]/80' : ''}`}>
                {d.day}
              </span>
              <span className={`text-lg font-bold ${d.isToday ? '' : ''}`}>
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Cards Stack */}
      <main className="relative z-10 px-4 space-y-3">

        {/* Meditation Card */}
        <div
          onClick={() => navigate('/player')}
          className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.meditation
            ? 'bg-[#e8f5f3] dark:bg-[#0d3d3d] ring-2 ring-[#3D6B5B]'
            : 'bg-gradient-to-br from-[#e8f5f3] to-white dark:from-[#0d3d3d] dark:to-[#0B1121]'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3D6B5B]/10 dark:bg-[#4FD1C5]/20 mb-2">
                <span className="material-symbols-outlined text-[14px] text-[#3D6B5B] dark:text-[#4FD1C5]">spa</span>
                <span className="text-xs font-bold text-[#3D6B5B] dark:text-[#4FD1C5]">Meditation</span>
              </div>

              <h3 className="text-lg font-bold text-[#2C3E35] dark:text-white mb-0.5">
                {todayContent?.meditation.title || 'Morning Clarity'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {todayContent?.meditation.duration || 10} min audio
              </p>

              {/* Start Button */}
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111818] dark:bg-white text-white dark:text-[#111818] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Start
              </button>
            </div>

            {/* Illustration */}
            <div className="w-20 h-20 flex-shrink-0">
              <MeditationIllustration className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {todayCompletion?.meditation && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#4b9b87] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">check</span>
            </div>
          )}
        </div>

        {/* Reflection Card */}
        <div
          onClick={() => navigate('/reflection')}
          className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.reflection
            ? 'bg-[#fff5f3] dark:bg-[#3d1f1f] ring-2 ring-[#e57373]'
            : 'bg-gradient-to-br from-[#fff5f3] to-white dark:from-[#3d1f1f] dark:to-[#0B1015]'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e57373]/10 dark:bg-[#f87171]/20 mb-2">
                <span className="material-symbols-outlined text-[14px] text-[#e57373] dark:text-[#f87171]">edit_note</span>
                <span className="text-xs font-bold text-[#e57373] dark:text-[#f87171]">Reflection</span>
              </div>

              <h3 className="text-lg font-bold text-[#111818] dark:text-white mb-0.5">Daily Journal</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Write your thoughts</p>

              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] text-[#111818] dark:text-white text-sm font-bold border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Open
              </button>
            </div>

            <div className="w-24 h-24 flex-shrink-0">
              <ReflectionIllustration className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {todayCompletion?.reflection && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#e57373] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">check</span>
            </div>
          )}
        </div>

        {/* Task Card */}
        <div
          onClick={() => navigate('/task')}
          className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.task
            ? 'bg-[#eff6ff] dark:bg-[#1e2a4a] ring-2 ring-[#60a5fa]'
            : 'bg-gradient-to-br from-[#eff6ff] to-white dark:from-[#1e2a4a] dark:to-[#0B1015]'
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#60a5fa]/10 dark:bg-[#60a5fa]/20 mb-2">
                <span className="material-symbols-outlined text-[14px] text-[#60a5fa]">directions_walk</span>
                <span className="text-xs font-bold text-[#60a5fa]">Task</span>
              </div>

              <h3 className="text-xl font-bold text-[#111818] dark:text-white mb-1">
                {todayContent?.task.title || 'Mindful Walking'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Step away from screen</p>

              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1e1e1e] text-[#111818] dark:text-white text-sm font-bold border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                View
              </button>
            </div>

            <div className="w-24 h-24 flex-shrink-0">
              <TaskIllustration className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {todayCompletion?.task && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#60a5fa] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">check</span>
            </div>
          )}
        </div>

        {/* Recommended for You */}
        <section className="mt-5">
          <h2 className="text-base font-bold text-[#111818] dark:text-white mb-3">Recommended for You</h2>

          <div className="flex gap-3">
            {/* Quick Start Card */}
            <div
              onClick={() => {
                // Enable short session mode and go to player
                navigate('/player');
              }}
              className="flex-1 bg-white dark:bg-[#161B22] rounded-xl p-3 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#4b9b87]/10 dark:bg-[#5eead4]/20 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px] text-[#4b9b87] dark:text-[#5eead4]">bolt</span>
              </div>
              <h3 className="text-sm font-bold text-[#111818] dark:text-white mb-0.5">Quick Start</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">For Arjun</p>
            </div>

            {/* Sleep Ready Card */}
            <div
              onClick={() => navigate('/player')}
              className="flex-1 bg-white dark:bg-[#161B22] rounded-xl p-3 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px] text-indigo-500 dark:text-indigo-400">bedtime</span>
              </div>
              <h3 className="text-sm font-bold text-[#111818] dark:text-white mb-0.5">Sleep Ready</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">For Rohan</p>
            </div>
          </div>
        </section>

        {/* 7-Day Mood Trends */}
        <section className="mt-5">
          <h2 className="text-base font-bold text-[#111818] dark:text-white mb-3">Your Mood This Week</h2>
          <div className="bg-white dark:bg-[#161B22] rounded-xl p-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800">
            {/* Mood Chart */}
            <div className="flex items-end justify-between gap-2 h-24 mb-4">
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
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full rounded-t-lg transition-all ${d.mood === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : d.mood >= 4
                        ? 'bg-gradient-to-t from-[#4b9b87] to-[#5EEAD4]'
                        : d.mood === 3
                          ? 'bg-yellow-400 dark:bg-yellow-600'
                          : 'bg-orange-400 dark:bg-orange-600'
                      }`} style={{
                        height: d.mood === 0 ? '16px' : `${(d.mood / 5) * 100}%`,
                        minHeight: '16px'
                      }}>
                      {d.mood > 0 && (
                        <div className="w-full flex items-start justify-center pt-0.5">
                          <span className="text-[10px]">
                            {d.mood === 5 ? '😊' : d.mood === 4 ? '🙂' : d.mood === 3 ? '😐' : d.mood === 2 ? '😔' : '😫'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${d.isToday
                      ? 'text-[#4b9b87] dark:text-[#5eead4]'
                      : 'text-gray-400 dark:text-gray-500'
                      }`}>
                      {d.label}
                    </span>
                  </div>
                ));
              })()}
            </div>

            {user.moodHistory.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                Complete mood check-ins to see your trends
              </p>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avg: {(user.moodHistory.slice(-7).reduce((a, m) => a + m.mood, 0) / Math.max(user.moodHistory.slice(-7).length, 1)).toFixed(1)}/5
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-[#4b9b87] dark:text-[#5eead4]"
                >
                  See Details →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Favorites Quick Access */}
        {user.favoriteDays.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#111818] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                Your Favorites
              </h2>
              <button
                onClick={() => navigate('/library')}
                className="text-sm font-medium text-[#4b9b87] dark:text-[#5eead4]"
              >
                View All →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {user.favoriteDays.slice(0, 3).map((dayNum) => {
                const dayContent = getDayContent(dayNum);
                if (!dayContent) return null;
                return (
                  <div
                    key={dayNum}
                    onClick={() => navigate(`/day/${dayNum}`)}
                    className="min-w-[140px] bg-white dark:bg-[#161B22] rounded-2xl p-4 shadow-sm dark:shadow-none border border-red-100 dark:border-red-900/30 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-red-500 text-[16px]">spa</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Day {dayNum}</p>
                    <p className="font-bold text-sm text-[#111818] dark:text-white truncate">{dayContent.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;