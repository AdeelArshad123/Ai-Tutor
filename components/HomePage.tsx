import React from 'react';
import { LearningCategory, Language, User } from '../types';
import { getLanguageProgress } from '../utils/progress';
import { CodeIcon, RoadmapIcon, MicIcon, SparklesIcon, PhoneIcon } from './icons';

// --- LanguageCard Component ---
interface LanguageCardProps {
  language: Language;
  user: User;
  onSelectLanguage: (language: Language) => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ language, user, onSelectLanguage }) => {
    const progress = getLanguageProgress(user.username, language.slug, language.topics.length);

    return (
        <div
            onClick={() => onSelectLanguage(language)}
            className="group relative bg-black/20 p-6 rounded-2xl flex flex-col cursor-pointer transition-all duration-300 overflow-hidden border border-white/10 hover:border-cyan-400/50 hover:-translate-y-1"
        >
            <div className="absolute -inset-px top-0 left-0 w-full h-full rounded-2xl bg-cyan-400/0 group-hover:bg-cyan-400/10 blur-lg transition-all duration-300"></div>
            <div className="relative z-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <img src={language.logo} alt={`${language.name} logo`} className="h-12 w-12" />
                    <h3 className="font-bold text-xl text-slate-100">{language.name}</h3>
                </div>
                <p className="text-sm text-slate-400 flex-grow mb-6">{language.description}</p>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-cyan-400">Progress</span>
                        <span className="text-xs font-medium text-slate-300">{progress}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2 border border-white/10">
                        <div
                            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Quick Access Button ---
interface QuickAccessButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
}
const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ onClick, icon, title, description }) => (
    <button onClick={onClick} className="text-left bg-black/20 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors flex items-start gap-4 w-full h-full">
        <div className="flex-shrink-0 bg-cyan-500/10 text-cyan-400 p-2 rounded-md mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </button>
);


// --- Updated HomePage Component ---
interface HomePageProps {
  learningData: LearningCategory[];
  onSelectLanguage: (language: Language) => void;
  user: User;
  onNavigate: (viewName: 'debugger' | 'learningPath' | 'interviewPrep' | 'apiGenerator' | 'liveTutor') => void;
}

const HomePage: React.FC<HomePageProps> = ({ learningData, onSelectLanguage, user, onNavigate }) => {
  return (
    <div className="space-y-16">
      <div className="text-center pt-12 pb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">{user.username}</span>!
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
          Continue your learning journey or explore powerful AI tools to accelerate your development. What will you do today?
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">AI Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAccessButton 
                onClick={() => onNavigate('apiGenerator')}
                icon={<SparklesIcon className="w-6 h-6" />}
                title="API Forge"
                description="Generate complete backend APIs from a text prompt."
            />
             <QuickAccessButton 
                onClick={() => onNavigate('liveTutor')}
                icon={<PhoneIcon className="w-6 h-6" />}
                title="Live AI Voice Tutor"
                description="Have a real-time voice conversation with an AI tutor."
            />
            <QuickAccessButton 
                onClick={() => onNavigate('learningPath')}
                icon={<RoadmapIcon className="w-6 h-6" />}
                title="Learning Path Generator"
                description="Create a custom roadmap to achieve your learning goals."
            />
            <QuickAccessButton 
                onClick={() => onNavigate('interviewPrep')}
                icon={<MicIcon className="w-6 h-6" />}
                title="Interview Simulator"
                description="Practice technical interviews and get instant feedback."
            />
            <QuickAccessButton 
                onClick={() => onNavigate('debugger')}
                icon={<CodeIcon className="w-6 h-6" />}
                title="AI Code Debugger"
                description="Find and fix bugs in your code with AI assistance."
            />
        </div>
      </div>
      
      <div className="space-y-12">
        {learningData.map((category) => (
          <div key={category.name}>
            <h2 className="text-3xl font-bold text-slate-100 mb-6 border-l-4 border-cyan-400 pl-4">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default HomePage;