import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { getDocument } from '@/lib/firebase/firestore';
import { PortfolioMetadata } from '@/types/portfolio';
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
 * Dynamically generate site metadata for SEO from Firestore
 */
export async function generateMetadata(): Promise<Metadata> {
  let meta: PortfolioMetadata | null = null;

  try {
    // Attempt to fetch dynamic metadata from Firestore
    // Note: We use the server-side firestore admin or direct client here since it's a Server Component
    // Wait, getDocument uses the client SDK which might cause issues in a Server Component without init.
    // However, getDocument from '@/lib/firebase/firestore' imports from '@/lib/firebase/config' which initializes the client app.
    // For a generic static/SSR build, this works with Next.js polyfills, but it's best to handle fallbacks gracefully.
    meta = await getDocument<PortfolioMetadata>('portfolio_content', 'metadata');
  } catch (error) {
    console.warn('Failed to fetch dynamic metadata, falling back to defaults:', error);
  }

  const title = meta?.siteTitle || 'Ridam Chhapiya | Software Engineer';
  const description = meta?.siteDescription || 'Software Engineer specializing in full-stack development, cloud-native architectures, and Generative AI integration';
  const keywords = meta?.seo?.keywords?.length ? meta.seo.keywords : [
    'Ridam Chhapiya', 'Software Engineer', 'Full Stack Developer',
    'Cloud Native', 'Generative AI', 'React', 'Next.js', 'Typescript'
  ];
  const authorName = meta?.seo?.author || 'Ridam Chhapiya';
  const siteUrl = meta?.siteUrl || 'https://ridamchhapiya.com';
  const ogImageUrl = meta?.ogImage || '/og-image.jpg';
  const twitterHandle = meta?.seo?.twitterHandle || '@ridamchhapiya';

  // Set up verification objects dynamically. Only add google if the string exists.
  const verification: any = {};
  if (meta?.seo?.googleVerification) {
    verification.google = meta.seo.googleVerification;
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: authorName, url: siteUrl }],
    creator: authorName,
    publisher: authorName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://portfolio-ten-silk-50.vercel.app'), // Use the vercel URL as physical base to prevent localhost errors in build
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title,
      description,
      siteName: title,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${authorName} - Software Engineer`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: twitterHandle,
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
    ...(Object.keys(verification).length > 0 && { verification }),
  };
}

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
