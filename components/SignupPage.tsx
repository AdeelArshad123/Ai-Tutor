import React, { useState } from 'react';
import { User } from '../types';
import { signupUser } from '../utils/auth';

interface SignupPageProps {
    onSignupSuccess: (user: User) => void;
    onNavigateToLogin: () => void;
}

const styles = {
    card: "bg-white dark:bg-black/50 backdrop-blur-xl border border-gray-300 dark:border-gray-700",
    title: "text-black dark:text-white",
    input: "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-white focus:ring-blue-500 dark:focus:ring-white text-black dark:text-white placeholder-gray-500",
    button: "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 active:scale-[0.98]",
    link: "text-blue-600 dark:text-white hover:underline",
};

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            const user = signupUser(username, password);
            setIsLoading(false);
            if (user) {
                onSignupSuccess(user);
            } else {
                setError('Username is already taken.');
            }
        }, 500);
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4">
             <div className={`relative w-full max-w-md rounded-2xl p-8 md:p-10 ${styles.card}`}>
                <div className="text-center mb-8">
                     <h1 className={`text-4xl font-bold ${styles.title}`}>StackTutor</h1>
                     <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Create Your Account</p>
                     <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Join to start your learning adventure.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-300 ${styles.input}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`mt-1 block w-full border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-300 ${styles.input}`}
                        />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center mt-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 ${styles.button}`}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className={`font-medium ${styles.link}`}>
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;