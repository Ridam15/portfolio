import type { Metadata } from 'next';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * Metadata for admin pages
 */
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Portfolio admin dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Props for AdminLayout component
 */
interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component that wraps all admin pages
 * Includes ProtectedRoute for authentication and admin-specific styling
 * 
 * @param children - Child pages/components to render
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Admin Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">P</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white">
                    Portfolio Admin
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-600 dark:text-gray-400">Content Management</p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-600 dark:text-gray-400 dark:hover:text-gray-900 dark:text-white transition-colors"
                >
                  View Site →
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-600 dark:text-gray-400">
              Portfolio Admin Dashboard © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

