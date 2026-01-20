#  AI Job Tracker - Professional Dashboard

An intelligent job portal that utilizes **AI Matching** and **Smart Tracking** to manage career applications efficiently. Built with the **MERN-lite** stack (Fastify & React).

##  Requirements Fulfilled
* **Job Feed**: Real-time developer roles fetched via Adzuna API.
* **AI Matching**: Gemini-1.5-Flash provides custom match scores and logic.
* **Smart Tracking**: Detects when you return to the app after applying and prompts for status.
* **Persistence**: Automatically saves your "Applied" job history to LocalStorage.
* **Career Coach**: Built-in AI sidebar for resume tips and interview help.
* **Mobile Responsive**: Dashboard adapts for both Desktop and Mobile views.

## 🛠️ Tech Stack
* **Backend**: Node.js, Fastify.
* **Frontend**: React.js, Lucide-React Icons.
* **AI Engine**: Google Generative AI (Gemini).

## 🚀 Setup Instructions
1.  **Backend**: `cd backend`, `npm install`, then `node server.js`.
2.  **Frontend**: `cd frontend`, `npm install`, then `npm start`.
3.  **Env**: Ensure `.env` contains your Gemini and Adzuna keys.