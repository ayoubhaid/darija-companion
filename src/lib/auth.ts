export const signInWithEmail = async (email: string, password: string) => {
  const { signInWithEmailAndPassword, getAuth } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const { createUserWithEmailAndPassword, getAuth, updateProfile } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result;
};

export const signInWithGoogle = async () => {
  const { signInWithPopup, getAuth, GoogleAuthProvider } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleProvider);
};

export const logOut = async () => {
  const { getAuth, signOut } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  return signOut(auth);
};

export const resetPassword = async (email: string) => {
  const { getAuth, sendPasswordResetEmail } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  return sendPasswordResetEmail(auth, email);
};

export const getCurrentUser = () => {
  return null;
};

export const updateUserProfile = async (displayName: string, photoURL?: string) => {
  const { getAuth, updateProfile } = await import('firebase/auth');
  const { auth } = await import('@/lib/firebase');
  if (auth.currentUser) {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  }
  throw new Error('No user logged in');
};
