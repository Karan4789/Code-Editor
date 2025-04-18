const express = require('express');
const cors = require('cors');
const path = require('path');
const { executeCode } = require('./execution/codeExecutor');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, 'temp');

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Temp directory: ${TEMP_DIR}`);
});
