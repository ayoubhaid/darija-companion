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
    return lessonsData as unknown as Lesson[];
  }
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const lessonsRef = collection(db, collections.lessons);
    const snapshot = await getDocs(lessonsRef);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return lessonsData as unknown as Lesson[];
  }
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  if (USE_MOCK_DATA) {
    const lesson = (lessonsData as unknown as Lesson[]).find(l => l.id === id);
    return lesson || null;
  }
  
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const lessonRef = doc(db, collections.lessons, id);
    const snapshot = await getDoc(lessonRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Lesson;
    }
    return null;
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    const lesson = (lessonsData as unknown as Lesson[]).find(l => l.id === id);
    return lesson || null;
  }
};

export const getLessonsByDifficulty = async (difficulty: string): Promise<Lesson[]> => {
  if (USE_MOCK_DATA) {
    return (lessonsData as unknown as Lesson[]).filter(l => l.difficulty === difficulty);
  }
  
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const lessonsRef = collection(db, collections.lessons);
    const q = query(lessonsRef, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Lesson));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (lessonsData as unknown as Lesson[]).filter(l => l.difficulty === difficulty);
  }
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  if (USE_MOCK_DATA) {
    return quizzesData as unknown as Quiz[];
  }
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const quizzesRef = collection(db, collections.quizzes);
    const snapshot = await getDocs(quizzesRef);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return quizzesData as unknown as Quiz[];
  }
};

export const getQuizById = async (id: string): Promise<Quiz | null> => {
  if (USE_MOCK_DATA) {
    const quiz = (quizzesData as unknown as Quiz[]).find(q => q.id === id);
    return quiz || null;
  }
  
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const quizRef = doc(db, collections.quizzes, id);
    const snapshot = await getDoc(quizRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Quiz;
    }
    return null;
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    const quiz = (quizzesData as unknown as Quiz[]).find(q => q.id === id);
    return quiz || null;
  }
};

export const getQuizzesByDifficulty = async (difficulty: string): Promise<Quiz[]> => {
  if (USE_MOCK_DATA) {
    return (quizzesData as unknown as Quiz[]).filter(q => q.difficulty === difficulty);
  }
  
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const quizzesRef = collection(db, collections.quizzes);
    const q = query(quizzesRef, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (quizzesData as unknown as Quiz[]).filter(q => q.difficulty === difficulty);
  }
};

export const getAllVocabulary = async (): Promise<VocabularyItem[]> => {
  if (USE_MOCK_DATA) {
    return vocabularyData as unknown as VocabularyItem[];
  }
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const vocabRef = collection(db, collections.vocabulary);
    const snapshot = await getDocs(vocabRef);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as VocabularyItem));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return vocabularyData as unknown as VocabularyItem[];
  }
};

export const getVocabularyByCategory = async (category: string): Promise<VocabularyItem[]> => {
  if (USE_MOCK_DATA) {
    return (vocabularyData as unknown as VocabularyItem[]).filter(v => v.category === category);
  }
  
  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const vocabRef = collection(db, collections.vocabulary);
    const q = query(vocabRef, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as VocabularyItem));
  } catch (error) {
    console.warn('Firebase error, falling back to mock data:', error);
    return (vocabularyData as unknown as VocabularyItem[]).filter(v => v.category === category);
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (USE_MOCK_DATA) {
    return null;
  }
  
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
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
  
  const { doc, setDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
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
    skillLevel: 1,
    accuracyRate: 0,
    quizzesCompleted: 0,
    lessonsCompleted: 0,
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
  
  const { doc, updateDoc, increment } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
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
  
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
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

// ============ ADMIN FUNCTIONS ============

// LESSONS
export const createLesson = async (lesson: Omit<Lesson, 'id'>, userId: string, userName: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot create lessons in mock data mode');
  }
  
  const { doc, setDoc, serverTimestamp, collection } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const lessonRef = doc(collection(db, collections.lessons));
  
  const lessonData = {
    ...lesson,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId,
    updatedBy: userId,
  };
  
  await setDoc(lessonRef, lessonData);
  
  // Create audit log
  await createAuditLog('create', 'lessons', lessonRef.id, lesson.title, userId, userName);
  
  return lessonRef.id;
};

export const updateLesson = async (id: string, lesson: Partial<Lesson>, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot update lessons in mock data mode');
  }
  
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const lessonRef = doc(db, collections.lessons, id);
  
  const updates = {
    ...lesson,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  };
  
  await updateDoc(lessonRef, updates);
  
  // Create audit log
  await createAuditLog('update', 'lessons', id, lesson.title || id, userId, userName);
};

export const deleteLesson = async (id: string, title: string, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot delete lessons in mock data mode');
  }
  
  const { deleteDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const { doc: docFn } = await import('firebase/firestore');
  const lessonRef = docFn(db, collections.lessons, id);
  
  await deleteDoc(lessonRef);
  
  // Create audit log
  await createAuditLog('delete', 'lessons', id, title, userId, userName);
};

// VOCABULARY
export const createVocabulary = async (vocab: Omit<VocabularyItem, 'id'>, userId: string, userName: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot create vocabulary in mock data mode');
  }
  
  const { doc, setDoc, serverTimestamp, collection } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const vocabRef = doc(collection(db, collections.vocabulary));
  
  const vocabData = {
    ...vocab,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId,
    updatedBy: userId,
  };
  
  await setDoc(vocabRef, vocabData);
  
  await createAuditLog('create', 'vocabulary', vocabRef.id, vocab.word, userId, userName);
  
  return vocabRef.id;
};

