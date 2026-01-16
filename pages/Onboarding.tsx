import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, ProgramTheme, RoutineTime, Persona } from '../context/UserContext';
import MentamindBranding from '../components/MentamindBranding';

type Step = 'feeling' | 'goal' | 'time' | 'ready';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectTheme, setRoutineTime, setPersona, completeOnboarding } = useUser();
  const [step, setStep] = useState<Step>('feeling');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [goal, setGoal] = useState<ProgramTheme | null>(null);
  const [time, setTime] = useState<RoutineTime>('flexible');

  // Map feelings to personas and themes
  const feelingToPersona: Record<string, { persona: Persona; themes: ProgramTheme[] }> = {
    'stressed': { persona: 'arjun', themes: ['anxiety', 'focus'] },
    'tired': { persona: 'rohan', themes: ['sleep', 'lifestyle'] },
    'scattered': { persona: 'meera', themes: ['emotional', 'confidence'] },
  };

  const handleFeelingSelect = (f: string) => {
    setFeeling(f);
    const mapping = feelingToPersona[f];
    if (mapping) {
      setPersona(mapping.persona);
    }
    setTimeout(() => setStep('goal'), 400);
  };

  const handleGoalSelect = (g: ProgramTheme) => {
    setGoal(g);
    selectTheme(g);
    setTimeout(() => setStep('time'), 400);
  };

  const handleTimeSelect = (t: RoutineTime) => {
    setTime(t);
    setRoutineTime(t);
    setTimeout(() => setStep('ready'), 400);
  };

  const handleBegin = () => {
    completeOnboarding();
    navigate('/home');
  };

  const goBack = () => {
    if (step === 'goal') setStep('feeling');
    else if (step === 'time') setStep('goal');
    else if (step === 'ready') setStep('time');
  };

  const getRecommendedThemes = () => {
    if (!feeling) return [];
    return feelingToPersona[feeling]?.themes || [];
  };

  const themes: { id: ProgramTheme; name: string; icon: string }[] = [
    { id: 'anxiety', name: 'Calm', icon: 'spa' },
    { id: 'focus', name: 'Focus', icon: 'center_focus_strong' },
    { id: 'sleep', name: 'Sleep', icon: 'bedtime' },
    { id: 'emotional', name: 'Healing', icon: 'favorite' },
    { id: 'confidence', name: 'Confidence', icon: 'psychology' },
    { id: 'lifestyle', name: 'Balance', icon: 'balance' },
  ];

  const times: { id: RoutineTime; label: string; icon: string; hint: string }[] = [
    { id: 'morning', label: 'Morning', icon: 'wb_sunny', hint: 'Start fresh' },
    { id: 'midday', label: 'Midday', icon: 'light_mode', hint: 'Reset & recharge' },
    { id: 'night', label: 'Night', icon: 'nights_stay', hint: 'Wind down' },
    { id: 'flexible', label: 'Anytime', icon: 'schedule', hint: 'When I have time' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#fafafa] dark:bg-[#0B1015] text-[#111618] dark:text-gray-100 font-['Epilogue'] overflow-hidden transition-colors duration-300">

      {/* Soft background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-[#37a49f]/5 dark:bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-12 pb-6">
        {['feeling', 'goal', 'time', 'ready'].map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? 'w-6 bg-[#37a49f] dark:bg-teal-400' :
              ['feeling', 'goal', 'time', 'ready'].indexOf(step) > i ? 'bg-[#37a49f] dark:bg-teal-400' : 'bg-gray-200 dark:bg-gray-700'
              }`}
          />
        ))}
      </div>

      {/* Back button */}
      {step !== 'feeling' && (
        <button
          onClick={goBack}
          className="absolute top-12 left-6 z-20 w-10 h-10 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
      )}

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12">

        {/* Step 1: How are you feeling? */}
        {step === 'feeling' && (
          <div className="w-full max-w-sm text-center animate-fade-up">
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium mb-2">Hi {user.name} 👋</p>
            <h1 className="text-2xl font-bold mb-2 text-[#111618] dark:text-white">How are you feeling?</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">No judgment, just curious.</p>

            <div className="flex flex-col gap-3">
              {[
                { id: 'stressed', emoji: '😮‍💨', label: 'Stressed or anxious' },
                { id: 'tired', emoji: '😴', label: 'Tired or drained' },
                { id: 'scattered', emoji: '🤯', label: 'Scattered or overwhelmed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFeelingSelect(f.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#161B22] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${feeling === f.id ? 'border-[#37a49f] dark:border-teal-500 shadow-lg' : 'border-transparent shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5'}`}
                >
                  <span className="text-3xl">{f.emoji}</span>
                  <span className="text-base font-medium text-[#111618] dark:text-white">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: What would help? */}
        {step === 'goal' && (
          <div className="w-full max-w-sm text-center animate-fade-up">
            <h1 className="text-2xl font-bold mb-2 text-[#111618] dark:text-white">What would help most?</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">We'll personalize your 30-day journey.</p>

            <div className="grid grid-cols-2 gap-3">
              {themes
                .filter(t => getRecommendedThemes().includes(t.id) || getRecommendedThemes().length === 0)
                .slice(0, 4)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleGoalSelect(t.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-[#161B22] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${goal === t.id ? 'border-[#37a49f] dark:border-teal-500 shadow-lg' : 'border-transparent shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5'}`}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#37a49f]/10 dark:bg-teal-900/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px] text-[#37a49f] dark:text-teal-400">{t.icon}</span>
                    </div>
                    <span className="font-bold text-[#111618] dark:text-white">{t.name}</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setStep('goal')}
              className="mt-6 text-sm text-gray-400 dark:text-gray-500 hover:text-[#37a49f] dark:hover:text-teal-400 transition-colors"
            >
              Show all options
            </button>
          </div>
        )}

        {/* Step 3: When do you practice? */}
        {step === 'time' && (
          <div className="w-full max-w-sm text-center animate-fade-up">
            <h1 className="text-2xl font-bold mb-2 text-[#111618] dark:text-white">Best time for you?</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">We'll send a gentle reminder.</p>

            <div className="grid grid-cols-2 gap-3">
              {times.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTimeSelect(t.id)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-white dark:bg-[#161B22] border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${time === t.id ? 'border-[#37a49f] dark:border-teal-500 shadow-lg' : 'border-transparent shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5'}`}
                >
                  <span className="material-symbols-outlined text-[28px] text-[#37a49f] dark:text-teal-400">{t.icon}</span>
                  <span className="font-bold text-[#111618] dark:text-white">{t.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{t.hint}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 'ready' && (
          <div className="w-full max-w-sm text-center animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-[#37a49f]/10 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-[48px] text-[#37a49f] dark:text-teal-400">check_circle</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-[#111618] dark:text-white">You're all set!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Your personalized 30-day journey is ready.<br />
              You can always adjust in settings.
            </p>

            {/* Summary */}
            <div className="bg-white dark:bg-[#161B22] rounded-2xl p-5 shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5 mb-8 text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-[#37a49f] dark:text-teal-400">spa</span>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Program</p>
                  <p className="font-bold text-[#111618] dark:text-white capitalize">{goal || 'Calm'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#37a49f] dark:text-teal-400">schedule</span>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Practice Time</p>
                  <p className="font-bold text-[#111618] dark:text-white capitalize">{time}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBegin}
              className="w-full py-4 rounded-2xl bg-[#37a49f] text-white font-bold text-lg shadow-lg shadow-[#37a49f]/25 hover:shadow-[#37a49f]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Begin My Journey
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            {/* Mentamind Branding */}
            <div className="mt-8">
              <MentamindBranding variant="footer" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Onboarding;