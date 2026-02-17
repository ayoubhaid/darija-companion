/**
 * LMS Firestore Library
 * Production-ready database operations for the Learning Management System
 * 
 * Features:
 * - Course, Module, Lesson CRUD operations
 * - Enrollment management
 * - Progress tracking
 * - Quiz attempts
 * - XP and Gamification
 * - Analytics
 * - Certificate generation
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Course,
  Module,
  Lesson,
  Enrollment,
  LessonProgress,
  CourseProgress,
  QuizAttempt,
  UserBlockInteraction,
  XPLog,
  Certificate,
  CourseAnalytics,
  UserAnalytics,
  CourseFilters,
  PaginatedResponse,
  LMSApiResponse,
  EditorJSContent,
  UserRole,
  EnrollmentStatus,
  XPSource,
} from '@/types/lms';
import { v4 as uuidv4 } from 'uuid';

// Collection names
const COLLECTIONS = {
  COURSES: 'courses',
  MODULES: 'modules',
  LESSONS: 'lessons',
  ENROLLMENTS: 'enrollments',
  LESSON_PROGRESS: 'lessonProgress',
  COURSE_PROGRESS: 'courseProgress',
  QUIZ_ATTEMPTS: 'quizAttempts',
  BLOCK_INTERACTIONS: 'blockInteractions',
  XP_LOGS: 'xpLogs',
  CERTIFICATES: 'certificates',
  USER_PROFILES: 'userProfiles',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert Firestore document to typed object
 */
function docToData<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    startedAt: data.startedAt?.toDate?.() || data.startedAt,
    completedAt: data.completedAt?.toDate?.() || data.completedAt,
    issuedAt: data.issuedAt?.toDate?.() || data.issuedAt,
    lastAccessedAt: data.lastAccessedAt?.toDate?.() || data.lastAccessedAt,
    timestamp: data.timestamp?.toDate?.() || data.timestamp,
  } as T;
}

/**
 * Create pagination cursor
 */
function createPaginationCursor(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
): QueryConstraint[] {
  if (!lastDoc) return [];
  return [startAfter(lastDoc)];
}

/**
 * Get collection reference
 */
function getCollection(name: string) {
  return collection(db, name);
}

function getDocRef(collectionName: string, id: string) {
  return doc(db, collectionName, id);
}

// ============================================
// COURSE OPERATIONS
// ============================================

/**
 * Create a new course
 */
export async function createCourse(
  courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string
): Promise<LMSApiResponse<Course>> {
  try {
    const course: Omit<Course, 'id'> = {
      ...courseData,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.COURSES), course);
    return {
      success: true,
      data: { ...course, id: docRef.id } as Course,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create course',
    };
  }
}

/**
 * Get course by ID
 */
export async function getCourse(courseId: string): Promise<LMSApiResponse<Course>> {
  try {
    const docSnap = await getDoc(getDocRef(COLLECTIONS.COURSES, courseId));
    if (!docSnap.exists()) {
      return { success: false, error: 'Course not found' };
    }
    return { success: true, data: docToData<Course>(docSnap) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get course',
    };
  }
}

/**
 * Get course by slug
 */
export async function getCourseBySlug(slug: string): Promise<LMSApiResponse<Course>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.COURSES),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'Course not found' };
    }
    return { success: true, data: docToData<Course>(snapshot.docs[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get course',
    };
  }
}

/**
 * Get all courses with filters and pagination
 */
export async function getCourses(
  filters: CourseFilters = {},
  page: number = 1,
  pageSize: number = 10,
  lastDocId?: string
): Promise<LMSApiResponse<PaginatedResponse<Course>>> {
  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.difficulty?.length) {
      constraints.push(where('difficulty', 'in', filters.difficulty));
    }
    if (filters.category?.length) {
      constraints.push(where('category', 'in', filters.category));
    }
    if (filters.isFree !== undefined) {
      constraints.push(where('isFree', '==', filters.isFree));
    }
    if (filters.isPublished !== undefined) {
      constraints.push(where('isPublished', '==', filters.isPublished));
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    constraints.push(orderBy(sortBy, sortOrder));

    // Pagination
    constraints.push(limit(pageSize));

    const q = query(getCollection(COLLECTIONS.COURSES), ...constraints);
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map(docToData<Course>);
    const hasMore = items.length === pageSize;

    return {
      success: true,
      data: {
        items,
        total: items.length,
        page,
        pageSize,
        hasMore,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get courses',
    };
  }
}

/**
 * Update course
 */
