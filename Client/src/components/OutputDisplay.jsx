import React from 'react';

function OutputDisplay({ output }) {
    return (
        <div className="relative">
            <div
                className="bg-gray-900 dark:bg-black/[.30] text-gray-100 dark:text-gray-200 p-4 rounded-lg min-h-[100px] max-h-60 overflow-y-auto shadow-inner backdrop-blur-sm"
                aria-live="polite"
            >
                <pre className="whitespace-pre-wrap font-mono text-sm break-words">
                    {output === '' ? (
                        <span className="text-gray-500 italic">// Output will appear here...</span>
                    ) : (
                        output
                    )}
                </pre>
            </div>
        </div>
    );
}

export default OutputDisplay;