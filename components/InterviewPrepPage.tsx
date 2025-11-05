import React, { useState } from 'react';
import { getInterviewQuestion, evaluateInterviewAttempt } from '../services/geminiService';
import { InterviewQuestion } from '../types';
import { learningData } from '../constants';

const availableLanguages = Array.from(new Set(learningData.flatMap(category => category.languages.map(lang => lang.name))));

type Stage = 'start' | 'question' | 'feedback';

const InterviewPrepPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [stage, setStage] = useState<Stage>('start');
    const [language, setLanguage] = useState(availableLanguages[0]);
    const [question, setQuestion] = useState<InterviewQuestion | null>(null);
    const [userCode, setUserCode] = useState('');
    const [userExplanation, setUserExplanation] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStartInterview = async () => {
        setIsLoading(true);
        setError('');
        setQuestion(null);
        try {
            const result = await getInterviewQuestion(language);
            if (result) {
                setQuestion(result);
                setStage('question');
            } else {
                setError('Could not generate a question. Please try again.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmitAttempt = async () => {
        if (!userCode.trim() || !userExplanation.trim()) {
            setError('Please provide both a code solution and an explanation.');
            return;
        }
        setIsLoading(true);
        setError('');
        setFeedback('');
        try {
            const result = await evaluateInterviewAttempt(question!.question, userCode, userExplanation);
            setFeedback(result);
            setStage('feedback');
        } catch (e) {
            setError('An error occurred while evaluating your attempt.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTryAgain = () => {
        setStage('start');
        setQuestion(null);
        setUserCode('');
        setUserExplanation('');
        setFeedback('');
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>
             <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">AI Interview Simulator</h1>
                <p className="text-slate-400 mt-2">Practice a technical interview and get instant feedback.</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                {stage === 'start' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Ready to start?</h2>
                        <div className="mb-6">
                            <label htmlFor="language-select" className="block text-sm font-medium text-slate-300 mb-1">Select your language/framework</label>
                            <select
                                id="language-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="mt-1 max-w-xs mx-auto block w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                            >
                                {availableLanguages.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleStartInterview} disabled={isLoading} className="w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50">
                             {isLoading ? 'Getting Question...' : `Start ${language} Interview`}
                        </button>
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                )}
                
                {stage === 'question' && question && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-2 text-cyan-400">Your Question</h2>
                        <p className="text-lg font-bold mb-2">{question.question}</p>
                        <p className="text-slate-400 mb-6">{question.instructions}</p>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="code-input" className="block text-sm font-medium text-slate-300 mb-1">Your Code Solution</label>
                                <textarea id="code-input" rows={12} value={userCode} onChange={(e) => setUserCode(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2 font-mono text-sm" />
                            </div>
                             <div>
                                <label htmlFor="explanation-input" className="block text-sm font-medium text-slate-300 mb-1">Explain your thought process</label>
                                <textarea id="explanation-input" rows={4} value={userExplanation} onChange={(e) => setUserExplanation(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-md p-2" />
                            </div>
                        </div>
                        <button onClick={handleSubmitAttempt} disabled={isLoading} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 disabled:opacity-50">
                           {isLoading ? 'Evaluating...' : 'Submit for Feedback'}
                        </button>
                         {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                )}

                {stage === 'feedback' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Interviewer Feedback</h2>
                         <div
                            className="prose prose-invert max-w-none prose-h4:text-cyan-400 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-code:text-white"
                            dangerouslySetInnerHTML={{ __html: feedback }}
                        />
                        <button onClick={handleTryAgain} className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500">
                           Try another question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewPrepPage;