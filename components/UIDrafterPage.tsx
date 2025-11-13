import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateUiFromImage } from '../services/geminiService';
import CodeBlock from './CodeBlock';
import { SparklesIcon, PhotoIcon } from './icons';

const UIDrafterPage: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(imageFile);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setError('');
        } else if (file) {
            setError('Please select an image file (PNG, JPG, etc.).');
        }
    };
    
    const handleDragEvents = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        handleDragEvents(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };
    
    const handleGenerate = async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedCode('');

        try {
            const result = await generateUiFromImage(imageFile, prompt);
            setGeneratedCode(result);
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
                <h1 className="text-4xl font-bold">UI Drafter: Design to Code</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Upload a UI mockup or screenshot, and let AI generate the HTML and Tailwind CSS code for you.
                </p>
            </div>

            <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Left Panel: Input & Controls --- */}
                <div className="flex flex-col gap-6">
                    <div 
                        className={`relative flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragEvents}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        />
                        {imagePreview ? (
                            <img src={imagePreview} alt="UI Preview" className="max-h-64 w-auto object-contain rounded-md shadow-md" />
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <PhotoIcon className="w-12 h-12 mx-auto" />
                                <p className="mt-2">Drag & drop your UI image here</p>
                                <p className="text-sm">or</p>
                            </div>
                        )}
                        <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-10">
                            {imagePreview ? 'Change Image' : 'Select Image'}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Additional Instructions (Optional)
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            placeholder="e.g., Use a dark theme, make the buttons interactive..."
                            className="w-full bg-gray-100 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                        />
                    </div>

                    {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !imageFile}
                        className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-4 rounded-lg transition-all hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : <><SparklesIcon className="w-5 h-5" /> Generate Code</>}
                    </button>
                </div>

                {/* --- Right Panel: Output --- */}
                <div className="bg-white dark:bg-gray-900/70 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col min-h-[500px]">
                    <div className="flex-grow flex flex-col">
                        {isLoading ? (
                            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <SparklesIcon className="w-12 h-12 animate-pulse" />
                                <p className="mt-4">Building your UI...</p>
                            </div>
                        ) : generatedCode ? (
                            <div className="flex-grow flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                    <h2 className="text-lg font-bold">Generated HTML & Tailwind CSS</h2>
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <CodeBlock code={generatedCode} language="html" filePath="index.html" />
                                </div>
                            </div>
                        ) : (
                             <div className="flex-grow flex items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                                Your generated code will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIDrafterPage;