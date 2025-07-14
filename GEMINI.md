# Gemini Project: Sunrise

This document provides context for the Gemini AI assistant to effectively work on the Sunrise project.

## Project Overview

Sunrise is a full-stack mental health and wellness application. The goal is to provide users with tools to track their mood and receive helpful, AI-driven suggestions. The application consists of a React-based web frontend and a Node.js/Express backend.

## Tech Stack

### Frontend (`/app`)
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with DaisyUI component library
- **Routing:** React Router
- **Data Validation:** Zod
- **API Client:** Axios

### Backend (`/backend`)
- **Framework:** Express.js
- **Language:** TypeScript
- **Runtime:** Node.js
- **Database/Auth:** Supabase
- **AI Services:**
    - Google Generative AI
    - Hugging Face Inference
- **Job Scheduling:** Bree
- **Logging:** Winston & Pino
- **Data Validation:** Zod

## Project Structure

- `/app`: Contains the React frontend application.
- `/backend`: Contains the Node.js/Express backend API.
    - `/backend/src`: Main source code for the server.
    - `/backend/routes`: API route definitions.
    - `/backend/services`: Business logic (e.g., suggestion generation).
    - `/backend/data`: Static data files like `mentalchat16k.json`.

## Key Commands

To work on this project, you will need to operate within the `app` and `backend` directories.

### Frontend (`/app`)
- **Install Dependencies:** `cd app && npm install`
- **Run Dev Server:** `cd app && npm run dev`
- **Build for Production:** `cd app && npm run build`
- **Lint Code:** `cd app && npm run lint`

### Backend (`/backend`)
- **Install Dependencies:** `cd backend && npm install`
- **Run Dev Server:** `cd backend && npm run dev`
- **Run Production Build:** `cd backend && npm run start`
- **Run Tests:** `cd backend && npm run test`

## Coding Conventions & Style

- **TypeScript:** The entire project is written in TypeScript. Adhere to strong typing and modern TypeScript features.
- **Linting:** The frontend uses ESLint for code quality. Run `npm run lint` in the `/app` directory to check for issues.
- **Environment Variables:** The backend uses a `.env` file for secrets and configuration. Key variables will include:
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
    - `GOOGLE_API_KEY`
    - `HUGGINGFACE_TOKEN`
- **Commit Messages:** Follow conventional commit standards.

