AI Job Tracker - Professional Dashboard
An intelligent job portal that utilizes AI Matching and Smart Tracking to manage career applications efficiently. Built with the Fastify & React stack.

Live Demo: https://ai-job-tracker-delta.vercel.app

🏗️ Architecture & Logic
System Design: The project follows a decoupled architecture where a React frontend communicates with a Fastify Node.js backend to ensure high performance and low latency.

AI Matching Logic: We utilize the Gemini-1.5-Flash model for semantic analysis, comparing job descriptions with user skills to generate a match percentage.

Efficiency: Parallel processing using Promise.all() is implemented to handle multiple job matching requests simultaneously, reducing processing time significantly.

🧠 Critical Thinking & Design Decisions
Application Tracker: We implemented a Popup Flow using a window.focus event listener. This detects when a user returns to the dashboard after clicking an external application link, triggering a status update prompt.

Persistence Strategy: LocalStorage was chosen for data persistence to ensure user application history is saved instantly without the overhead of complex database management for this version.

📈 Scalability & Tradeoffs
Scaling to 10k Users: For high-scale traffic, we would transition to a Redis-based caching system for job scores and a PostgreSQL database for persistent cross-device user data.

Tradeoffs: Given the 24-hour development window, we prioritized core AI functionality and UX flow over a multi-page authentication system to deliver maximum value to the recruiter.

🛠️ Tech Stack
Backend: Node.js, Fastify.

Frontend: React.js, Lucide-React.

AI Engine: Google Generative AI (Gemini).

🚀 Setup Instructions
Prerequisites: Install Node.js and NPM.

Backend: Navigate to /backend, run npm install, and start with node server.js.

Frontend: Navigate to /frontend, run npm install, and start with npm start.

Environment Variables: Create a .env in the backend with GEMINI_API_KEY, ADZUNA_APP_ID, and ADZUNA_APP_KEY.

⚠️ Important Note: This project uses a free-tier hosting service (Render). Please allow 60 seconds for the AI backend to "wake up" during the first request.
