import React, { useState } from 'react';
import { getInterviewQuestion, evaluateInterviewAttempt } from '../services/geminiService';
import { InterviewQuestion } from '../types';
import { SparklesIcon, MicIcon } from './icons';
import { techStack } from '../constants';
import CodeEditor from './CodeEditor';

const InterviewPrepPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [technology, setTechnology] = useState('JavaScript');
    const [question, setQuestion] = useState<InterviewQuestion | null>(null);
    const [userCode, setUserCode] = useState('');
    const [userExplanation, setUserExplanation] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [error, setError] = useState('');

    const interviewTechnologies = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'react', name: 'React' },
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
        ...techStack.languages,
        { id: 'dsa', name: 'Data Structures & Algorithms' },
        { id: 'sql', name: 'SQL' },
        { id: 'system-design', name: 'System Design' }
    ];

    // Remove duplicates by name to ensure a clean list
    const uniqueTechnologies = interviewTechnologies.filter((tech, index, self) =>
        index === self.findIndex((t) => t.name === tech.name)
    );


    const handleGetQuestion = async () => {
        setIsLoadingQuestion(true);
        setQuestion(null);
        setFeedback('');
        setUserCode('');
        setUserExplanation('');
        setError('');
        try {
            const q = await getInterviewQuestion(technology);
            setQuestion(q);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoadingQuestion(false);
        }
    };
    
    const handleEvaluate = async () => {
        if (!userCode.trim() || !userExplanation.trim() || !question) return;
        setIsEvaluating(true);
        setFeedback('');
        setError('');
        try {
            const fb = await evaluateInterviewAttempt(question.question, userCode, userExplanation);
            setFeedback(fb);
        } catch(err) {
            setError((err as Error).message);
        } finally {
            setIsEvaluating(false);
        }
    }

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">Interview Simulator</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Practice for your next technical interview. Get a random question, code a solution, explain your approach, and receive instant AI-powered feedback.
                </p>
            </div>

            <div className="max-w-4xl mx-auto mt-8 space-y-8">
                {/* Step 1: Get Question */}
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Step 1: Choose Your Technology</h2>
                    <div className="flex items-end gap-4 mt-4">
                        <div className="flex-grow">
                            <label htmlFor="technology" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Technology
                            </label>
                            <select
                                id="technology"
                                value={technology}
                                onChange={(e) => setTechnology(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                            >
                                {uniqueTechnologies.map(tech => (
                                    <option key={tech.id} value={tech.name}>{tech.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleGetQuestion}
                            disabled={isLoadingQuestion}
                            className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isLoadingQuestion ? 'Generating...' : (<><MicIcon className="w-5 h-5" /> Get Question</>)}
                        </button>
                    </div>
                </div>

                {/* Step 2: Answer Question */}
                {question && (
                    <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold">Step 2: Solve the Problem</h2>
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-black/30 rounded-lg">
                             <h3 className="font-bold text-lg text-black dark:text-white">{question.question}</h3>
                             <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{question.instructions}</p>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="userCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Code</label>
                            <div className="w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                                <CodeEditor
                                    value={userCode}
                                    onChange={setUserCode}
                                    language={technology.toLowerCase()}
                                    height="250px"
                                />
                            </div>
                        </div>
                         <div className="mt-4">
                            <label htmlFor="userExplanation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Explanation</label>
                            <textarea id="userExplanation" value={userExplanation} onChange={e => setUserExplanation(e.target.value)} rows={4} placeholder="Explain your approach, time/space complexity, and any trade-offs." className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white" />
                        </div>
                        <button onClick={handleEvaluate} disabled={isEvaluating || !userCode.trim() || !userExplanation.trim()} className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                            {isEvaluating ? 'Evaluating...' : (<><SparklesIcon className="w-5 h-5" /> Get Feedback</>)}
                        </button>
                    </div>
                )}
                
                {/* Step 3: Feedback */}
                {feedback && (
                    <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold">Step 3: AI Feedback</h2>
                        <div className="mt-4 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: feedback }}/>
                    </div>
                )}
                
                {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default InterviewPrepPage;