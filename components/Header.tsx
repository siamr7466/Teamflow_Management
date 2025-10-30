import React from 'react';
import { User } from '../types';
import { LogoutIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
    currentUser: User;
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, theme, setTheme }) => {
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700/50">
            <div>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome, {currentUser.name}!</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Let's get things done today.</p>
            </div>
            <div className="flex items-center gap-4">
                 <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
                <div className="text-right">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
                </div>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition"
                    aria-label="Logout"
                >
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;