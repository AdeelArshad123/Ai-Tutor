import React, { useState } from 'react';
import { getPracticeFeedback } from '../services/geminiService';
import CodeEditor from './CodeEditor';
import { SparklesIcon } from './icons';
import { techStack } from '../constants';

const CodePlaygroundPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [aiFeedback, setAiFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const allLangs = [
        ...techStack.languages,
        {id: 'html', name: 'HTML'},
        {id: 'css', name: 'CSS'},
        {id: 'typescript', name: 'TypeScript'},
    ];

    const runJsCode = (jsCode: string): { output: string[], error: string | null } => {
        const logs: string[] = [];
        let executionError: string | null = null;
        
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            logs.push(args.map(arg => {
                try {
                    return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                } catch {
                    return 'Unserializable object';
                }
            }).join(' '));
        };
        console.error = (...args) => {
            const errorMsg = args.map(arg => String(arg)).join(' ');
            logs.push(`ERROR: ${errorMsg}`);
            if (!executionError) executionError = errorMsg; // Capture the first error
        };

        try {
            new Function(jsCode)();
        } catch (e: any) {
            executionError = e.message;
        } finally {
            console.log = originalLog;
            console.error = originalError;
        }

        return { output: logs, error: executionError };
    };

    const handleRunAndAnalyze = async () => {
        setIsLoading(true);
        setOutput([]);
        setError(null);
        setAiFeedback('');

        let executionError = '';

        if (language === 'javascript') {
            const result = runJsCode(code);
            setOutput(result.output);
            setError(result.error);
            executionError = result.error || '';
        }

        try {
            const feedback = await getPracticeFeedback(code, language, executionError);
            setAiFeedback(feedback);
        } catch (err) {
            setAiFeedback('<p class="text-red-500">Could not get AI feedback. Please try again.</p>');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors self-start">
                &larr; Back to Home
            </button>
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold">Code Playground</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Practice your coding skills. Run your code to see the output and get instant AI-powered feedback.
                </p>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Panel: Editor */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                         <div className="flex-1">
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
                        <button
                            onClick={handleRunAndAnalyze}
                            disabled={isLoading}
                            className="self-end flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isLoading ? (
                                'Analyzing...'
                            ) : (
                                <><SparklesIcon className="w-5 h-5" /> Run & Analyze</>
                            )}
                        </button>
                    </div>
                    <div className="flex-grow w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={language}
                            height="100%"
                        />
                    </div>
                </div>

                {/* Right Panel: Output & Feedback */}
                <div className="flex flex-col gap-6">
                    {/* Output */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/70 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold mb-2 flex-shrink-0">Output</h2>
                        <div className="flex-grow bg-gray-100 dark:bg-black/30 rounded-md p-2 overflow-y-auto font-mono text-sm">
                            {output.length > 0 ? (
                                output.map((line, index) => (
                                    <p key={index} className={line.startsWith('ERROR:') ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-300'}>
                                        {line}
                                    </p>
                                ))
                            ) : (
                                <p className="text-gray-500">Code output will appear here.</p>
                            )}
                             {error && <p className="text-red-500 dark:text-red-400 mt-2"><strong>Error:</strong> {error}</p>}
                        </div>
                    </div>
                    {/* AI Feedback */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/70 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold mb-2 flex-shrink-0">AI Feedback</h2>
                        <div className="flex-grow overflow-y-auto">
                            {isLoading && !aiFeedback && <p className="text-gray-500">Generating feedback...</p>}
                            {aiFeedback ? (
                                 <div 
                                    className="prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900/70"
                                    dangerouslySetInnerHTML={{ __html: aiFeedback }} 
                                />
                            ) : !isLoading && (
                                <p className="text-gray-500">Analysis and suggestions will appear here.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePlaygroundPage;