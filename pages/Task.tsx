import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayContent } from '../data/curriculum';
import { WalkingPersonIllustration, LogoWatermark } from '../components/Illustrations';

const Task: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeSession, getTodayCompletion } = useUser();
  const [showReminder, setShowReminder] = useState(false);

  const [searchParams] = useSearchParams();
  const dayParam = searchParams.get('day');
  const viewingDay = dayParam ? parseInt(dayParam, 10) : user.currentDay;

  // Find completion for THIS specific day
  const dayCompletion = user.sessionCompletions.find(s => s.day === viewingDay);
  const isCompleted = dayCompletion?.task || false;

  const todayContent = getDayContent(viewingDay);
  const isDark = user.nightMode;

  const taskData = todayContent?.task || {
    title: 'Mindful Walking',
    description: 'Connect with the ground beneath you.',
    details: 'Today, take 10 minutes to walk without a destination. Focus solely on the sensation of your feet touching the ground and the rhythm of your breath. Notice the textures and sounds around you.',
    duration: 10,
    icon: 'directions_walk'
  };

  // Map content fields based on source (Curriculum vs Fallback)
  // Curriculum: subtitle (short), description (long)
  // Fallback: description (short), details (long)
  const displaySubtitle = 'subtitle' in taskData ? (taskData as any).subtitle : taskData.description;
  const displayBody = 'details' in taskData ? (taskData as any).details : taskData.description;

  const handleComplete = () => {
    completeSession('task', viewingDay);
    if (dayParam) {
      navigate(`/day/${viewingDay}`);
    } else {
      navigate('/home');
    }
  };

  const handleRemindLater = () => {
    setShowReminder(true);
    setTimeout(() => {
      setShowReminder(false);
      setShowReminder(false);
      if (dayParam) {
        navigate(`/day/${viewingDay}`);
      } else {
        navigate('/home');
      }
    }, 1500);
  };

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'
      } font-['Epilogue'] pb-24 overflow-hidden transition-colors duration-300`}>

      {/* Logo Watermark */}
      <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-6 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white'
            } shadow-sm`}
        >
          <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>arrow_back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
            Day {viewingDay.toString().padStart(2, '0')}
          </span>
          <span className={`${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>•</span>
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {todayContent?.title || 'Awareness'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6">
        {/* Task Card */}
        <div className={`relative rounded-3xl overflow-hidden ${isDark ? 'bg-[#161B22]' : 'bg-white'
          } shadow-lg`}>

          {/* Illustration Section */}
          <div className={`relative h-56 ${isDark ? 'bg-[#0c111c]' : 'bg-[#F2F7F6]'
            } flex items-center justify-center overflow-hidden`}>
            {/* Decorative circles */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${isDark ? 'bg-[#4FD1C5]/10' : 'bg-[#3D6B5B]/10'
              } translate-x-1/3 -translate-y-1/3`} />
            <div className={`absolute bottom-0 left-0 w-40 h-40 rounded-full ${isDark ? 'bg-orange-500/10' : 'bg-[#E2B19F]/20'
              } -translate-x-1/3 translate-y-1/3`} />

            {/* Illustration */}
            <WalkingPersonIllustration className="relative z-10 w-48 h-48" />

            {/* Bottom fade */}
            <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${isDark ? 'from-[#151E32]' : 'from-white'
              } to-transparent`} />

            {/* Completed badge */}
            {isCompleted && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3D6B5B] text-white text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Completed!
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 ${isDark ? 'bg-[#4FD1C5]/10' : 'bg-[#3D6B5B]/10'
              }`}>
              <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>
                footprint
              </span>
              <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>
                Lifestyle Task
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
              {taskData.title}
            </h1>

            {/* Subtitle */}
            <p className={`text-base mb-4 ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>
              {displaySubtitle}
            </p>

            {/* Divider */}
            <div className={`h-px w-full mb-4 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />

            {/* Details */}
            <p className={`text-base leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {displayBody}
            </p>

            {/* Action Buttons */}
            {!isCompleted ? (
              <>
                <button
                  onClick={handleComplete}
                  className="w-full py-4 rounded-2xl bg-[#3D6B5B] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#3D6B5B]/25 hover:shadow-[#3D6B5B]/40 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Mark as Complete
                </button>

                <button
                  onClick={handleRemindLater}
                  className={`w-full text-center py-3 text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                >
                  Remind me later
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-4xl text-[#3D6B5B] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                  celebration
                </span>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>Great job!</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  You've completed today's task
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 px-6 py-4 flex justify-around ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#F5F7F4]/90'
        } backdrop-blur-sm border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1">
          <span className={`material-symbols-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>wb_sunny</span>
          <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Today</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <span className={`material-symbols-outlined ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className={`text-xs font-medium ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>Practice</span>
        </button>
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1">
          <span className={`material-symbols-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>map</span>
          <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Journey</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1">
          <span className={`material-symbols-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>person</span>
          <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Profile</span>
        </button>
      </nav>

      {/* Reminder Toast */}
      {showReminder && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="bg-[#111817] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span className="text-sm font-medium">We'll remind you later</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;