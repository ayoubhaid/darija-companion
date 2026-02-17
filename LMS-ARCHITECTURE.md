# LMS Architecture Documentation

## Overview

This is a production-ready Learning Management System (LMS) architecture built with Next.js, Firebase (Firestore), and Editor.js. The system is modular, scalable, and designed for future growth.

---

## 📁 Folder Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── admin/                  # Admin dashboard pages
│   │   ├── courses/           # Course management
│   │   ├── lessons/           # Lesson management
│   │   ├── quizzes/           # Quiz management
│   │   └── users/             # User management
│   ├── api/                    # API routes
│   │   ├── upload-file/        # File upload handler
│   │   └── fetch-url/         # Link preview fetcher
│   ├── courses/                # Course catalog (student)
│   ├── lessons/                # Lesson viewer (student)
│   └── quizzes/                # Quiz pages (student)
│
├── components/
│   ├── editor/                 # Editor.js components
│   │   ├── Editor.tsx          # Main editor component
│   │   └── ContentRenderer.tsx # Content renderer
│   │
│   ├── lms/                    # LMS-specific components
│   │   ├── smartBlocks/        # Interactive learning blocks
│   │   │   ├── QuizBlock.tsx
│   │   │   ├── VocabularyBlock.tsx
│   │   │   ├── DialogueBlock.tsx
│   │   │   ├── RevealBlock.tsx
│   │   │   └── CalloutBlock.tsx
│   │   ├── admin/              # Admin components
│   │   │   └── CourseBuilder.tsx
│   │   ├── student/            # Student components
│   │   │   ├── CoursePlayer.tsx
│   │   │   └── StudentDashboard.tsx
│   │   ├── ContentRenderer.tsx
│   │   └── index.ts
│   │
│   ├── layout/                # Layout components
│   └── ui/                    # Reusable UI components
│
├── lib/                        # Core libraries
│   ├── firebase.ts             # Firebase initialization
│   ├── firestore.ts            # Firestore utilities
│   ├── lms.ts                 # LMS database operations
│   ├── auth.ts                # Authentication
│   ├── achievements.ts         # Gamification system
│   ├── spacedRepetition.ts    # Learning algorithm
│   └── editor/                # Editor utilities
│       └── smartBlocks.ts     # Custom Editor.js tools
│
└── types/
    ├── index.ts               # Existing type definitions
    ├── editorjs.d.ts          # Editor.js types
    └── lms.ts                 # LMS type definitions ⭐ NEW
```

---

## 🗄️ Database Schema

### Firestore Collections

```
users/{userId}
├── email: string
├── displayName: string
├── role: 'admin' | 'instructor' | 'student'
├── profile: UserProfile
└── createdAt: timestamp

userProfiles/{userId}
├── xp: number
├── level: number
├── totalXP: number
├── streak: number
├── achievements: string[]
├── preferences: {...}
└── stats: {...}

courses/{courseId}
├── title: string
├── slug: string (unique)
├── description: string
├── coverImage: string
├── difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
├── category: string
├── tags: string[]
├── estimatedDuration: number
├── isFree: boolean
├── price: number?
├── isPublished: boolean
├── isFeatured: boolean
├── certificateEnabled: boolean
├── createdBy: string
├── createdAt: timestamp
└── updatedAt: timestamp

modules/{moduleId}
├── courseId: string
├── title: string
├── description: string
├── order: number
├── isLocked: boolean
├── unlockCondition: {...}
├── prerequisites: string[]
├── dripRelease: {...}
├── createdAt: timestamp
└── updatedAt: timestamp

lessons/{lessonId}
├── moduleId: string
├── courseId: string
├── title: string
├── description: string
├── content: EditorJSContent (JSON)
├── order: number
├── duration: number
├── xpReward: number
├── difficulty: string
├── isFree: boolean
├── isPublished: boolean
├── completionRules: {...}
├── createdBy: string
├── createdAt: timestamp
└── updatedAt: timestamp

enrollments/{enrollmentId}
├── userId: string
├── courseId: string
├── status: 'active' | 'completed' | 'dropped' | 'expired'
├── progress: number (0-100)
├── startedAt: timestamp
├── completedAt: timestamp?
├── lastAccessedAt: timestamp
├── currentModuleId: string?
└── currentLessonId: string?

lessonProgress/{progressId}
├── userId: string
├── lessonId: string
├── courseId: string
├── moduleId: string
├── completed: boolean
├── progress: number
├── timeSpent: number (seconds)
├── blocksCompleted: string[]
├── startedAt: timestamp
├── completedAt: timestamp?
└── lastAccessedAt: timestamp

courseProgress/{progressId}
├── userId: string
├── courseId: string
├── progress: number
├── lessonsCompleted: number
├── totalLessons: number
├── quizzesPassed: number
├── totalQuizzes: number
├── xpEarned: number
├── startedAt: timestamp
├── completedAt: timestamp?
└── lastAccessedAt: timestamp

