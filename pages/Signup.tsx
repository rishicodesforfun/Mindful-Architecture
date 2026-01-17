import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MentamindBranding from '../components/MentamindBranding';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signup, isAuthenticated } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const plan = searchParams.get('plan') || 'free';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.username.trim() || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const result = await signup({
                username: formData.username.trim(),
                password: formData.password,
            });

            if (result.success) {
                navigate('/onboarding');
            } else {
                if (result.error === 'USERNAME_EXISTS') {
                    setError('That username is already taken');
                } else {
                    // Show debug message if available, otherwise generic
                    setError(result.debugMessage || 'An error occurred. Please try again.');
                }
            }
        } catch (err: any) {
            setError('Failed to create account');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F7F4] dark:bg-[#0B1121] font-['Epilogue'] overflow-hidden px-8 transition-colors duration-300">

            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#37a49f]/5 dark:bg-teal-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    <span className="text-sm">Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37a49f] to-[#2b5664] flex items-center justify-center shadow-lg shadow-[#37a49f]/20 mb-6 mx-auto">
                        <span className="material-symbols-outlined text-white text-[32px]">self_improvement</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#111618] dark:text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {plan === 'free' ? 'Start your local journey' : `Sign up for ${plan} plan`}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Username"
                            autoComplete="username"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Create password"
                            autoComplete="new-password"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 py-2 rounded-xl">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl bg-[#37a49f] text-white font-bold text-lg shadow-lg shadow-[#37a49f]/25 hover:shadow-[#37a49f]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Start Journey
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#37a49f] font-medium hover:underline"
                    >
                        Sign in
                    </button>
                </p>

                {/* Security Note */}
                <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500">
                    Your data is stored securely on your device.
                </p>

                <div className="mt-8">
                    <MentamindBranding variant="footer" />
                </div>
            </div>
        </div>
    );
};

export default Signup;
