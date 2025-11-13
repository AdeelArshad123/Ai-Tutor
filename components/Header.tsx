import React, { useState, useEffect, useRef, memo } from 'react';
import { User, View, BreadcrumbItem } from '../types';
import { SearchIcon, CodeIcon, RoadmapIcon, MicIcon, SparklesIcon, PhoneIcon, TranslateIcon, WrenchScrewdriverIcon, UserCircleIcon, ChevronDownIcon, QuizIcon, LightBulbIcon, SunIcon, MoonIcon, BeakerIcon, VialIcon, SwatchIcon, BoltIcon } from './icons';
import Breadcrumb from './Breadcrumb';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onSearch: (query: string) => void;
    onNavigate: (view: View) => void;
    breadcrumbs: BreadcrumbItem[];
}

const Header: React.FC<HeaderProps> = memo(({ user, onLogout, onSearch, onNavigate, breadcrumbs }) => {
    const [query, setQuery] = useState('');
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const toolsRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setQuery('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const aiTools: { view: 'apiGenerator' | 'codeTranslator' | 'liveTutor' | 'interviewPrep' | 'learningPath' | 'quizGenerator' | 'debugger' | 'codeMentor' | 'playground' | 'unitTestGenerator' | 'uiDrafter' | 'codeImprover', icon: React.ReactNode, title: string }[] = [
        { view: 'apiGenerator', icon: <SparklesIcon className="w-5 h-5" />, title: 'API Forge' },
        { view: 'uiDrafter', icon: <SwatchIcon className="w-5 h-5" />, title: 'UI Drafter' },
        { view: 'codeImprover', icon: <BoltIcon className="w-5 h-5" />, title: 'AI Code Improver' },
        { view: 'codeTranslator', icon: <TranslateIcon className="w-5 h-5" />, title: 'Code Translator' },
        { view: 'unitTestGenerator', icon: <VialIcon className="w-5 h-5" />, title: 'Unit Test Generator' },
        { view: 'liveTutor', icon: <PhoneIcon className="w-5 h-5" />, title: 'Live AI Voice Tutor' },
        { view: 'interviewPrep', icon: <MicIcon className="w-5 h-5" />, title: 'Interview Simulator' },
        { view: 'learningPath', icon: <RoadmapIcon className="w-5 h-5" />, title: 'Learning Path Generator' },
        { view: 'codeMentor', icon: <LightBulbIcon className="w-5 h-5" />, title: 'Code Mentor' },
        { view: 'playground', icon: <BeakerIcon className="w-5 h-5" />, title: 'Code Playground' },
        { view: 'quizGenerator', icon: <QuizIcon className="w-5 h-5" />, title: 'AI Quiz Generator' },
        { view: 'debugger', icon: <CodeIcon className="w-5 h-5" />, title: 'AI Code Debugger' },
    ];


    return (
        <header className="sticky top-0 z-50 bg-gray-50/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={() => onNavigate({ name: 'home' })} className="text-2xl font-bold text-black dark:text-white">
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
                                className="w-full border bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-full py-2 pl-10 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white text-black dark:text-white placeholder-gray-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-500" />
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex items-center gap-2 md:gap-3">
                    {user ? (
                        <>
                            {/* AI Tools Dropdown */}
                            <div ref={toolsRef} className="relative">
                                <button
                                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white ${isToolsOpen ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                                >
                                    <WrenchScrewdriverIcon className="w-5 h-5" />
                                    <span className="hidden lg:inline text-sm font-medium">AI Toolkit</span>
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isToolsOpen && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-1 bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                                        {aiTools.map(tool => (
                                            <button
                                                key={tool.view}
                                                onClick={() => { onNavigate({ name: tool.view }); setIsToolsOpen(false); }}
                                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm transition-colors text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                                            >
                                                {tool.icon}
                                                {tool.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="flex items-center p-2 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                            </button>

                             {/* User Dropdown */}
                            <div ref={userRef} className="relative">
                                <button
                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                    className={`flex items-center p-1.5 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white ${isUserOpen ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
                                >
                                    <UserCircleIcon className="w-6 h-6" />
                                </button>
                                {isUserOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                                            <p className="text-sm font-semibold truncate text-black dark:text-white">{user.username}</p>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-4 py-2 text-sm transition-colors text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
            <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />
        </header>
    );
});

export default Header;
