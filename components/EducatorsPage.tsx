import React from 'react';
import { topEducators } from '../constants';
import { Educator } from '../types';
import { YouTubeIcon, GitHubIcon, GlobeAltIcon } from './icons';

const EducatorCard: React.FC<{ educator: Educator }> = ({ educator }) => {
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full transition-all duration-300 hover:border-blue-400 dark:hover:border-gray-600 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
                <img src={educator.avatarUrl} alt={`${educator.name} avatar`} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                <div>
                    <h3 className="text-xl font-bold text-black dark:text-white">{educator.name}</h3>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                {educator.description}
            </p>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                {educator.links.youtube && (
                    <a href={educator.links.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${educator.name} YouTube`} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-white transition-colors">
                        <YouTubeIcon className="w-6 h-6" />
                    </a>
                )}
                 {educator.links.website && (
                    <a href={educator.links.website} target="_blank" rel="noopener noreferrer" aria-label={`${educator.name} Website`} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white transition-colors">
                        <GlobeAltIcon className="w-6 h-6" />
                    </a>
                )}
                {educator.links.github && (
                    <a href={educator.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${educator.name} GitHub`} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors">
                        <GitHubIcon className="w-6 h-6" />
                    </a>
                )}
            </div>
        </div>
    );
};

const EducatorsPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
  return (
    <div>
        <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            &larr; Back to Home
        </button>
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">Top Full Stack Educators</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                A curated list of excellent YouTube channels, tutors, and resources for learning modern web development.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEducators.map(educator => (
                <EducatorCard key={educator.name} educator={educator} />
            ))}
        </div>
    </div>
  );
};

export default EducatorsPage;