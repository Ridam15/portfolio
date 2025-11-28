'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, isAdmin } from '../firebase/auth';

/**
 * Return type for useAuth hook
 */
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
}

/**
 * Custom hook for managing authentication state
 * 
 * @returns Object containing user, loading state, and admin status
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, isAdminUser } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Please sign in</div>;
 *   if (!isAdminUser) return <div>Access denied</div>;
 *   
 *   return <div>Welcome, {user.email}</div>;
 * }
 * ```
 */
export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setIsAdminUser(isAdmin(authUser));
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    isAdminUser,
  };
}

