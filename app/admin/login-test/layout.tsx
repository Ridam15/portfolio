import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Test',
  description: 'Test page',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


