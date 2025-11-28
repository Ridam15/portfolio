'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPortfolioContent } from '../firebase/firestore';
import type { PortfolioContent } from '@/types/portfolio';

/**
 * Return type for usePortfolioData hook
 */
interface UsePortfolioDataReturn {
  data: PortfolioContent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing portfolio data
 * 
 * @returns Object containing portfolio data, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function PortfolioPage() {
 *   const { data, loading, error, refetch } = usePortfolioData();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return <div>No data found</div>;
 *   
 *   return (
 *     <div>
 *       <h1>{data.hero.name}</h1>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePortfolioData(): UsePortfolioDataReturn {
  const [data, setData] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch portfolio data from Firestore
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const portfolioContent = await getPortfolioContent();
      setData(portfolioContent);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio data'));
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
    data,
    loading,
    error,
    refetch,
  };
}

