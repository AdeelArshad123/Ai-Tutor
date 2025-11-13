import React, { useState } from 'react';
import { improveCode } from '../services/geminiService';
import CodeEditor from './CodeEditor';
import CodeBlock from './CodeBlock';
import { SparklesIcon } from './icons';
import { techStack } from '../constants';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

interface ImprovementResult {
    improvedCode: string;
    explanation: string;
}

const CodeImproverPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [result, setResult] = useState<ImprovementResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Please enter some code to improve.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await improveCode(code, language);
            setResult(response);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const allLangs = [
        {id: 'javascript', name: 'JavaScript'},
        {id: 'typescript', name: 'TypeScript'},
        ...techStack.languages,
        {id: 'html', name: 'HTML'},
        {id: 'css', name: 'CSS'},
    ];

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">AI Code Improver</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Write or paste your code, and our AI will refactor it for improved readability, performance, and adherence to best practices.
                </p>
            </div>

            <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col min-h-[600px]">
                    <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Language
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                            >
                                {allLangs.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mt-4 flex-grow flex flex-col">
                            <label htmlFor="code-improver-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Your Code
                            </label>
                             <div className="flex-grow w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                                <CodeEditor
                                    value={code}
                                    onChange={setCode}
                                    language={language}
                                    height="100%"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 dark:text-red-400 mt-4 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isLoading ? (
                                'Improving...'
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    Improve Code
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Output Panel */}
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col min-h-[600px]">
                    {isLoading && (
                         <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
                             <SparklesIcon className="w-12 h-12 animate-pulse" />
                             <span className="ml-4">AI is refactoring your code...</span>
                         </div>
                    )}
                    {!isLoading && !result && (
                        <div className="flex-grow flex items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                            <p>The improved code and explanation will appear here.</p>
                        </div>
                    )}
                    {result && (
                        <div className="flex flex-col gap-6 h-full overflow-y-auto">
                            <div>
                                <h2 className="text-xl font-bold">Improved Code</h2>
                                <CodeBlock code={result.improvedCode} language={language} />
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-xl font-bold">Explanation</h2>
                                <div
                                    className="mt-2 prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-strong:text-gray-800 dark:prose-strong:text-gray-200"
                                    dangerouslySetInnerHTML={{ __html: md.render(result.explanation) }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeImproverPage;