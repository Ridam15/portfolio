'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import GlassCard, { GlassCardContent } from '@/components/effects/GlassCard';
import { useExperiences } from '@/lib/hooks/useExperiences';
import type { Experience as ExperienceType } from '@/types/portfolio';

// ==================== Types ====================

interface ExperienceProps {
  className?: string;
}

interface ExperienceCardProps {
  experience: ExperienceType;
  index: number;
  isLast: boolean;
}

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const timelineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const achievementVariants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// ==================== Helper Functions ====================

/**
 * Format date range for experience
 */
const formatDateRange = (startDate: string, endDate: string | undefined, current: boolean): string => {
  const start = formatDate(new Date(startDate), { year: 'numeric', month: 'short' });
  
  if (current) {
    return `${start} - Present`;
  }
  
  if (endDate) {
    const end = formatDate(new Date(endDate), { year: 'numeric', month: 'short' });
    return `${start} - ${end}`;
  }
  
  return start;
};

/**
 * Calculate duration between two dates
 */
const calculateDuration = (startDate: string, endDate: string | undefined, current: boolean): string => {
  const start = new Date(startDate);
  const end = current || !endDate ? new Date() : new Date(endDate);
  
  const months = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years > 0 && remainingMonths > 0) {
    return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} yr${years > 1 ? 's' : ''}`;
  } else {
    return `${months} mo${months > 1 ? 's' : ''}`;
  }
};

// ==================== Location Type Badge ====================

const LocationTypeBadge = ({ type }: { type?: 'remote' | 'hybrid' | 'onsite' }) => {
  if (!type) return null;
  
  const config = {
    remote: { label: 'Remote', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    hybrid: { label: 'Hybrid', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    onsite: { label: 'On-site', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };
  
  const { label, color } = config[type];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      color
    )}>
      {label}
    </span>
  );
};

// ==================== Experience Card Component ====================

const ExperienceCard = ({ experience, index, isLast }: ExperienceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  const {
    title,
    company,
    companyUrl,
    companyLogo,
    location,
    locationType,
    startDate,
    endDate,
    current,
    description,
    achievements,
    techStack,
  } = experience;
  
  const dateRange = formatDateRange(startDate, endDate, current);
  const duration = calculateDuration(startDate, endDate, current);
  
  return (
    <div ref={cardRef} className="relative flex gap-6 md:gap-8">
      {/* Timeline Line and Dot */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <motion.div
          variants={dotVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative z-10 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/50">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={`${company} logo`} 
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Briefcase className="w-6 h-6 text-cyan-400" />
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Timeline Line */}
        {!isLast && (
          <motion.div
            variants={timelineVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent mt-2"
            style={{ originY: 0 }}
          />
        )}
      </div>
      
      {/* Experience Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex-1 pb-12"
      >
        <GlassCard 
          className="group hover:border-cyan-500/30 transition-colors duration-300"
          enableHover={false}
        >
          <GlassCardContent className="p-6 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {companyUrl ? (
                      <a
                        href={companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        {company}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-lg text-cyan-400">{company}</span>
                    )}
                    <LocationTypeBadge type={locationType} />
                  </div>
                </div>
                
                {current && (
                  <motion.span
                    className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-medium"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    Current
                  </motion.span>
                )}
              </div>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{dateRange}</span>
                  <span className="text-xs text-gray-500">({duration})</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{description}</p>
            
            {/* Tech Stack */}
            {techStack && techStack.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements Toggle */}
            {achievements && achievements.length > 0 && (
              <div className="border-t border-gray-700/50 pt-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-between w-full text-left group/btn"
                >
                  <span className="text-sm font-semibold text-gray-400 group-hover/btn:text-cyan-400 transition-colors flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Key Achievements ({achievements.length})
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover/btn:text-cyan-400 transition-colors" />
                  </motion.div>
                </button>
                
                {/* Achievements List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.ul
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={achievementVariants}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      {achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                          className="flex gap-3 text-sm text-gray-300"
                        >
                          <span className="text-cyan-400 mt-1 flex-shrink-0">▸</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
};

// ==================== Loading Skeleton ====================

const ExperienceSkeleton = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((index) => (
        <div key={index} className="relative flex gap-6 md:gap-8">
          {/* Skeleton Dot */}
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-800/50 animate-pulse" />
            {index < 3 && (
              <div className="w-0.5 h-48 bg-gray-800/30 mt-2" />
            )}
          </div>
          
          {/* Skeleton Card */}
          <div className="flex-1 pb-12">
            <GlassCard className="opacity-50">
              <GlassCardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-7 bg-gray-700/30 rounded w-3/4 animate-pulse" />
                  <div className="h-5 bg-gray-700/30 rounded w-1/2 animate-pulse" />
                  <div className="flex gap-4 mt-2">
                    <div className="h-4 bg-gray-700/30 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-gray-700/30 rounded w-40 animate-pulse" />
                  </div>
                </div>
                <div className="h-16 bg-gray-700/30 rounded animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 w-20 bg-gray-700/30 rounded-full animate-pulse" />
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== Main Experience Component ====================

const Experience = ({ className }: ExperienceProps) => {
  const { experiences, loading, error } = useExperiences();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  // Error State
  if (error) {
    return (
      <section
        id="experience"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work Experience
          </h2>
          <p className="text-red-400 mt-8">Failed to load experience data. Please try again later.</p>
        </div>
      </section>
    );
  }
  
  // Loading State
  if (loading) {
    return (
      <section
        id="experience"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Section Heading Skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-700/30 rounded w-96 max-w-full mx-auto animate-pulse mb-4" />
            <div className="h-6 bg-gray-700/30 rounded w-64 max-w-full mx-auto animate-pulse" />
          </div>
          
          {/* Experience Cards Skeleton */}
          <ExperienceSkeleton />
        </motion.div>
      </section>
    );
  }
  
  // Empty State
  if (experiences.length === 0) {
    return (
      <section
        id="experience"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work Experience
          </h2>
          <p className="text-gray-400 mt-8">No experience data available yet.</p>
        </div>
      </section>
    );
  }
  
  // Main Render
  return (
    <section
      id="experience"
      ref={sectionRef}
      className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
    >
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Section Heading */}
        <motion.div variants={headingVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative inline-block">
            Work Experience
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ originX: 0.5 }}
            />
          </h2>
          <p className="text-gray-400 text-lg mt-6">
            My professional journey and key accomplishments
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div className="relative">
          {experiences.map((exp, index) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={index}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
        
        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-400">
              {experiences.length} position{experiences.length !== 1 ? 's' : ''} held
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;
