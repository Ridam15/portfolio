'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDocuments } from '../firebase/firestore';
import type { Experience } from '@/types/portfolio';
import { orderBy } from 'firebase/firestore';

/**
 * Return type for useExperiences hook
 */
interface UseExperiencesReturn {
  experiences: Experience[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing experiences data
 * Fetches from the 'experiences' collection in Firestore
 * 
 * @returns Object containing experiences array, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function ExperienceEditor() {
 *   const { experiences, loading, error, refetch } = useExperiences();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       {experiences.map(exp => (
 *         <div key={exp.id}>{exp.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useExperiences(): UseExperiencesReturn {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch experiences from Firestore
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch experiences from 'experiences' collection, ordered by 'order' field
      const experiencesData = await getDocuments<Experience>(
        'experiences',
        orderBy('order', 'asc')
      );
      
      setExperiences(experiencesData);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch experiences'));
      setExperiences([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    experiences,
    loading,
    error,
    refetch,
  };
}