export const updateVocabulary = async (id: string, vocab: Partial<VocabularyItem>, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot update vocabulary in mock data mode');
  }
  
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const vocabRef = doc(db, collections.vocabulary, id);
  
  const updates = {
    ...vocab,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  };
  
  await updateDoc(vocabRef, updates);
  
  await createAuditLog('update', 'vocabulary', id, vocab.word || id, userId, userName);
};

export const deleteVocabulary = async (id: string, word: string, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot delete vocabulary in mock data mode');
  }
  
  const { deleteDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const { doc: docFn } = await import('firebase/firestore');
  const vocabRef = docFn(db, collections.vocabulary, id);
  
  await deleteDoc(vocabRef);
  
  await createAuditLog('delete', 'vocabulary', id, word, userId, userName);
};

export const bulkCreateVocabulary = async (vocabList: Omit<VocabularyItem, 'id'>[], userId: string, userName: string): Promise<number> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot bulk create vocabulary in mock data mode');
  }
  
  const { doc, setDoc, serverTimestamp, collection } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  
  let count = 0;
  for (const vocab of vocabList) {
    const vocabRef = doc(collection(db, collections.vocabulary));
    await setDoc(vocabRef, {
      ...vocab,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      updatedBy: userId,
    });
    count++;
  }
  
  await createAuditLog('create', 'vocabulary', 'bulk', `${count} vocabulary words`, userId, userName);
  
  return count;
};

// QUIZZES
export const createQuiz = async (quiz: Omit<Quiz, 'id'>, userId: string, userName: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot create quizzes in mock data mode');
  }
  
  const { doc, setDoc, serverTimestamp, collection } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const quizRef = doc(collection(db, collections.quizzes));
  
  const quizData = {
    ...quiz,
    totalQuestions: quiz.questions?.length || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId,
    updatedBy: userId,
  };
  
  await setDoc(quizRef, quizData);
  
  await createAuditLog('create', 'quizzes', quizRef.id, quiz.title, userId, userName);
  
  return quizRef.id;
};

export const updateQuiz = async (id: string, quiz: Partial<Quiz>, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot update quizzes in mock data mode');
  }
  
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const quizRef = doc(db, collections.quizzes, id);
  
  const updates = {
    ...quiz,
    totalQuestions: quiz.questions?.length,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  };
  
  await updateDoc(quizRef, updates);
  
  await createAuditLog('update', 'quizzes', id, quiz.title || id, userId, userName);
};

export const deleteQuiz = async (id: string, title: string, userId: string, userName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot delete quizzes in mock data mode');
  }
  
  const { deleteDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const { doc: docFn } = await import('firebase/firestore');
  const quizRef = docFn(db, collections.quizzes, id);
  
  await deleteDoc(quizRef);
  
  await createAuditLog('delete', 'quizzes', id, title, userId, userName);
};

// USERS
export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (USE_MOCK_DATA) {
    return [];
  }
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const usersRef = collection(db, collections.users);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.warn('Firebase error:', error);
    return [];
  }
};

export const setUserAdminStatus = async (userId: string, isAdmin: boolean, adminUserId: string, adminUserName: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    throw new Error('Cannot update user admin status in mock data mode');
  }
  
  const { doc, updateDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');
  const userRef = doc(db, collections.users, userId);
  
  await updateDoc(userRef, { isAdmin });
  
  await createAuditLog('update', 'users', userId, `Set admin to ${isAdmin}`, adminUserId, adminUserName);
};

// AUDIT LOG
export const createAuditLog = async (
  action: 'create' | 'update' | 'delete',
  collection: 'lessons' | 'vocabulary' | 'quizzes' | 'users',
  documentId: string,
  documentTitle: string,
  userId: string,
  userName: string
): Promise<void> => {
  if (USE_MOCK_DATA) {
    return;
  }
  
  try {
    const { collection: coll, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const auditRef = coll(db, 'auditLogs');
    
    await addDoc(auditRef, {
      action,
      collection,
      documentId,
      documentTitle,
      userId,
      userName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Error creating audit log:', error);
  }
};

// STATS
export const getStats = async (): Promise<{ totalLessons: number; totalVocabulary: number; totalQuizzes: number; totalUsers: number }> => {
  if (USE_MOCK_DATA) {
    return {
      totalLessons: lessonsData.length,
      totalVocabulary: vocabularyData.length,
      totalQuizzes: quizzesData.length,
      totalUsers: 0,
    };
  }
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    const [lessonsSnap, vocabSnap, quizzesSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, collections.lessons)),
      getDocs(collection(db, collections.vocabulary)),
      getDocs(collection(db, collections.quizzes)),
      getDocs(collection(db, collections.users)),
    ]);
    
    return {
      totalLessons: lessonsSnap.size,
      totalVocabulary: vocabSnap.size,
      totalQuizzes: quizzesSnap.size,
      totalUsers: usersSnap.size,
    };
  } catch (error) {
    console.warn('Error getting stats:', error);
    return { totalLessons: 0, totalVocabulary: 0, totalQuizzes: 0, totalUsers: 0 };
  }
};
