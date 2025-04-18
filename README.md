# Code Editor

A modern code editor with support for multiple programming languages.

## Prerequisites

- Node.js (v14 or higher)
- Python (for Python code execution)
- GCC (for C code execution)

## Setup & Running

1. **Install Dependencies**

   First, install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd Server
   npm install

   # Install frontend dependencies
   cd ../Client
   npm install
   ```

2. **Start the Backend Server**

   ```bash
   # In the Server directory
   npm run dev
   ```

   The backend will run on http://localhost:5000

3. **Start the Frontend Development Server**

   ```bash
   # In the Client directory
   npm run dev
   ```

   The frontend will run on http://localhost:5173

4. **Open the Application**

   Open your browser and navigate to:
   http://localhost:5173

## Supported Languages

- JavaScript
- Python
- C

## Development

- Backend runs on Express.js
- Frontend built with React + Vite
- Code editing powered by Monaco Editor
