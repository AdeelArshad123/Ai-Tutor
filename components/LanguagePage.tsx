import React from 'react';
import { Language, Topic, User, ResourceLink } from '../types';
import { isTopicComplete } from '../utils/progress';
import { CheckCircleIcon, ExternalLinkIcon, YouTubeIcon, GitHubIcon, BookOpenIcon, NewspaperIcon, UsersIcon } from './icons';

const ResourceCard: React.FC<{ resource: ResourceLink }> = ({ resource }) => {
    const Icon = {
        youtube: YouTubeIcon,
        github: GitHubIcon,
        documentation: BookOpenIcon,
        article: NewspaperIcon,
        tutor: UsersIcon
    }[resource.type];

    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                   <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                    <h4 className="font-semibold text-black dark:text-white">{resource.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                </div>
            </div>
        </a>
    );
};


const LanguagePage: React.FC<{
  language: Language;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
  user: User;
}> = ({ language, onSelectTopic, onBack, user }) => {
  return (
    <div className="space-y-8">
      <div>
        <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
          &larr; Back to Home
        </button>
        <div className="flex items-center gap-6">
            <img src={language.logo} alt={`${language.name} logo`} className="h-24 w-24 dark:filter dark:grayscale" />
            <div>
                <h1 className="text-4xl font-bold text-black dark:text-white">{language.name}</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{language.description}</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-gray-400 dark:border-gray-500 pl-3">Topics</h2>
            {language.topics.map((topic) => {
                const isComplete = isTopicComplete(user.username, language.slug, topic.slug);
                return (
                <div
                    key={topic.slug}
                    onClick={() => onSelectTopic(topic)}
                    className="flex items-center justify-between p-5 bg-white dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
                >
                    <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">{topic.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{topic.description}</p>
                    </div>
                    {isComplete && (
                    <div className="flex-shrink-0 ml-4">
                        <CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-white" />
                    </div>
                    )}
                </div>
                );
            })}
        </div>

        {language.resources && language.resources.length > 0 && (
             <div className="space-y-4">
                <h2 className="text-2xl font-bold border-l-4 border-gray-400 dark:border-gray-500 pl-3">Recommended Resources</h2>
                {language.resources.map(resource => (
                    <ResourceCard key={resource.url} resource={resource} />
                ))}
             </div>
        )}
      </div>

    </div>
  );
};

export default LanguagePage;