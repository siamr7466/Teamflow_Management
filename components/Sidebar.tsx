import React from 'react';
import { View } from '../types';
import { DashboardIcon, MessageIcon, StatsIcon, LogoIcon, BotIcon } from './Icons';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { view: View.DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
        { view: View.MESSAGES, label: 'Messages', icon: MessageIcon },
        { view: View.STATS, label: 'Stats', icon: StatsIcon },
        { view: View.AI_ASSISTANT, label: 'AI Assistant', icon: BotIcon },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <LogoIcon className="h-8 w-8 text-indigo-600"/>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">TeamFlow</span>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setActiveView(item.view)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                            activeView === item.view
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;