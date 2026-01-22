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
  const { user, completeSession, setSoundPreference } = useUser();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [breathPhase, setBreathPhase] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);


  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, []);

  // Get day from URL param or use current day
  const dayParam = searchParams.get('day');
  const viewingDay = dayParam ? parseInt(dayParam, 10) : user.currentDay;
  const dayContent = getDayContent(viewingDay);

  // Background Audio Logic - plays after intro speech finishes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Start audio only after intro TTS finishes (or if there's no script)
      const shouldPlay = isPlaying && (introFinished || !dayContent?.meditation.script);
      if (shouldPlay) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback error:", e);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, introFinished, dayContent, volume, user.soundPreference]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);

      // Try to find a "Natural" or good default voice
      const preferred = available.find(v =>
        v.name.includes('Natural') ||
        v.name.includes('Google US English') ||
        v.name.includes('Zira')
      );
      if (preferred) setSelectedVoice(preferred);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // TTS Logic - Intro Script
  useEffect(() => {
    // Reset intro state when session changes
    setIntroFinished(false);

    // Cancel any ongoing speech when component unmounts or session changes
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession || !dayContent?.meditation.script) return;

    if (isPlaying && !introFinished) {
      // Start speaking intro
      const utterance = new SpeechSynthesisUtterance(dayContent.meditation.script);
      utterance.rate = 0.85;
      utterance.pitch = 0.95;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIntroFinished(true);
      };

      window.speechSynthesis.speak(utterance);
    } else if (!isPlaying) {
      // Pause/Cancel speech
      window.speechSynthesis.cancel();
    }
  }, [isPlaying, selectedSession, dayContent, selectedVoice, introFinished]);

  // Breathing animation state
  const [breathState, setBreathState] = useState<'in' | 'hold' | 'out'>('in');

  // Breathing Loop Logic (Visual Only)
  useEffect(() => {
    let mounted = true;
    if (!isPlaying) return;

    const cycle = async () => {
      if (!mounted || !isPlaying) return;

      // Inhale (4s)
      setBreathState('in');
      await new Promise(r => setTimeout(r, 4000));

      if (!mounted || !isPlaying) return;

      // Hold (2s)
      setBreathState('hold');
      await new Promise(r => setTimeout(r, 2000));

      if (!mounted || !isPlaying) return;

      // Exhale (4s)
      setBreathState('out');
      await new Promise(r => setTimeout(r, 4000));

      if (!mounted || !isPlaying) return;

      // Hold (2s)
      setBreathState('hold');
      await new Promise(r => setTimeout(r, 2000));

      // Loop
      if (mounted && isPlaying) cycle();
    };

    cycle();

    return () => {
      mounted = false;
    };
  }, [isPlaying]);

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
              completeSession('meditation', viewingDay);
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

  const handleMarkAsDone = () => {
    window.speechSynthesis.cancel();
    completeSession('meditation', viewingDay);
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

  const isDark = user.nightMode;

  // Active session view
  if (selectedSession) {
    return (
      <div className={`relative flex h-full min-h-screen w-full flex-col overflow-hidden ${isDark ? 'bg-[#0B1121]' : 'bg-[#fafaf9]'
        } font-['Epilogue']`}>

        {/* Floating Orbs Background */}
        <FloatingOrbs variant={isDark ? 'dark' : 'light'} />

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2">
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
              } min-w-[200px]`}>

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

              <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} p-4`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Background Sound</p>

                {/* Volume Slider */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>volume_down</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className={`flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#37a49f]`}
                  />
                  <span className={`material-symbols-outlined ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>volume_up</span>
                </div>

                {/* Sound Selector */}
                <div className="space-y-2">
                  {[
                    { id: 'nature', label: 'Nature', icon: 'forest' },
                    { id: 'ambient', label: 'Ambient', icon: 'waves' },
                    { id: 'silent', label: 'Silent', icon: 'volume_off' },
                  ].map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => setSoundPreference(sound.id as any)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${user.soundPreference === sound.id
                        ? 'bg-[#37a49f]/10 text-[#37a49f] font-bold'
                        : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">{sound.icon}</span>
                        {sound.label}
                      </div>
                      {user.soundPreference === sound.id && (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Player Controls - Centered Breathing Animation */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">

          {/* Breathing Circle Container */}
          <div className="relative w-[240px] h-[240px] flex items-center justify-center mb-6">
            {/* Progress Ring (Static Outer) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 z-0 opacity-20" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke={isDark ? '#4FD1C5' : '#3D6B5B'}
                strokeWidth="1"
              />
            </svg>

            {/* Dynamic Breathing Circle */}
            <div
              className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center backdrop-blur-xl
                ${isDark ? 'bg-[#4FD1C5]/10 shadow-[0_0_60px_rgba(79,209,197,0.2)]' : 'bg-[#3D6B5B]/10 shadow-[0_0_60px_rgba(61,107,91,0.2)]'}
                ${breathState === 'in' ? 'w-[220px] h-[220px] opacity-100' :
                  breathState === 'out' ? 'w-[110px] h-[110px] opacity-60' :
                    'w-[220px] h-[220px] opacity-100' /* Hold uses previous state size essentially? No need logic */
                } 
                ${/* Tweaking 'Hold' logic: if we just came from IN, we stay big. If we came from OUT, we stay small. 
                   Checking current state logic: In -> Hold -> Out -> Hold.
                   Actually simpler to just set explicit sizes based on phase. 
                   But with my current cycle logic: 
                   In (4s) -> Sets to 'in' (Big)
                   Hold (2s) -> Sets to 'hold' (Stay Big)
                   Out (4s) -> Sets to 'out' (Small)
                   Hold (2s) -> Sets to 'hold' (Stay Small) - WAIT, generic 'hold' state is ambiguous.
                */ ''}
              `}
              style={{
                width: breathState === 'in' ? '220px' : breathState === 'out' ? '110px' : undefined, // Let style override classes for precision if needed? No, classes are fine.
                height: breathState === 'in' ? '220px' : breathState === 'out' ? '110px' : undefined,
                // For 'hold', we keep the size of the previous state naturally if we don't change the class. 
                // But React re-renders. We need specific states or styles.
                transform: breathState === 'in' ? 'scale(1)' : breathState === 'out' ? 'scale(0.5)' : 'scale(1)', // Let's use scale
              }}
            >
              {/* Inner Core Circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isDark ? 'bg-[#4FD1C5] text-[#0B1121]' : 'bg-[#3D6B5B] text-white'
                } shadow-xl`}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full h-full flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[32px] ml-1">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>

            {/* Breathing Text Guide */}
            {isPlaying && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-24 pointer-events-none">
                <p className={`text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'
                  } opacity-80 animate-pulse`}>
                  {breathState === 'in' ? 'Breathe In' :
                    breathState === 'out' ? 'Breathe Out' : 'Hold'}
                </p>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-4">
            <h2 className={`text-4xl font-bold tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
              {formatTime(progress, selectedSession.duration)}
            </h2>
            <p className={`text-sm mt-3 font-medium tracking-wide opacity-60 ${isDark ? 'text-white' : 'text-[#111817]'}`}>
              {selectedSession.title}
            </p>
          </div>

          <div className="h-12"></div> {/* Spacer */}

          {/* Voice Selector - Main UI */}
          <div className="relative z-30">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all ${isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
              <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
              <span className="text-sm font-medium pr-2">
                {selectedVoice ? selectedVoice.name.replace('Microsoft ', '').replace('Google ', '').split(' - ')[0] : 'Select Voice'}
              </span>
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  if (voice) setSelectedVoice(voice);
                  if (isPlaying) {
                    window.speechSynthesis.cancel();
                    setIsPlaying(false);
                    setTimeout(() => setIsPlaying(true), 100);
                  }
                }}
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name} className="text-black">
                    {v.name.replace('Microsoft ', '').replace('Google ', '')}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] opacity-60">expand_more</span>
            </div>
          </div>

        </main>

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
                  completeSession('meditation', viewingDay);
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
        <div className={`relative z-10 px-4 pb-6 ${isDark ? 'bg-[#0B1121]/90' : 'bg-[#fafaf9]/90'} backdrop-blur-sm`}>
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

          <audio
            ref={audioRef}
            src={user.soundPreference === 'silent' ? '' : "/assets/audio/meditation_ambient.mp3"}
            loop
            onError={(e) => console.error("Audio Load Error:", e.currentTarget.error, e.currentTarget.src)}
            onCanPlay={() => console.log("Audio ready to play")}
          />
        </div>
      </div>
    );
  }

  // Session selection view - Day specific
  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1121]' : 'bg-[#F5F7F4]'
      } font-['Epilogue'] pb-16`}>

      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-4 pb-2 bg-inherit">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dayParam ? navigate(`/day/${viewingDay}`) : navigate(-1)}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-white'
              } shadow-sm`}
          >
            <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>arrow_back</span>
          </button>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
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
      <main className="px-4 space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${isDark
              ? 'bg-[#161B22] hover:bg-[#1e2429]'
              : 'bg-white shadow-sm hover:shadow-md'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#5EEAD4]/10' : 'bg-[#4b9b87]/10'
                }`}>
                <span className={`material-symbols-outlined text-[24px] ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'
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
          <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-[#161B22]' : 'bg-white'} shadow-sm`}>
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