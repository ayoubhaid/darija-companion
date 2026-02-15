import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Lesson, Quiz, VocabularyItem, UserProfile } from '@/types';

import lessonsData from '@/data/lessons.json';
import vocabularyData from '@/data/vocabulary.json';
import quizzesData from '@/data/quizzes.json';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const collections = {
  lessons: 'lessons',
  quizzes: 'quizzes',
  vocabulary: 'vocabulary',
  users: 'users',
  progress: 'progress',
};

export const getAllLessons = async (): Promise<Lesson[]> => {
  if (USE_MOCK_DATA) {
    return lessonsData as Lesson[];
  }
  
  try {
    const lessonsRef = collection(db, collections.lessons);
    const snapshot = await getDocs(lessonsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return lessonsData as Lesson[];
  }
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  if (USE_MOCK_DATA) {
    const lesson = (lessonsData as Lesson[]).find(l => l.id === id);
    return lesson || null;
  }
  
  try {
    const lessonRef = doc(db, collections.lessons, id);
    const snapshot = await getDoc(lessonRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Lesson;
    }
    return null;
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    const lesson = (lessonsData as Lesson[]).find(l => l.id === id);
    return lesson || null;
  }
};

export const getLessonsByDifficulty = async (difficulty: string): Promise<Lesson[]> => {
  if (USE_MOCK_DATA) {
    return (lessonsData as Lesson[]).filter(l => l.difficulty === difficulty);
  }
  
  try {
    const lessonsRef = collection(db, collections.lessons);
    const q = query(lessonsRef, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (lessonsData as Lesson[]).filter(l => l.difficulty === difficulty);
  }
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  if (USE_MOCK_DATA) {
    return quizzesData as Quiz[];
  }
  
  try {
    const quizzesRef = collection(db, collections.quizzes);
    const snapshot = await getDocs(quizzesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return quizzesData as Quiz[];
  }
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  if (USE_MOCK_DATA) {
    const quiz = (quizzesData as Quiz[]).find(q => q.id === id);
    return quiz || null;
  }
  
  try {
    const quizRef = doc(db, collections.quizzes, id);
    const snapshot = await getDoc(quizRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Quiz;
    }
    return null;
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    const quiz = (quizzesData as Quiz[]).find(q => q.id === id);
    return quiz || null;
  }
};

export const getQuizzesByDifficulty = async (difficulty: string): Promise<Quiz[]> => {
  if (USE_MOCK_DATA) {
    return (quizzesData as Quiz[]).filter(q => q.difficulty === difficulty);
  }
  
  try {
    const quizzesRef = collection(db, collections.quizzes);
    const q = query(quizzesRef, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (quizzesData as Quiz[]).filter(q => q.difficulty === difficulty);
  }
};

export const getAllVocabulary = async (): Promise<VocabularyItem[]> => {
  if (USE_MOCK_DATA) {
    return vocabularyData as VocabularyItem[];
  }
  
  try {
    const vocabRef = collection(db, collections.vocabulary);
    const snapshot = await getDocs(vocabRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as VocabularyItem));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return vocabularyData as VocabularyItem[];
  }
};

export const getVocabularyByCategory = async (category: string): Promise<VocabularyItem[]> => {
  if (USE_MOCK_DATA) {
    return (vocabularyData as VocabularyItem[]).filter(v => v.category === category);
  }
  
  try {
    const vocabRef = collection(db, collections.vocabulary);
    const q = query(vocabRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as VocabularyItem));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (vocabularyData as VocabularyItem[]).filter(v => v.category === category);
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (USE_MOCK_DATA) {
    return null;
  }
  
  try {
    const userRef = doc(db, collections.users, userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Firebase error:', error);
    return null;
  }
};

export const createUserProfile = async (
  userId: string,
  email: string,
  displayName: string
): Promise<void> => {
  if (USE_MOCK_DATA) {
    return;
  }
  
  const userRef = doc(db, collections.users, userId);
  const initialProfile: Omit<UserProfile, 'id'> = {
    email,
    displayName,
    xp: 0,
    level: 1,
    streak: 0,
    completedLessons: [],
    completedQuizzes: [],
    vocabularyLearned: 0,
    totalXP: 0,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    preferences: {
      showTransliteration: true,
      showArabic: true,
      darkMode: false,
      notifications: true,
    },
  };
  await setDoc(userRef, initialProfile);
};

export const updateUserProgress = async (
  userId: string,
  lessonId?: string,
  quizId?: string,
  xpEarned?: number
): Promise<void> => {
  if (USE_MOCK_DATA) {
    return;
  }
  
  const userRef = doc(db, collections.users, userId);
  const updates: Record<string, unknown> = {
    lastActive: new Date().toISOString(),
  };

  if (lessonId) {
    updates.completedLessons = [lessonId];
  }
  if (quizId) {
    updates.completedQuizzes = [quizId];
  }
  if (xpEarned) {
    updates.xp = increment(xpEarned);
    updates.totalXP = increment(xpEarned);
  }

  await updateDoc(userRef, updates);
};

export const recordQuizResult = async (
  userId: string,
  quizId: string,
  score: number,
  totalPoints: number,
  timeTaken: number
): Promise<void> => {
  if (USE_MOCK_DATA) {
    return;
  }
  
  const resultsRef = collection(db, collections.users, userId, 'quizResults');
  await addDoc(resultsRef, {
    quizId,
    score,
    totalPoints,
    timeTaken,
    completedAt: serverTimestamp(),
  });
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};
