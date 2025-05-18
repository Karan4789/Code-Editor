const express = require('express');
const cors = require('cors');
const path = require('path');
const { executeCode } = require('./Server/execution/codeExecutor');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for production
app.use(cors({
  origin: ['https://karan4789.github.io', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Use OS temp directory for Vercel compatibility
const TEMP_DIR = path.join(os.tmpdir(), 'code-editor');

// Create temp directory if it doesn't exist
require('fs').mkdirSync(TEMP_DIR, { recursive: true });

app.post('/api/execute', async (req, res) => {
    try {
        const result = await executeCode(req.body, TEMP_DIR);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Temp directory: ${TEMP_DIR}`);
    });
}

// Export the express app for Vercel
module.exports = app;
