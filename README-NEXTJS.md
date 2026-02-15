# Darija Companion - Next.js Web Application

A modern Moroccan Darija learning web application built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Features

- **Interactive Lessons** - Structured lessons with vocabulary, sentences, and exercises
- **Vocabulary Flashcards** - Spaced repetition flashcards for effective memorization
- **Interactive Quizzes** - Multiple choice and fill-in-the-blank quizzes with XP rewards
- **User Authentication** - Google and email/password authentication via Firebase
- **Progress Tracking** - XP system, levels, streaks, and achievements
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **State Management**: React Context + Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/ayoubhaida/darija-companion.git
cd darija-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Google + Email/Password)
4. Enable Firestore Database
5. Add a Web app and copy the config
6. Update `.env.local` with your Firebase credentials

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/            # Main app routes
│   │   ├── lessons/       # Lessons pages
│   │   ├── vocabulary/    # Vocabulary page
│   │   ├── quizzes/       # Quizzes pages
│   │   ├── profile/      # Profile page
│   │   └── settings/     # Settings page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities
│   ├── firebase.ts       # Firebase config
│   ├── auth.ts          # Auth helpers
│   └── firestore.ts     # Firestore helpers
└── types/               # TypeScript types
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
```

## 🎨 Design

The app uses a Moroccan-inspired color scheme:

- **Primary (Gold)**: `#D4AF37`
- **Secondary (Deep Blue)**: `#1E3A8A`
- **Accent (Orange)**: `#F97316`

## 📄 License

MIT License
