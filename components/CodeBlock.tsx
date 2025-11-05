import React, { useState } from 'react';
import { CopyIcon, CheckIcon, DownloadIcon } from './icons';

interface CodeBlockProps {
  code: string;
  filePath?: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, filePath }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!filePath) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black/30 rounded-xl overflow-hidden border border-white/10 my-4">
        <div className="bg-black/20 px-4 py-2 text-xs text-slate-400 font-mono flex justify-between items-center">
            <span>{filePath || 'Code Example'}</span>
            <div className="flex items-center gap-4">
                {filePath && (
                    <button 
                        onClick={handleDownload}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                        aria-label="Download file"
                    >
                        <DownloadIcon className="w-4 h-4" />
                    </button>
                )}
                <button 
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                    aria-label={isCopied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
                >
                    {isCopied ? (
                        <>
                            <CheckIcon className="w-4 h-4 text-green-400" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
        <pre className="p-4 text-sm overflow-x-auto max-h-[60vh]">
            <code>
                {code}
            </code>
        </pre>
    </div>
  );
};
