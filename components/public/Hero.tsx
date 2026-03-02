'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import { ChevronDown, Github, Linkedin, Mail, MapPin, Download, ArrowRight, Link as LinkIcon, Globe, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import background components for better performance
const ParticleBackground = dynamic(
  () => import('@/components/effects/ParticleBackground'),
  { ssr: false }
);

const AnimatedGradient = dynamic(
  () => import('@/components/effects/AnimatedGradient'),
  { ssr: false }
);

// ==================== Types ====================

interface SocialLink {
  name: string;
  url: string;
  icon?: typeof Github;
  label?: string;
  platform?: string;
}

interface HeroProps {
  /**
   * Use particle background instead of gradient
   * @default false
   */
  useParticles?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ==================== Constants ====================

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/ridamchhapiya',
    icon: Github,
    label: 'View my GitHub profile',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ridamchhapiya',
    icon: Linkedin,
    label: 'Connect on LinkedIn',
  },
  {
    name: 'Email',
    url: 'mailto:ridamchhapiya5@gmail.com',
    icon: Mail,
    label: 'Send me an email',
  },
];

const platformIconMap: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  twitter: Twitter,
  x: Twitter,
  website: Globe,
  default: LinkIcon,
};

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const nameVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1 + 0.8,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

const scrollIndicatorVariants = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

// ==================== Custom Hooks ====================

/**
 * Custom hook for typewriter effect
 */
function useTypewriter(texts: string[], speed: number = 100, deleteSpeed: number = 50) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;

    const targetText = texts[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          // Wait before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts, speed, deleteSpeed]);

  return currentText;
}

// ==================== Loading Skeleton ====================

function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8 animate-pulse">
        {/* Name skeleton */}
        <div className="h-16 bg-gray-800/50 rounded-lg w-3/4 mx-auto" />

        {/* Role skeleton */}
        <div className="h-12 bg-gray-800/50 rounded-lg w-1/2 mx-auto" />

        {/* Tagline skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-800/50 rounded-lg w-full" />
          <div className="h-6 bg-gray-800/50 rounded-lg w-5/6 mx-auto" />
        </div>

        {/* Location skeleton */}
        <div className="h-6 bg-gray-800/50 rounded-lg w-40 mx-auto" />

        {/* Buttons skeleton */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="h-12 bg-gray-800/50 rounded-lg w-40" />
          <div className="h-12 bg-gray-800/50 rounded-lg w-48" />
        </div>

        {/* Social links skeleton */}
        <div className="flex gap-4 justify-center">
          <div className="w-12 h-12 bg-gray-800/50 rounded-full" />
          <div className="w-12 h-12 bg-gray-800/50 rounded-full" />
          <div className="w-12 h-12 bg-gray-800/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ==================== Component ====================

/**
 * Hero - Landing section with animated text, CTA buttons, and social links
 * 
 * @example
 * // Basic usage
 * <Hero />
 * 
 * @example
 * // With particle background
 * <Hero useParticles />
 */
export default function Hero({ useParticles = true, className }: HeroProps) {
  const { data, loading, error } = usePortfolioData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract hero data or use fallbacks
  const heroData = data?.hero || {
    id: 'hero-1',
    name: 'RIDAM CHHAPIYA',
    roles: ['Full Stack Developer', 'Cloud Engineer', 'AI Enthusiast'],
    tagline: 'Building scalable web applications and cloud-native solutions with cutting-edge technologies.',
    ctaButtons: [
      { text: 'View Projects', url: '#projects', variant: 'primary' as const },
      { text: 'Download Resume', url: '/resume.pdf', variant: 'secondary' as const },
    ],
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/ridamchhapiya', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/ridamchhapiya', icon: 'linkedin' },
      { platform: 'Email', url: 'mailto:ridamchhapiya5@gmail.com', icon: 'email' },
    ],
  };

  const location = 'Pune, India'; // Can be moved to About section or made configurable

  // Typewriter effect for roles
  const typedRole = useTypewriter(heroData.roles || ['Developer']);

  // Smooth scroll handler
  const handleScrollDown = () => {
    const nextSection = document.querySelector('#about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <section
        id="hero"
        className={cn('relative min-h-screen flex items-center justify-center', className)}
      >
        {useParticles && isClient && <ParticleBackground />}
        {!useParticles && isClient && <AnimatedGradient />}
        <HeroSkeleton />
      </section>
    );
  }

  // Error state
  if (error) {
    console.error('Hero data error:', error);
  }

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background */}
      {useParticles && isClient && <ParticleBackground opacity={0.5} />}
      {!useParticles && isClient && <AnimatedGradient opacity={0.9} />}

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Name */}
          <motion.h1
            variants={nameVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              {heroData.name}
            </span>
          </motion.h1>

          {/* Typewriter Role */}
          <motion.div
            variants={itemVariants}
            className="mb-6 h-12 sm:h-16 flex items-center justify-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-cyan-400">
              {typedRole}
              <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-cyan-400 ml-1 animate-pulse" />
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed"
          >
            {heroData.tagline}
          </motion.p>

          {/* Location */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 text-gray-400 mb-10"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span className="text-base sm:text-lg">{location}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            {heroData.ctaButtons?.map((btn, index) => {
              if (btn.variant === 'primary') {
                return (
                  <motion.a
                    key={index}
                    href={btn.url}
                    onClick={(e) => {
                      if (btn.url.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(btn.url);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {btn.text}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                );
              }

              return (
                <motion.a
                  key={index}
                  href={btn.url}
                  download={btn.url.includes('.pdf') || btn.text.toLowerCase().includes('download')}
                  className="group relative px-8 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-lg font-semibold text-white hover:bg-gray-800/80 hover:border-cyan-500/60 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    {(btn.url.includes('.pdf') || btn.text.toLowerCase().includes('download')) ? (
                      <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    ) : null}
                    {btn.text}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex gap-6 justify-center mb-16"
          >
            {heroData.socialLinks?.map((social, index) => {
              const platform = social.platform?.toLowerCase() || '';
              const Icon = platformIconMap[platform] || platformIconMap.default;

              // Fallback for label and name if not provided in CMS
              const platformName = social.platform ? social.platform.charAt(0).toUpperCase() + social.platform.slice(1) : 'Link';
              const label = `Visit my ${platformName}`;

              return (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  custom={index}
                  variants={socialVariants}
                  className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            variants={scrollIndicatorVariants}
            animate="animate"
            onClick={handleScrollDown}
            className="group inline-flex flex-col items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
            aria-label="Scroll to next section"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-current rounded-full"
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
