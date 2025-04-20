const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function executeCode({ language, code }, tempDir) {
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
                filePath = path.join(tempDir, `${fileId}.py`);
                await fs.writeFile(filePath, code);
                command = process.platform === 'win32' ?
                    `python "${filePath}"` :
                    `python3 "${filePath}" 2>&1 || python "${filePath}" 2>&1`;
                break;
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

                    // Execute compiled code with input support
                    const result = await new Promise((resolve, reject) => {
                        const process = spawn(execPath, [], {
                            timeout: 10000,
                            windowsHide: true
                        });

                        let stdout = '';
                        let stderr = '';

                        // Provide input immediately
                        process.stdin.write('3\n');  // Number of processes
                        process.stdin.write('24 3 3\n');  // Burst times
                        process.stdin.end();

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
                                resolve({ output: stdout });
                            }
                        });
                    });

                    // Cleanup C files
                    await fs.unlink(sourcePath).catch(() => {});
                    await fs.unlink(execPath).catch(() => {});
                    
                    return result;
                } catch (error) {
                    // Cleanup on error
                    await fs.unlink(sourcePath).catch(() => {});
                    await fs.unlink(execPath).catch(() => {});
                    return { error: error.message };
                }
            default:
                throw new Error('Unsupported language');
        }

        // Handle JavaScript and Python execution
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