import React, { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

// This makes ace available globally after script load from index.html
declare var ace: any;

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language: string;
    readOnly?: boolean;
    height?: string;
}

// Map our app's language slugs to Ace editor's mode names
const languageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    html: 'html',
    css: 'css',
    python: 'python',
    go: 'golang',
    ruby: 'ruby',
    java: 'java',
    php: 'php',
    nodejs: 'javascript', // no specific nodejs mode, use js
    sql: 'sql',
    postgresql: 'pgsql',
    mongodb: 'json', // No specific mongo mode, json is close for queries
};

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language, readOnly = false, height = '300px' }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const aceEditorRef = useRef<any>(null); // To hold the editor instance
    const { theme } = useTheme();

    // Initialize editor on mount
    useEffect(() => {
        if (editorRef.current && typeof ace !== 'undefined') {
            const editor = ace.edit(editorRef.current);
            aceEditorRef.current = editor;

            // Enable language tools
            ace.require('ace/ext/language_tools');

            editor.session.setMode(`ace/mode/${languageMap[language] || 'javascript'}`);
            editor.setValue(value, -1); // -1 moves cursor to the start
            editor.setReadOnly(readOnly);

            editor.setOptions({
                enableBasicAutocompletion: !readOnly,
                enableLiveAutocompletion: !readOnly,
                enableSnippets: !readOnly,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: true, // This enables syntax checking
            });

            editor.renderer.setShowGutter(true);
            editor.container.style.lineHeight = '1.5';
            editor.renderer.updateFontSize();

            if (onChange) {
                editor.on('change', () => {
                    // prevent onChange from firing when setValue is called externally
                    if (editor.curOp && editor.curOp.command.name === 'setValue') {
                        return;
                    }
                    onChange(editor.getValue());
                });
            }
        }
        
        // Cleanup on unmount
        return () => {
            if (aceEditorRef.current) {
                aceEditorRef.current.destroy();
                const oldEl = aceEditorRef.current.container;
                if (oldEl && oldEl.parentNode) {
                    oldEl.parentNode.removeChild(oldEl);
                }
                aceEditorRef.current = null;
            }
        };
    }, []); // Run only once on mount
    
    // Handle theme changes
    useEffect(() => {
        if (aceEditorRef.current) {
            const editorTheme = theme === 'dark' ? 'tomorrow_night_eighties' : 'tomorrow';
            aceEditorRef.current.setTheme(`ace/theme/${editorTheme}`);
        }
    }, [theme]);

    // Handle prop changes for language
    useEffect(() => {
        if (aceEditorRef.current) {
            aceEditorRef.current.session.setMode(`ace/mode/${languageMap[language] || 'javascript'}`);
        }
    }, [language]);
    
    // Handle external value changes
    useEffect(() => {
        if (aceEditorRef.current && aceEditorRef.current.getValue() !== value) {
            const currentPosition = aceEditorRef.current.selection.getCursor();
            aceEditorRef.current.setValue(value, -1); // Use -1 to avoid moving cursor
            aceEditorRef.current.selection.moveCursorToPosition(currentPosition);
        }
    }, [value]);

    // Handle readOnly changes
    useEffect(() => {
        if (aceEditorRef.current) {
            aceEditorRef.current.setReadOnly(readOnly);
             aceEditorRef.current.setOptions({
                enableBasicAutocompletion: !readOnly,
                enableLiveAutocompletion: !readOnly,
            });
        }
    }, [readOnly]);

    return <div ref={editorRef} style={{ height, width: '100%' }} />;
};

export default CodeEditor;