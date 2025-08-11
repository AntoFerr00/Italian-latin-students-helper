# Latin-to-Italian Translation Helper 🇮🇹 🏛️

An interactive web application designed to help students learn the *process* of translating Latin to Italian through a guided, step-by-step methodology. Instead of just focusing on the final translation, this tool breaks down the expert's analytical process into manageable tasks, providing feedback at each stage.

## Core Features

* **Guided, Multi-Step Process**: Guides the student through a proven algorithm: finding verbs, identifying the main clause, analyzing grammatical components, finding the subject, and more.
* **Interactive Text Analysis**: Students directly interact with the Latin text by clicking words to make selections.
* **Grammatical Prompts**: Asks for specific grammatical details (voice, person, number) using dropdowns to reinforce knowledge.
* **AI-Powered Feedback**: Uses a locally-run AI model (via Ollama) to provide qualitative feedback on the student's final translation, comparing it against an expert's version.
* **Data-Driven Exercises**: All texts and their correct analyses are stored in a MongoDB database, making the application easily extensible with new content.

## Tech Stack 🛠️

#### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **AI**: Ollama with Llama 3 model

#### Frontend
* **Framework**: React (with Vite)
* **State Management**: Redux Toolkit
* **Routing**: React Router DOM
* **API Communication**: Axios

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:
* [Node.js](https://nodejs.org/) (which includes npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)
* [Ollama](https://ollama.com/)

## Installation & Setup 🚀

The project is split into two main folders: `latin-app-backend` and `latin-app-frontend`. You need to install the dependencies for both.

1.  **Clone the repository** (or ensure your two project folders are in the same parent directory).

2.  **Install Backend Dependencies**:
    ```bash
    cd latin-app-backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../latin-app-frontend
    npm install
    ```

## Configuration ⚙️

The backend server requires environment variables to connect to the database.

1.  In the `latin-app-backend` directory, create a new file named `.env`.

2.  Add the following content to the `.env` file, replacing the placeholder with your actual MongoDB connection string.

    ```
    # Your MongoDB connection string (local or from Atlas)
    MONGO_URI=mongodb://127.0.0.1:27017/latin_app_db
    
    # The port the backend server will run on
    PORT=5000
    ```

## Running the Application Locally ▶️

To run the application, you need to start **three separate processes** in three different terminals.

#### 1. Start the AI Model

First, ensure the Ollama application is running on your computer. Then, in a terminal, pull and run the Llama 3 model:
```bash
ollama run llama3
```

You can leave this running in the background.

2. Start the Backend Server
In a second terminal, navigate to the backend directory and start the server:

```bash
cd latin-app-backend
npm run dev
```
The server should start on http://localhost:5000 and log "Connected to MongoDB".

3. Start the Frontend Application
In a third terminal, navigate to the frontend directory and start the development server:

```bash
cd latin-app-frontend
npm run dev
```
The React application will open in your browser, usually at http://localhost:5173.

How It Works: The Translation Algorithm
The application guides a student through the following pedagogical steps for each translation exercise:

Passo 1: Trova i Verbi: The student highlights all verbs in the text.
```bash
cd latin-app-frontend
npm run dev
```
The React application will open in your browser, usually at http://localhost:5173.

How It Works: The Translation Algorithm
The application guides a student through the following pedagogical steps for each translation exercise:

Passo 1: Trova i Verbi: The student highlights all verbs in the text.

Passo 2: Identifica il Verbo Principale: From the list of correct verbs, the student selects the main verb of the principal clause.

Passo 3: Analisi del Verbo Principale: The student analyzes the main verb's voice, person, and number using dropdowns.

Passo 4: Trova il Soggetto: Based on the analysis, the student highlights the subject of the main verb in the text.

Passo 5: Prima bozza di traduzione: The student writes their full translation in a text box and submits it for AI-powered evaluation and comparison with an expert's translation.

Project Structure
Backend (latin-app-backend)
/
|-- /controllers  # Handles request logic
|-- /models       # Mongoose schemas for the database
|-- /routes       # API endpoint definitions
|-- /services     # AI service logic (Ollama)
|-- .env          # Environment variables (you create this)
|-- server.js     # Main server entry point
Frontend (latin-app-frontend)
/src
|-- /components   # Reusable UI components (if any)
|-- /pages        # Main page components (TextSelection, TranslationWorkspace)
|-- /redux        # Redux Toolkit store and slices
|-- App.jsx       # Main application component with routing
|-- main.jsx      # Application entry point