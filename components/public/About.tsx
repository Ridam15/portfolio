'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import GlassCard from '@/components/effects/GlassCard';
import { Download, Code2, Database, Cloud, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ==================== Types ====================

interface AboutProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

// ==================== Custom Hooks ====================

/**
 * Custom hook for animated counter
 */
/**
 * Custom hook for animated counter
 */
function useCounter({ target, duration = 2000, start = true }: { target: number; duration?: number; start?: boolean }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!start || hasAnimated) return;

    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
        setHasAnimated(true);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, hasAnimated, start]);

  return count;
}

/**
 * Animated Counter component
 */
function AnimatedCounter({ target, duration = 2000, suffix = '', prefix = '' }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isInView, shouldAnimate]);

  const count = useCounter({ target, duration, start: shouldAnimate });

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-cyan-400">
      {prefix}{count}{suffix}
    </div>
  );
}

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const techStackVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const techItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

// ==================== Loading Skeleton ====================

function AboutSkeleton() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 space-y-4 animate-pulse">
          <div className="h-12 bg-gray-800/50 rounded-lg w-48" />
          <div className="h-1 bg-gray-800/50 rounded w-32" />
        </div>

        <GlassCard variant="default" padding="lg">
          <div className="grid md:grid-cols-3 gap-8 animate-pulse">
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 bg-gray-800/50 rounded w-full" />
              <div className="h-6 bg-gray-800/50 rounded w-11/12" />
              <div className="h-6 bg-gray-800/50 rounded w-10/12" />
              <div className="h-6 bg-gray-800/50 rounded w-full" />

              <div className="pt-6 grid grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800/50 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="aspect-square bg-gray-800/50 rounded-2xl" />
              <div className="h-12 bg-gray-800/50 rounded-lg" />
              <div className="h-12 bg-gray-800/50 rounded-lg" />
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

// ==================== Component ====================

/**
 * About - Professional summary section with tech stack and experience
 * 
 * @example
 * <About />
 */
export default function About({ className }: AboutProps) {
  const { data, loading, error } = usePortfolioData();
  // Default data
  const aboutData = data?.about || {
    id: 'about-1',
    summary: "I'm a passionate Full Stack Developer with expertise in building modern web applications. With a strong foundation in both frontend and backend technologies, I create seamless user experiences backed by robust, scalable architectures. My journey in software development has equipped me with the skills to tackle complex challenges and deliver high-quality solutions.",
    bio: undefined,
    techStack: [
      { name: 'React', icon: '⚛️', category: 'Frontend' },
      { name: 'Next.js', icon: '▲', category: 'Frontend' },
      { name: 'TypeScript', icon: 'TS', category: 'Language' },
      { name: 'Node.js', icon: '🟢', category: 'Backend' },
      { name: 'Python', icon: '🐍', category: 'Language' },
      { name: 'Firebase', icon: '🔥', category: 'Backend' },
      { name: 'AWS', icon: '☁️', category: 'Cloud' },
      { name: 'Docker', icon: '🐳', category: 'DevOps' },
    ],
    yearsOfExperience: 3,
    resumeUrl: '/resume.pdf',
    photoUrl: undefined,
  };

  const yearsOfExperience = aboutData.yearsOfExperience || 3;
  const techStack = aboutData.techStack || [];

  if (loading) {
    return <AboutSkeleton />;
  }

  if (error) {
    console.error('About data error:', error);
  }

  return (
    <section
      id="about"
      className={cn('py-20 px-4 relative', className)}
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          {/* Animated underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '120px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <GlassCard variant="default" padding="lg" className="overflow-hidden">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Summary & Tech Stack */}
              <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
                {/* Summary & Bio */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <div className="absolute inset-0 bg-cyan-400/50 blur-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                      <span className="text-cyan-400">&lt;</span>
                      Who I Am
                      <span className="text-cyan-400"> /&gt;</span>
                    </h3>
                  </div>

                  {/* Bio (Terminal Style) */}
                  {aboutData.bio && (
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                      <div className="relative p-6 bg-gray-900 rounded-lg border border-gray-800 font-mono text-sm md:text-base leading-relaxed text-gray-300 shadow-xl">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="ml-2 text-xs text-gray-500">bio.txt</span>
                        </div>
                        <p className="whitespace-pre-wrap">
                          <span className="text-cyan-400 mr-2">$</span>
                          {aboutData.bio}
                          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="relative pl-4 border-l-2 border-cyan-500/30">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {aboutData.summary}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white">Tech Stack</h3>
                  </div>

                  <motion.div
                    variants={techStackVariants}
                    className="grid grid-cols-3 sm:grid-cols-4 gap-4"
                  >
                    {techStack.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        variants={techItemVariants}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative"
                      >
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800/30 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer h-full">
                          {/* Icon/Emoji */}
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                            {tech.icon}
                          </div>

                          {/* Name */}
                          <div className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors text-center">
                            {tech.name}
                          </div>

                          {/* Hover glow */}
                          <div className="absolute inset-0 rounded-xl bg-cyan-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Stats & CTA */}
              <motion.div variants={itemVariants} className="space-y-6">
                {/* Profile Photo (if available) */}
                {aboutData.photoUrl && (
                  <motion.div
                    className="relative aspect-square rounded-2xl overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Futuristic Scanline Effect */}
                    <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20" />

                    {/* Tech Overlay - clear center, glowing edges */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 z-10 mix-blend-overlay" />

                    {/* Corner Accents */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-20 rounded-tl-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-purple-400 z-20 rounded-br-lg opacity-60 group-hover:opacity-100 transition-opacity" />

                    <Image
                      src={aboutData.photoUrl}
                      alt="Profile"
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />

                    {/* Creative border effect */}
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-2xl z-20" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
                  </motion.div>
                )}

                {/* Experience Counter */}
                <GlassCard variant="bordered" padding="lg" className="text-center">
                  <div className="space-y-2">
                    <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                    <AnimatedCounter
                      target={yearsOfExperience}
                      suffix="+"
                      duration={2000}
                    />
                    <p className="text-gray-400 text-sm">
                      Years of Experience
                    </p>
                  </div>
                </GlassCard>

                {/* Projects Counter */}
                <GlassCard variant="bordered" padding="lg" className="text-center">
                  <div className="space-y-2">
                    <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <AnimatedCounter
                      target={data?.projects?.length || 15}
                      suffix="+"
                      duration={2500}
                    />
                    <p className="text-gray-400 text-sm">
                      Projects Completed
                    </p>
                  </div>
                </GlassCard>

                {/* Download Resume Button */}
                <motion.a
                  href={aboutData.resumeUrl}
                  download
                  className="group relative block w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white text-center overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    Download Resume
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-cyan-500/10">
                    <div className="text-2xl font-bold text-cyan-400">100%</div>
                    <div className="text-xs text-gray-400 mt-1">Client Satisfaction</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-blue-500/10">
                    <div className="text-2xl font-bold text-blue-400">24/7</div>
                    <div className="text-xs text-gray-400 mt-1">Support</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
