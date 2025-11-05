import React, { useState, useEffect, useRef } from 'react';
import { GenerationConfig, GenerationResult, FrameworkOption, AiChatMessage } from '../types';
import { generateApiStream, refineCodeStream } from '../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { SendIcon } from './icons';
import { techStack } from '../constants';

type ActiveTab = 'code' | 'explanation' | 'docs' | 'deployment';

const ApiGeneratorPage: React.FC = () => {
    const [config, setConfig] = useState<GenerationConfig>({
        language: 'nodejs',
        framework: 'express',
        database: 'mongodb',
        prompt: 'A simple blog API with posts and comments. Include user authentication.',
    });
    const [result, setResult] = useState<GenerationResult>({ code: [], explanation: '', docs: '', deployment: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<ActiveTab>('code');
    const [currentFrameworks, setCurrentFrameworks] = useState<FrameworkOption[]>(techStack.frameworks.filter(f => f.language === 'nodejs'));
    const [aiChatMessages, setAiChatMessages] = useState<AiChatMessage[]>([]);
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const frameworks = techStack.frameworks.filter(f => f.language === config.language);
        setCurrentFrameworks(frameworks);
        if (frameworks.length > 0 && !frameworks.some(f => f.id === config.framework)) {
            setConfig(prev => ({ ...prev, framework: frameworks[0].id }));
        }
    }, [config.language]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [aiChatMessages]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setResult({ code: [], explanation: '', docs: '', deployment: '' });
        setActiveTab('code');
        setAiChatMessages([]);

        try {
            const stream = await generateApiStream(config);
            let partialResult: GenerationResult = { code: [], explanation: '', docs: '', deployment: '' };
            let currentFile = '';
            let currentContent = '';
            let currentSection = '';

            for await (const chunk of stream) {
                const text = chunk.text;

                if (text.includes('[START_CODE:')) {
                    if (currentFile) { // Finish previous file
                        partialResult.code.push({ filePath: currentFile, code: currentContent.trim() });
                    }
                    currentSection = 'code';
                    currentFile = text.substring(text.indexOf('[START_CODE:') + 12, text.indexOf(']'));
                    currentContent = text.substring(text.indexOf(']') + 1);
                } else if (text.includes('[END_CODE]')) {
                    currentContent += text.replace('[END_CODE]', '');
                    partialResult.code.push({ filePath: currentFile, code: currentContent.trim() });
                    currentFile = '';
                    currentContent = '';
                    currentSection = '';
                } else if (text.includes('[START_EXPLANATION]')) {
                    currentSection = 'explanation';
                    currentContent = text.replace('[START_EXPLANATION]', '');
                } else if (text.includes('[END_EXPLANATION]')) {
                    currentSection = '';
                    partialResult.explanation += currentContent + text.replace('[END_EXPLANATION]', '');
                    currentContent = '';
                } else if (text.includes('[START_DOCS]')) {
                    currentSection = 'docs';
                    currentContent = text.replace('[START_DOCS]', '');
                } else if (text.includes('[END_DOCS]')) {
                    currentSection = '';
                    partialResult.docs += currentContent + text.replace('[END_DOCS]', '');
                    currentContent = '';
                } else if (text.includes('[START_DEPLOYMENT]')) {
                    currentSection = 'deployment';
                    currentContent = text.replace('[START_DEPLOYMENT]', '');
                } else if (text.includes('[END_DEPLOYMENT]')) {
                    currentSection = '';
                    partialResult.deployment += currentContent + text.replace('[END_DEPLOYMENT]', '');
                    currentContent = '';
                } else {
                    if (currentSection === 'code') currentContent += text;
                    if (currentSection === 'explanation') partialResult.explanation += text;
                    if (currentSection === 'docs') partialResult.docs += text;
                    if (currentSection === 'deployment') partialResult.deployment += text;
                }
                
                setResult({ ...partialResult, code: [...partialResult.code] });
            }
        } catch (e: any) {
            console.error(e);
            setError('An error occurred during generation. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRefine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refinementPrompt.trim() || isRefining) return;
        
        const userMessage: AiChatMessage = { role: 'user', content: refinementPrompt };
        setAiChatMessages(prev => [...prev, userMessage]);
        setIsRefining(true);
        setRefinementPrompt('');

        const assistantMessage: AiChatMessage = { role: 'assistant', content: '' };
        setAiChatMessages(prev => [...prev, assistantMessage]);
        
        try {
            const initialCode = result.code.map(c => `// File: ${c.filePath}\n${c.code}`).join('\n\n');
            const history = [
                { role: 'user', parts: `Here is the initial API I generated:\n${initialCode}` },
                ...aiChatMessages.slice(0, -1).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: m.content })),
            ];

            const stream = await refineCodeStream(history, userMessage.content);
            
            let finalContent = '';
            for await (const chunk of stream) {
                finalContent += chunk.text;
                setAiChatMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = finalContent;
                    return newMessages;
                });
            }

        } catch (e) {
            setAiChatMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = "Sorry, I encountered an error trying to refine the code.";
                return newMessages;
            });
        } finally {
            setIsRefining(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'code':
                return result.code.length > 0 ? (
                    result.code.map(file => <CodeBlock key={file.filePath} filePath={file.filePath} code={file.code} />)
                ) : <div className="flex items-center justify-center h-full text-slate-400">Generated code will appear here.</div>;
            case 'explanation':
                return result.explanation ? <div className="prose prose-invert max-w-none p-4 prose-h4:text-cyan-400" dangerouslySetInnerHTML={{ __html: result.explanation }} /> : <div className="flex items-center justify-center h-full text-slate-400">The AI-generated explanation will appear here.</div>;
            case 'docs':
                return result.docs ? <div className="prose prose-invert max-w-none p-4" dangerouslySetInnerHTML={{ __html: result.docs }} /> : <div className="flex items-center justify-center h-full text-slate-400">API documentation will appear here.</div>;
            case 'deployment':
                return result.deployment ? <div className="prose prose-invert max-w-none p-4" dangerouslySetInnerHTML={{ __html: result.deployment }} /> : <div className="flex items-center justify-center h-full text-slate-400">Deployment suggestions will appear here.</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-2 overflow-hidden h-[calc(100vh_-_150px)]">
            {/* Left Panel: Configuration */}
            <div className="lg:col-span-3 bg-black/20 border border-white/10 rounded-lg p-4 flex flex-col overflow-y-auto">
                <h2 className="text-lg font-semibold text-cyan-400 mb-4">Configuration</h2>
                <div className="space-y-4 flex-grow">
                    <div>
                        <label className="block text-sm font-medium mb-1">Describe your API</label>
                        <textarea
                            rows={6}
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={config.prompt}
                            onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <select
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={config.language}
                            onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
                        >
                            {techStack.languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Framework</label>
                         <select
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={config.framework}
                            onChange={(e) => setConfig({ ...config, framework: e.target.value })}
                        >
                            {currentFrameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Database</label>
                        <select
                            className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            value={config.database}
                            onChange={(e) => setConfig({ ...config, database: e.target.value })}
                        >
                            {techStack.databases.map(db => <option key={db.id} value={db.id}>{db.name}</option>)}
                        </select>
                    </div>
                </div>
                 <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? 'Generating...' : 'Generate API'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* Center Panel: Results */}
            <div className="lg:col-span-6 bg-black/20 border border-white/10 rounded-lg flex flex-col overflow-hidden">
                <div className="flex-shrink-0 border-b border-white/10">
                    <nav className="flex space-x-1 p-1">
                        {(['code', 'explanation', 'docs', 'deployment'] as ActiveTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {isLoading && activeTab === 'code' ? <div className="flex items-center justify-center h-full text-slate-400">🤖 Generating your API...</div> : renderTabContent()}
                </div>
            </div>

            {/* Right Panel: AI Assistant */}
            <div className="lg:col-span-3 bg-black/20 border border-white/10 rounded-lg flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold text-cyan-400 p-4 border-b border-white/10 flex-shrink-0">AI Assistant</h2>
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                    {aiChatMessages.length === 0 && <p className="text-slate-400 text-sm text-center">Refine your API with follow-up prompts after generating.</p>}
                    {aiChatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-sm rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                 <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.content }} />
                            </div>
                        </div>
                    ))}
                    {isRefining && aiChatMessages[aiChatMessages.length-1]?.role === 'assistant' && <div className="flex justify-start"><div className="bg-slate-700 text-slate-200 rounded-lg px-3 py-2">...</div></div>}
                </div>
                <div className="flex-shrink-0 p-2 border-t border-white/10">
                    <form onSubmit={handleRefine} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={refinementPrompt}
                            onChange={(e) => setRefinementPrompt(e.target.value)}
                            placeholder="e.g., 'Add JWT authentication'"
                            disabled={result.code.length === 0 || isRefining}
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50"
                        />
                        <button type="submit" disabled={result.code.length === 0 || isRefining || !refinementPrompt.trim()} className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-500 disabled:opacity-50">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApiGeneratorPage;
