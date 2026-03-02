import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

/**
 * Configure Inter font
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

/**
 * Site metadata for SEO
 */
export const metadata: Metadata = {
  title: 'Ridam Chhapiya | Software Engineer',
  description:
    'Software Engineer specializing in full-stack development, cloud-native architectures, and Generative AI integration',
  keywords: [
    'Ridam Chhapiya',
    'Software Engineer',
    'Full Stack Developer',
    'Cloud Native',
    'Generative AI',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Firebase',
    'Web Development',
    'Portfolio',
  ],
  authors: [{ name: 'Ridam Chhapiya', url: 'https://ridamchhapiya.com' }],
  creator: 'Ridam Chhapiya',
  publisher: 'Ridam Chhapiya',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ridamchhapiya.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ridamchhapiya.com',
    title: 'Ridam Chhapiya | Software Engineer',
    description:
      'Software Engineer specializing in full-stack development, cloud-native architectures, and Generative AI integration',
    siteName: 'Ridam Chhapiya Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ridam Chhapiya - Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridam Chhapiya | Software Engineer',
    description:
      'Software Engineer specializing in full-stack development, cloud-native architectures, and Generative AI integration',
    images: ['/twitter-image.jpg'],
    creator: '@ridamchhapiya',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // other: 'your-other-verification-code',
  },
};

/**
 * Props for RootLayout component
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application
 * Includes global fonts, styles, and providers
 * 
 * @param children - Child pages/components to render
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="portfolio-theme"
          disableTransitionOnChange={false}
        >
          {/* Error Boundary for global error handling */}
          <ErrorBoundary>
            {children}
          </ErrorBoundary>

          {/* Toast notifications with glassmorphic styling */}
          <Toaster
            position="top-right"
            richColors={true}
            toastOptions={{
              className: 'bg-gray-900/90 backdrop-blur-lg border border-cyan-500/20',
              style: {
                background: 'rgba(17, 24, 39, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: 'white',
              },
            }}
          />
          <GoogleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
