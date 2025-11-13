import React, { useState, useMemo, useEffect } from 'react';
import { techStack, testingFrameworks } from '../constants';
import { GeneratedCode, GenerationConfig, OpenApiSpec } from '../types';
import { generateApiStream } from '../services/geminiService';
import CodeBlock from './CodeBlock';
import { SparklesIcon, FileCodeIcon, DownloadIcon, GlobeAltIcon } from './icons';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import ApiPreview from './ApiPreview';

// A simple loader component
const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <SparklesIcon className="w-16 h-16 text-blue-500 animate-pulse" />
        <p className="mt-6 text-xl font-semibold">{message}</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please wait, this can take a moment.</p>
    </div>
);


const ApiGeneratorPage: React.FC = () => {
    const [config, setConfig] = useState<Omit<GenerationConfig, 'prompt'>>({
        language: 'nodejs',
        framework: 'express',
        database: 'mongodb',
        generateTests: true,
        testingFramework: 'jest',
        generateDocs: true,
        addValidation: true,
    });
    const [prompt, setPrompt] = useState('');
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'complete' | 'error'>('idle');
    const [error, setError] = useState('');
    
    const [generatedFiles, setGeneratedFiles] = useState<GeneratedCode[]>([]);
    const [selectedFile, setSelectedFile] = useState<GeneratedCode | null>(null);
    const [activeView, setActiveView] = useState<'files' | 'preview'>('files');
    const [openApiSpec, setOpenApiSpec] = useState<OpenApiSpec | null>(null);


    const isLoading = generationStatus === 'generating';

    // Filter frameworks based on selected language
    const filteredFrameworks = useMemo(() => {
        return techStack.frameworks.filter(f => f.language === config.language);
    }, [config.language]);

    const availableTestingFrameworks = useMemo(() => {
        return testingFrameworks[config.language] || [];
    }, [config.language]);
    
    // Auto-select first framework and testing framework when language changes
    useEffect(() => {
        const newFramework = filteredFrameworks.find(f => f.id === config.framework) ? config.framework : (filteredFrameworks[0]?.id || '');
        const newTestingFrameworks = testingFrameworks[config.language] || [];
        const newTestingFramework = newTestingFrameworks.length > 0 ? newTestingFrameworks[0].id : '';
        
        setConfig(c => ({
            ...c,
            framework: newFramework,
            testingFramework: newTestingFramework
        }));

    }, [config.language]);
    
    const resetResults = () => {
        setGeneratedFiles([]);
        setSelectedFile(null);
        setOpenApiSpec(null);
        setActiveView('files');
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt describing your API.');
            return;
        }
        
        setGenerationStatus('generating');
        setError('');
        resetResults();
        
        const fullConfig: GenerationConfig = { ...config, prompt };

        try {
            const stream = await generateApiStream(fullConfig);
            
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
            }
            
            const files: GeneratedCode[] = [];
            // A more flexible regex to handle variations in model output for file path and code blocks.
            const fileRegex = /\[\s*START_CODE\s*:\s*(.*?)\]([\s\S]*?)\[\s*END_CODE\s*]/g;
            let match;

            while ((match = fileRegex.exec(fullResponse)) !== null) {
                if (match[1] && match[2]) {
                    // Clean up file path: remove potential braces, quotes, etc.
                    const filePath = match[1].trim().replace(/[{}"']/g, '');
                    
                    // Clean up code: remove potential markdown fences if they exist
                    let code = match[2].trim();
                    const codeFenceRegex = /^```(?:\w+)?\n([\s\S]*)\n```$/;
                    const codeMatch = code.match(codeFenceRegex);
                    if (codeMatch && codeMatch[1]) {
                        code = codeMatch[1];
                    }

                    files.push({
                        filePath: filePath,
                        code: code.trim(),
                    });
                }
            }

            if (files.length === 0) {
                throw new Error("The AI did not return any code files. Please try refining your prompt or check the model's response.");
            }
            
            setGeneratedFiles(files);
            setSelectedFile(files[0]);

            const openApiFile = files.find(f => f.filePath === 'openapi.json');
            if (openApiFile) {
                try {
                    const spec = JSON.parse(openApiFile.code);
                    setOpenApiSpec(spec);
                    setActiveView('preview'); 
                } catch (e) {
                    console.error("Failed to parse openapi.json", e);
                    setOpenApiSpec(null);
                    setActiveView('files');
                }
            } else {
                setOpenApiSpec(null);
                setActiveView('files');
            }
            
            setGenerationStatus('complete');

        } catch (e: any) {
            console.error(e);
            setError(`An error occurred: ${e.message}`);
            setGenerationStatus('error');
        }
    };
    
    const handleDownloadZip = () => {
        const zip = new JSZip();
        generatedFiles.forEach(file => {
            zip.file(file.filePath, file.code);
        });
        
        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, 'api-forge-export.zip');
        });
    };

    const renderResults = () => {
        if (isLoading) {
            return <Loader message="Generating your API..." />;
        }
        
        if (generationStatus === 'error') {
            return <div className="p-8 text-center text-red-500 dark:text-red-400">{error}</div>
        }
        
        if (generationStatus !== 'complete' || generatedFiles.length === 0) {
             return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-600 dark:text-gray-400">
                    <FileCodeIcon className="w-16 h-16" />
                    <p className="mt-4 text-xl font-semibold">Your generated API will appear here</p>
                    <p className="mt-2">Describe your API, choose your stack, and click "Generate API".</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full">
                <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between pl-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveView('files')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold border-b-2 ${activeView === 'files' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'}`}>
                            <FileCodeIcon className="w-4 h-4" /> Files
                        </button>
                        {openApiSpec && (
                             <button onClick={() => setActiveView('preview')} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold border-b-2 ${activeView === 'preview' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'}`}>
                                <GlobeAltIcon className="w-4 h-4" /> API Preview
                            </button>
                        )}
                    </div>
                    {generatedFiles.length > 0 && (
                        <button onClick={handleDownloadZip} className="flex items-center gap-2 text-sm py-1 px-3 m-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Download ZIP">
                            <DownloadIcon className="w-4 h-4" />
                            Download .zip
                        </button>
                    )}
                </div>
                <div className="flex-grow flex overflow-hidden">
                    {activeView === 'files' ? (
                        <>
                            <div className="w-1/3 min-w-[200px] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                                {generatedFiles.map(file => (
                                    <button 
                                        key={file.filePath}
                                        onClick={() => setSelectedFile(file)}
                                        className={`w-full text-left px-4 py-2 text-sm truncate ${selectedFile?.filePath === file.filePath ? 'bg-blue-100 dark:bg-gray-800 font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                                    >
                                        {file.filePath}
                                    </button>
                                ))}
                            </div>
                            <div className="w-2/3 flex-grow overflow-y-auto">
                                {selectedFile && <CodeBlock code={selectedFile.code} language={selectedFile.filePath.endsWith('.json') ? 'json' : config.language} />}
                            </div>
                        </>
                    ) : openApiSpec ? (
                        <div className="w-full overflow-y-auto">
                            <ApiPreview spec={openApiSpec} />
                        </div>
                    ) : null }
                </div>
            </div>
        )
    };
    
    return (
        <div className="h-full flex flex-col">
            <div className="text-center pt-0 pb-8">
                <h1 className="text-4xl font-bold">API Forge</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Generate a backend API from a simple text prompt.
                </p>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className={`lg:col-span-1 bg-white dark:bg-gray-900/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col`}>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-lg font-semibold mb-2">1. Describe Your API</label>
                            <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={5}
                                placeholder="e.g., A blog API with Users (name, email) and Posts (title, content)."
                                className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                            />
                        </div>
                        
                        <div>
                             <label className="block text-lg font-semibold mb-2">2. Choose Your Stack</label>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Language</label>
                                    <select value={config.language} onChange={e => setConfig(c => ({...c, language: e.target.value}))} className="mt-1 w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none">
                                        {techStack.languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium">Framework</label>
                                    <select value={config.framework} onChange={e => setConfig(c => ({...c, framework: e.target.value}))} className="mt-1 w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none">
                                        {filteredFrameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium">Database</label>
                                    <select value={config.database} onChange={e => setConfig(c => ({...c, database: e.target.value}))} className="mt-1 w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none">
                                        {techStack.databases.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                             </div>
                        </div>

                         <div>
                             <label className="block text-lg font-semibold mb-2">3. Additional Options</label>
                             <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-black/30">
                                    <label htmlFor="add-validation" className="text-sm font-medium">Add Input Validation Middleware</label>
                                    <input type="checkbox" id="add-validation" checked={config.addValidation} onChange={e => setConfig(c => ({ ...c, addValidation: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-black/30">
                                    <label htmlFor="generate-docs" className="text-sm font-medium">Generate OpenAPI/Swagger Docs</label>
                                    <input type="checkbox" id="generate-docs" checked={config.generateDocs} onChange={e => setConfig(c => ({ ...c, generateDocs: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                                <div className="p-3 rounded-md bg-gray-100 dark:bg-black/30">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="generate-tests" className="text-sm font-medium">Generate Unit Tests</label>
                                        <input type="checkbox" id="generate-tests" checked={config.generateTests} onChange={e => setConfig(c => ({ ...c, generateTests: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </div>
                                    {config.generateTests && (
                                        <div className="mt-3">
                                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Testing Framework</label>
                                            <select value={config.testingFramework} onChange={e => setConfig(c => ({...c, testingFramework: e.target.value}))} disabled={availableTestingFrameworks.length === 0} className="mt-1 w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none disabled:opacity-50">
                                                {availableTestingFrameworks.length > 0 ? (
                                                    availableTestingFrameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)
                                                ) : (
                                                    <option>No frameworks available</option>
                                                )}
                                            </select>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex-shrink-0">{error}</p>}
                    <button onClick={handleGenerate} disabled={isLoading}
                        className="w-full mt-4 flex-shrink-0 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                       <SparklesIcon className="w-5 h-5"/> Generate API
                    </button>
                </div>
                
                <div className="lg:col-span-2 bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
                   {renderResults()}
                </div>
            </div>
        </div>
    );
};

export default ApiGeneratorPage;