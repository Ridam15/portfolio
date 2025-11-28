'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that restricts access to authenticated admin users only
 * 
 * @param children - Child components to render if user is authenticated admin
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdminUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading && (!user || !isAdminUser)) {
      router.push('/admin-login');
    }
  }, [user, loading, isAdminUser, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Return null if user is not authenticated or not admin
  // (redirect will happen via useEffect)
  if (!user || !isAdminUser) {
    return null;
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}

