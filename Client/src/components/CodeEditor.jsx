import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ language, value, onChange, theme = 'vs-dark' }) {
    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                width="100%"
                language={language}
                value={value}
                onChange={onChange}
                theme={theme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: language === 'python' ? 4 : 2,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    smoothScrolling: true,
                }}
                loading={
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                }
            />
        </div>
    );
}

export default CodeEditor;