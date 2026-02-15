import { VocabularyItem, UserVocabularyProgress, SpacedRepetitionSession, SpacedRepetitionQuestion, AnswerResult, SessionResult, UserProfile } from '@/types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const SESSION_SIZE = 15;
const DUE_REVIEW_PERCENTAGE = 0.4;
const WEAK_WORDS_PERCENTAGE = 0.3;
const NEW_WORDS_PERCENTAGE = 0.3;

const BASE_XP = 10;
const SPEED_BONUS_XP = 2;
const SPEED_BONUS_THRESHOLD = 3000;
const STREAK_3_DAYS_MULTIPLIER = 1.2;
const STREAK_7_DAYS_MULTIPLIER = 1.5;
const SKILL_LEVEL_ACCURACY_THRESHOLD = 85;

export function calculateSM2(
  isCorrect: boolean,
  quality: number,
  currentEaseFactor: number,
  currentRepetitions: number,
  currentInterval: number
): { easeFactor: number; interval: number; repetitions: number } {
  let easeFactor = currentEaseFactor;
  let interval = currentInterval;
  let repetitions = currentRepetitions;

  if (isCorrect) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(currentInterval * easeFactor);
    }
    
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(easeFactor, 1.3);
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  return { easeFactor, interval, repetitions };
}

export function calculateXP(
  isCorrect: boolean,
  timeTaken: number,
  streakDays: number
): number {
  if (!isCorrect) return 0;

  let xp = BASE_XP;

  if (timeTaken < SPEED_BONUS_THRESHOLD) {
    xp += SPEED_BONUS_XP;
  }

  let multiplier = 1;
  if (streakDays >= 7) {
    multiplier = STREAK_7_DAYS_MULTIPLIER;
  } else if (streakDays >= 3) {
    multiplier = STREAK_3_DAYS_MULTIPLIER;
  }

  return Math.round(xp * multiplier);
}

export function calculateNextReviewDate(intervalDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date;
}

export function getShuffledArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSession(
  vocabulary: VocabularyItem[],
  userProgress: UserVocabularyProgress[],
  skillLevel: number
): SpacedRepetitionSession {
  const now = new Date();
  
  const dueWords = userProgress.filter(p => {
    const nextReview = new Date(p.nextReviewDate);
    return nextReview <= now;
  });
  
  const weakWords = userProgress.filter(p => p.successRate < 70 && p.successRate > 0);
  
  const learnedWordIds = new Set(userProgress.map(p => p.wordId));
  const newWords = vocabulary.filter(v => !learnedWordIds.has(v.id));
  
  const dueCount = Math.round(SESSION_SIZE * DUE_REVIEW_PERCENTAGE);
  const weakCount = Math.round(SESSION_SIZE * WEAK_WORDS_PERCENTAGE);
  const newCount = SESSION_SIZE - dueCount - weakCount;
  
  const shuffledDue = getShuffledArray(dueWords).slice(0, dueCount);
  const shuffledWeak = getShuffledArray(weakWords).slice(0, weakCount);
  const shuffledNew = getShuffledArray(newWords).slice(0, Math.min(newCount, newWords.length));
  
  const allWordIds = [
    ...shuffledDue.map(p => p.wordId),
    ...shuffledWeak.map(p => p.wordId),
    ...shuffledNew.map(v => v.id)
  ];
  
  const remainingSlots = SESSION_SIZE - allWordIds.length;
  if (remainingSlots > 0) {
    const additionalNew = shuffledNew.slice(0);
    while (additionalNew.length < remainingSlots && newWords.length > allWordIds.length) {
      const extra = newWords.find(v => !allWordIds.includes(v.id));
      if (extra) {
        allWordIds.push(extra.id);
      }
      break;
    }
  }
  
  const vocabularyMap = new Map(vocabulary.map(v => [v.id, v]));
  const sessionType: 'review' | 'practice' | 'mixed' = 
    shuffledDue.length > SESSION_SIZE * 0.5 ? 'review' :
    shuffledNew.length > SESSION_SIZE * 0.5 ? 'practice' : 'mixed';
  
  const questionsRaw = getShuffledArray(allWordIds)
    .slice(0, SESSION_SIZE)
    .map((wordId, index) => {
      const vocab = vocabularyMap.get(wordId);
      if (!vocab) return null;

      const questionType: 'translation' | 'multipleChoice' = 
        Math.random() > 0.5 ? 'multipleChoice' : 'translation';

      let options: string[] | undefined;
      if (questionType === 'multipleChoice') {
        const otherTranslations = vocabulary
          .filter(v => v.id !== wordId)
          .map(v => v.translation);
        options = getShuffledArray(otherTranslations).slice(0, 3);
        options.push(vocab.translation);
        options = getShuffledArray(options);
      }

      return {
        id: `q-${index}`,
        wordId: vocab.id,
        word: vocab.word,
        translation: vocab.translation,
        transliteration: vocab.transliteration,
        arabic: vocab.arabic,
        category: vocab.category,
        questionType,
        options,
        correctAnswer: vocab.translation
      } as SpacedRepetitionQuestion;
    })
    .filter((q): q is SpacedRepetitionQuestion => q !== null);

  const questions: SpacedRepetitionQuestion[] = questionsRaw;

  return {
    questions,
    sessionType,
    totalQuestions: questions.length
  };
}

