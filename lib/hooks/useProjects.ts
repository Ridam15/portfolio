'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDocuments } from '../firebase/firestore';
import type { Project } from '@/types/portfolio';
import { orderBy } from 'firebase/firestore';

/**
 * Return type for useProjects hook
 */
interface UseProjectsReturn {
    projects: Project[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing projects data
 * Fetches from the 'projects' collection in Firestore
 * 
 * @returns Object containing projects array, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * function ProjectEditor() {
 *   const { projects, loading, error, refetch } = useProjects();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       {projects.map(project => (
 *         <div key={project.id}>{project.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Fetch projects from Firestore
     */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch projects from 'projects' collection, ordered by 'order' field
            const projectsData = await getDocuments<Project>(
                'projects',
                orderBy('order', 'asc')
            );

            setProjects(projectsData);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
            setProjects([]); // Set empty array on error
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
        projects,
        loading,
        error,
        refetch,
    };
}