quizAttempts/{attemptId}
├── userId: string
├── quizId: string
├── lessonId: string?
├── courseId: string?
├── answers: QuizAnswer[]
├── score: number
├── totalPoints: number
├── percentage: number
├── passed: boolean
├── timeSpent: number
├── startedAt: timestamp
├── completedAt: timestamp
└── xpEarned: number

xpLogs/{logId}
├── userId: string
├── amount: number
├── source: XPSource
├── sourceId: string
├── description: string
└── timestamp: timestamp

certificates/{certificateId}
├── userId: string
├── courseId: string
├── courseName: string
├── userName: string
├── issuedAt: timestamp
├── credentialId: string (unique)
└── verificationUrl: string
```

---

## 🔌 API Routes Structure

```
/api/
├── courses/
│   ├── GET /api/courses              # List courses
│   ├── POST /api/courses              # Create course
│   ├── GET /api/courses/[id]         # Get course
│   ├── PUT /api/courses/[id]         # Update course
│   └── DELETE /api/courses/[id]      # Delete course
│
├── modules/
│   ├── GET /api/courses/[id]/modules # Get course modules
│   ├── POST /api/modules             # Create module
│   └── PUT /api/modules/[id]         # Update module
│
├── lessons/
│   ├── GET /api/lessons/[id]        # Get lesson
│   ├── PUT /api/lessons/[id]        # Update lesson
│   └── POST /api/lessons/[id]/complete # Mark complete
│
├── enrollments/
│   ├── POST /api/enroll              # Enroll in course
│   ├── GET /api/enrollments          # Get user enrollments
│   └── PUT /api/enrollments/[id]    # Update enrollment
│
├── progress/
│   ├── GET /api/progress/[courseId]  # Get course progress
│   └── PUT /api/progress/[lessonId]  # Update lesson progress
│
├── quizzes/
│   ├── POST /api/quizzes/submit      # Submit quiz attempt
│   └── GET /api/quizzes/[id]/attempts # Get quiz attempts
│
├── analytics/
│   └── GET /api/analytics/course/[id] # Get course analytics
│
└── certificates/
    ├── POST /api/certificates/generate # Generate certificate
    └── GET /api/certificates/verify/[id] # Verify certificate
```

---

## 🎨 Editor.js Configuration

### Tools Available

**Standard Tools:**
- Header (H1-H6)
- Paragraph
- List (ordered/unordered)
- Nested List
- Checklist
- Quote
- Code Block
- Table
- Delimiter
- Image (with upload)
- Link Tool (with preview)
- Embed (YouTube, Twitter, etc.)
- Warning
- Attaches (file download)
- Marker (highlight)
- Inline Code

**Smart Blocks (Custom):**
- **Quiz** - Interactive quizzes with multiple question types
- **Vocabulary** - Word lists with flashcards
- **Dialogue** - Interactive conversations
- **Reveal** - Hidden content reveal
- **Callout** - Info/Tip/Warning blocks

### Usage Example

```tsx
import Editor from '@/components/editor/Editor';

<Editor
  data={initialContent}
  onChange={(data) => saveContent(data)}
  config={{
    placeholder: 'Start writing...',
    autosave: {
      enabled: true,
      interval: 30000, // 30 seconds
    },
  }}
/>
```

---

## 🎮 Smart Blocks

### 1. Quiz Block

```tsx
{
  type: 'quiz',
  data: {
    title: 'Lesson Quiz',
    description: 'Test your knowledge',
    questions: [
      {
        id: 'q1',
        type: 'multipleChoice',
        question: 'What is...?',
        options: [
          { id: 'a', text: 'Option A', isCorrect: true },
          { id: 'b', text: 'Option B', isCorrect: false }
        ],
        correctAnswer: 'a',
        explanation: 'Because...',
        points: 10
      }
    ],
    xpReward: 50,
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 10 // minutes
  }
}
```

### 2. Vocabulary Block

```tsx
{
  type: 'vocabulary',
  data: {
    title: 'Key Words',
    words: [
      {
        id: 'w1',
        word: 'Labas',
        transliteration: 'Labas',
        translation: 'Hello/Good',
        arabic: 'لبيس',
        audioUrl: '...'
      }
    ],
    displayMode: 'flashcard'
  }
}
```

### 3. Dialogue Block

```tsx
{
  type: 'dialogue',
  data: {
    title: 'At the Shop',
    speakers: [
      { id: 's1', name: 'Seller', color: '#3B82F6' },
      { id: 's2', name: 'Customer', color: '#10B981' }
    ],
    lines: [
      {
        id: 'l1',
        speakerId: 's1',
        text: 'Labas, bslash?',
        translation: 'Hello, how are you?'
      }
    ],
    settings: {
      showTranslation: true,
      enableSlowPlayback: true
    }
  }
}
```

### 4. Reveal Block

```tsx
{
  type: 'reveal',
  data: {
    title: 'Answer',
    revealType: 'click', // or 'timer', 'scroll', 'completion'
    timerSeconds: 5,
    buttonText: 'Show Answer',
    hint: 'Think about...'
  }
}
```

### 5. Callout Block

```tsx
{
  type: 'callout',
  data: {
    type: 'tip', // 'info', 'tip', 'warning', 'success', 'error', 'cultural'
    title: 'Pro Tip',
    message: 'This is helpful information'
  }
}
```

---

## 🔐 Role-Based Access

### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access, manage users, view analytics |
| **Instructor** | Create/edit courses, view own course analytics |
| **Student** | Enroll, learn, track progress |

### Access Control Functions

```typescript
// lib/lms.ts
import { canEditCourse, isAdmin, canAccessLesson } from '@/lib/lms';

// Check permissions
canEditCourse(userRole); // true for admin/instructor
isAdmin(userRole);      // true for admin only

// Check lesson access
const canAccess = await canAccessLesson(userId, lesson);
```

---

## 🏆 Gamification System

### XP Sources

| Action | XP Reward |
|--------|-----------|
| Complete Lesson | 10-50 XP |
| Pass Quiz | 20-100 XP |
| Perfect Quiz Score | 1.5x multiplier |
| Complete Course | 500 XP |
| Daily Login | 5 XP |

### Level Calculation

```typescript
function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  while (xpRequired <= totalXP) {
    xpRequired += level * 1000;
    level++;
  }
  return level - 1;
}
```

---

## 📊 Analytics

### Tracked Metrics

**User Analytics:**
- Total time spent
- Lessons completed
- Quizzes taken
- Average score
- Streak (current & longest)
- Engagement score

**Course Analytics:**
- Total enrollments
- Active students
- Completion rate
- Average progress
- Average time spent
- Drop-off points
- Quiz performance

---

## 🚀 Performance Optimizations

1. **Lazy Loading** - Smart blocks load on demand
2. **Caching** - Course structure cached client-side
3. **Query Optimization** - Firestore indexes configured
4. **Pagination** - Large lists paginated
5. **Image Compression** - Uploaded images optimized
6. **Code Splitting** - Dynamic imports for editors

---

## 🔮 Future-Ready Architecture

The system is designed to support:

- [ ] AI Lesson Assistant (content generation)
- [ ] Adaptive Learning Paths
- [ ] Live Classes (WebRTC integration)
- [ ] Instructor Marketplace
- [ ] Subscription System
- [ ] Collaborative Editing
- [ ] Course Export to PDF
- [ ] Version History
- [ ] Multi-language Support

---

## 📦 Example: Creating a Full Course

### 1. Create Course

```typescript
const course = await createCourse({
  title: 'Introduction to Moroccan Darija',
  slug: 'intro-moroccan-darija',
  description: 'Learn the basics of Moroccan Arabic...',
  difficulty: 'beginner',
  category: 'Language',
  estimatedDuration: 120,
  isFree: true,
  certificateEnabled: true,
  isPublished: true,
}, userId);
```

### 2. Add Modules

```typescript
const module1 = await createModule({
  courseId: course.id,
  title: 'Greetings & Basics',
  order: 0,
  isLocked: false,
});
```

### 3. Add Lessons with Content

```typescript
const lesson = await createLesson({
  moduleId: module1.id,
  courseId: course.id,
  title: 'Common Greetings',
  description: 'Learn essential greeting phrases',
  content: {
    time: Date.now(),
    version: '2.0',
    blocks: [
      {
        type: 'header',
        data: { text: 'Greetings in Darija', level: 2 }
      },
      {
        type: 'vocabulary',
        data: {
          title: 'Key Words',
          words: [
            { word: 'Labas', transliteration: 'Labas', translation: 'Hello' }
          ]
        }
      },
      {
        type: 'quiz',
        data: {
          title: 'Quiz',
          questions: [...],
          xpReward: 20,
          passingScore: 70
        }
      }
    ]
  },
  duration: 15,
  xpReward: 30,
  isFree: true,
});
```

### 4. Student Enrollment

```typescript
const enrollment = await enrollInCourse(userId, course.id);
```

---

## 🎯 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create Firebase project
   - Add Firestore rules
   - Set up environment variables

3. **Use components:**
   ```tsx
   import { CourseBuilder } from '@/components/lms/admin';
   import { StudentDashboard } from '@/components/lms/student';
   import { ContentRenderer } from '@/components/lms';
   ```

4. **Use LMS library:**
   ```typescript
   import { 
     createCourse, 
     enrollInCourse, 
     completeLesson 
   } from '@/lib/lms';
   ```

---

## 📄 License

This LMS architecture is provided as-is for educational and commercial use.
