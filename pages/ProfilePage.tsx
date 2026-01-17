import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import LogoutModal from '../components/LogoutModal';
import { useUser, AvatarId } from '../context/UserContext';
import MentamindBranding from '../components/MentamindBranding';

// Avatar options - different styles for users to choose
const avatarOptions: { id: AvatarId; emoji: string; label: string; bg: string }[] = [
    { id: 'avatar1', emoji: '🧘', label: 'Meditator', bg: 'bg-teal-100 dark:bg-teal-900/30' },
    { id: 'avatar2', emoji: '🌸', label: 'Lotus', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    { id: 'avatar3', emoji: '🌿', label: 'Nature', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 'avatar4', emoji: '🌙', label: 'Moon', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { id: 'avatar5', emoji: '☀️', label: 'Sun', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { id: 'avatar6', emoji: '🦋', label: 'Butterfly', bg: 'bg-purple-100 dark:bg-purple-900/30' },
];

// Persona descriptions
const personaInfo = {
    meera: { name: 'Meera', desc: 'The Mindful Explorer', color: 'text-pink-500 dark:text-pink-400' },
    rohan: { name: 'Rohan', desc: 'The Night Owl', color: 'text-indigo-500 dark:text-indigo-400' },
    arjun: { name: 'Arjun', desc: 'The Busy Achiever', color: 'text-teal-500 dark:text-teal-400' },
};

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, setName, setAvatar, activatePause, toggleNightMode, toggleShortSession, logout, clearProgressAndLogout } = useUser();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showSoundModal, setShowSoundModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editName, setEditName] = useState(user.name);

    const handleSaveName = () => {
        setName(editName);
        setShowEditModal(false);
    };

    const handleSelectAvatar = (avatarId: AvatarId) => {
        setAvatar(avatarId);
        setShowAvatarModal(false);
    };

    const handleUsePauseToken = () => {
        const success = activatePause();
        if (success) {
            alert('Pause activated! Take a 24-hour break without losing your streak.');
        } else {
            alert('No pause tokens remaining.');
        }
    };

    const currentAvatar = avatarOptions.find(a => a.id === user.avatar) || avatarOptions[0];
    const currentPersona = user.persona ? personaInfo[user.persona] : null;

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#F5F7F4] dark:bg-[#0B1121] text-[#2C3E35] dark:text-[#CBD5E1] font-['Epilogue'] pb-24 overflow-y-auto no-scrollbar transition-colors duration-300">

            {/* Header */}
            <header className="px-6 pt-10 pb-2">
                <h1 className="text-2xl font-black tracking-tight text-[#111618] dark:text-white">Profile</h1>
            </header>

            {/* Profile Card */}
            <section className="mx-6 mt-4 bg-white dark:bg-[#161B22] rounded-3xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-black/5 dark:ring-white/5 transition-colors">
                <div className="flex flex-col items-center text-center">
                    {/* Avatar - Clickable */}
                    <button
                        onClick={() => setShowAvatarModal(true)}
                        className="relative group"
                    >
                        <div className={`w-24 h-24 rounded-full ${currentAvatar.bg} flex items-center justify-center text-5xl ring-4 ring-white dark:ring-gray-800 shadow-lg transition-transform group-hover:scale-105`}>
                            {currentAvatar.emoji}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#37a49f] text-white flex items-center justify-center shadow-md">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                        </div>
                    </button>

                    {/* User Name */}
                    <h2 className="mt-4 text-xl font-bold text-[#111618] dark:text-white">
                        {user.name || 'Guest'}
                    </h2>

                    {/* Persona Type */}
                    {currentPersona && (
                        <p className={`text-sm font-medium ${currentPersona.color}`}>
                            {currentPersona.desc}
                        </p>
                    )}

                    {/* Stats Row */}
                    <div className="flex justify-center gap-6 mt-5 w-full border-t border-gray-100 dark:border-white/5 pt-5">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#37a49f] dark:text-teal-400">{user.streak}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Day Streak</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#37a49f] dark:text-teal-400">{user.sessionCompletions.length * 10}m</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Total Time</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#37a49f] dark:text-teal-400">{user.sessionCompletions.filter(s => s.meditation).length}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Sessions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pause Token Card */}
            <section className="mx-6 mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 ring-1 ring-amber-200/50 dark:ring-amber-700/30 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-white text-[24px]">pause_circle</span>
                        </div>
                        <div>
                            <p className="font-bold text-amber-900 dark:text-amber-200">Pause Token</p>
                            <p className="text-xs text-amber-700/70 dark:text-amber-400/70">{user.pauseTokens} available • Skip without breaking streak</p>
                        </div>
                    </div>
                    <button
                        onClick={handleUsePauseToken}
                        disabled={user.pauseTokens === 0}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${user.pauseTokens > 0
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 hover:shadow-amber-500/40'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Use
                    </button>
                </div>
            </section>

            {/* Achievements Grid */}
            <section className="mx-6 mt-6">
                <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Achievements</h3>
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: '🌱', label: 'Seedling', unlocked: true },
                        { icon: '🔥', label: 'On Fire', unlocked: user.streak >= 7 },
                        { icon: '🧘', label: 'Zen Master', unlocked: user.sessionCompletions.length >= 10 },
                        { icon: '🌟', label: 'Star', unlocked: false },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${badge.unlocked
                                ? 'bg-white dark:bg-[#161B22] shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                                : 'bg-gray-100 dark:bg-gray-800/50 opacity-40'
                                }`}
                        >
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Settings Section */}
            <section className="mx-6 mt-6">
                <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Settings</h3>
                <div className="bg-white dark:bg-[#161B22] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-sm dark:shadow-none transition-colors">
                    {/* Edit Profile */}
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[22px] text-gray-400 dark:text-gray-500">person</span>
                            <span className="font-medium text-[#111618] dark:text-white">Edit Name</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                    </button>

                    {/* Sound Preferences */}
                    <button
                        onClick={() => setShowSoundModal(true)}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[22px] text-gray-400 dark:text-gray-500">music_note</span>
                            <span className="font-medium text-[#111618] dark:text-white">Sound Preferences</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                    </button>

                    {/* Night Mode Toggle */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[22px] text-gray-400 dark:text-gray-500">dark_mode</span>
                            <span className="font-medium text-[#111618] dark:text-white">Night Mode</span>
                        </div>
                        <button
                            onClick={toggleNightMode}
                            className={`w-12 h-7 rounded-full transition-all ${user.nightMode ? 'bg-[#37a49f]' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${user.nightMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Short Sessions Toggle */}
                    <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-[22px] text-gray-400 dark:text-gray-500">timer</span>
                            <span className="font-medium text-[#111618] dark:text-white">Short Sessions (5 min)</span>
                        </div>
                        <button
                            onClick={toggleShortSession}
                            className={`w-12 h-7 rounded-full transition-all ${user.shortSessionMode ? 'bg-[#37a49f]' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${user.shortSessionMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="mx-6 mt-6 mb-6">
                <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Support</h3>
                <div className="bg-white dark:bg-[#161B22] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-sm dark:shadow-none transition-colors">
                    {['Help & FAQ', 'Send Feedback', 'Privacy Policy'].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => alert('Coming soon!')}
                            className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="font-medium text-[#111618] dark:text-white">{item}</span>
                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Sign Out */}
            <div className="mx-6 mb-8">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full py-4 text-center text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                >
                    Sign Out
                </button>
            </div>

            {/* Mentamind Branding */}
            <div className="mx-6 mb-6">
                <MentamindBranding variant="footer" />
            </div>

            <BottomNav />

            {/* Edit Name Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-up">
                    <div className="bg-white dark:bg-[#161B22] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-[#111618] dark:text-white">Edit Name</h3>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B1015] text-[#111618] dark:text-white focus:border-[#37a49f] focus:ring-2 focus:ring-[#37a49f]/20 outline-none transition-all"
                            placeholder="Your name"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveName}
                                className="flex-1 py-3 rounded-xl font-bold bg-[#37a49f] text-white shadow-md hover:shadow-lg transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-up">
                    <div className="bg-white dark:bg-[#161B22] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold mb-2 text-[#111618] dark:text-white">Choose Your Avatar</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Pick one that represents you</p>

                        <div className="grid grid-cols-3 gap-4">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => handleSelectAvatar(avatar.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${user.avatar === avatar.id
                                        ? 'ring-2 ring-[#37a49f] ring-offset-2 dark:ring-offset-[#161B22] bg-[#37a49f]/5'
                                        : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full ${avatar.bg} flex items-center justify-center text-3xl`}>
                                        {avatar.emoji}
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{avatar.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowAvatarModal(false)}
                            className="w-full mt-6 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Sound Preferences Modal */}
            {showSoundModal && (
                <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-up">
                    <div className="bg-white dark:bg-[#161B22] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-[#111618] dark:text-white">Sound Preferences</h3>
                        <div className="space-y-4">
                            {['Nature Sounds', 'Ambient Music', 'Guided Voice', 'Silent Mode'].map((sound, i) => (
                                <label key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                                    <input type="radio" name="sound" defaultChecked={i === 0} className="w-5 h-5 accent-[#37a49f]" />
                                    <span className="font-medium text-[#111618] dark:text-white">{sound}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSoundModal(false)}
                            className="w-full mt-6 py-3 rounded-xl font-bold bg-[#37a49f] text-white shadow-md hover:shadow-lg transition-all"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onKeepProgress={async () => {
                    await logout();
                    setShowLogoutModal(false);
                    navigate('/');
                }}
                onClearProgress={async () => {
                    await clearProgressAndLogout();
                    setShowLogoutModal(false);
                    navigate('/');
                }}
                userName={user.name}
            />
        </div>
    );
};

export default ProfilePage;
