# Online Code Editor

A modern, full-stack web application that allows users to write and execute code in multiple programming languages directly in the browser.

## 🚀 Live Demo

- Frontend: [Code Editor App](https://code-editor-a4020y2bn-karans-projects-554647fa.vercel.app)

## ✨ Features

- Support for multiple programming languages:
  - JavaScript
  - Python
  - C
- Real-time code execution
- Dark/Light theme toggle
- Interactive terminal output
- Input handling for programs
- Syntax highlighting
- Error handling and display

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Monaco Editor
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- Python3
- GCC
- Railway (Deployment)
- Nixpacks

## 🏗️ Architecture

- Frontend deployed on Vercel
- Backend deployed on Railway
- RESTful API communication
- Secure code execution environment

## 🚦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Python 3.x
- GCC compiler

### Local Development

1. Clone the repository
```bash
git clone https://github.com/karan4789/Code-Editor.git
cd Code-Editor
```

2. Install Frontend Dependencies
```bash
cd Client
npm install
```

3. Install Backend Dependencies
```bash
cd ../Server
npm install
```

4. Start Backend Server
```bash
npm run dev
```

5. Start Frontend Development Server
```bash
cd ../Client
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_API_URL=your_backend_url/api
```

### Backend
```
NODE_ENV=production
PORT=3000
```

## 📝 License

[MIT](LICENSE)

## 🙏 Acknowledgments

- Monaco Editor for the code editing interface
- Railway for hosting the backend
- Vercel for hosting the frontend

## 👨‍💻 Author

Karan - [GitHub Profile](https://github.com/karan4789)
