'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';

// ==================== Types ====================

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /**
   * Content to be rendered inside the card
   */
  children: ReactNode;

  /**
   * Additional CSS classes to merge with default styles
   */
  className?: string;

  /**
   * Variant of the glass card (determines intensity and style)
   * @default 'default'
   */
  variant?: 'default' | 'subtle' | 'strong' | 'bordered' | 'glow';

  /**
   * Whether to enable hover effects
   * @default true
   */
  enableHover?: boolean;

  /**
   * Whether to enable tap/click animations
   * @default true
   */
  enableTap?: boolean;

  /**
   * Custom padding (overrides default padding)
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Whether the card is interactive (shows cursor pointer)
   * @default false
   */
  interactive?: boolean;
}

// ==================== Variant Styles ====================

const variantStyles = {
  default: `
    bg-white/80 dark:bg-gray-900/60 
    backdrop-blur-lg 
    border border-gray-200 dark:border-cyan-500/10 
    shadow-lg shadow-black/5 dark:shadow-black/20
    text-gray-800 dark:text-white
  `,

  subtle: `
    bg-white/60 dark:bg-gray-900/40 
    backdrop-blur-md 
    border border-gray-200/50 dark:border-gray-700/30
    shadow-md shadow-black/5 dark:shadow-black/10
    text-gray-800 dark:text-white
  `,

  strong: `
    bg-white/90 dark:bg-gray-900/80 
    backdrop-blur-xl 
    border border-gray-300 dark:border-cyan-500/20 
    shadow-xl shadow-black/10 dark:shadow-cyan-500/5
    text-gray-800 dark:text-white
  `,

  bordered: `
    bg-white/70 dark:bg-gray-900/50 
    backdrop-blur-lg 
    border-2 border-cyan-500/50 dark:border-cyan-500/30 
    shadow-lg shadow-cyan-500/10
    text-gray-800 dark:text-white
  `,

  glow: `
    bg-white/80 dark:bg-gray-900/60 
    backdrop-blur-lg 
    border border-cyan-500/30 dark:border-cyan-500/20 
    shadow-[0_0_20px_rgba(6,182,212,0.15)] 
    shadow-cyan-500/20
    text-gray-800 dark:text-white
  `,
};

// ==================== Padding Styles ====================

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

// ==================== Animation Variants ====================

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // Custom easing for smooth feel
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

// Variant for non-hover version
const staticCardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ==================== Component ====================

/**
 * GlassCard - A reusable glassmorphic card component with Framer Motion animations
 * 
 * @example
 * // Basic usage
 * <GlassCard>
 *   <h2>Title</h2>
 *   <p>Content</p>
 * </GlassCard>
 * 
 * @example
 * // With custom variant and padding
 * <GlassCard variant="glow" padding="lg" interactive>
 *   <button onClick={handleClick}>Click me</button>
 * </GlassCard>
 * 
 * @example
 * // With custom styles
 * <GlassCard className="max-w-md mx-auto" variant="bordered">
 *   <div>Custom content</div>
 * </GlassCard>
 */
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      enableHover = true,
      enableTap = true,
      padding = 'md',
      onClick,
      interactive = false,
      ...props
    },
    ref
  ) => {
    // Determine if the card is clickable
    const isClickable = !!onClick || interactive;

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl overflow-hidden transition-all duration-300',

          // Variant-specific styles
          variantStyles[variant],

          // Padding
          paddingStyles[padding],

          // Interactive styles
          isClickable && 'cursor-pointer',

          // Hover glow enhancement
          enableHover && variant === 'glow' && 'hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
          enableHover && variant === 'bordered' && 'hover:border-cyan-500/50',
          enableHover && variant === 'default' && 'hover:border-cyan-500/20',

          // Custom className
          className
        )}
        variants={enableHover ? cardVariants : staticCardVariants}
        initial="initial"
        animate="animate"
        whileHover={enableHover ? 'hover' : undefined}
        whileTap={enableTap && isClickable ? 'tap' : undefined}
        onClick={onClick}
        {...props}
      >
        {/* Inner glow effect for enhanced depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-xl" />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;

// ==================== Additional Export ====================

/**
 * GlassCardHeader - Optional header component for GlassCard
 */
export function GlassCardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-cyan-500/10', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardTitle - Optional title component for GlassCard
 */
export function GlassCardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-xl font-bold text-white', className)}>
      {children}
    </h3>
  );
}

/**
 * GlassCardDescription - Optional description component for GlassCard
 */
export function GlassCardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-gray-400 mt-2', className)}>
      {children}
    </p>
  );
}

/**
 * GlassCardContent - Optional content wrapper for GlassCard
 */
export function GlassCardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

/**
 * GlassCardFooter - Optional footer component for GlassCard
 */
export function GlassCardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-cyan-500/10', className)}>
      {children}
    </div>
  );
}

