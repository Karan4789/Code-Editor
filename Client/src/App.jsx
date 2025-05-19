import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import OutputDisplay from './components/OutputDisplay';
import ThemeToggle from './components/ThemeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
    const [code, setCode] = useState('// Write your code here...');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => 
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const [inputBuffer, setInputBuffer] = useState('');
    const [pendingRequest, setPendingRequest] = useState(null);
    const [waitingForInput, setWaitingForInput] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        return () => {
            if (pendingRequest) {
                pendingRequest.abort();
            }
        };
    }, [pendingRequest]);

    const getDefaultCode = (lang) => {
        switch (lang) {
            case 'python':
                return `# Python Example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`;
            case 'javascript':
                return `// JavaScript Example
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;
            case 'c':
                return `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`;
            default:
                return `// Write your ${lang} code here...`;
        }
    };

    const handleCodeChange = (value) => {
        setCode(value || '');
    };

    const handleLanguageChange = (event) => {
        const newLang = event.target.value;
        setLanguage(newLang);
        setCode(getDefaultCode(newLang));
        setOutput('');
        setError('');
    };

    const handleTerminalInput = (input) => {
        setInputBuffer(input);
        if (language === 'c' && output.includes('Enter')) {
            setOutput(prev => prev + '\n' + input);
        }
    };

    const runCode = async () => {
        if (!code.trim()) {
            setError("Please write some code before running.");
            setOutput('');
            return;
        }
        if (!language) {
            setError("Please select a language.");
            setOutput('');
            return;
        }

        // Cancel any pending request
        if (pendingRequest) {
            pendingRequest.abort();
        }

        setIsLoading(true);
        setOutput('');
        setError('');

        // Create new abort controller
        const abortController = new AbortController();
        setPendingRequest(abortController);

        try {
            const response = await axios.post(`${API_URL}/execute`, {
                language,
                code,
                input: inputBuffer
            }, {
                signal: abortController.signal,
                timeout: 30000 // Increased to 30 seconds
            });

            if (response.data.error) {
                setError(response.data.error);
                setOutput('');
                setWaitingForInput(false);
            } else {
                // Format the output before setting it
                const formattedOutput = response.data.output?.trim() || '';
                setOutput(formattedOutput + '\n');
                setWaitingForInput(response.data.output.toLowerCase().includes('input') || 
                                   response.data.output.toLowerCase().includes('enter'));
                setError('');
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                setError('Execution cancelled');
            } else {
                console.error("API Error:", err);
                const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to connect to the execution server.";
                setError(`API Request Failed: ${errorMessage}`);
            }
            setOutput('');
        } finally {
            setIsLoading(false);
            setPendingRequest(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                            CodeNimbus
                        </span>
                        <FontAwesomeIcon 
                            icon={faCode} 
                            className="text-teal-500"
                        />
                    </h1>
                    <ThemeToggle 
                        isDark={isDarkMode} 
                        onToggle={() => setIsDarkMode(!isDarkMode)} 
                    />
                </header>

                <div className="grid gap-6 lg:grid-cols-[1fr,auto] lg:gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <select
                                value={language}
                                onChange={handleLanguageChange}
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md border-0 text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="c">C</option>
                            </select>

                            <button
                                onClick={runCode}
                                disabled={isLoading}
                                className="ml-auto inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Running...
                                    </>
                                ) : 'Run Code'}
                            </button>
                        </div>

                        <div className="h-[60vh] lg:h-[70vh] rounded-lg overflow-hidden border dark:border-gray-700 shadow-lg">
                            <CodeEditor
                                language={language}
                                value={code}
                                onChange={handleCodeChange}
                                theme={isDarkMode ? 'vs-dark' : 'light'}
                            />
                        </div>
                    </div>

                    <div className="lg:w-96 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Output Terminal
                        </h2>
                        
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-md">
                                <p className="font-bold text-red-800 dark:text-red-200">Error</p>
                                <pre className="mt-1 text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{error}</pre>
                            </div>
                        )}

                        <OutputDisplay 
                            output={output} 
                            onInput={handleTerminalInput}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;