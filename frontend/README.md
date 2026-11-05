# Aggu – AI Study Chatbot

**Your friendly AI-powered study companion.**

Aggu is an AI Study Chatbot designed to help students understand academic concepts, clarify doubts, and learn more effectively through interactive conversations.

Built with a modern React frontend, Python FastAPI backend, and Ollama-powered local AI model, Aggu provides an accessible and student-friendly learning experience.

---

## Features

- **AI-Powered Study Assistance:** Ask academic questions and receive AI-generated explanations.
- **Interactive Conversations:** Continue conversations with contextual chat history.
- **Markdown Support:** View structured answers with headings, lists, code blocks, and tables.
- **Student Authentication:** Register, log in, and log out securely.
- **User Profiles:** Personalized student experience.
- **Local AI Integration:** Uses Ollama to run the language model locally.
- **Responsive Interface:** Designed for a clean and comfortable study experience.

---

## Technologies Used

| Component | Technology |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| AI Integration | Ollama |
| AI Model | Gemma 2B |
| API Communication | REST API |

---

## Project Structure

```text
AI-Study-Chatbot/
│
├── backend/
│   ├── main.py
│   ├── studyai.db
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── Auth.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── MarkdownMessage.tsx
│   ├── package.json
│   └── index.html
│
├── .venv/
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Study-Chatbot
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Backend Setup

Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r backend/requirements.txt
```

Start the FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL displayed in your terminal, usually:

```text
http://localhost:5173
```

---

## Ollama Setup

Aggu uses Ollama to run its AI language model locally.

### 1. Install Ollama

Download Ollama:

https://ollama.com/download

### 2. Download the AI Model

```bash
ollama pull gemma:2b
```

### 3. Run the Model

```bash
ollama run gemma:2b
```

Make sure Ollama is running before testing AI conversations in Aggu.

---

## Running the Application

To run the complete application, start:

1. Ollama – AI model service.
2. FastAPI – Backend server.
3. Vite – Frontend development server.

Keep the backend and frontend terminals running while using the application.

---

## Future Enhancements

- Personalized study plans.
- Subject-wise learning assistance.
- Quiz and practice question generation.
- Study progress tracking.
- Document-based question answering.
- Docker-based deployment.
- Improved student learning analytics.

---

## Project Objective

The objective of Aggu is to make learning easier and more interactive by providing students with an AI-powered study companion that can explain concepts, answer questions, and support independent learning.

---

**Aggu – Learn Better. Understand More. Grow Smarter.**