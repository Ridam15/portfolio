import Navigation from '@/components/public/Navigation';
import Footer from '@/components/public/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white scroll-smooth">
      <Navigation />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}