export async function updateCourse(
  courseId: string,
  updates: Partial<Course>
): Promise<LMSApiResponse<Course>> {
  try {
    const docRef = getDocRef(COLLECTIONS.COURSES, courseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    const updated = await getCourse(courseId);
    return updated;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update course',
    };
  }
}

/**
 * Delete course
 */
export async function deleteCourse(courseId: string): Promise<LMSApiResponse<void>> {
  try {
    await deleteDoc(getDocRef(COLLECTIONS.COURSES, courseId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete course',
    };
  }
}

/**
 * Get courses by category
 */
export async function getCoursesByCategory(
  category: string
): Promise<LMSApiResponse<Course[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.COURSES),
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Course>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get courses',
    };
  }
}

/**
 * Get featured courses
 */
export async function getFeaturedCourses(): Promise<LMSApiResponse<Course[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.COURSES),
      where('isFeatured', '==', true),
      where('isPublished', '==', true),
      limit(6)
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Course>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get featured courses',
    };
  }
}

// ============================================
// MODULE OPERATIONS
// ============================================

/**
 * Create module
 */
export async function createModule(
  moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LMSApiResponse<Module>> {
  try {
    const moduleDoc: Omit<Module, 'id'> = {
      ...moduleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(getCollection(COLLECTIONS.MODULES), moduleDoc);
    return { success: true, data: { ...moduleDoc, id: docRef.id } as Module };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create module',
    };
  }
}

/**
 * Get modules by course
 */
export async function getModulesByCourse(
  courseId: string
): Promise<LMSApiResponse<Module[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.MODULES),
      where('courseId', '==', courseId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Module>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get modules',
    };
  }
}

/**
 * Update module
 */
export async function updateModule(
  moduleId: string,
  updates: Partial<Module>
): Promise<LMSApiResponse<Module>> {
  try {
    const docRef = getDocRef(COLLECTIONS.MODULES, moduleId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    const docSnap = await getDoc(docRef);
    return { success: true, data: docToData<Module>(docSnap) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update module',
    };
  }
}

/**
 * Delete module
 */
export async function deleteModule(moduleId: string): Promise<LMSApiResponse<void>> {
  try {
    await deleteDoc(getDocRef(COLLECTIONS.MODULES, moduleId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete module',
    };
  }
}

/**
 * Reorder modules
 */
export async function reorderModules(
  moduleIds: string[]
): Promise<LMSApiResponse<void>> {
  try {
    const updates = moduleIds.map((id, index) =>
      updateDoc(getDocRef(COLLECTIONS.MODULES, id), { order: index })
    );
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder modules',
    };
  }
}

// ============================================
// LESSON OPERATIONS
// ============================================

/**
 * Create lesson
 */
export async function createLesson(
  lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LMSApiResponse<Lesson>> {
  try {
    const lesson: Omit<Lesson, 'id'> = {
      ...lessonData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(getCollection(COLLECTIONS.LESSONS), lesson);
    return { success: true, data: { ...lesson, id: docRef.id } as Lesson };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lesson',
    };
  }
}

/**
 * Get lesson by ID
 */
export async function getLesson(lessonId: string): Promise<LMSApiResponse<Lesson>> {
  try {
    const docSnap = await getDoc(getDocRef(COLLECTIONS.LESSONS, lessonId));
    if (!docSnap.exists()) {
      return { success: false, error: 'Lesson not found' };
    }
    return { success: true, data: docToData<Lesson>(docSnap) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lesson',
    };
  }
}

/**
 * Get lessons by module
 */
export async function getLessonsByModule(
  moduleId: string
): Promise<LMSApiResponse<Lesson[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.LESSONS),
      where('moduleId', '==', moduleId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Lesson>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lessons',
    };
  }
}

/**
 * Get all lessons for a course (flat structure)
 */
export async function getLessonsByCourse(
  courseId: string
): Promise<LMSApiResponse<Lesson[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.LESSONS),
      where('courseId', '==', courseId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Lesson>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lessons',
    };
  }
}

/**
 * Update lesson
 */
export async function updateLesson(
  lessonId: string,
  updates: Partial<Lesson>
): Promise<LMSApiResponse<Lesson>> {
  try {
    const docRef = getDocRef(COLLECTIONS.LESSONS, lessonId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    const updated = await getLesson(lessonId);
    return updated;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lesson',
    };
  }
}

/**
 * Delete lesson
 */