export async function processAnswer(
  userId: string,
  wordId: string,
  isCorrect: boolean,
  timeTaken: number,
  userProfile: UserProfile,
  existingProgress: UserVocabularyProgress | null
): Promise<AnswerResult> {
  const quality = isCorrect ? 4 : 1;
  
  const currentEaseFactor = existingProgress?.easeFactor || 2.5;
  const currentRepetitions = existingProgress?.repetitions || 0;
  const currentInterval = existingProgress?.intervalDays || 1;

  const { easeFactor, interval, repetitions } = calculateSM2(
    isCorrect,
    quality,
    currentEaseFactor,
    currentRepetitions,
    currentInterval
  );

  const xpEarned = calculateXP(isCorrect, timeTaken, userProfile.streak);
  const nextReviewDate = calculateNextReviewDate(interval);

  const totalAttempts = (existingProgress?.totalAttempts || 0) + 1;
  const successfulAttempts = (existingProgress?.successfulAttempts || 0) + (isCorrect ? 1 : 0);
  const successRate = (successfulAttempts / totalAttempts) * 100;

  return {
    wordId,
    correct: isCorrect,
    timeTaken,
    xpEarned,
    newEaseFactor: easeFactor,
    newInterval: interval,
    newRepetitions: repetitions,
    nextReviewDate: nextReviewDate.toISOString()
  };
}

export function calculateSessionResult(
  answers: AnswerResult[],
  userProfile: UserProfile,
  sessionType: string
): SessionResult {
  const correctAnswers = answers.filter(a => a.correct).length;
  const totalQuestions = answers.length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const totalXpEarned = answers.reduce((sum, a) => sum + a.xpEarned, 0);
  
  let skillLevelChange = 0;
  if (accuracy > SKILL_LEVEL_ACCURACY_THRESHOLD) {
    skillLevelChange = 1;
  } else if (accuracy < 50) {
    skillLevelChange = -1;
  }

  return {
    totalQuestions,
    correctAnswers,
    accuracy,
    totalXpEarned,
    sessionType,
    answers,
    skillLevelChange
  };
}

export async function getUserVocabularyProgress(userId: string): Promise<UserVocabularyProgress[]> {
  if (USE_MOCK_DATA) {
    return [];
  }

  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const progressRef = collection(db, 'userVocabularyProgress');
    const q = query(progressRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as UserVocabularyProgress[];
  } catch (error) {
    console.error('Error fetching user vocabulary progress:', error);
    return [];
  }
}

export async function updateUserVocabularyProgress(
  userId: string,
  wordId: string,
  result: AnswerResult,
  totalAttempts: number,
  successfulAttempts: number
): Promise<void> {
  if (USE_MOCK_DATA) {
    return;
  }

  try {
    const { doc, setDoc, collection } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const progressRef = doc(collection(db, 'userVocabularyProgress'), `${userId}_${wordId}`);
    
    await setDoc(progressRef, {
      userId,
      wordId,
      easeFactor: result.newEaseFactor,
      intervalDays: result.newInterval,
      repetitions: result.newRepetitions,
      nextReviewDate: result.nextReviewDate,
      successRate: (successfulAttempts / totalAttempts) * 100,
      totalAttempts,
      successfulAttempts,
      lastReviewed: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating vocabulary progress:', error);
  }
}

export async function updateUserAfterSession(
  userId: string,
  result: SessionResult,
  currentProfile: UserProfile
): Promise<UserProfile> {
  if (USE_MOCK_DATA) {
    return {
      ...currentProfile,
      xp: currentProfile.xp + result.totalXpEarned,
      skillLevel: Math.max(1, currentProfile.skillLevel + result.skillLevelChange)
    };
  }

  try {
    const { doc, updateDoc, increment } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    const userRef = doc(db, 'users', userId);

    const updates: Record<string, unknown> = {
      xp: increment(result.totalXpEarned),
      totalXP: increment(result.totalXpEarned),
      lastActive: new Date().toISOString()
    };

    if (result.skillLevelChange !== 0) {
      updates.skillLevel = Math.max(1, currentProfile.skillLevel + result.skillLevelChange);
    }

    await updateDoc(userRef, updates);

    return {
      ...currentProfile,
      xp: currentProfile.xp + result.totalXpEarned,
      skillLevel: Math.max(1, currentProfile.skillLevel + result.skillLevelChange)
    };
  } catch (error) {
    console.error('Error updating user after session:', error);
    return currentProfile;
  }
}
