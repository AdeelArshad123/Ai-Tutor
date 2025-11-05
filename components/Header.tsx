import React, { useState } from 'react';
import { User } from '../types';
import { SearchIcon, CodeIcon, RoadmapIcon, MicIcon, SparklesIcon, PhoneIcon } from './icons';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onSearch: (query: string) => void;
    onNavigate: (viewName: 'home' | 'debugger' | 'learningPath' | 'interviewPrep' | 'apiGenerator' | 'liveTutor') => void;
}

const NavButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; }> = ({ onClick, title, children }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors" title={title}>
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, onSearch, onNavigate }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setQuery('');
        }
    };

    return (
        <header className="bg-black/30 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    StackTutor
                </button>
                
                {user && (
                    <div className="flex-1 flex justify-center px-8">
                        <form onSubmit={handleSearch} className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search topics..."
                                className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-4">
                                <NavButton onClick={() => onNavigate('apiGenerator')} title="AI API Generator">
                                    <SparklesIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">API Forge</span>
                                </NavButton>
                                 <NavButton onClick={() => onNavigate('liveTutor')} title="Live AI Voice Tutor">
                                    <PhoneIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">Live Tutor</span>
                                </NavButton>
                                <NavButton onClick={() => onNavigate('learningPath')} title="AI Learning Path">
                                    <RoadmapIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">Learning Path</span>
                                </NavButton>
                                <NavButton onClick={() => onNavigate('interviewPrep')} title="AI Interview Prep">
                                    <MicIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">Interview Prep</span>
                                </NavButton>
                                <NavButton onClick={() => onNavigate('debugger')} title="AI Code Debugger">
                                    <CodeIcon className="w-6 h-6" />
                                    <span className="hidden lg:inline">AI Debugger</span>
                                </NavButton>
                            </div>
                            <span className="text-slate-300 hidden md:inline">Welcome, {user.username}</span>
                            <button onClick={onLogout} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                           {/* These buttons will be handled by the App component's routing */}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;