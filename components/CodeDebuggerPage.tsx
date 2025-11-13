import React, { useState } from 'react';
import { debugCode } from '../services/geminiService';
import CodeEditor from './CodeEditor';
import { SparklesIcon } from './icons';
import { techStack } from '../constants';

const CodeDebuggerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Please enter some code to debug.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const response = await debugCode(code, language);
            setResult(response);
        } catch (err) {
            setError((err as Error).message);
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
                <h1 className="text-4xl font-bold">AI Code Debugger</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Stuck on a bug? Paste your code below, select the language, and let our AI find the problem and suggest a fix.
                </p>
            </div>
            
            <div className="max-w-4xl mx-auto mt-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                             <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Language
                            </label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                            >
                                {techStack.languages.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                                 <option value="html">HTML</option>
                                 <option value="css">CSS</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Code
                        </label>
                        <div className="w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                             <CodeEditor
                                value={code}
                                onChange={setCode}
                                language={language}
                                height="300px"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isLoading ? (
                            'Debugging...'
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                Debug Code
                            </>
                        )}
                    </button>
                </form>

                {result && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold">Analysis Result</h2>
                        <div 
                            className="mt-4 bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900/70"
                            dangerouslySetInnerHTML={{ __html: result }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeDebuggerPage;