import React, { useState, useEffect, memo, useMemo } from 'react';
import { LearningCategory, Language, User, Topic, ResourceLink, View } from '../types';
import { getLanguageProgress, getResumeLink } from '../utils/progress';
import { featuredResources } from '../constants';
import { CodeIcon, RoadmapIcon, MicIcon, SparklesIcon, PhoneIcon, TranslateIcon, QuizIcon, ArrowRightIcon, LightBulbIcon, BookOpenIcon, NewspaperIcon, UsersIcon, ExternalLinkIcon, YouTubeIcon, GitHubIcon, BeakerIcon, VialIcon, SwatchIcon, BoltIcon } from './icons';

// --- Helper to get a unique gradient for each language ---
const getGradientForLanguage = (slug: string): [string, string] => {
    // Returns [light mode gradient, dark mode gradient]
    switch (slug) {
        // Reds & Oranges
        case 'html': return ['from-orange-500/20', 'from-orange-500/20'];
        case 'ruby': return ['from-red-600/20', 'from-red-600/20'];
        case 'git': return ['from-orange-600/20', 'from-orange-600/20'];
        // Blues
        case 'css': return ['from-blue-500/20', 'from-blue-500/20'];
        case 'typescript': return ['from-blue-400/20', 'from-blue-400/20'];
        case 'react': return ['from-cyan-400/20', 'from-cyan-400/20'];
        case 'go': return ['from-cyan-300/20', 'from-cyan-300/20'];
        case 'postgresql': return ['from-sky-600/20', 'from-sky-600/20'];
        case 'docker': return ['from-blue-600/20', 'from-blue-600/20'];
        // Greens
        case 'vuejs': return ['from-green-500/20', 'from-green-500/20'];
        case 'nodejs': return ['from-green-600/20', 'from-green-600/20'];
        case 'mongodb': return ['from-green-400/20', 'from-green-400/20'];
        // Yellows
        case 'javascript': return ['from-yellow-400/20', 'from-yellow-400/20'];
        case 'python': return ['from-yellow-500/20', 'from-yellow-500/20'];
        default: return ['from-gray-400/20', 'from-gray-700/20'];
    }
};

// --- LinearProgress Component ---
interface LinearProgressProps {
    progress: number;
}
const LinearProgress: React.FC<LinearProgressProps> = ({ progress }) => {
    return (
        <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
                className="h-1.5 rounded-full bg-gray-800 dark:bg-white"
                style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
            />
        </div>
    );
};


// --- LanguageCard Component ---
interface LanguageCardProps {
  language: Language;
  user: User;
  onSelectLanguage: (language: Language) => void;
}
const LanguageCard: React.FC<LanguageCardProps> = memo(({ language, user, onSelectLanguage }) => {
    const progress = getLanguageProgress(user.username, language.slug, language.topics.length);
    const [gradientLight, gradientDark] = getGradientForLanguage(language.slug);

    return (
        <div
            onClick={() => onSelectLanguage(language)}
            className={`group flex flex-col justify-between p-4 cursor-pointer transition-all duration-300 overflow-hidden border rounded-xl 
                       bg-gradient-to-br to-white dark:to-gray-900/50 ${gradientLight} dark:${gradientDark} 
                       border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-1`}
        >
            <div className="flex items-center gap-3">
                <img 
                    src={language.logo} 
                    alt={`${language.name} logo`} 
                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 dark:filter dark:grayscale" 
                />
                <h3 className="font-bold text-lg text-black dark:text-white">{language.name}</h3>
            </div>
            
            <div className="mt-4">
                <div className="flex justify-between items-center text-xs mb-1 text-gray-500 dark:text-gray-400">
                     <span>Progress</span>
                     <span>{progress}%</span>
                </div>
                <LinearProgress progress={progress} />
            </div>
        </div>
    );
});

// --- Quick Access Button ---
interface QuickAccessButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
}
const QuickAccessButton: React.FC<QuickAccessButtonProps> = memo(({ onClick, icon, title, description }) => {
    return (
        <button onClick={onClick} className="group text-left p-3 transition-all duration-300 flex items-center gap-4 w-full h-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-300 dark:hover:border-white/10">
            <div className="flex-shrink-0 p-3 rounded-lg transition-transform duration-300 group-hover:scale-110 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-black dark:text-white">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-500">{description}</p>
            </div>
        </button>
    );
});

// --- Resume Card ---
interface ResumeCardProps {
    language: Language;
    topic: Topic;
    onClick: () => void;
}
const ResumeCard: React.FC<ResumeCardProps> = memo(({ language, topic, onClick }) => {
    return (
        <button onClick={onClick} className="group w-full p-6 border rounded-2xl flex items-center justify-between transition-all duration-300 bg-white dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-gray-500">
            <div className="flex items-center gap-5">
                <img src={language.logo} alt={`${language.name} logo`} className="h-14 w-14 drop-shadow-lg dark:filter dark:grayscale" />
                <div className="text-left">
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Continue Learning</p>
                    <h3 className="text-2xl font-bold mt-1 text-black dark:text-white">{language.name}: {topic.title}</h3>
                </div>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-white">
                Go <ArrowRightIcon className="w-6 h-6" />
            </div>
        </button>
    );
});

