import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Experience from '@/components/public/Experience';
import Projects from '@/components/public/Projects';
import Skills from '@/components/public/Skills';
import Contact from '@/components/public/Contact';

export default function HomePage() {
  return (
    <main className="relative">
      <Hero useParticles={true} />
      <About />
      <Experience />
      <Projects />
      <Skills /> {/* Integrated Skills component */}

      <Contact />
    </main>
  );
}
