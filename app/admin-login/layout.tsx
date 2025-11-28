import type { Metadata } from 'next';

/**
 * Metadata for admin login page
 */
export const metadata: Metadata = {
  title: 'Admin Login | Portfolio',
  description: 'Secure login for portfolio administration',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Props for AdminLoginLayout component
 */
interface AdminLoginLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin login layout component - simple wrapper without ProtectedRoute
 * to allow unauthenticated users to access the login page
 * 
 * @param children - Login page content
 */
export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return <>{children}</>;
}


