import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';

// ==================== Constants ====================

/**
 * Admin email address - only this user can access admin features
 */
export const ADMIN_EMAIL = 'ridamchhapiya5@gmail.com';

// ==================== Authentication Functions ====================

/**
 * Sign in with Google - Admin only
 * @returns Promise with User object
 * @throws Error if user is not admin or sign-in fails
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user is admin
    if (!user.email || user.email !== ADMIN_EMAIL) {
      // Not admin - sign them out immediately
      await signOut(auth);
      throw new Error('Unauthorized: Admin access only');
    }

    // User is admin, return user
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Re-throw with better error message
    if (error instanceof Error) {
      if (error.message === 'Unauthorized: Admin access only') {
        throw error;
      }
      throw new Error(`Sign-in failed: ${error.message}`);
    }
    throw new Error('Sign-in failed: Unknown error');
  }
};

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with UserCredential
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is admin
    if (!userCredential.user.email || userCredential.user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error('Unauthorized: Admin access only');
    }
    
    return userCredential;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns Promise<void>
 * @throws Error if sign-out fails
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error('Logout failed: Unknown error');
  }
};

/**
 * Legacy logout function for backward compatibility
 * @deprecated Use logOut() instead
 */
export const logout = logOut;

/**
 * Send password reset email
 * @param email - User email
 * @returns Promise<void>
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user profile (display name, photo URL)
 * @param user - Current user
 * @param profile - Profile data to update
 * @returns Promise<void>
 */
export const updateUserProfile = async (
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    return await updateProfile(user, profile);
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

/**
 * Update user email
 * @param user - Current user
 * @param newEmail - New email address
 * @returns Promise<void>
 */
export const updateUserEmail = async (
  user: User,
  newEmail: string
): Promise<void> => {
  try {
    return await updateEmail(user, newEmail);
  } catch (error) {
    console.error('Email update error:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param user - Current user
 * @param newPassword - New password
 * @returns Promise<void>
 */
export const updateUserPassword = async (
  user: User,
  newPassword: string
): Promise<void> => {
  try {
    return await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
};

/**
 * Reauthenticate user with email and password
 * Required for sensitive operations
 * @param user - Current user
 * @param password - User's current password
 * @returns Promise<UserCredential>
 */
export const reauthenticateUser = async (
  user: User,
  password: string
): Promise<UserCredential> => {
  try {
    if (!user.email) {
      throw new Error('User email not found');
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    return await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error('Reauthentication error:', error);
    throw error;
  }
};

/**
 * Get current user
 * @returns Current user or null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Check if a user is an admin
 * @param user - User object to check (can be null)
 * @returns true if user is admin, false otherwise
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user?.email) {
    return false;
  }
  return user.email === ADMIN_EMAIL;
};

/**
 * Listen to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function to stop listening
 */
export const onAuthChange = (
  callback: (user: User | null) => void
): Unsubscribe => {
  try {
    return onAuthStateChanged(auth, (user) => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in auth state change callback:', error);
      }
    });
  } catch (error) {
    console.error('Error setting up auth state listener:', error);
    throw new Error('Failed to set up authentication listener');
  }
};

// ==================== Exports ====================
export { auth } from './config';
export { onAuthStateChanged } from 'firebase/auth';
export type { User, UserCredential, Unsubscribe } from 'firebase/auth';

