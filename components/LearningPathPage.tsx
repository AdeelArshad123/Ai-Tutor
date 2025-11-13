import React, { useState } from 'react';
import { generateLearningPath } from '../services/geminiService';
import { LearningPath, View, Language, Topic } from '../types';
import { SparklesIcon, RoadmapIcon } from './icons';
import { learningData } from '../constants';

const LearningPathPage: React.FC<{
  onBack: () => void;
  onNavigate: (view: { name: 'topic', language: Language, topic: Topic }) => void;
}> = ({ onBack, onNavigate }) => {
    const [goal, setGoal] = useState('');
    const [path, setPath] = useState<LearningPath | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) {
            setError('Please enter a learning goal.');
            return;
        }
        setIsLoading(true);
        setError('');
        setPath(null);
        try {
            const response = await generateLearningPath(goal);
            setPath(response);
        } catch (err) {
            setError('An error occurred while generating the path. Please try a different prompt.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTopicClick = (langSlug: string, topicSlug: string) => {
        const language = learningData.flatMap(c => c.languages).find(l => l.slug === langSlug);
        if (language) {
            const topic = language.topics.find(t => t.slug === topicSlug);
            if (topic) {
                onNavigate({ name: 'topic', language, topic });
            }
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">Learning Path Generator</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Describe your learning goal, and our AI will generate a personalized, step-by-step roadmap for you using topics available on StackTutor.
                </p>
            </div>
            
            <div className="max-w-4xl mx-auto mt-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        What do you want to learn?
                    </label>
                    <textarea
                        id="goal"
                        rows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., 'Build a blog backend with Node.js and MongoDB' or 'Become a frontend developer with React'"
                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : (
                            <><SparklesIcon className="w-5 h-5" /> Generate Path</>
                        )}
                    </button>
                </form>

                {isLoading && (
                    <div className="text-center py-10">
                        <RoadmapIcon className="w-12 h-12 text-current animate-pulse mx-auto" />
                        <p className="mt-4">Building your custom roadmap...</p>
                    </div>
                )}

                {path && (
                    <div className="mt-8 bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-3xl font-bold">{path.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{path.description}</p>
                        <div className="mt-6 space-y-4">
                            {path.steps.map((step, index) => (
                                <div key={index} className="p-4 bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 border border-gray-400 dark:border-gray-600 text-current font-bold w-10 h-10 flex items-center justify-center rounded-full">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => handleTopicClick(step.languageSlug, step.topicSlug)}
                                                className="text-lg font-semibold text-left text-black dark:text-white hover:underline transition-colors"
                                            >
                                                {step.languageName}: {step.topicTitle}
                                            </button>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPathPage;