# 🌅 Sunrise — AI-Powered Behavioral Activation & Spiritual Wellness App

### SonarCloud Status

[![SonarCloud Status](https://sonarcloud.io/api/project_badges/measure?project=MCarlquist_Sunrise&metric=alert_status)](https://sonarcloud.io/dashboard?id=MCarlquist_Sunrise)

Welcome to **Sunrise**, where technology meets the soul. This Progressive Web App harnesses the power of AI-driven **Cognitive Behavioral Therapy (CBT)** and **Behavioral Activation (BA)** techniques to support your mental health journey—infused with spiritual depth and philosophical resonance. Sunrise helps you track moods, cultivate meaningful activities, and flow into states of personal growth and well-being, all wrapped in a radiant, spiritually-integrated experience.

---

## ✨ What Is Sunrise?

Sunrise is a personalized, offline-first PWA built entirely in **TypeScript**, designed to guide you through mood management and behavioral activation with the subtlety of AI-powered suggestions rooted in CBT principles. It combines rigorous mental health science with spiritual themes to keep you engaged, uplifted, and evolving. By learning from your input and previous sessions, Sunrise offers curated, adaptive activities that help you build resilience, find purpose, and navigate life's emotional tides with grace.

---

## 🧩 Core Features

- **AI-Driven Activity Suggestions:** Auto-suggest personalized CBT/BA activities powered by the MentalChat16K dataset and advanced embeddings from Hugging Face and Google Gemini models.
- **Mood & Activity Logging:** Track your emotional states alongside your daily behaviors, enabling reflection and growth over time.
- **Spiritual & Philosophical UI Themes:** Choose from calming sunrise-inspired or mystical, moonlit themes, complete with affirmations and ritual reminders.
- **Offline-First PWA:** Seamlessly installable with push notifications and reminders, working even when offline.
- **Secure & Scalable Backend:** Powered by Node.js, Express, and Supabase with vector similarity search for smart AI recommendations.
- **Robust Validation & Logging:** Using Zod for API request validation and Winston for error tracking and monitoring.

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                                  |
|---------------------|------------------------------------------|
| React + TypeScript   | Component-driven UI with type safety     |
| Tailwind CSS + DaisyUI | Fast, beautiful, and customizable styling |
| React Icons         | Intuitive iconography                    |
| PWA Support         | Offline usage and installability         |

### Backend

| Technology               | Purpose                                  |
|--------------------------|------------------------------------------|
| Node.js + Express (TS)   | API routing and server logic              |
| Supabase                 | Auth, PostgreSQL, and vector search      |
| Hugging Face             | MentalChat16K dataset integration         |
| Google Gemini            | Advanced AI embeddings and NLP            |
| Zod                      | Runtime schema validation                  |
| Winston                  | Logging and error monitoring               |
| Bree.js                  | Background task scheduling (e.g., reminders) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Supabase account & project
- OpenAI API key
- Google Gemini API credentials
- `.env` file with all secrets configured (see below)

### Clone & Install

```bash
git clone https://github.com/MCarlquist/Sunrise.git
cd Sunrise

# Frontend setup
cd app
npm install

# Backend setup
cd ../backend
npm install


