// Complete 30-Day Curriculum with rich content for each day
// All days are accessible - users can switch between any day

export interface MeditationSession {
    title: string;
    duration: number;
    shortDuration?: number;
    techniques: string[];
    audioUrl?: string;
    description: string;
}

export interface ReflectionPrompt {
    prompt: string;
    follow_up?: string;
}

export interface LifestyleTask {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    duration: number;
    image?: string;
}

export interface DayContent {
    day: number;
    block: 1 | 2 | 3;
    title: string;
    subtitle: string;
    theme: string;
    meditation: MeditationSession;
    reflection: ReflectionPrompt;
    task: LifestyleTask;
    moodQuestion: string;
}

export interface BlockInfo {
    block: 1 | 2 | 3;
    name: string;
    focus: string;
    meditationFocus: string;
    reflectionFocus: string;
    taskFocus: string;
    color: string;
}

// Block definitions with colors
export const blocks: BlockInfo[] = [
    {
        block: 1,
        name: 'Foundation',
        focus: 'Settling in and learning basic techniques',
        meditationFocus: 'Grounding, breath awareness, light body scans',
        reflectionFocus: 'Noticing tension, physical/emotional signals',
        taskFocus: 'Digital resets, evening cues, minor adjustments',
        color: 'from-teal-400 to-teal-600',
    },
    {
        block: 2,
        name: 'Depth',
        focus: 'Increasing depth and building skills',
        meditationFocus: 'Return-to-anchor, deeper scans, visualization',
        reflectionFocus: 'Attention patterns, supportive/disruptive factors',
        taskFocus: 'Brief walks, organization, planning',
        color: 'from-indigo-400 to-indigo-600',
    },
    {
        block: 3,
        name: 'Integration',
        focus: 'Application in daily life and maintenance',
        meditationFocus: 'Consolidated grounding, relaxed awareness',
        reflectionFocus: 'Real-life application, weekly patterns',
        taskFocus: 'Stable daily cues, reducing friction, habits',
        color: 'from-purple-400 to-purple-600',
    },
];

