# ShikshaAI

AI-powered teaching assistant for Indian students (Classes 6-12). Get structured explanations, flashcards, and quizzes for Math, Science, and History. Personalized learning plans, progress tracking, and more.

---

## Demo

Curious how ShikshaAI works? Watch a walkthrough of the app's main features, navigation, and user experience:

[Click here to watch the demo on Vimeo](https://vimeo.com/1097638229?share=copy)

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Supabase Database Setup](#supabase-database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User authentication and profile setup (grade, exam type, learning style, preferred subjects)
- Personalized learning dashboard
- Study plan generator
- Flashcards, quizzes, and chunked content
- Progress tracking and analytics
- AI-powered explanations (Groq API)
- Text-to-speech (ElevenLabs API)

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **State/Context:** React Context API
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase (Postgres, Auth, RLS)
- **AI/Voice:** Groq API, ElevenLabs API
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase](https://supabase.com/) account
- [ElevenLabs](https://elevenlabs.io/) API key (for voice features, optional)
- [Groq](https://groq.com/) API key (for AI explanations, optional)

### Clone the Repository
```bash
git clone https://github.com/Chandra731/ShikshaAI
cd ShikshaAI
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GROQ_API_KEY=your-groq-api-key             
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key   # Optional, for voice

```
You can find your Supabase URL and anon key in your Supabase project settings.

### Supabase Database Setup
1. **Create a new project** in [Supabase](https://app.supabase.com/).
2. **Enable Auth** (email/password) in the Auth settings.
3. **Run the migration script** to set up tables and policies:
   - Go to the SQL editor in your Supabase dashboard.
   - Copy the contents of `supabase/migrations/20250630112957_golden_harbor.sql` and run it.
   - This will create the necessary tables (`student_profiles`, `student_progress`, `learning_roadmaps`, `student_interactions`, `syllabus`) and set up Row Level Security (RLS) policies.

## Running the Project

### Development
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure
```
ShikshaAI-main/
├── src/
│   ├── components/         # React components (auth, dashboard, learning, etc.)
│   ├── contexts/           # React Contexts (Auth)
│   ├── lib/                # API clients (supabase, groq, elevenlabs)
│   ├── pages/              # Page-level components
│   ├── index.css           # Tailwind base styles
│   └── main.tsx            # App entry point
├── supabase/
│   └── migrations/         # SQL migration scripts
├── public/                 # Static assets (if any)
├── package.json            # NPM scripts and dependencies
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── tsconfig*.json          # TypeScript configs
└── README.md               # This file
```

## Usage Guide
1. **Sign Up:** Register with your email and password.
2. **Profile Setup:** Enter your full name, class (11/12), target exam (Boards, NEET, JEE, UPSC), preferred subjects, and learning style (visual, audio, text).
3. **Dashboard:**
   - View your personalized study plan, progress, and subjects.
   - Start learning sessions: get explanations, flashcards, and quizzes.
   - Track your progress and adjust your plan as needed.
4. **Voice & AI:**
   - If you provide ElevenLabs and Groq API keys, you'll get voice explanations and AI-powered content.

## Contributing
- Fork the repo and create a feature branch.
- Run `npm run lint` before submitting PRs.
- Follow the existing code style (TypeScript, functional components, Tailwind CSS).
- Open issues for bugs or feature requests.

## License
[MIT](LICENSE)
