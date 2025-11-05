import React, { useState } from 'react';
import { generateLearningPath } from '../services/geminiService';
import { LearningPath, Language, Topic } from '../types';
import { learningData } from '../constants';

interface LearningPathPageProps {
    onBack: () => void;
    onNavigate: (view: { name: 'topic', language: Language, topic: Topic }) => void;
}

const LearningPathPage: React.FC<LearningPathPageProps> = ({ onBack, onNavigate }) => {
    const [goal, setGoal] = useState('');
    const [path, setPath] = useState<LearningPath | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!goal.trim()) {
            setError('Please describe your learning goal.');
            return;
        }
        setIsLoading(true);
        setError('');
        setPath(null);
        try {
            const result = await generateLearningPath(goal);
            if (result) {
                setPath(result);
            } else {
                setError('Could not generate a learning path. The AI might be busy. Try rephrasing your goal.');
            }
        } catch (e) {
            setError('An error occurred while generating the path. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopicClick = (languageSlug: string, topicSlug: string) => {
        const language = learningData.flatMap(c => c.languages).find(l => l.slug === languageSlug);
        if (language) {
            const topic = language.topics.find(t => t.slug === topicSlug);
            if (topic) {
                onNavigate({ name: 'topic', language, topic });
            }
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">AI Learning Path Generator</h1>
                <p className="text-slate-400 mt-2">Tell us your goal, and our AI will create a personalized roadmap for you.</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                <label htmlFor="goal-input" className="block text-lg font-medium text-slate-300 mb-2">What do you want to learn or become?</label>
                <textarea
                    id="goal-input"
                    rows={3}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., 'I want to become a frontend developer and build interactive web apps' or 'Help me learn backend development with Node.js'"
                    className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                />
                 <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                    >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Path...
                            </>
                        ) : 'Generate My Path'}
                    </button>
                </div>
            </div>

            {(isLoading || error || path) && (
                <div className="max-w-4xl mx-auto mt-8 bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                    <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Your Custom Learning Path</h2>
                    {isLoading && <p>🤖 Crafting your personalized roadmap...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {path && (
                        <div>
                            <h3 className="text-xl font-bold">{path.title}</h3>
                            <p className="text-slate-400 mt-1 mb-6">{path.description}</p>
                            <div className="space-y-4">
                                {path.steps.map((step, index) => (
                                    <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-cyan-500/20 text-cyan-300 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">{index + 1}</div>
                                            <div>
                                                <button onClick={() => handleTopicClick(step.languageSlug, step.topicSlug)} className="text-lg font-semibold text-left hover:text-cyan-400 transition-colors">
                                                    {step.languageName} - {step.topicTitle}
                                                </button>
                                                <p className="text-slate-400 text-sm mt-1">{step.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LearningPathPage;