// Complete 30-day curriculum
export const curriculum: DayContent[] = [
    // BLOCK 1: Days 1-10 - Foundation
    {
        day: 1,
        block: 1,
        title: 'Foundation',
        subtitle: 'Begin your journey',
        theme: 'Getting Started',
        meditation: {
            title: 'Grounding Basics',
            duration: 10,
            shortDuration: 5,
            techniques: ['breath awareness', 'grounding'],
            description: 'A gentle introduction to meditation. Learn to settle your body and mind through breath awareness.',
        },
        reflection: {
            prompt: 'What brought you here today? What are you hoping to change?',
        },
        task: {
            title: 'Digital Sunset',
            subtitle: 'Prepare for rest',
            description: 'Turn on night mode on all your devices after 8pm. This signals to your brain that the day is winding down.',
            icon: 'brightness_4',
            duration: 2,
        },
        moodQuestion: 'How do you feel right now?',
    },
    {
        day: 2,
        block: 1,
        title: 'Awareness',
        subtitle: 'Notice your surroundings',
        theme: 'Present Moment',
        meditation: {
            title: 'Present Moment',
            duration: 10,
            shortDuration: 5,
            techniques: ['breath awareness', 'attention anchoring'],
            description: 'Learn to anchor your attention in the present moment using your breath as a focal point.',
        },
        reflection: {
            prompt: 'What did you notice about your thoughts today?',
        },
        task: {
            title: 'Mindful Tea',
            subtitle: 'Savor the moment',
            description: 'Drink a cup of tea or water slowly, noticing each sip. Feel the warmth, taste, and sensation.',
            icon: 'emoji_food_beverage',
            duration: 5,
        },
        moodQuestion: 'How present do you feel?',
    },
    {
        day: 3,
        block: 1,
        title: 'Breath Work',
        subtitle: 'Connect with your breath',
        theme: 'Breathing',
        meditation: {
            title: 'Paced Breathing',
            duration: 10,
            shortDuration: 6,
            techniques: ['paced breathing', 'counting'],
            description: 'Discover the power of controlled breathing to calm your nervous system.',
        },
        reflection: {
            prompt: 'When do you hold your breath or breathe shallowly?',
        },
        task: {
            title: 'Phone-Free Morning',
            subtitle: 'Start without screens',
            description: 'Wait 30 minutes before checking your phone after waking. Use this time for yourself.',
            icon: 'smartphone',
            duration: 30,
        },
        moodQuestion: 'How calm do you feel?',
    },
    {
        day: 4,
        block: 1,
        title: 'Body Scan',
        subtitle: 'Tune into sensations',
        theme: 'Body Awareness',
        meditation: {
            title: 'Light Body Scan',
            duration: 12,
            shortDuration: 7,
            techniques: ['body scan', 'tension release'],
            description: 'Gently scan through your body, noticing areas of tension and relaxation.',
        },
        reflection: {
            prompt: 'Where do you hold tension in your body?',
        },
        task: {
            title: 'Stretch Break',
            subtitle: 'Release tension',
            description: 'Take a 3-minute stretch break mid-day. Focus on areas where you hold tension.',
            icon: 'fitness_center',
            duration: 3,
        },
        moodQuestion: 'How relaxed is your body?',
    },
    {
        day: 5,
        block: 1,
        title: 'Release',
        subtitle: 'Let go of tension',
        theme: 'Letting Go',
        meditation: {
            title: 'Tension Release',
            duration: 10,
            shortDuration: 5,
            techniques: ['progressive relaxation', 'breath awareness'],
            description: 'Learn to consciously release tension from your body, one area at a time.',
        },
        reflection: {
            prompt: 'What would you like to release today?',
        },
        task: {
            title: 'Mindful Walking',
            subtitle: 'Connect with the ground',
            description: 'Take 10 minutes to walk without a destination. Focus on the sensation of your feet touching the ground.',
            icon: 'directions_walk',
            duration: 10,
        },
        moodQuestion: 'How light do you feel?',
    },
    {
        day: 6,
        block: 1,
        title: 'Stillness',
        subtitle: 'Find your center',
        theme: 'Inner Peace',
        meditation: {
            title: 'Seated Stillness',
            duration: 10,
            shortDuration: 5,
            techniques: ['stillness', 'grounding'],
            description: 'Practice being completely still, allowing your mind to settle naturally.',
        },
        reflection: {
            prompt: 'What does stillness mean to you?',
        },
        task: {
            title: 'Quiet Moment',
            subtitle: 'Embrace silence',
            description: 'Spend 5 minutes in complete silence. No phone, no music, just you.',
            icon: 'volume_off',
            duration: 5,
        },
        moodQuestion: 'How centered do you feel?',
    },
    {
        day: 7,
        block: 1,
        title: 'Observation',
        subtitle: 'Watch without judgment',
        theme: 'Non-Judgment',
        meditation: {
            title: 'Thought Observation',
            duration: 10,
            shortDuration: 6,
            techniques: ['thought watching', 'non-attachment'],
            description: 'Learn to observe your thoughts like clouds passing through the sky.',
        },
        reflection: {
            prompt: 'What patterns do you notice in your thoughts?',
        },
        task: {
            title: 'Nature Pause',
            subtitle: 'Connect with nature',
            description: 'Step outside and observe nature for 5 minutes. Notice colors, sounds, movements.',
            icon: 'park',
            duration: 5,
        },
        moodQuestion: 'How aware do you feel?',
    },
    {
        day: 8,
        block: 1,
        title: 'Patience',
        subtitle: 'Embrace the pace',
        theme: 'Patience',
        meditation: {
            title: 'Patience Practice',
            duration: 12,
            shortDuration: 7,
            techniques: ['breath awareness', 'patience cultivation'],
            description: 'Cultivate patience by slowing down and accepting the present moment.',
        },
        reflection: {
            prompt: 'What triggers impatience in you?',
        },
        task: {
            title: 'Slow Task',
            subtitle: 'Decelerate',
            description: 'Do one routine task 50% slower than usual. Notice what changes.',
            icon: 'hourglass_empty',
            duration: 10,
        },
        moodQuestion: 'How patient do you feel?',
    },
    {
        day: 9,
        block: 1,
        title: 'Acceptance',
        subtitle: 'Welcome what is',
        theme: 'Self-Compassion',
        meditation: {
            title: 'Acceptance Meditation',
            duration: 10,
            shortDuration: 6,
            techniques: ['acceptance', 'self-compassion'],
            description: 'Practice accepting yourself and your experience exactly as it is.',
        },
        reflection: {
            prompt: 'What are you resisting in your life right now?',
        },
        task: {
            title: 'Gratitude List',
            subtitle: 'Count your blessings',
            description: 'Write down 3 things you\'re grateful for today. Be specific.',
            icon: 'favorite',
            duration: 3,
        },
        moodQuestion: 'How accepting do you feel?',
    },
    {
        day: 10,
        block: 1,
        title: 'Integration',
        subtitle: 'Block 1 Complete',
        theme: 'Milestone',
        meditation: {
            title: 'Foundation Review',
            duration: 12,
            shortDuration: 7,
            techniques: ['breath awareness', 'body scan', 'grounding'],
            description: 'Integrate everything you\'ve learned in Block 1. A comprehensive practice session.',
        },
        reflection: {
            prompt: 'What have you learned about yourself in the first 10 days?',
        },
        task: {
            title: 'Weekly Review',
            subtitle: 'Reflect on progress',
            description: 'Review your mood trends and insights from this week. What worked best?',
            icon: 'insights',
            duration: 5,
        },
        moodQuestion: 'How has your baseline shifted?',
    },

    // BLOCK 2: Days 11-20 - Depth
    {
        day: 11,
        block: 2,
        title: 'Deepening',
        subtitle: 'Go deeper within',
        theme: 'Focus',
        meditation: {
            title: 'Return to Anchor',
            duration: 12,
            shortDuration: 7,
            techniques: ['anchor practice', 'focused attention'],
            description: 'Strengthen your ability to return to your breath when the mind wanders.',
        },
        reflection: {
            prompt: 'What distracts you most during meditation?',
        },
        task: {
            title: 'Notification Audit',
            subtitle: 'Reclaim attention',
            description: 'Disable non-essential app notifications. Keep only what truly matters.',
            icon: 'notifications_off',
            duration: 5,
        },
        moodQuestion: 'How focused do you feel?',
    },
    {
        day: 12,
        block: 2,
        title: 'Insight',
        subtitle: 'Finding clarity',
        theme: 'Clarity',
        meditation: {
            title: 'Morning Clarity',
            duration: 15,
            shortDuration: 8,
            techniques: ['visualization', 'clarity cultivation'],
            description: 'Start your day with crystal clear intention and mental clarity.',
        },
        reflection: {
            prompt: 'What insight emerged from today\'s practice?',
        },
        task: {
            title: 'Tidy Space',
            subtitle: 'Clear environment',
            description: 'Spend 10 minutes organizing one area of your space. External order, internal calm.',
            icon: 'cleaning_services',
            duration: 10,
        },
        moodQuestion: 'How clear is your mind?',
    },
    {
        day: 13,
        block: 2,
        title: 'Visualization',
        subtitle: 'See your path',
        theme: 'Vision',
        meditation: {
            title: 'Peaceful Visualization',
            duration: 12,
            shortDuration: 7,
            techniques: ['visualization', 'relaxation'],
            description: 'Create a peaceful inner sanctuary through guided visualization.',
        },
        reflection: {
            prompt: 'What does your ideal peaceful space look like?',
        },
        task: {
            title: 'Vision Moment',
            subtitle: 'Future self',
            description: 'Spend 5 minutes visualizing your best self. How do they move? Speak? Feel?',
            icon: 'visibility',
            duration: 5,
        },
        moodQuestion: 'How clear is your vision?',
    },
    {
        day: 14,
        block: 2,
        title: 'Connection',
        subtitle: 'Link mind and body',
        theme: 'Unity',
        meditation: {
            title: 'Mind-Body Connection',
            duration: 12,
            shortDuration: 7,
            techniques: ['body awareness', 'breath awareness'],
            description: 'Strengthen the connection between your mental state and physical sensations.',
        },
        reflection: {
            prompt: 'How does your body respond to your emotions?',
        },
        task: {
            title: 'Mindful Meal',
            subtitle: 'Eat consciously',
            description: 'Eat one meal today without any screens. Focus entirely on the food.',
            icon: 'restaurant',
            duration: 20,
        },
        moodQuestion: 'How connected do you feel to your body?',
    },
    {
        day: 15,
        block: 2,
        title: 'Flow',
        subtitle: 'Find your rhythm',
        theme: 'Flow State',
        meditation: {
            title: 'Flow State',
            duration: 15,
            shortDuration: 8,
            techniques: ['breath flow', 'presence'],
            description: 'Discover the effortless state of flow through breath and presence.',
        },
        reflection: {
            prompt: 'When do you feel most in flow?',
        },
        task: {
            title: 'Focus Block',
            subtitle: 'Deep work',
            description: 'Set a 25-minute timer. Work on one task with zero distractions.',
            icon: 'timer',
            duration: 25,
        },
        moodQuestion: 'How easily can you enter flow?',
    },
    {
        day: 16,
        block: 2,
        title: 'Balance',
        subtitle: 'Find equilibrium',
        theme: 'Harmony',
        meditation: {
            title: 'Balance Meditation',
            duration: 12,
            shortDuration: 7,
            techniques: ['centering', 'equilibrium'],
            description: 'Find balance between effort and ease, activity and rest.',
        },
        reflection: {
            prompt: 'What areas of your life need more balance?',
        },
        task: {
            title: 'Energy Audit',
            subtitle: 'Know your peaks',
            description: 'Note your energy levels throughout the day. When are you most energized?',
            icon: 'bolt',
            duration: 5,
        },
        moodQuestion: 'How balanced do you feel?',
    },
    {
        day: 17,
        block: 2,
        title: 'Resilience',
        subtitle: 'Build inner strength',
        theme: 'Strength',
        meditation: {
            title: 'Inner Strength',
            duration: 12,
            shortDuration: 7,
            techniques: ['resilience building', 'grounding'],
            description: 'Cultivate resilience through grounding and inner stability practices.',
        },
        reflection: {
            prompt: 'What challenges have made you stronger?',
        },
        task: {
            title: 'Cold Exposure',
            subtitle: 'Build tolerance',
            description: 'End your shower with 30 seconds of cold water. Notice how you adapt.',
            icon: 'ac_unit',
            duration: 1,
        },
        moodQuestion: 'How resilient do you feel?',
    },
    {
        day: 18,
        block: 2,
        title: 'Strength',
        subtitle: 'Inner power',
        theme: 'Empowerment',
        meditation: {
            title: 'Core Power',
            duration: 12,
            shortDuration: 7,
            techniques: ['empowerment', 'breath power'],
            description: 'Connect with your inner power through breath and visualization.',
        },
        reflection: {
            prompt: 'What makes you feel powerful?',
        },
        task: {
            title: 'Power Pose',
            subtitle: 'Embody confidence',
            description: 'Stand in a power pose for 2 minutes. Arms wide, chest open.',
            icon: 'accessibility_new',
            duration: 2,
        },
        moodQuestion: 'How strong do you feel inside?',
    },
    {
        day: 19,
        block: 2,
        title: 'Clarity',
        subtitle: 'Clear the fog',
        theme: 'Mental Clarity',
        meditation: {
            title: 'Mental Clearing',
            duration: 15,
            shortDuration: 8,
            techniques: ['mental clarity', 'focus'],
            description: 'Clear mental fog and sharpen your focus through guided practice.',
        },
        reflection: {
            prompt: 'What clouds your thinking?',
        },
        task: {
            title: 'Brain Dump',
            subtitle: 'Empty your mind',
            description: 'Write down everything on your mind. Don\'t filter, just dump.',
            icon: 'edit_note',
            duration: 10,
        },
        moodQuestion: 'How clear-headed do you feel?',
    },
    {
        day: 20,
        block: 2,
        title: 'Peace',
        subtitle: 'Block 2 Complete',
        theme: 'Milestone',
        meditation: {
            title: 'Deep Peace',
            duration: 15,
            shortDuration: 8,
            techniques: ['deep relaxation', 'peace cultivation'],
            description: 'Integrate Block 2 learnings with a deep peace meditation.',
        },
        reflection: {
            prompt: 'How has your practice deepened over the last 10 days?',
        },
        task: {
            title: 'Progress Celebration',
            subtitle: 'Honor your journey',
            description: 'Do something kind for yourself today. You\'ve come far.',
            icon: 'celebration',
            duration: 10,
        },
        moodQuestion: 'How deep is your peace?',
    },

    // BLOCK 3: Days 21-30 - Integration
    {
        day: 21,
        block: 3,
        title: 'Application',
        subtitle: 'Bring it to life',
        theme: 'Daily Life',
        meditation: {
            title: 'Daily Integration',
            duration: 12,
            shortDuration: 7,
            techniques: ['mindful living', 'presence'],
            description: 'Learn to carry your meditative awareness into everyday activities.',
        },
        reflection: {
            prompt: 'How can you apply mindfulness to your daily routines?',
        },
        task: {
            title: 'Mindful Commute',
            subtitle: 'Transform routine',
            description: 'If you commute, use it for mindfulness. If not, pick a routine activity.',
            icon: 'commute',
            duration: 15,
        },
        moodQuestion: 'How present are you in daily activities?',
    },
    {
        day: 22,
        block: 3,
        title: 'Wisdom',
        subtitle: 'Inner knowing',
        theme: 'Intuition',
        meditation: {
            title: 'Inner Wisdom',
            duration: 12,
            shortDuration: 7,
            techniques: ['intuition', 'listening'],
            description: 'Connect with your inner wisdom and intuition through quiet listening.',
        },
        reflection: {
            prompt: 'What is your intuition telling you right now?',
        },
        task: {
            title: 'Trust Intuition',
            subtitle: 'Follow your gut',
            description: 'Make one decision today based purely on intuition.',
            icon: 'psychology_alt',
            duration: 1,
        },
        moodQuestion: 'How connected are you to your intuition?',
    },
    {
        day: 23,
        block: 3,
        title: 'Harmony',
        subtitle: 'Living in sync',
        theme: 'Alignment',
        meditation: {
            title: 'Harmonious Living',
            duration: 12,
            shortDuration: 7,
            techniques: ['harmony', 'alignment'],
            description: 'Align your actions with your deepest values and intentions.',
        },
        reflection: {
            prompt: 'Are your daily actions aligned with your values?',
        },
        task: {
            title: 'Value Check',
            subtitle: 'Align actions',
            description: 'List your top 3 values. Did today\'s actions reflect them?',
            icon: 'check_circle',
            duration: 5,
        },
        moodQuestion: 'How aligned do you feel?',
    },
    {
        day: 24,
        block: 3,
        title: 'Purpose',
        subtitle: 'Find meaning',
        theme: 'Meaning',
        meditation: {
            title: 'Purpose Meditation',
            duration: 15,
            shortDuration: 8,
            techniques: ['purpose finding', 'visualization'],
            description: 'Connect with your sense of purpose and meaning.',
        },
        reflection: {
            prompt: 'What gives your life meaning?',
        },
        task: {
            title: 'Meaning Moment',
            subtitle: 'Find purpose',
            description: 'Do one thing today that feels meaningful to you.',
            icon: 'star',
            duration: 10,
        },
        moodQuestion: 'How purposeful do you feel?',
    },
    {
        day: 25,
        block: 3,
        title: 'Renewal',
        subtitle: 'Fresh start',
        theme: 'Refresh',
        meditation: {
            title: 'Fresh Start',
            duration: 12,
            shortDuration: 7,
            techniques: ['renewal', 'letting go'],
            description: 'Release the old and welcome the new with each breath.',
        },
        reflection: {
            prompt: 'What do you need to let go of to move forward?',
        },
        task: {
            title: 'Release Ritual',
            subtitle: 'Let go',
            description: 'Write down something you want to release. Then tear it up.',
            icon: 'delete',
            duration: 5,
        },
        moodQuestion: 'How renewed do you feel?',
    },
    {
        day: 26,
        block: 3,
        title: 'Reflection',
        subtitle: 'Look within',
        theme: 'Self-Discovery',
        meditation: {
            title: 'Deep Reflection',
            duration: 15,
            shortDuration: 8,
            techniques: ['self-inquiry', 'reflection'],
            description: 'Look deeply into yourself with compassion and curiosity.',
        },
        reflection: {
            prompt: 'Who are you becoming through this practice?',
        },
        task: {
            title: 'Letter to Self',
            subtitle: 'Future you',
            description: 'Write a letter to your future self. What do you want them to know?',
            icon: 'mail',
            duration: 10,
        },
        moodQuestion: 'How self-aware are you?',
    },
    {
        day: 27,
        block: 3,
        title: 'Integration',
        subtitle: 'Bringing it together',
        theme: 'Wholeness',
        meditation: {
            title: 'Wholeness Practice',
            duration: 15,
            shortDuration: 8,
            techniques: ['integration', 'completeness'],
            description: 'Experience yourself as whole and complete, just as you are.',
        },
        reflection: {
            prompt: 'What parts of yourself are you learning to accept?',
        },
        task: {
            title: 'Whole Day',
            subtitle: 'Live mindfully',
            description: 'Try to maintain mindful awareness throughout your entire day.',
            icon: 'all_inclusive',
            duration: 0,
        },
        moodQuestion: 'How whole do you feel?',
    },
    {
        day: 28,
        block: 3,
        title: 'Mastery',
        subtitle: 'Own your practice',
        theme: 'Confidence',
        meditation: {
            title: 'Self-Guided Practice',
            duration: 15,
            shortDuration: 8,
            techniques: ['self-guidance', 'intuition'],
            description: 'Guide yourself through meditation using everything you\'ve learned.',
        },
        reflection: {
            prompt: 'How has meditation changed you?',
        },
        task: {
            title: 'Teach Someone',
            subtitle: 'Share wisdom',
            description: 'Share one mindfulness technique with someone today.',
            icon: 'groups',
            duration: 5,
        },
        moodQuestion: 'How confident are you in your practice?',
    },
    {
        day: 29,
        block: 3,
        title: 'Celebration',
        subtitle: 'Honor your journey',
        theme: 'Achievement',
        meditation: {
            title: 'Gratitude Celebration',
            duration: 12,
            shortDuration: 7,
            techniques: ['gratitude', 'celebration'],
            description: 'Celebrate how far you\'ve come with deep gratitude.',
        },
        reflection: {
            prompt: 'What are you most proud of from this journey?',
        },
        task: {
            title: 'Reward Yourself',
            subtitle: 'You earned it',
            description: 'Treat yourself to something special. You\'ve done the work.',
            icon: 'card_giftcard',
            duration: 10,
        },
        moodQuestion: 'How accomplished do you feel?',
    },
    {
        day: 30,
        block: 3,
        title: 'Continuation',
        subtitle: 'This is just the beginning',
        theme: 'New Chapter',
        meditation: {
            title: 'New Beginning',
            duration: 15,
            shortDuration: 8,
            techniques: ['intention setting', 'continuation'],
            description: 'Set your intention for continued practice beyond the 30 days.',
        },
        reflection: {
            prompt: 'How will you continue this practice?',
        },
        task: {
            title: 'Commitment',
            subtitle: 'Plan ahead',
            description: 'Set your intention for the next 30 days of your journey.',
            icon: 'rocket_launch',
            duration: 5,
        },
        moodQuestion: 'How ready are you to continue?',
    },
];

// Helper to get current day content
export const getDayContent = (day: number): DayContent | undefined => {
    return curriculum.find(d => d.day === day);
};

// Helper to get block info
export const getBlockInfo = (blockNum: 1 | 2 | 3): BlockInfo | undefined => {
    return blocks.find(b => b.block === blockNum);
};

export default curriculum;
