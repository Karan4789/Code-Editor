import React from 'react';

function OutputDisplay({ output }) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative">
            {/* Copy button */}
            {output && (
                <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
                    title="Copy to clipboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                </button>
            )}
            
            {/* Output container */}
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