export async function deleteLesson(lessonId: string): Promise<LMSApiResponse<void>> {
  try {
    await deleteDoc(getDocRef(COLLECTIONS.LESSONS, lessonId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lesson',
    };
  }
}

/**
 * Get next lesson in course
 */
export async function getNextLesson(
  courseId: string,
  currentLessonId: string
): Promise<LMSApiResponse<Lesson | null>> {
  try {
    const lessons = await getLessonsByCourse(courseId);
    if (!lessons.success || !lessons.data) {
      return { success: false, error: 'Failed to get lessons' };
    }
    const currentIndex = lessons.data.findIndex(l => l.id === currentLessonId);
    if (currentIndex === -1 || currentIndex === lessons.data.length - 1) {
      return { success: true, data: null };
    }
    return { success: true, data: lessons.data[currentIndex + 1] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get next lesson',
    };
  }
}

/**
 * Get previous lesson in course
 */
export async function getPreviousLesson(
  courseId: string,
  currentLessonId: string
): Promise<LMSApiResponse<Lesson | null>> {
  try {
    const lessons = await getLessonsByCourse(courseId);
    if (!lessons.success || !lessons.data) {
      return { success: false, error: 'Failed to get lessons' };
    }
    const currentIndex = lessons.data.findIndex(l => l.id === currentLessonId);
    if (currentIndex <= 0) {
      return { success: true, data: null };
    }
    return { success: true, data: lessons.data[currentIndex - 1] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get previous lesson',
    };
  }
}

// ============================================
// ENROLLMENT OPERATIONS
// ============================================

/**
 * Enroll in course
 */
export async function enrollInCourse(
  userId: string,
  courseId: string,
  paymentId?: string
): Promise<LMSApiResponse<Enrollment>> {
  try {
    // Check if already enrolled
    const existingEnrollment = await getEnrollment(userId, courseId);
    if (existingEnrollment.success && existingEnrollment.data) {
      return { success: false, error: 'Already enrolled in this course' };
    }

    const enrollment: Omit<Enrollment, 'id'> = {
      userId,
      courseId,
      status: 'active',
      progress: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      paymentId,
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.ENROLLMENTS), enrollment);
    return { success: true, data: { ...enrollment, id: docRef.id } as Enrollment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enroll',
    };
  }
}

/**
 * Get user enrollment for a course
 */
export async function getEnrollment(
  userId: string,
  courseId: string
): Promise<LMSApiResponse<Enrollment | null>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.ENROLLMENTS),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: true, data: null };
    }
    return { success: true, data: docToData<Enrollment>(snapshot.docs[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get enrollment',
    };
  }
}

/**
 * Get user enrollments
 */
export async function getUserEnrollments(
  userId: string,
  status?: EnrollmentStatus
): Promise<LMSApiResponse<Enrollment[]>> {
  try {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    if (status) {
      constraints.push(where('status', '==', status));
    }
    constraints.push(orderBy('lastAccessedAt', 'desc'));

    const q = query(getCollection(COLLECTIONS.ENROLLMENTS), ...constraints);
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Enrollment>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get enrollments',
    };
  }
}

/**
 * Update enrollment progress
 */
export async function updateEnrollmentProgress(
  userId: string,
  courseId: string,
  progress: number,
  currentModuleId?: string,
  currentLessonId?: string
): Promise<LMSApiResponse<void>> {
  try {
    const enrollment = await getEnrollment(userId, courseId);
    if (!enrollment.success || !enrollment.data) {
      return { success: false, error: 'Enrollment not found' };
    }

    const docRef = getDocRef(COLLECTIONS.ENROLLMENTS, enrollment.data.id);
    await updateDoc(docRef, {
      progress,
      lastAccessedAt: serverTimestamp(),
      ...(currentModuleId && { currentModuleId }),
      ...(currentLessonId && { currentLessonId }),
      ...(progress >= 100 && { 
        status: 'completed',
        completedAt: serverTimestamp(),
      }),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress',
    };
  }
}

/**
 * Complete enrollment
 */
export async function completeEnrollment(
  userId: string,
  courseId: string
): Promise<LMSApiResponse<void>> {
  try {
    const enrollment = await getEnrollment(userId, courseId);
    if (!enrollment.success || !enrollment.data) {
      return { success: false, error: 'Enrollment not found' };
    }

    const docRef = getDocRef(COLLECTIONS.ENROLLMENTS, enrollment.data.id);
    await updateDoc(docRef, {
      status: 'completed',
      progress: 100,
      completedAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete enrollment',
    };
  }
}

// ============================================
// PROGRESS TRACKING
// ============================================

/**
 * Start lesson progress
 */
export async function startLessonProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  moduleId: string
): Promise<LMSApiResponse<LessonProgress>> {
  try {
    // Check if progress already exists
    const existing = await getLessonProgress(userId, lessonId);
    if (existing.success && existing.data) {
      return { success: true, data: existing.data };
    }

    const progress: Omit<LessonProgress, 'id'> = {
      userId,
      lessonId,
      courseId,
      moduleId,
      completed: false,
      progress: 0,
      timeSpent: 0,
      blocksCompleted: [],
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.LESSON_PROGRESS), progress);
    return { success: true, data: { ...progress, id: docRef.id } as LessonProgress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start progress',
    };
  }
}

