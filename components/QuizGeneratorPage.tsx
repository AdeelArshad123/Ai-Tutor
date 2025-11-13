import React, { useState, lazy, Suspense } from 'react';
import { generateQuizFromTopicText } from '../services/geminiService';
import { Quiz as QuizType } from '../types';
import { SparklesIcon } from './icons';

const Quiz = lazy(() => import('./Quiz'));

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-4">
        <svg className="animate-spin h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const QuizGeneratorPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [topicText, setTopicText] = useState('');
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicText.trim()) {
            setError('Please enter some text to generate a quiz from.');
            return;
        }
        setIsLoading(true);
        setError('');
        setQuiz(null);
        try {
            const response = await generateQuizFromTopicText(topicText);
            setQuiz(response);
        } catch (err) {
            setError('An error occurred while generating the quiz. The AI might have returned an invalid format. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">AI Quiz Generator</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Paste any text—like documentation, an article, or your own notes—and our AI will create a multiple-choice quiz to help you study.
                </p>
            </div>
            
            <div className="max-w-4xl mx-auto mt-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <label htmlFor="topicText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Paste your topic text here
                    </label>
                    <textarea
                        id="topicText"
                        rows={10}
                        value={topicText}
                        onChange={(e) => setTopicText(e.target.value)}
                        placeholder="e.g., The Document Object Model (DOM) is a programming interface for web documents..."
                        className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                    />
                    {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : (
                            <><SparklesIcon className="w-5 h-5" /> Generate Quiz</>
                        )}
                    </button>
                </form>

                {isLoading && <div className="mt-8"><LoadingSpinner /></div>}

                {quiz && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Your Generated Quiz</h2>
                        <Suspense fallback={<LoadingSpinner />}>
                            <Quiz quiz={quiz} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizGeneratorPage;