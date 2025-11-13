import React, { useState } from 'react';
import { translateCode } from '../services/geminiService';
import { techStack } from '../constants';
import CodeBlock from './CodeBlock';
import { TranslateIcon, SwitchIcon } from './icons';
import CodeEditor from './CodeEditor';

const CodeTranslatorPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [sourceCode, setSourceCode] = useState('');
    const [sourceLang, setSourceLang] = useState('javascript');
    const [targetLang, setTargetLang] = useState('python');
    const [translatedCode, setTranslatedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const allLangs = [
        ...techStack.languages,
        {id: 'html', name: 'HTML'},
        {id: 'css', name: 'CSS'},
        {id: 'typescript', name: 'TypeScript'},
    ];

    const handleTranslate = async () => {
        if (!sourceCode.trim()) {
            setError('Please enter some code to translate.');
            return;
        }
        setIsLoading(true);
        setError('');
        setTranslatedCode('');
        try {
            const result = await translateCode(sourceCode, sourceLang, targetLang);
            setTranslatedCode(result);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSwitchLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceCode(translatedCode);
        setTranslatedCode(sourceCode);
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 dark:bg-gray-800 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                &larr; Back to Home
            </button>
            <div className="text-center">
                <h1 className="text-4xl font-bold">AI Code Translator</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Translate code snippets from one language to another with high accuracy.
                </p>
            </div>

            <div className="mt-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-4 md:gap-8 mb-4">
                    <div className="flex-1">
                        <label htmlFor="sourceLang" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                         <select id="sourceLang" value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white">
                             {allLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                         </select>
                    </div>
                     <button onClick={handleSwitchLanguages} className="mt-6 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"><SwitchIcon className="w-5 h-5" /></button>
                     <div className="flex-1">
                        <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                         <select id="targetLang" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white">
                             {allLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                         </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-white">
                         <CodeEditor
                            value={sourceCode}
                            onChange={setSourceCode}
                            language={sourceLang}
                            height="350px"
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-md">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                <TranslateIcon className="w-8 h-8 animate-pulse" />
                                <span className="ml-2">Translating...</span>
                            </div>
                        ) : translatedCode ? (
                            <CodeBlock code={translatedCode} language={targetLang} />
                        ) : (
                             <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-500">
                                <p>Translated code will appear here.</p>
                             </div>
                        )}
                    </div>
                </div>
                 {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm text-center">{error}</p>}
                <button onClick={handleTranslate} disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-2.5 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                    <TranslateIcon className="w-5 h-5" /> Translate
                </button>
            </div>
        </div>
    );
};

export default CodeTranslatorPage;