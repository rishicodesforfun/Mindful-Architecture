import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MentamindBranding from '../components/MentamindBranding';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.username.trim() || !formData.password) {
            setError('Please enter your username and password');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(formData.username.trim(), formData.password);

            if (result.success) {
                // Determine redirect path - could be based on onboarding status if we had that check here
                // For now, default to home
                navigate('/home');
            } else {
                if (result.error === 'USER_NOT_FOUND') {
                    setError('User not found. Please sign up first.');
                } else if (result.error === 'INVALID_PASSWORD') {
                    setError('Incorrect password. Please try again.');
                } else {
                    setError('Login failed. Please try again.');
                }
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F5F7F4] dark:bg-[#0B1121] font-['Epilogue'] overflow-hidden px-8 transition-colors duration-300">

            {/* Soft ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#37a49f]/5 dark:bg-teal-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-[#D7C29E]/10 dark:bg-amber-500/10 rounded-full blur-[80px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#37a49f] to-[#2b5664] flex items-center justify-center shadow-xl shadow-[#37a49f]/20 mb-6 mx-auto animate-float">
                        <span className="material-symbols-outlined text-white text-[40px]">self_improvement</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#111618] dark:text-white">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                        Continue your journey to inner peace
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
                            autoFocus
                            className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-lg text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] dark:focus:border-teal-500 shadow-sm dark:shadow-none transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Password"
                            autoComplete="current-password"
                            className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-lg text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] dark:focus:border-teal-500 shadow-sm dark:shadow-none transition-all"
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
                                Sign In
                                <span className="material-symbols-outlined text-[20px]">login</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Signup Link */}
                <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-[#37a49f] font-bold hover:underline"
                    >
                        Start Journey
                    </button>
                </p>

                {/* Footer */}
                <div className="mt-12">
                    <MentamindBranding variant="footer" />
                </div>
            </div>
        </div>
    );
};

export default Login;
