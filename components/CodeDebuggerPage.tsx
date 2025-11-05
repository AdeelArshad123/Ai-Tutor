import React, { useState } from 'react';
import { debugCode } from '../services/geminiService';
import { learningData } from '../constants';
import { CodeBlock } from './CodeBlock';

const availableLanguages = learningData.flatMap(category => category.languages.map(lang => ({
    slug: lang.slug,
    name: lang.name,
})));

const CodeDebuggerPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(availableLanguages[0].name);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!code.trim()) {
            setError('Please enter some code to debug.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResponse('');
        try {
            const result = await debugCode(code, language);
            setResponse(result);
        } catch (e) {
            setError('An error occurred while debugging. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">AI Code Debugger</h1>
                <p className="text-slate-400 mt-2">Stuck on a bug? Paste your code below and let our AI find the issue.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label htmlFor="language-select" className="block text-sm font-medium text-slate-300">Language</label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                             className="mt-1 block w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
                        >
                            {availableLanguages.map(lang => (
                                <option key={lang.slug} value={lang.name}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label htmlFor="code-input" className="block text-sm font-medium text-slate-300 mb-1">Your Code</label>
                <textarea
                    id="code-input"
                    rows={10}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Paste your ${language} code here...`}
                    className="w-full bg-black/20 border border-white/10 rounded-md py-2 px-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm font-mono"
                />
                
                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Debugging...
                            </>
                        ) : 'Debug Code'}
                    </button>
                </div>
            </div>

            {(isLoading || error || response) && (
                <div className="max-w-4xl mx-auto mt-8 bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                    <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Debugger Response</h2>
                    {isLoading && <p>🤖 Analyzing your code...</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    {response && (
                         <div
                            className="prose prose-invert max-w-none prose-h4:text-cyan-400 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 prose-code:text-white"
                            dangerouslySetInnerHTML={{ __html: response }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeDebuggerPage;