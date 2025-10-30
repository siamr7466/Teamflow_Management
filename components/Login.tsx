import React, { useState } from 'react';
import { User } from '../types';
import { LogoIcon } from './Icons';

interface LoginProps {
    users: User[];
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
    const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.id === selectedUserId);
        if (user) {
            onLogin(user);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 bg-gradient-to-br from-indigo-100 via-white to-cyan-100 dark:from-gray-900 dark:via-black dark:to-indigo-900/50">
            <div className="w-full max-w-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-white/30 dark:border-gray-700/50">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                       <LogoIcon className="h-10 w-10 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            TeamFlow
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Select a user to log in</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            User
                        </label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
             <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                This is a demo. No real authentication is used.
            </p>
        </div>
    );
};

export default Login;