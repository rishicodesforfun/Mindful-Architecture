import React, { useState } from 'react';

interface MoodCheckInProps {
    onComplete: (mood: 1 | 2 | 3 | 4 | 5, emotion?: string) => void;
    onClose?: () => void;
    question?: string;
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({
    onComplete,
    onClose,
    question = 'How are you feeling right now?'
}) => {
    const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

    const moods = [
        { value: 1, emoji: '😫', label: 'Struggling', color: '#ef4444' },
        { value: 2, emoji: '😔', label: 'Low', color: '#f97316' },
        { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
        { value: 4, emoji: '🙂', label: 'Good', color: '#22c55e' },
        { value: 5, emoji: '😊', label: 'Great', color: '#37a49f' },
    ] as const;

    const emotions = [
        { name: 'Calm', icon: 'spa', color: '#4b9b87' },
        { name: 'Anxious', icon: 'psychology_alt', color: '#8b5cf6' },
        { name: 'Energized', icon: 'bolt', color: '#f59e0b' },
        { name: 'Tired', icon: 'bedtime', color: '#6b7280' },
        { name: 'Grateful', icon: 'favorite', color: '#ec4899' },
        { name: 'Focused', icon: 'center_focus_strong', color: '#3b82f6' },
    ];

    const handleSubmit = () => {
        if (selectedMood) {
            onComplete(selectedMood, selectedEmotion || undefined);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-6">
            <div className="bg-white dark:bg-[#161B22] rounded-3xl p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-xl border border-gray-100/50 dark:border-white/5 animate-scale-in w-full max-w-md relative">

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                )}

                <h3 className="text-lg font-bold text-[#111618] dark:text-white text-center mb-2">
                    {question}
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6">
                    Tap to select your current state
                </p>

                {/* Mood Scale */}
                <div className="flex justify-between items-center mb-8 px-2">
                    {moods.map((mood) => (
                        <button
                            key={mood.value}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${selectedMood === mood.value
                                ? 'bg-[#37a49f]/10 dark:bg-teal-900/30 scale-110 shadow-md dark:shadow-none'
                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span
                                className={`text-3xl transition-transform ${selectedMood === mood.value ? 'scale-110' : ''}`}
                            >
                                {mood.emoji}
                            </span>
                            <span
                                className={`text-[10px] font-medium ${selectedMood === mood.value ? 'text-[#37a49f] dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {mood.label}
                            </span>
                            {selectedMood === mood.value && (
                                <div
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: mood.color }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Emotion Tags */}
                {selectedMood && (
                    <div className="animate-fade-up">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-3 text-center">
                            What best describes it?
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {emotions.map((emotion) => (
                                <button
                                    key={emotion.name}
                                    onClick={() => setSelectedEmotion(emotion.name)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all ${selectedEmotion === emotion.name
                                        ? 'border-transparent shadow-md dark:shadow-none'
                                        : 'border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
                                        }`}
                                    style={selectedEmotion === emotion.name ? {
                                        backgroundColor: `${emotion.color}15`,
                                        color: emotion.color
                                    } : {}}
                                >
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        style={{ color: selectedEmotion === emotion.name ? emotion.color : '#9ca3af' }}
                                    >
                                        {emotion.icon}
                                    </span>
                                    <span className={`text-sm font-medium ${selectedEmotion === emotion.name ? '' : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {emotion.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {selectedMood && (
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-6 py-3 rounded-xl bg-[#37a49f] text-white font-bold text-sm shadow-lg shadow-[#37a49f]/25 transition-all hover:shadow-[#37a49f]/40 active:scale-[0.98] animate-fade-up"
                    >
                        Save Check-in
                    </button>
                )}
            </div>
        </div>
    );
};

export default MoodCheckIn;
