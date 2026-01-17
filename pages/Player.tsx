import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getDayContent } from '../data/curriculum';
import { FloatingOrbs } from '../components/Illustrations';
import confetti from 'canvas-confetti';

interface Session {
  id: string;
  title: string;
  duration: number;
  description: string;
}

const Player: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, completeSession } = useUser();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get day from URL param or use current day
  const dayParam = searchParams.get('day');
  const viewingDay = dayParam ? parseInt(dayParam, 10) : user.currentDay;
  const dayContent = getDayContent(viewingDay);

  // Build sessions list specific to this day
  const sessions: Session[] = dayContent ? [
    {
      id: 'today',
      title: dayContent.meditation.title,
      duration: dayContent.meditation.duration,
      description: dayContent.meditation.description
    },
    // Shorter version of today's meditation
    {
      id: 'short',
      title: dayContent.meditation.title,
      duration: dayContent.meditation.shortDuration || 5,
      description: 'Quick version - ' + (dayContent.meditation.shortDuration || 5) + ' min'
    },
  ] : [];

  // Timer logic with auto-complete and confetti
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedSession) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;

          // Timer complete!
          if (newProgress >= selectedSession.duration * 60) {
            setIsPlaying(false);
            setShowCelebration(true);

            // Trigger confetti celebration
            const duration = 3000;
            const animationEnd = Date.now() + duration;

            const randomInRange = (min: number, max: number) => {
              return Math.random() * (max - min) + min;
            };

            const interval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();

              if (timeLeft <= 0) {
                clearInterval(interval);
                return;
              }

              const particleCount = 50 * (timeLeft / duration);

              // Left side confetti
              confetti({
                particleCount,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3D6B5B', '#4FD1C5', '#D4A574', '#CBD5E1']
              });

              // Right side confetti
              confetti({
                particleCount,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3D6B5B', '#4FD1C5', '#D4A574', '#CBD5E1']
              });
            }, 250);

            // Auto-complete the session and navigate
            setTimeout(() => {
              completeSession('meditation');
              // Navigate back after completing
              if (dayParam) {
                navigate(`/day/${viewingDay}`);
              } else {
                navigate('/home');
              }
            }, 3000);

            return prev;
          }

          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedSession, completeSession]);

  // Breathing animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setBreathPhase((prev) => (prev + 1) % 5);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMarkAsDone = () => {
    completeSession('meditation');
    // Navigate back to day view if coming from journey, else home
    if (dayParam) {
      navigate(`/day/${viewingDay}`);
    } else {
      navigate('/home');
    }
  };

  const formatTime = (seconds: number, totalMinutes: number) => {
    const remaining = totalMinutes * 60 - seconds;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = selectedSession
    ? (progress / (selectedSession.duration * 60)) * 100
    : 0;

  const breathTexts = ['BREATHE IN', 'HOLD', 'BREATHE OUT', 'HOLD', 'BREATHE IN'];
  const isDark = user.nightMode;

  // Active session view
  if (selectedSession) {
    return (
      <div className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden ${isDark ? 'bg-[#0B1121]' : 'bg-[#fafaf9]'
        } font-['Epilogue']`}>

        {/* Floating Orbs Background */}
        <FloatingOrbs variant={isDark ? 'dark' : 'light'} />

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
          <button
            onClick={() => setSelectedSession(null)}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'
              } backdrop-blur-sm shadow-lg`}
          >
            <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontSize: '28px' }}>
              keyboard_arrow_down
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'
              } backdrop-blur-sm`}>
              <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontSize: '20px' }}>
                cast
              </span>
            </button>

            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'
                } backdrop-blur-sm`}
            >
              <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`} style={{ fontSize: '20px' }}>
                more_horiz
              </span>
            </button>
          </div>

          {/* Options Dropdown */}
          {showOptions && (
            <div className={`absolute top-28 right-6 ${isDark ? 'bg-[#1C2128]' : 'bg-white'
              } rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in border ${isDark ? 'border-white/5' : 'border-gray-100'
              }`}>
              <button className={`w-full px-5 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                } flex items-center gap-3`}>
                <span className="material-symbols-outlined text-[20px] text-gray-400">favorite</span>
                Add to Favorites
              </button>
              <button className={`w-full px-5 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                } flex items-center gap-3`}>
                <span className="material-symbols-outlined text-[20px] text-gray-400">share</span>
                Share Session
              </button>
            </div>
          )}
        </header>

        {/* Session Info */}
        <div className="relative z-10 text-center px-6 mt-8">
          <h1 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
            {selectedSession.title}
          </h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'} font-medium`}>
            DAY {viewingDay.toString().padStart(2, '0')} • {selectedSession.duration} MIN
          </p>
          {dayContent && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {dayContent.theme}
            </p>
          )}
        </div>

        {/* Player Controls */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative w-[260px] h-[260px]">
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={isDark ? '#1e3a3a' : '#e5e7eb'}
                strokeWidth="3"
                opacity="0.3"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={isDark ? '#4FD1C5' : '#3D6B5B'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progressPercent / 100)}
                className="transition-all duration-300"
              />
              {/* Progress dot */}
              <circle
                cx={50 + 45 * Math.cos((progressPercent / 100 * 360 - 90) * Math.PI / 180)}
                cy={50 + 45 * Math.sin((progressPercent / 100 * 360 - 90) * Math.PI / 180)}
                r="4"
                fill={isDark ? '#4FD1C5' : '#3D6B5B'}
              />
            </svg>

            {/* Play Button - Neumorphic */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full flex items-center justify-center transition-all active:scale-95 ${isDark
                ? 'bg-[#151E32] shadow-[inset_8px_8px_16px_#0a1020,inset_-8px_-8px_16px_#1e2844]'
                : 'bg-white shadow-[12px_12px_24px_#d1d1d1,-12px_-12px_24px_#ffffff]'
                }`}
            >
              <span
                className={`material-symbols-outlined text-[56px] ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Time Display */}
          <p className={`text-4xl font-bold tabular-nums mt-8 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
            {formatTime(progress, selectedSession.duration)}
          </p>

          {/* Description */}
          {dayContent && (
            <p className={`text-sm text-center mt-4 max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {dayContent.meditation.description}
            </p>
          )}
        </main>

        {/* Breathing Guide */}
        <div className="relative z-10 text-center pb-8">
          <p className={`text-sm font-medium tracking-[0.3em] uppercase ${isDark ? 'text-white/40' : 'text-gray-400'
            }`}>
            {isPlaying ? breathTexts[breathPhase] : 'TAP TO START'}
          </p>

          {/* Breath dots */}
          <div className="flex justify-center gap-2 mt-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === breathPhase && isPlaying
                  ? isDark ? 'bg-[#4FD1C5] scale-125' : 'bg-[#3D6B5B] scale-125'
                  : isDark ? 'bg-white/20' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="text-center px-8 animate-scale-in">
              <div className={`mb-6 ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '120px', fontVariationSettings: "'FILL' 1" }}>
                  celebration
                </span>
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#2C3E35]'}`}>
                Amazing Work! 🎉
              </h2>
              <p className={`text-xl mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                You completed your meditation
              </p>
              <p className={`text-lg ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'} font-medium mb-8`}>
                Your mind and body thank you ✨
              </p>
              <button
                onClick={() => {
                  completeSession('meditation');
                  if (dayParam) {
                    navigate(`/day/${viewingDay}`);
                  } else {
                    navigate('/home');
                  }
                }}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${isDark
                    ? 'bg-[#4FD1C5] text-[#0B1121]'
                    : 'bg-[#3D6B5B] text-white'
                  } shadow-lg`}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Bottom Action */}
        <div className={`relative z-10 px-6 pb-12 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#fafaf9]/90'} backdrop-blur-sm`}>
          <button
            onClick={handleMarkAsDone}
            className="w-full py-4 rounded-2xl bg-[#3D6B5B] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#3D6B5B]/25 hover:shadow-[#3D6B5B]/40 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            I'm Done for Today
          </button>

          <button
            onClick={() => setSelectedSession(null)}
            className={`w-full text-center text-sm font-medium mt-3 py-2 ${isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
          >
            Choose a different session
          </button>
        </div>
      </div>
    );
  }

  // Session selection view - Day specific
  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'
      } font-['Epilogue'] pb-24`}>

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 pt-12 pb-4 bg-inherit">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dayParam ? navigate(`/day/${viewingDay}`) : navigate(-1)}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white'
              } shadow-sm`}
          >
            <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>arrow_back</span>
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
              Day {viewingDay} Meditation
            </h1>
            {dayContent && (
              <p className={`text-sm ${isDark ? 'text-[#5EEAD4]' : 'text-[#389485]'}`}>
                {dayContent.title} • {dayContent.theme}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Sessions List - Day specific */}
      <main className="px-6 space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className={`p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${isDark
              ? 'bg-[#161B22] hover:bg-[#1e2429]'
              : 'bg-white shadow-sm hover:shadow-md'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#5EEAD4]/10' : 'bg-[#4b9b87]/10'
                }`}>
                <span className={`material-symbols-outlined text-[28px] ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'
                  }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  self_improvement
                </span>
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                  {session.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {session.description}
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {session.duration}m
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Techniques */}
        {dayContent && (
          <div className={`mt-6 p-5 rounded-2xl ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}>
            <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Techniques Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {dayContent.meditation.techniques.map((tech, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#5EEAD4]/10 text-[#5EEAD4]' : 'bg-[#389485]/10 text-[#389485]'}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Player;