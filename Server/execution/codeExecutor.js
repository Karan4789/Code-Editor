const { exec } = require('child_process');
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
                await new Promise((resolve, reject) => {
                    exec(`gcc "${sourcePath}" -o "${execPath}"`, (error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });
                command = `"${execPath}"`;
                break;
            default:
                throw new Error('Unsupported language');
        }

        return await new Promise((resolve, reject) => {
            exec(command, { timeout: 10000 }, async (error, stdout, stderr) => {
                // Cleanup files
                try {
                    await fs.unlink(filePath).catch(() => {});
                    if (language === 'c') {
                        await fs.unlink(path.join(tempDir, `${fileId}.c`)).catch(() => {});
                        await fs.unlink(path.join(tempDir, `${fileId}.exe`)).catch(() => {});
                    }
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
    } catch (err) {
        throw new Error(`Execution failed: ${err.message}`);
    }
}

module.exports = { executeCode };