/**
 * Get lesson progress
 */
export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LMSApiResponse<LessonProgress | null>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.LESSON_PROGRESS),
      where('userId', '==', userId),
      where('lessonId', '==', lessonId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: true, data: null };
    }
    return { success: true, data: docToData<LessonProgress>(snapshot.docs[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get progress',
    };
  }
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  updates: Partial<LessonProgress>
): Promise<LMSApiResponse<LessonProgress>> {
  try {
    const progress = await getLessonProgress(userId, lessonId);
    if (!progress.success || !progress.data) {
      return { success: false, error: 'Progress not found' };
    }

    const docRef = getDocRef(COLLECTIONS.LESSON_PROGRESS, progress.data.id);
    await updateDoc(docRef, {
      ...updates,
      lastAccessedAt: serverTimestamp(),
    });

    const updated = await getLessonProgress(userId, lessonId);
    return updated as LMSApiResponse<LessonProgress>;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update progress',
    };
  }
}

/**
 * Mark lesson as completed
 */
export async function completeLesson(
  userId: string,
  lessonId: string,
  courseId: string,
  moduleId: string,
  xpEarned: number
): Promise<LMSApiResponse<void>> {
  try {
    // Get lesson for XP reward
    const lesson = await getLesson(lessonId);
    if (!lesson.success || !lesson.data) {
      return { success: false, error: 'Lesson not found' };
    }

    // Start or get progress
    await startLessonProgress(userId, lessonId, courseId, moduleId);

    // Update progress to completed
    await updateLessonProgress(userId, lessonId, {
      completed: true,
      progress: 100,
      completedAt: new Date(),
    });

    // Log XP
    await logXP(userId, xpEarned || lesson.data.xpReward, 'lesson_complete', lessonId, 
      `Completed lesson: ${lesson.data.title}`);

    // Update course progress
    await updateCourseProgress(userId, courseId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete lesson',
    };
  }
}

/**
 * Get course progress
 */
export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<LMSApiResponse<CourseProgress | null>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.COURSE_PROGRESS),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: true, data: null };
    }
    return { success: true, data: docToData<CourseProgress>(snapshot.docs[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get course progress',
    };
  }
}

/**
 * Update course progress
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string
): Promise<LMSApiResponse<CourseProgress>> {
  try {
    const lessons = await getLessonsByCourse(courseId);
    if (!lessons.success || !lessons.data) {
      return { success: false, error: 'Failed to get lessons' };
    }

    const totalLessons = lessons.data.length;
    let completedLessons = 0;
    let totalXPEarned = 0;

    for (const lesson of lessons.data) {
      const progress = await getLessonProgress(userId, lesson.id);
      if (progress.success && progress.data?.completed) {
        completedLessons++;
        totalXPEarned += lesson.xpReward;
      }
    }

    const progressPercent = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    // Check if course progress exists
    const existingProgress = await getCourseProgress(userId, courseId);
    
    const progressData: Omit<CourseProgress, 'id'> = {
      userId,
      courseId,
      progress: progressPercent,
      lessonsCompleted: completedLessons,
      totalLessons,
      quizzesPassed: 0,
      totalQuizzes: 0,
      xpEarned: totalXPEarned,
      startedAt: existingProgress.data?.startedAt || new Date(),
      completedAt: progressPercent >= 100 ? new Date() : undefined,
      lastAccessedAt: new Date(),
    };

    if (existingProgress.success && existingProgress.data) {
      const docRef = getDocRef(COLLECTIONS.COURSE_PROGRESS, existingProgress.data.id);
      await updateDoc(docRef, progressData);
    } else {
      await addDoc(getCollection(COLLECTIONS.COURSE_PROGRESS), progressData);
    }

    // Update enrollment progress
    await updateEnrollmentProgress(userId, courseId, progressPercent);

    // Check if course completed
    if (progressPercent >= 100) {
      await completeEnrollment(userId, courseId);
      await logXP(userId, 500, 'course_complete', courseId, 'Course completed!');
    }

    return { success: true, data: { ...progressData, id: existingProgress.data?.id || '' } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update course progress',
    };
  }
}

// ============================================
// QUIZ OPERATIONS
// ============================================

/**
 * Submit quiz attempt
 */
export async function submitQuizAttempt(
  attemptData: Omit<QuizAttempt, 'id'>
): Promise<LMSApiResponse<QuizAttempt>> {
  try {
    const attempt: Omit<QuizAttempt, 'id'> = {
      ...attemptData,
      startedAt: attemptData.startedAt,
      completedAt: new Date(),
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.QUIZ_ATTEMPTS), attempt);
    const savedAttempt = { ...attempt, id: docRef.id };

    // Log XP if passed
    if (attempt.passed) {
      const xpAmount = attempt.percentage === 100 
        ? attemptData.xpEarned * 1.5 // Perfect score bonus
        : attemptData.xpEarned;
      
      await logXP(
        attemptData.userId,
        Math.round(xpAmount),
        attempt.percentage === 100 ? 'quiz_perfect' : 'quiz_pass',
        attemptData.quizId,
        'Quiz completed'
      );
    }

    return { success: true, data: savedAttempt as QuizAttempt };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit quiz',
    };
  }
}

/**
 * Get quiz attempts
 */
export async function getQuizAttempts(
  userId: string,
  quizId?: string
): Promise<LMSApiResponse<QuizAttempt[]>> {
  try {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    if (quizId) {
      constraints.push(where('quizId', '==', quizId));
    }
    constraints.push(orderBy('completedAt', 'desc'));

    const q = query(getCollection(COLLECTIONS.QUIZ_ATTEMPTS), ...constraints);
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<QuizAttempt>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get attempts',
    };
  }
}

/**
 * Get best quiz score
 */
export async function getBestQuizScore(
  userId: string,
  quizId: string
): Promise<LMSApiResponse<number>> {
  try {
    const attempts = await getQuizAttempts(userId, quizId);
    if (!attempts.success || !attempts.data || attempts.data.length === 0) {
      return { success: true, data: 0 };
    }
    const best = Math.max(...attempts.data.map(a => a.percentage));
    return { success: true, data: best };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get best score',
    };
  }
}

// ============================================
// XP & GAMIFICATION
// ============================================

/**
 * Log XP
 */
export async function logXP(
  userId: string,
  amount: number,
  source: XPSource,
  sourceId: string,
  description: string
): Promise<LMSApiResponse<XPLog>> {
  try {
    const xpLog: Omit<XPLog, 'id'> = {
      userId,
      amount,
      source,
      sourceId,
      description,
      timestamp: new Date(),
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.XP_LOGS), xpLog);

    // Update user profile XP
    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await updateDoc(profileRef, {
      xp: increment(amount),
      totalXP: increment(amount),
      // Level calculation happens on read, but we can update level directly
    });

    // Calculate new level
    const newLevel = calculateLevel(amount);

    return { success: true, data: { ...xpLog, id: docRef.id } as XPLog };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to log XP',
    };
  }
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
  // Each level requires 1000 * level XP
  let level = 1;
  let xpRequired = 0;
  while (xpRequired <= totalXP) {
    xpRequired += level * 1000;
    level++;
  }
  return level - 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 1000;
}

/**
 * Get XP to next level
 */
export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * currentLevel * 500;
  const xpForNextLevel = currentLevel * (currentLevel + 1) * 500;
  return xpForNextLevel - totalXP;
}

/**
 * Get user XP logs
 */
export async function getUserXPLogs(
  userId: string,
  limitCount: number = 20
): Promise<LMSApiResponse<XPLog[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.XP_LOGS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<XPLog>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get XP logs',
    };
  }
}

// ============================================
// CERTIFICATE OPERATIONS
// ============================================

/**
 * Generate certificate
 */
