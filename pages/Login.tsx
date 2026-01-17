import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import MentamindBranding from '../components/MentamindBranding';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setName, user } = useUser();
    const [name, setNameInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        if (name.trim()) {
            setIsLoading(true);
            setName(name.trim());

            // Short delay for smooth transition
            setTimeout(() => {
                if (user.hasCompletedOnboarding) {
                    navigate('/home');
                } else {
                    navigate('/onboarding');
                }
            }, 600);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F7F4] dark:bg-[#0B1121] text-[#2C3E35] dark:text-[#CBD5E1] font-['Epilogue'] overflow-hidden px-8 transition-colors duration-300">

            {/* Soft ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#37a49f]/5 dark:bg-teal-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-[#D7C29E]/10 dark:bg-amber-500/10 rounded-full blur-[80px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">

                {/* App Icon */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#37a49f] to-[#2b5664] flex items-center justify-center shadow-xl shadow-[#37a49f]/20 mb-8 animate-float">
                    <span className="material-symbols-outlined text-white text-[40px]">self_improvement</span>
                </div>

                {/* Welcome Text */}
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#111618] dark:text-white">
                    Welcome
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base mb-10 leading-relaxed">
                    Let's begin your journey to inner peace.
                </p>

                {/* Name Input */}
                <div className="w-full mb-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="What should we call you?"
                        className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-center text-lg font-medium text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] dark:focus:border-teal-500 shadow-sm dark:shadow-none transition-all"
                        autoFocus
                    />
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!name.trim() || isLoading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${name.trim()
                        ? 'bg-[#37a49f] text-white shadow-lg shadow-[#37a49f]/25 hover:shadow-[#37a49f]/40 active:scale-[0.98]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Continue
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
                    Your progress stays private on your device.
                </p>

                {/* Mentamind Branding */}
                <div className="mt-12">
                    <MentamindBranding variant="footer" />
                </div>
            </div>
        </div>
    );
};

export default Login;
