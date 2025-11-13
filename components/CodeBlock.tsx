import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';
import CodeEditor from './CodeEditor';

interface CodeBlockProps {
    code: string;
    language: string;
    filePath?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filePath }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    // Calculate editor height based on number of lines
    const lines = code.trim().split('\n').length;
    // Set a dynamic height with min and max values to keep it reasonable
    const editorHeight = `${Math.max(50, Math.min(400, lines * 21))}px`;

    return (
        <div className="bg-gray-50 dark:bg-black/30 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 my-4 relative group text-left">
            {(filePath || language) && (
                 <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center justify-between">
                    <span>{filePath || `language: ${language}`}</span>
                     <button
                        onClick={handleCopy}
                        className="p-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-md text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
                        aria-label="Copy code"
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4 text-current" />
                                <span className="text-xs">Copied!</span>
                            </>
                        ) : (
                             <>
                                <CopyIcon className="w-4 h-4" />
                                <span className="text-xs">Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            <CodeEditor
                value={code.trim()}
                language={language}
                readOnly={true}
                height={filePath ? '400px' : editorHeight}
            />
        </div>
    );
};

export default CodeBlock;