import React, { useState, useCallback, useEffect } from 'react';
import { Topic, Language, Quiz as QuizType, User, Exercise } from '../types';
import { explainCode, simplifyTopic, generateQuiz, reviewCode } from '../services/geminiService';
import { markTopicAsComplete } from '../utils/progress';
import { CodeBlock } from './CodeBlock';
import { Quiz } from './Quiz';
import { ExternalLinkIcon, PlayIcon, CheckCircleIcon } from './icons';
import { runCode } from '../utils/codeRunner';

interface TopicPageProps {
  topic: Topic;
  language: Language;
  onBack: () => void;
  user: User;
  onNavigate: (view: any) => void;
}

const AIFeatureButton: React.FC<{ onClick: () => void, text: string, isLoading: boolean }> = ({ onClick, text, isLoading }) => (
    <button
        onClick={onClick}
        disabled={isLoading}
        className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
    >
        {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : '🤖'}
        <span className="ml-2">{text}</span>
    </button>
);

interface TestResult {
    passed: boolean;
    input: string;
    output: string;
    expected: string;
}

const InteractiveExercise: React.FC<{ exercise: Exercise, language: Language }> = ({ exercise, language }) => {
    const [userCode, setUserCode] = useState(exercise.starterCode);
    const [results, setResults] = useState<TestResult[] | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [review, setReview] = useState('');
    const [isReviewLoading, setIsReviewLoading] = useState(false);

    const handleRunCode = () => {
        const testResults = runCode(userCode, exercise, language.slug);
        setResults(testResults);
    };

    const handleShowSolution = () => {
        setShowSolution(true);
        setUserCode(exercise.solution);
    };

    const handleGetReview = async () => {
        setIsReviewLoading(true);
        setReview('');
        const result = await reviewCode(userCode, language.name, exercise.description);
        setReview(result);
        setIsReviewLoading(false);
    }

    const allPassed = results?.every(r => r.passed);

    return (
        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400">Interactive Exercise</h3>
            <p className="text-slate-300">{exercise.description}</p>
            <div>
                <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={10}
                    className="w-full bg-black/30 border border-white/10 rounded-md p-2 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    aria-label="Code editor for exercise"
                />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
                <button
                    onClick={handleRunCode}
                    className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <PlayIcon className="w-5 h-5" />
                    Run Code
                </button>
                <button
                    onClick={handleShowSolution}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg transition-colors"
                >
                    Show Solution
                </button>
                 {allPassed && (
                    <AIFeatureButton onClick={handleGetReview} text="Get AI Code Review" isLoading={isReviewLoading} />
                )}
            </div>
            {results && (
                <div>
                    <h4 className="font-semibold mb-2">Results:</h4>
                    {allPassed && <p className="text-green-400 font-bold mb-2 flex items-center gap-2"><CheckCircleIcon className="w-6 h-6"/>All tests passed! Great job!</p>}
                    <ul className="space-y-2">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-md text-sm ${result.passed ? 'bg-green-900/50' : 'bg-red-900/50'}`}
                            >
                                <span className="font-bold">{result.passed ? '✅ Pass:' : '❌ Fail:'}</span> Test case #{index + 1}
                                {!result.passed && (
                                    <pre className="mt-1 p-2 bg-black/30 rounded text-xs"><code>Expected: {result.expected}\nGot: {result.output}</code></pre>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
             {(isReviewLoading || review) && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">AI Code Review</h4>
                    {isReviewLoading && <p>🤖 Analyzing your code...</p>}
                    {review && (
                        <div
                            className="prose prose-invert max-w-none prose-h4:text-cyan-400 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-code:text-white"
                            dangerouslySetInnerHTML={{ __html: review }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};


const TopicPage: React.FC<TopicPageProps> = ({ topic, language, onBack, user }) => {
    const [aiResponse, setAiResponse] = useState<string>('');
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [aiTutorAction, setAiTutorAction] = useState<'simplifying' | 'quizzing' | null>(null);
    const [error, setError] = useState<string>('');

    const [explanation, setExplanation] = useState<string>('');
    const [isExplanationLoading, setIsExplanationLoading] = useState<boolean>(false);
    const [explanationError, setExplanationError] = useState<string>('');

    useEffect(() => {
        markTopicAsComplete(user.username, language.slug, topic.slug);
    }, [user.username, language.slug, topic.slug]);
    
    const handleExplainCode = useCallback(async () => {
        setIsExplanationLoading(true);
        setExplanationError('');
        setExplanation('');
        try {
            const result = await explainCode(topic.codeExample, language.name);
            setExplanation(result);
        } catch (e) {
            setExplanationError('An error occurred. Please try again.');
        } finally {
            setIsExplanationLoading(false);
        }
    }, [topic.codeExample, language.name]);

    const handleSimplifyTopic = async () => {
        setAiTutorAction('simplifying');
        setError('');
        setAiResponse('');
        setQuiz(null);
        try {
            const result = await simplifyTopic(topic.longDescription);
            setAiResponse(result);
        } catch (e) {
            setError('An error occurred while simplifying. Please try again.');
        } finally {
            setAiTutorAction(null);
        }
    };
    
    const handleGenerateQuiz = async () => {
        setAiTutorAction('quizzing');
        setError('');
        setAiResponse('');
        setQuiz(null);
        try {
            const result = await generateQuiz(topic.title, topic.longDescription + "\n" + topic.codeExample);
            setQuiz(result);
        } catch (e) {
            setError('An error occurred while generating the quiz. Please try again.');
        } finally {
            setAiTutorAction(null);
        }
    };


    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to {language.name}
            </button>
            <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
            <p className="text-slate-400 mb-6 max-w-4xl">{topic.longDescription}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Code Example</h2>
                        <CodeBlock code={topic.codeExample} language={language.slug.toLowerCase()} />
                        <div className="mt-4">
                            <button
                                onClick={handleExplainCode}
                                disabled={isExplanationLoading}
                                className="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isExplanationLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : '💡'}
                                <span className="ml-2">Explain this Code</span>
                            </button>
                        </div>
                    </div>
                    
                    {isExplanationLoading && <p className="p-6 bg-black/20 rounded-lg border border-white/10">🤖 Thinking...</p>}
                    {explanationError && <p className="text-red-400 p-6 bg-red-900/20 rounded-lg border border-red-500/30">{explanationError}</p>}
                    {explanation && (
                        <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Code Explanation</h3>
                            <div className="prose prose-invert max-w-none prose-h4:text-cyan-400" dangerouslySetInnerHTML={{__html: explanation}} />
                        </div>
                    )}
                     
                    {topic.exercises && topic.exercises.map(exercise => (
                       <InteractiveExercise key={exercise.id} exercise={exercise} language={language} />
                    ))}

                     <div className="pt-8 border-t border-white/10">
                        <h3 className="text-xl font-semibold mb-3 text-cyan-400">External Resources</h3>
                        <ul className="space-y-2">
                        {topic.externalLinks.map(link => (
                            <li key={link.url}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 flex items-center transition-colors">
                                    {link.name} <ExternalLinkIcon className="w-4 h-4 ml-2" />
                                </a>
                            </li>
                        ))}
                        </ul>
                    </div>

                </div>

                <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/10 h-full">
                    <div className="sticky top-24">
                        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">AI Tutor</h2>
                        <p className="text-slate-400 mb-4">Use the AI Tutor for more help with this topic.</p>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <AIFeatureButton onClick={handleSimplifyTopic} text="Simplify Topic" isLoading={aiTutorAction === 'simplifying'} />
                            <AIFeatureButton onClick={handleGenerateQuiz} text="Generate Quiz" isLoading={aiTutorAction === 'quizzing'} />
                        </div>
                        
                        <div className="min-h-[200px]">
                            {aiTutorAction && <p>🤖 Thinking...</p>}
                            {error && <p className="text-red-400">{error}</p>}
                            {aiResponse && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{__html: aiResponse}} />}
                            {quiz && <Quiz quizData={quiz} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicPage;