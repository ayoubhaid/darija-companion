'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initAuth = async () => {
      try {
        const { auth } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { getUserProfile, createUserProfile } = await import('@/lib/firestore');

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          
          if (firebaseUser) {
            try {
              let profile = await getUserProfile(firebaseUser.uid);
              
              if (!profile) {
                await createUserProfile(
                  firebaseUser.uid,
                  firebaseUser.email || '',
                  firebaseUser.displayName || 'New User'
                );
                profile = await getUserProfile(firebaseUser.uid);
              }
              
              setUserProfile(profile);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, [isClient]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  completedQuizzes: string[];
  vocabularyLearned: number;
  totalXP: number;
  lastActive: string;
  createdAt: string;
  isAdmin?: boolean;
  achievements?: string[];
  skillLevel?: number;
  accuracyRate?: number;
  quizzesCompleted?: number;
  lessonsCompleted?: number;
  preferences?: {
    showTransliteration: boolean;
    showArabic: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
}
