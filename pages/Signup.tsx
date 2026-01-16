import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import MentamindBranding from '../components/MentamindBranding';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setName, completeOnboarding } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const plan = searchParams.get('plan') || 'free';
    const billing = searchParams.get('billing') || 'yearly';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        // Simulate signup - in production this would hit an API
        setTimeout(() => {
            setName(formData.name.trim());

            // If paid plan, would redirect to payment here
            if (plan !== 'free') {
                // In production: redirect to Stripe checkout
                console.log(`Redirect to payment for ${plan} (${billing})`);
            }

            navigate('/onboarding');
        }, 800);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0B1015] font-['Epilogue'] overflow-hidden px-8 transition-colors duration-300">

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
                        {plan === 'free' ? 'Start your 7-day free trial' : `Sign up for ${plan} plan`}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email address"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Create password"
                            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-[#161B22] border border-gray-100 dark:border-white/10 text-[#111618] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a49f]/30 focus:border-[#37a49f] transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
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
                                {plan === 'free' ? 'Start Free Trial' : 'Continue to Payment'}
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

                {/* Terms */}
                <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>

                <div className="mt-8">
                    <MentamindBranding variant="footer" />
                </div>
            </div>
        </div>
    );
};

export default Signup;