export async function generateCertificate(
  userId: string,
  courseId: string,
  courseName: string,
  userName: string
): Promise<LMSApiResponse<Certificate>> {
  try {
    const credentialId = `CERT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const certificate: Omit<Certificate, 'id'> = {
      userId,
      courseId,
      courseName,
      userName,
      issuedAt: new Date(),
      credentialId,
      verificationUrl: `/verify/${credentialId}`,
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.CERTIFICATES), certificate);
    return { success: true, data: { ...certificate, id: docRef.id } as Certificate };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate certificate',
    };
  }
}

/**
 * Verify certificate
 */
export async function verifyCertificate(
  credentialId: string
): Promise<LMSApiResponse<Certificate>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.CERTIFICATES),
      where('credentialId', '==', credentialId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { success: false, error: 'Certificate not found' };
    }
    return { success: true, data: docToData<Certificate>(snapshot.docs[0]) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify certificate',
    };
  }
}

/**
 * Get user certificates
 */
export async function getUserCertificates(
  userId: string
): Promise<LMSApiResponse<Certificate[]>> {
  try {
    const q = query(
      getCollection(COLLECTIONS.CERTIFICATES),
      where('userId', '==', userId),
      orderBy('issuedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map(docToData<Certificate>),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get certificates',
    };
  }
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Get course analytics
 */
export async function getCourseAnalytics(
  courseId: string
): Promise<LMSApiResponse<CourseAnalytics>> {
  try {
    // Get enrollments
    const enrollmentsQ = query(
      getCollection(COLLECTIONS.ENROLLMENTS),
      where('courseId', '==', courseId)
    );
    const enrollmentsSnap = await getDocs(enrollmentsQ);
    const enrollments = enrollmentsSnap.docs.map(docToData<Enrollment>);

    const totalEnrollments = enrollments.length;
    const completedCount = enrollments.filter(e => e.status === 'completed').length;
    const completionRate = totalEnrollments > 0 
      ? (completedCount / totalEnrollments) * 100 
      : 0;

    // Get quiz performance
    const quizAttemptsQ = query(
      getCollection(COLLECTIONS.QUIZ_ATTEMPTS),
      where('courseId', '==', courseId)
    );
    const quizSnap = await getDocs(quizAttemptsQ);
    const quizAttempts = quizSnap.docs.map(docToData<QuizAttempt>);

    const avgScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizAttempts.length
      : 0;

    const analytics: CourseAnalytics = {
      courseId,
      totalEnrollments,
      activeStudents: enrollments.filter(e => e.status === 'active').length,
      completionRate,
      averageProgress: enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments || 0,
      averageTimeSpent: 0,
      averageScore: avgScore,
      dropOffPoints: [],
      quizPerformance: [],
      lastUpdated: new Date(),
    };

    return { success: true, data: analytics };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics',
    };
  }
}

/**
 * Track block interaction
 */
export async function trackBlockInteraction(
  userId: string,
  blockId: string,
  lessonId: string,
  blockType: string,
  interactionType: UserBlockInteraction['interactionType'],
  data: Record<string, unknown> = {}
): Promise<LMSApiResponse<void>> {
  try {
    const interaction: Omit<UserBlockInteraction, 'id'> = {
      userId,
      blockId,
      lessonId,
      blockType,
      interactionType,
      data,
      timestamp: new Date(),
    };

    await addDoc(getCollection(COLLECTIONS.BLOCK_INTERACTIONS), interaction);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track interaction',
    };
  }
}

// ============================================
// PERMISSIONS & ACCESS CONTROL
// ============================================

/**
 * Check if user can access lesson
 */
export async function canAccessLesson(
  userId: string,
  lesson: Lesson
): Promise<LMSApiResponse<boolean>> {
  try {
    // Free lessons are always accessible
    if (lesson.isFree) {
      return { success: true, data: true };
    }

    // Check enrollment
    const enrollment = await getEnrollment(userId, lesson.courseId);
    if (!enrollment.success || !enrollment.data) {
      return { success: true, data: false };
    }

    // Check if enrollment is active
    if (enrollment.data.status !== 'active') {
      return { success: true, data: false };
    }

    // Check module unlock conditions
    const modules = await getModulesByCourse(lesson.courseId);
    if (modules.success && modules.data) {
      const currentModule = modules.data.find(m => m.id === lesson.moduleId);
      if (currentModule?.isLocked) {
        // Check unlock conditions
        if (currentModule.prerequisites?.length) {
          // Check if prerequisites are met
          for (const prereqId of currentModule.prerequisites) {
            const prereqProgress = await getLessonProgress(userId, prereqId);
            if (!prereqProgress.success || !prereqProgress.data?.completed) {
              return { success: true, data: false };
            }
          }
        }
      }
    }

    return { success: true, data: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check access',
    };
  }
}

/**
 * Check if user can edit course (admin/instructor)
 */
export function canEditCourse(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'instructor';
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}
