import React, { useState, useMemo, useEffect } from 'react';
import { generateUnitTests } from '../services/geminiService';
import { techStack, testingFrameworks } from '../constants';
import CodeEditor from './CodeEditor';
import CodeBlock from './CodeBlock';
import { SparklesIcon } from './icons';

const UnitTestGeneratorPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [sourceCode, setSourceCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [framework, setFramework] = useState('jest');
    const [generatedTests, setGeneratedTests] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const availableFrameworks = useMemo(() => {
        return testingFrameworks[language] || [];
    }, [language]);

    // Effect to update the selected framework when the language changes
    useEffect(() => {
        const currentFrameworks = testingFrameworks[language] || [];
        if (currentFrameworks.length > 0 && !currentFrameworks.some(f => f.id === framework)) {
            setFramework(currentFrameworks[0].id);
        } else if (currentFrameworks.length === 0) {
            setFramework('');
        }
    }, [language, framework]);

    const allLangs = [
        ...techStack.languages,
        {id: 'javascript', name: 'JavaScript'},
        {id: 'typescript', name: 'TypeScript'},
    ];

    const handleGenerate = async () => {
        if (!sourceCode.trim()) {
            setError('Please enter some code to generate tests for.');
            return;
        }
        if (!framework) {
            setError('Please select a testing framework.');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedTests('');

        try {
            const result = await generateUnitTests(sourceCode, language, framework);
            setGeneratedTests(result);
        } catch (err) {
            setError('An error occurred while generating tests. Please try again.');
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
                <h1 className="text-4xl font-bold">AI Unit Test Generator</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Paste your function, class, or module, select your language and testing framework, and let our AI write the tests for you.
                </p>
            </div>

            <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Left Panel: Input --- */}
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                            <select id="language" value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white">
                                {allLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Testing Framework</label>
                            <select id="framework" value={framework} onChange={e => setFramework(e.target.value)} disabled={availableFrameworks.length === 0} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white disabled:opacity-50">
                                {availableFrameworks.length > 0 ? (
                                    availableFrameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)
                                ) : (
                                    <option>No frameworks available</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex-grow flex flex-col">
                        <label htmlFor="sourceCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Code</label>
                        <div className="flex-grow w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                            <CodeEditor value={sourceCode} onChange={setSourceCode} language={language} height="100%" />
                        </div>
                    </div>
                     {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
                    <button onClick={handleGenerate} disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                        {isLoading ? 'Generating...' : <><SparklesIcon className="w-5 h-5" /> Generate Tests</>}
                    </button>
                </div>

                {/* --- Right Panel: Output --- */}
                <div className="bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 flex-shrink-0">Generated Unit Tests</h2>
                    <div className="flex-grow">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                <SparklesIcon className="w-8 h-8 animate-pulse" />
                                <span className="ml-2">Writing tests...</span>
                            </div>
                        ) : generatedTests ? (
                            <CodeBlock code={generatedTests} language={language} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center p-4">
                                <p>Your generated tests will appear here. The AI will attempt to cover edge cases and mock dependencies.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitTestGeneratorPage;
