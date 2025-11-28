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
 * Props for LoginLayout component
 */
interface LoginLayoutProps {
  children: React.ReactNode;
}

/**
 * Login layout component - simple wrapper without ProtectedRoute
 * to allow unauthenticated users to access the login page
 * 
 * @param children - Login page content
 */
export default function LoginLayout({ children }: LoginLayoutProps) {
  return <>{children}</>;
}


