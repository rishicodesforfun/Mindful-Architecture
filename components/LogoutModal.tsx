import React from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onKeepProgress: () => void;
    onClearProgress: () => void;
    userName: string;
}

/**
 * Logout Confirmation Modal
 * 
 * Asks the user whether to keep or clear their progress when logging out.
 * Progress is stored locally in IndexedDB and will persist if kept.
 */
const LogoutModal: React.FC<LogoutModalProps> = ({
    isOpen,
    onClose,
    onKeepProgress,
    onClearProgress,
    userName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1A1F2E] rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[32px]">
                        logout
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Sign Out
                </h2>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Would you like to keep your progress, <span className="font-semibold text-gray-900 dark:text-white">{userName}</span>?
                </p>

                {/* Options */}
                <div className="space-y-3">
                    {/* Keep Progress Button */}
                    <button
                        onClick={onKeepProgress}
                        className="w-full py-3 px-4 rounded-xl bg-[#37a49f] text-white font-semibold hover:bg-[#2d8a85] transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        Keep My Progress
                    </button>

                    {/* Clear Progress Button */}
                    <button
                        onClick={onClearProgress}
                        className="w-full py-3 px-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        Clear & Sign Out
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                {/* Info */}
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                    Your progress is stored locally on this device.
                </p>
            </div>
        </div>
    );
};

export default LogoutModal;
