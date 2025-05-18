const express = require('express');
const cors = require('cors');
const path = require('path');
const { executeCode } = require('./execution/codeExecutor');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for production
app.use(cors({
  origin: [
    'https://code-editor-alpha-five.vercel.app', 
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
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

// Start the server for Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Temp directory: ${TEMP_DIR}`);
});

// Export the express app for compatibility
module.exports = app;
