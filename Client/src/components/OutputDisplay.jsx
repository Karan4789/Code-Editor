import React, { useRef, useEffect, useState } from 'react';
import Console from 'react-console-emulator';

function OutputDisplay({ output, onInput, isDarkMode }) {
    const terminal = useRef(null);
    const [isRunning, setIsRunning] = useState(false);
    const [waitingForInput, setWaitingForInput] = useState(false);

    const resetTerminal = () => {
        setIsRunning(false);
        setWaitingForInput(false);
        if (terminal.current) {
            terminal.current.clearStdout();
            terminal.current.pushToStdout('Terminal reset. Ready for new execution.');
        }
    };

    const commands = {
        echo: {
            description: 'Echo input',
            fn: (...args) => args.join(' ')
        },
        input: {
            description: 'Provide input to the program',
            fn: (...args) => {
                const input = args.join(' ');
                if (onInput) {
                    onInput(input + '\n');
                }
                return `Input provided: ${input}`;
            }
        },
        stop: {
            description: 'Stop the running program',
            fn: () => {
                setIsRunning(false);
                setWaitingForInput(false);
                return 'Program terminated.';
            }
        },
        reset: {
            description: 'Reset terminal state',
            fn: resetTerminal
        }
    };

    useEffect(() => {
        if (terminal.current && output) {
            terminal.current.clearStdout();
            terminal.current.pushToStdout(output);
            
            // Check if program is asking for input
            const needsInput = output.toLowerCase().includes('input') || 
                             output.toLowerCase().includes('enter');
            
            if (needsInput && !waitingForInput) {
                setWaitingForInput(true);
                terminal.current.pushToStdout('\n>>> Program is waiting for input. Type your response and press Enter <<<\n');
            }
            
            setIsRunning(needsInput);
        }
    }, [output]);

    useEffect(() => {
        if (!output && terminal.current) {
            resetTerminal();
        }
    }, [output]);

    const handleInput = (input) => {
        if (!isRunning) {
            terminal.current.pushToStdout('\nNo program is currently waiting for input.\n');
            return;
        }
        if (onInput) {
            terminal.current.pushToStdout(`\nSending input: ${input}\n`);
            onInput(input + '\n');
            setWaitingForInput(false);
            setIsRunning(false);
        }
    };

    return (
        <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Console
                ref={terminal}
                commands={commands}
                welcomeMessage={`Output Terminal Ready...\nType 'help' for commands.\nUse 'stop' to terminate a running program.`}
                promptLabel={isRunning ? "input>" : ">"}
                style={{
                    height: '300px',
                    maxHeight: '500px',
                    overflow: 'auto',
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    padding: '10px',
                }}
                styleEchoBack='fullInherit'
                contentStyle={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                promptLabelStyle={{ color: '#00ff00' }}
                inputStyle={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                noEchoBack={false}
                autoFocus
                onInput={handleInput}
            />
        </div>
    );
}

export default OutputDisplay;