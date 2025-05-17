const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function executeCode({ language, code, input }, tempDir) {
    const fileId = uuidv4();
    let filePath, command;

    try {
        switch (language) {
            case 'javascript':
                filePath = path.join(tempDir, `${fileId}.js`);
                await fs.writeFile(filePath, code);
                command = `node "${filePath}"`;
                break;
            case 'python':
                const pythonPath = path.join(tempDir, `${fileId}.py`);
                await fs.writeFile(pythonPath, code);
                
                return new Promise((resolve, reject) => {
                    let isTerminated = false;
                    const process = spawn('python', [pythonPath], {
                        stdio: ['pipe', 'pipe', 'pipe']
                    });

                    let stdout = '';
                    let stderr = '';
                    let inputTimeout;

                    // Set input timeout
                    const setInputTimer = () => {
                        clearTimeout(inputTimeout);
                        inputTimeout = setTimeout(() => {
                            if (!isTerminated) {
                                process.kill();
                                isTerminated = true;
                                resolve({ error: 'Program timed out waiting for input' });
                            }
                        }, 10000); // 10 second timeout for input
                    };

                    process.stdout.on('data', (data) => {
                        stdout += data.toString();
                        if (data.toString().toLowerCase().includes('input') || 
                            data.toString().includes('Enter')) {
                            setInputTimer();
                        }
                    });

                    process.stderr.on('data', (data) => {
                        stderr += data.toString();
                    });

                    if (input) {
                        clearTimeout(inputTimeout);
                        process.stdin.write(input);
                        process.stdin.end();
                    }

                    process.on('close', (code) => {
                        fs.unlink(pythonPath).catch(() => {});
                        if (code !== 0) {
                            resolve({ error: stderr || 'Process exited with error' });
                        } else {
                            resolve({ output: stdout });
                        }
                    });

                    process.on('error', (err) => {
                        fs.unlink(pythonPath).catch(() => {});
                        reject(new Error(`Execution failed: ${err.message}`));
                    });
                });
            case 'c':
                const sourcePath = path.join(tempDir, `${fileId}.c`);
                const execPath = path.join(tempDir, `${fileId}.exe`);
                await fs.writeFile(sourcePath, code);
                
                try {
                    // Compile C code
                    await new Promise((resolve, reject) => {
                        exec(`gcc "${sourcePath}" -o "${execPath}"`, {
                            timeout: 5000,
                            windowsHide: true
                        }, (error, stdout, stderr) => {
                            if (error) reject(new Error(`Compilation error: ${stderr}`));
                            else resolve(stdout);
                        });
                    });

                    // Execute with better stream handling
                    const result = await new Promise((resolve, reject) => {
                        const process = spawn(execPath, [], {
                            stdio: ['pipe', 'pipe', 'pipe'],
                            windowsHide: true
                        });

                        let stdout = '';
                        let stderr = '';
                        
                        process.stdout.on('data', (data) => {
                            stdout += data.toString();
                        });

                        process.stderr.on('data', (data) => {
                            stderr += data.toString();
                        });

                        process.on('error', (error) => {
                            reject(new Error(`Execution error: ${error.message}`));
                        });

                        const timeout = setTimeout(() => {
                            process.kill();
                            reject(new Error('Execution timeout'));
                        }, 10000);

                        process.on('close', (code) => {
                            clearTimeout(timeout);
                            if (code !== 0) {
                                resolve({ error: stderr || 'Process exited with non-zero code' });
                            } else {
                                // Format output for consistent display
                                const formattedOutput = stdout
                                    .replace(/\r\n/g, '\n')
                                    .replace(/\r/g, '\n')
                                    .trim();
                                resolve({ output: formattedOutput + '\n' });
                            }
                        });

                        // Handle program input
                        if (code.includes('scanf') || code.includes('gets')) {
                            process.stdin.write('3\n');  // Default input
                            process.stdin.end();
                        }
                    });

                    // Cleanup files
                    await fs.unlink(sourcePath).catch(() => {});
                    await fs.unlink(execPath).catch(() => {});
                    
                    return result;
                } catch (error) {
                    // Cleanup on error
                    await fs.unlink(sourcePath).catch(() => {});
                    await fs.unlink(execPath).catch(() => {});
                    return { error: error.message };
                }
                break;
            default:
                throw new Error('Unsupported language');
        }

        // Handle JavaScript execution
        const result = await new Promise((resolve, reject) => {
            exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
                try {
                    await fs.unlink(filePath).catch(() => {});
                } catch (err) {
                    console.error('Cleanup error:', err);
                }

                if (error || stderr) {
                    resolve({ error: stderr || error?.message || 'Execution failed' });
                } else {
                    resolve({ output: stdout });
                }
            });
        });

        return result;
    } catch (err) {
        return { error: `Execution failed: ${err.message}` };
    }
}

module.exports = { executeCode };