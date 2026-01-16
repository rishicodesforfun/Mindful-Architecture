import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogoWatermark } from '../components/Illustrations';
import MentamindBranding from '../components/MentamindBranding';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const isDark = user.nightMode;

    const plans = [
        {
            id: 'free',
            name: 'Free Trial',
            price: 0,
            period: '7 days',
            description: 'Try Mindful Architecture risk-free',
            features: [
                'Full access to Foundations program',
                '7 guided meditation sessions',
                'Basic mood tracking',
                'Daily session reminders',
            ],
            cta: 'Start Free Trial',
            popular: false,
        },
        {
            id: 'premium',
            name: 'Premium',
            price: billingCycle === 'yearly' ? 79 : 9.99,
            period: billingCycle === 'yearly' ? '/year' : '/month',
            description: 'Everything you need for your journey',
            features: [
                'All 6 meditation programs',
                'Unlimited sessions',
                'Advanced mood & habit tracking',
                'Journal with AI insights',
                'Sleep stories & soundscapes',
                'Offline downloads',
                'Priority support',
            ],
            cta: 'Get Premium',
            popular: true,
            savings: billingCycle === 'yearly' ? 'Save 34%' : null,
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: 199,
            period: 'one-time',
            description: 'Own it forever',
            features: [
                'Everything in Premium',
                'Lifetime access',
                'All future programs included',
                'Exclusive masterclasses',
                'Personal progress dashboard',
                'Family sharing (up to 5)',
            ],
            cta: 'Get Lifetime Access',
            popular: false,
        },
    ];

    const handleSelectPlan = (planId: string) => {
        // In real app, this would go to payment
        if (planId === 'free') {
            navigate('/signup?plan=free');
        } else {
            navigate(`/signup?plan=${planId}&billing=${billingCycle}`);
        }
    };

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-[#0B1015]' : 'bg-[#fafafa]'} font-['Epilogue'] pb-12 overflow-hidden transition-colors duration-300`}>

            <LogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Header */}
            <header className="relative z-10 px-6 pt-12 pb-6 text-center">
                <button
                    onClick={() => navigate(-1)}
                    className={`absolute left-6 top-12 w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white'} shadow-sm`}
                >
                    <span className={`material-symbols-outlined ${isDark ? 'text-white' : 'text-gray-700'}`}>arrow_back</span>
                </button>

                <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                    Choose Your Plan
                </h1>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Start your mindfulness journey today
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? isDark ? 'bg-[#5EEAD4] text-[#0B1015]' : 'bg-[#4b9b87] text-white'
                                : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                                ? isDark ? 'bg-[#5EEAD4] text-[#0B1015]' : 'bg-[#4b9b87] text-white'
                                : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </header>

            {/* Plans */}
            <main className="relative z-10 px-6 space-y-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-3xl overflow-hidden ${plan.popular
                                ? isDark ? 'bg-gradient-to-br from-[#1e3a3a] to-[#161B22] ring-2 ring-[#5EEAD4]' : 'bg-gradient-to-br from-[#e8f5f3] to-white ring-2 ring-[#4b9b87]'
                                : isDark ? 'bg-[#161B22]' : 'bg-white'
                            } shadow-sm`}
                    >
                        {/* Popular badge */}
                        {plan.popular && (
                            <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl ${isDark ? 'bg-[#5EEAD4] text-[#0B1015]' : 'bg-[#4b9b87] text-white'} text-xs font-bold`}>
                                Most Popular
                            </div>
                        )}

                        <div className="p-6">
                            {/* Plan Header */}
                            <div className="mb-4">
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-4">
                                {plan.price > 0 && <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>$</span>}
                                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                                    {plan.price === 0 ? 'Free' : plan.price}
                                </span>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {plan.period}
                                </span>
                                {plan.savings && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                        {plan.savings}
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className={`material-symbols-outlined text-[18px] mt-0.5 ${isDark ? 'text-[#5EEAD4]' : 'text-[#4b9b87]'}`}>check_circle</span>
                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] ${plan.popular
                                        ? 'bg-[#4b9b87] text-white shadow-lg shadow-[#4b9b87]/25'
                                        : isDark
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : 'bg-gray-100 text-[#111817] hover:bg-gray-200'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Trust badges */}
                <div className={`text-center py-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p className="text-xs mb-2">Secure payment • Cancel anytime • 30-day money-back guarantee</p>
                    <div className="flex items-center justify-center gap-4 opacity-50">
                        <span className="text-xs">💳 Stripe</span>
                        <span className="text-xs">🔒 SSL Secured</span>
                    </div>
                </div>

                <MentamindBranding variant="footer" />
            </main>
        </div>
    );
};

export default Pricing;
