import React, { useState } from 'react';
import { User } from '../types';
import { loginUser } from '../utils/auth';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
    onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const user = loginUser(username, password);
            setIsLoading(false);
            if (user) {
                onLoginSuccess(user);
            } else {
                setError('Invalid username or password.');
            }
        }, 500);
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    StackTutor
                </h1>
                <p className="text-center text-slate-400 mb-6">Welcome back! Please log in.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-slate-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                             className="mt-1 block w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToSignup} className="font-medium text-cyan-400 hover:text-cyan-300">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;