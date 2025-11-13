import React, { useState } from 'react';
import { generateCodingChallenge, getCodeHint, evaluateSolution } from '../services/geminiService';
import { techStack } from '../constants';
import { SparklesIcon, LightBulbIcon, SendIcon } from './icons';
import CodeEditor from './CodeEditor';

type MentorPhase = 'setup' | 'challenge' | 'feedback';

const CodeMentorPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [phase, setPhase] = useState<MentorPhase>('setup');
    const [language, setLanguage] = useState('javascript');
    const [concept, setConcept] = useState('');
    const [challenge, setChallenge] = useState('');
    const [userCode, setUserCode] = useState('');
    const [hint, setHint] = useState('');
    const [feedback, setFeedback] = useState('');
    
    const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
    const [isLoadingHint, setIsLoadingHint] = useState(false);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
    const [error, setError] = useState('');

    const allLangs = [
        ...techStack.languages,
        {id: 'typescript', name: 'TypeScript'},
    ];
    
    const handleGenerateChallenge = async () => {
        if (!concept.trim()) {
            setError('Please enter a concept to practice.');
            return;
        }
        setIsLoadingChallenge(true);
        setError('');
        setChallenge('');
        setHint('');
        setFeedback('');
        setUserCode('');
        try {
            const result = await generateCodingChallenge(language, concept);
            setChallenge(result);
            setPhase('challenge');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoadingChallenge(false);
        }
    };
    
    const handleGetHint = async () => {
        if (!userCode.trim()) return;
        setIsLoadingHint(true);
        setHint('');
        try {
            const result = await getCodeHint(challenge, userCode, language);
            setHint(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoadingHint(false);
        }
    };
    
    const handleSubmitSolution = async () => {
        if (!userCode.trim()) return;
        setIsLoadingFeedback(true);
        setFeedback('');
        setHint('');
        try {
            const result = await evaluateSolution(challenge, userCode, language);
            setFeedback(result);
            setPhase('feedback');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoadingFeedback(false);
        }
    };
    
    const handleStartOver = () => {
        setPhase('setup');
        setChallenge('');
        setUserCode('');
        setHint('');
        setFeedback('');
        setError('');
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">AI Code Mentor</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Practice your skills with AI-generated challenges, hints, and feedback.
                </p>
            </div>
            
            <div className="max-w-4xl mx-auto mt-8 space-y-6">
                {/* --- Step 1: Setup --- */}
                <div className={`bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 ${phase !== 'setup' ? 'opacity-50' : ''}`}>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-current font-bold">1</span>
                        Choose a Topic
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                            <select id="language" value={language} onChange={e => setLanguage(e.target.value)} disabled={phase !== 'setup'} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white">
                                {allLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="concept" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Concept</label>
                            <input type="text" id="concept" value={concept} onChange={e => setConcept(e.target.value)} disabled={phase !== 'setup'} placeholder="e.g., 'functions' or 'for loops'" className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white" />
                        </div>
                    </div>
                     <button onClick={handleGenerateChallenge} disabled={isLoadingChallenge || phase !== 'setup'} className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                        {isLoadingChallenge ? 'Generating...' : <><SparklesIcon className="w-5 h-5" /> Generate Challenge</>}
                    </button>
                </div>
                
                {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

                {/* --- Step 2: Challenge & Coding --- */}
                {phase !== 'setup' && (
                    <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-current font-bold">2</span>
                            Solve the Challenge
                        </h2>
                        <div className="mt-4 p-4 bg-gray-100 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-700 dark:text-gray-300">{challenge}</p>
                        </div>
                        <div className="mt-4">
                            <div className="w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                                <CodeEditor
                                    value={userCode}
                                    onChange={setUserCode}
                                    language={language}
                                    height="300px"
                                    readOnly={phase === 'feedback'}
                                />
                            </div>
                        </div>
                        {phase === 'challenge' && (
                             <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button onClick={handleGetHint} disabled={isLoadingHint || !userCode} className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold py-2 px-4 rounded-lg transition-all hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
                                    {isLoadingHint ? 'Getting hint...' : <><LightBulbIcon className="w-5 h-5" /> Get a Hint</>}
                                </button>
                                 <button onClick={handleSubmitSolution} disabled={isLoadingFeedback || !userCode} className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                                    {isLoadingFeedback ? 'Evaluating...' : <><SendIcon className="w-5 h-5" /> Submit Solution</>}
                                </button>
                             </div>
                        )}
                        {hint && <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg text-sm text-blue-800 dark:text-gray-300">{hint}</div>}
                    </div>
                )}
                
                {/* --- Step 3: Feedback --- */}
                {phase === 'feedback' && (
                     <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-current font-bold">3</span>
                            Feedback
                        </h2>
                         <div className="mt-4 prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900/70" dangerouslySetInnerHTML={{ __html: feedback }} />
                         <button onClick={handleStartOver} className="mt-6 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200">
                            Start a New Challenge
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeMentorPage;