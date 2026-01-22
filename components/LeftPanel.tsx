import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface LeftPanelProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ isCollapsed, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const isDark = user.nightMode;

    const navItems = [
        { path: '/dashboard', icon: 'dashboard', label: 'DASHBOARD' },
        { path: '/profile', icon: 'person', label: 'PROFILE' },
        { path: '/home', icon: 'wb_sunny', label: 'TODAY' },
        { path: '/journey', icon: 'map', label: 'JOURNEY' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-[70px]' : 'w-[280px]'
                } ${isDark ? 'bg-[#0B1121] border-r border-white/5' : 'bg-white border-r border-gray-200'
                } flex flex-col transition-all duration-300 z-40`}
        >
            {/* Header with Toggle Button */}
            <div className={`px-4 py-4 border-b ${isDark ? 'border-white/5' : 'border-gray-200'} flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div>
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#111817]'}`}>
                            WELCOME
                        </h2>
                        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-[#4FD1C5]' : 'text-[#3D6B5B]'}`}>
                            {user.name || 'User'}
                        </p>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                        }`}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <span className={`material-symbols-outlined text-[24px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isCollapsed ? 'menu' : 'menu_open'}
                    </span>
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-2 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'
                            } py-3 rounded-xl transition-all ${isActive(item.path)
                                ? isDark
                                    ? 'bg-[#3D6B5B]/20 text-[#4FD1C5]'
                                    : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'
                                : isDark
                                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#111817]'
                            }`}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <span
                            className="material-symbols-outlined text-[24px]"
                            style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className={`text-sm font-bold tracking-wide ${isActive(item.path) ? 'font-extrabold' : ''}`}>
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}

                {/* Settings Button - Pushed to bottom */}
                <button
                    onClick={() => navigate('/profile')}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'
                        } py-3 rounded-xl transition-all mt-auto ${isActive('/settings') // logically settings, but technically profile
                            ? isDark ? 'bg-[#3D6B5B]/20 text-[#4FD1C5]' : 'bg-[#3D6B5B]/10 text-[#3D6B5B]'
                            : isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-[#111817]'
                        }`}
                    title={isCollapsed ? 'SETTINGS' : undefined}
                >
                    <span
                        className="material-symbols-outlined text-[24px]"
                        style={isActive('/profile') && location.hash === '#settings' ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                        settings
                    </span>
                    {!isCollapsed && (
                        <span className={`text-sm font-bold tracking-wide`}>
                            SETTINGS
                        </span>
                    )}
                </button>
            </nav>

            {/* Footer - Mentamind Branding */}
            {!isCollapsed && (
                <div className={`px-6 py-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <a
                        href="https://mentamind.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs ${isDark ? 'text-gray-500 hover:text-[#4FD1C5]' : 'text-gray-400 hover:text-[#3D6B5B]'} transition-colors`}
                    >
                        Powered by: <span className="font-semibold">mentamind.in</span>
                    </a>
                </div>
            )}
        </aside>
    );
};

export default LeftPanel;
