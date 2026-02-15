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
import { Lesson, Quiz, Vocabulary, UserProfile } from '@/types';

const collections = {
  lessons: 'lessons',
  quizzes: 'quizzes',
  vocabulary: 'vocabulary',
  users: 'users',
  progress: 'progress',
};

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessonsRef = collection(db, collections.lessons);
  const snapshot = await getDocs(lessonsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  const lessonRef = doc(db, collections.lessons, id);
  const snapshot = await getDoc(lessonRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Lesson;
  }
  return null;
};

export const getLessonsByDifficulty = async (
  difficulty: string
): Promise<Lesson[]> => {
  const lessonsRef = collection(db, collections.lessons);
  const q = query(lessonsRef, where('difficulty', '==', difficulty));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const quizzesRef = collection(db, collections.quizzes);
  const snapshot = await getDocs(quizzesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz));
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  const quizRef = doc(db, collections.quizzes, id);
  const snapshot = await getDoc(quizRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Quiz;
  }
  return null;
};

export const getQuizzesByDifficulty = async (
  difficulty: string
): Promise<Quiz[]> => {
  const quizzesRef = collection(db, collections.quizzes);
  const q = query(quizzesRef, where('difficulty', '==', difficulty));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz));
};

export const getAllVocabulary = async (): Promise<Vocabulary[]> => {
  const vocabRef = collection(db, collections.vocabulary);
  const snapshot = await getDocs(vocabRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Vocabulary));
};

export const getVocabularyByCategory = async (
  category: string
): Promise<Vocabulary[]> => {
  const vocabRef = collection(db, collections.vocabulary);
  const q = query(vocabRef, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Vocabulary));
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, collections.users, userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as UserProfile;
  }
  return null;
};

export const createUserProfile = async (
  userId: string,
  email: string,
  displayName: string
): Promise<void> => {
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