// --- Resource Card ---
const ResourceCard: React.FC<{ resource: ResourceLink; onClick?: () => void }> = memo(({ resource, onClick }) => {
    const Icon = useMemo(() => {
        switch (resource.type) {
            case 'documentation': return BookOpenIcon;
            case 'article': return NewspaperIcon;
            case 'youtube': return YouTubeIcon;
            case 'github': return GitHubIcon;
            case 'tutor': return UsersIcon;
            case 'educators': return UsersIcon;
            default: return ExternalLinkIcon;
        }
    }, [resource.type]);

    const content = (
         <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-lg transition-transform duration-300 group-hover:scale-110 bg-gray-100 dark:bg-gray-800">
                <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-grow">
                <h4 className="font-semibold text-black dark:text-white">{resource.name}</h4>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{resource.description}</p>
            </div>
            {!onClick && <ExternalLinkIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
    );
    
    const cardClasses = "group block w-full text-left p-4 rounded-xl transition-all duration-300 border bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:-translate-y-1";

    if (onClick) {
        return <button onClick={onClick} className={cardClasses}>{content}</button>;
    }

    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className={cardClasses}>
            {content}
        </a>
    );
});


// --- HomePage Component ---
interface HomePageProps {
  learningData: LearningCategory[];
  onSelectLanguage: (language: Language) => void;
  onSelectTopic: (language: Language, topic: Topic) => void;
  user: User;
  onNavigate: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ learningData, onSelectLanguage, onSelectTopic, user, onNavigate }) => {
    const [resumeLink, setResumeLink] = useState<{ language: Language, topic: Topic } | null>(null);

    useEffect(() => {
        const link = getResumeLink(user.username, learningData);
        setResumeLink(link);
    }, [user, learningData]);

    const aiTools = [
        { view: 'apiGenerator', icon: <SparklesIcon className="w-6 h-6" />, title: "API Forge", description: "Generate backend APIs" },
        { view: 'uiDrafter', icon: <SwatchIcon className="w-6 h-6" />, title: "UI Drafter", description: "Create UI from a design" },
        { view: 'codeImprover', icon: <BoltIcon className="w-6 h-6" />, title: "Code Improver", description: "Refactor & enhance code" },
        { view: 'codeTranslator', icon: <TranslateIcon className="w-6 h-6" />, title: "Code Translator", description: "Switch between languages" },
        { view: 'unitTestGenerator', icon: <VialIcon className="w-6 h-6" />, title: "Unit Test Generator", description: "Create tests for your code" },
        { view: 'liveTutor', icon: <PhoneIcon className="w-6 h-6" />, title: "Live AI Voice Tutor", description: "Talk with an AI tutor" },
        { view: 'interviewPrep', icon: <MicIcon className="w-6 h-6" />, title: "Interview Simulator", description: "Practice for interviews" },
        { view: 'learningPath', icon: <RoadmapIcon className="w-6 h-6" />, title: "Learning Path Generator", description: "Create a custom roadmap" },
        { view: 'codeMentor', icon: <LightBulbIcon className="w-6 h-6" />, title: "Code Mentor", description: "Get guided practice" },
        { view: 'playground', icon: <BeakerIcon className="w-6 h-6" />, title: "Code Playground", description: "Practice with AI feedback" },
        { view: 'debugger', icon: <CodeIcon className="w-6 h-6" />, title: "AI Code Debugger", description: "Find and fix bugs" },
        { view: 'quizGenerator', icon: <QuizIcon className="w-6 h-6" />, title: "AI Quiz Generator", description: "Create quizzes from text" },
    ] as const;

    return (
    <div className="space-y-12">
        {/* Hero */}
        <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">
                Welcome back, <span className="text-blue-600 dark:text-white">{user.username}</span>!
            </h1>
            <p className="text-lg mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Your coding dojo awaits. Pick up where you left off or dive into a new technology.
            </p>
        </div>

        {/* Resume Card */}
        {resumeLink && (
            <div>
                <ResumeCard 
                    language={resumeLink.language}
                    topic={resumeLink.topic}
                    onClick={() => onSelectTopic(resumeLink.language, resumeLink.topic)}
                />
            </div>
        )}

        {/* AI Toolkit */}
        <div>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">AI Toolkit</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {aiTools.map(tool => (
                    <QuickAccessButton 
                        key={tool.view}
                        onClick={() => onNavigate({ name: tool.view })}
                        icon={tool.icon}
                        title={tool.title}
                        description={tool.description}
                    />
                ))}
            </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-10">
            {learningData.map((category) => (
                <div key={category.name}>
                    <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">{category.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {category.languages.map((lang) => (
                            <LanguageCard 
                                key={lang.slug}
                                language={lang}
                                user={user}
                                onSelectLanguage={onSelectLanguage}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        {/* Featured Resources */}
        <div>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Featured Resources & Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredResources.map(resource => (
                    <ResourceCard
                        key={resource.name}
                        resource={resource}
                        onClick={resource.type === 'educators' ? () => onNavigate({ name: 'educators' }) : undefined}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default HomePage;
