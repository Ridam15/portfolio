'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

// ==================== Types ====================

interface AnimatedGradientProps {
  /**
   * Intensity of the gradient effect (0-1)
   * @default 0.8
   */
  intensity?: number;
  
  /**
   * Z-index for layering
   * @default -20
   */
  zIndex?: number;
  
  /**
   * Opacity of the gradient overlay
   * @default 1
   */
  opacity?: number;
  
  /**
   * Animation speed multiplier
   * @default 1
   */
  speed?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Variant of the gradient theme
   * @default 'space'
   */
  variant?: 'space' | 'cyber' | 'ocean' | 'aurora';
}

// ==================== Gradient Variant Configurations ====================

const gradientVariants = {
  space: {
    primary: 'from-gray-950 via-blue-950/50 to-gray-950',
    secondary: 'from-purple-900/20 via-cyan-900/30 to-blue-900/20',
    accent: 'from-cyan-500/10 via-transparent to-green-500/10',
    radial1: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
    radial2: 'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
    radial3: 'radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
  },
  cyber: {
    primary: 'from-black via-purple-950 to-black',
    secondary: 'from-cyan-900/30 via-pink-900/30 to-blue-900/30',
    accent: 'from-cyan-500/20 via-transparent to-pink-500/20',
    radial1: 'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.25) 0%, transparent 50%)',
    radial2: 'radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.25) 0%, transparent 50%)',
    radial3: 'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
  },
  ocean: {
    primary: 'from-gray-950 via-blue-950 to-teal-950',
    secondary: 'from-blue-900/30 via-cyan-900/40 to-teal-900/30',
    accent: 'from-cyan-400/15 via-transparent to-blue-400/15',
    radial1: 'radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
    radial2: 'radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
    radial3: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)',
  },
  aurora: {
    primary: 'from-gray-950 via-indigo-950/50 to-gray-950',
    secondary: 'from-green-900/20 via-purple-900/30 to-pink-900/20',
    accent: 'from-green-400/10 via-purple-500/10 to-pink-400/10',
    radial1: 'radial-gradient(circle at 20% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
    radial2: 'radial-gradient(circle at 80% 40%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
    radial3: 'radial-gradient(circle at 50% 90%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
  },
};

// ==================== Component ====================

/**
 * AnimatedGradient - Full-screen animated mesh gradient background
 * 
 * @example
 * // Basic usage
 * <AnimatedGradient />
 * 
 * @example
 * // Custom intensity and variant
 * <AnimatedGradient 
 *   intensity={0.6} 
 *   variant="cyber"
 *   speed={1.5}
 * />
 * 
 * @example
 * // As a page background
 * <div className="relative">
 *   <AnimatedGradient zIndex={-20} opacity={0.9} />
 *   <div className="relative z-10">
 *     <YourContent />
 *   </div>
 * </div>
 */
export default function AnimatedGradient({
  intensity = 0.8,
  zIndex = -20,
  opacity = 1,
  speed = 1,
  className = '',
  variant = 'space',
}: AnimatedGradientProps) {
  // Get gradient colors based on variant
  const colors = useMemo(() => gradientVariants[variant], [variant]);
  
  // Calculate animation durations based on speed
  const durations = useMemo(() => ({
    slow: 20 / speed,
    medium: 15 / speed,
    fast: 10 / speed,
  }), [speed]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        zIndex,
        opacity: opacity * intensity,
      }}
      aria-hidden="true"
    >
      {/* Base gradient layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${colors.primary}`}
      />
      
      {/* Animated gradient layer 1 - Slow diagonal movement */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-tr ${colors.secondary}`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: durations.slow,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: 'center center',
        }}
      />
      
      {/* Animated gradient layer 2 - Medium speed */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-bl ${colors.accent}`}
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: durations.medium,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          transformOrigin: 'center center',
        }}
      />
      
      {/* Radial gradient 1 - Animated position */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: colors.radial1,
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: durations.slow,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Radial gradient 2 - Opposite animation */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: colors.radial2,
        }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: durations.medium,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Radial gradient 3 - Pulsing effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: colors.radial3,
          transformOrigin: 'center center',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: durations.fast,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Mesh noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 7, 18, 0.5) 100%)',
        }}
      />
    </div>
  );
}

// ==================== Additional Exports ====================

/**
 * AnimatedGradientPresets - Pre-configured gradient components
 */
export function SpaceGradient(props: Omit<AnimatedGradientProps, 'variant'>) {
  return <AnimatedGradient {...props} variant="space" />;
}

export function CyberGradient(props: Omit<AnimatedGradientProps, 'variant'>) {
  return <AnimatedGradient {...props} variant="cyber" />;
}

export function OceanGradient(props: Omit<AnimatedGradientProps, 'variant'>) {
  return <AnimatedGradient {...props} variant="ocean" />;
}

export function AuroraGradient(props: Omit<AnimatedGradientProps, 'variant'>) {
  return <AnimatedGradient {...props} variant="aurora" />;
}

// ==================== Usage Notes ====================

/**
 * Performance Optimization:
 * 
 * - Uses only transform and opacity for animations (GPU-accelerated)
 * - No layout thrashing or repaints
 * - Fixed positioning prevents scroll performance issues
 * - pointer-events-none ensures no interaction overhead
 * 
 * Accessibility:
 * 
 * - aria-hidden="true" hides from screen readers
 * - Respects prefers-reduced-motion (implement if needed):
 *   
 *   const prefersReducedMotion = window.matchMedia(
 *     '(prefers-reduced-motion: reduce)'
 *   ).matches;
 *   
 *   {!prefersReducedMotion && <AnimatedGradient />}
 * 
 * Variants:
 * 
 * - 'space': Deep space with cyan/purple/green accents (default)
 * - 'cyber': Dark cyberpunk with cyan/pink/purple
 * - 'ocean': Deep ocean blues and teals
 * - 'aurora': Northern lights with green/purple/pink
 */

