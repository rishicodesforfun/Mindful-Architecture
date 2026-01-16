import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
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
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0B1015] font-['Epilogue'] pb-24 overflow-hidden transition-colors duration-300">

      {/* Logo Watermark Background */}
      <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Journey</p>
            <h1 className="text-3xl font-bold text-[#111818] dark:text-white">
              Day <span className="text-[#2b5664] dark:text-[#5eead4]">{user.currentDay}</span> of 30
            </h1>
          </div>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8f5f3] to-[#d0ebe6] dark:from-[#1e3a3a] dark:to-[#0d2626] flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-800"
          >
            <span className="text-xl">
              {user.avatar ? (user.avatar === 'avatar1' ? '🧘' : user.avatar === 'avatar2' ? '🌿' : '🙂') : '🙂'}
            </span>
          </button>
        </div>
      </header>

      {/* Week Calendar */}
      <div className="relative z-10 px-6 mb-6">
        <div className="flex justify-between items-center gap-2">
          {weekDates.map((d, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${d.isToday
                  ? 'bg-[#2b5664] dark:bg-[#5eead4] text-white dark:text-[#0B1015]'
                  : d.isPast
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
            >
              <span className={`text-xs font-medium ${d.isToday ? 'text-white/80 dark:text-[#0B1015]/80' : ''}`}>
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
      <main className="relative z-10 px-6 space-y-4">

        {/* Meditation Card */}
        <div
          onClick={() => navigate('/player')}
          className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.meditation
              ? 'bg-[#e8f5f3] dark:bg-[#0d3d3d] ring-2 ring-[#4b9b87]'
              : 'bg-gradient-to-br from-[#e8f5f3] to-white dark:from-[#0d3d3d] dark:to-[#0B1015]'
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4b9b87]/10 dark:bg-[#5eead4]/20 mb-2">
                <span className="material-symbols-outlined text-[14px] text-[#4b9b87] dark:text-[#5eead4]">spa</span>
                <span className="text-xs font-bold text-[#4b9b87] dark:text-[#5eead4]">Meditation</span>
              </div>

              <h3 className="text-xl font-bold text-[#111818] dark:text-white mb-1">
                {todayContent?.meditation.title || 'Morning Clarity'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {todayContent?.meditation.duration || 10} min audio
              </p>

              {/* Start Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111818] dark:bg-white text-white dark:text-[#111818] text-sm font-bold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Start
              </button>
            </div>

            {/* Illustration */}
            <div className="w-24 h-24 flex-shrink-0">
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
          className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.reflection
              ? 'bg-[#fff5f3] dark:bg-[#3d1f1f] ring-2 ring-[#e57373]'
              : 'bg-gradient-to-br from-[#fff5f3] to-white dark:from-[#3d1f1f] dark:to-[#0B1015]'
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e57373]/10 dark:bg-[#f87171]/20 mb-2">
                <span className="material-symbols-outlined text-[14px] text-[#e57373] dark:text-[#f87171]">edit_note</span>
                <span className="text-xs font-bold text-[#e57373] dark:text-[#f87171]">Reflection</span>
              </div>

              <h3 className="text-xl font-bold text-[#111818] dark:text-white mb-1">Daily Journal</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Write your thoughts</p>

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
          className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${todayCompletion?.task
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Step away from screen</p>

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
        <section className="mt-8">
          <h2 className="text-lg font-bold text-[#111818] dark:text-white mb-4">Recommended for You</h2>

          <div className="flex gap-3">
            {/* Quick Start Card */}
            <div
              onClick={() => {
                // Enable short session mode and go to player
                navigate('/player');
              }}
              className="flex-1 bg-white dark:bg-[#161B22] rounded-2xl p-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#4b9b87]/10 dark:bg-[#5eead4]/20 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px] text-[#4b9b87] dark:text-[#5eead4]">bolt</span>
              </div>
              <h3 className="font-bold text-[#111818] dark:text-white mb-1">Quick Start</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">For Arjun</p>
            </div>

            {/* Sleep Ready Card */}
            <div
              onClick={() => navigate('/player')}
              className="flex-1 bg-white dark:bg-[#161B22] rounded-2xl p-4 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px] text-indigo-500 dark:text-indigo-400">bedtime</span>
              </div>
              <h3 className="font-bold text-[#111818] dark:text-white mb-1">Sleep Ready</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">For Rohan</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;