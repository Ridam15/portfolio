'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2,
  Cloud,
  Database,
  Wrench,
  TrendingUp,
  Clock,
  Award,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard, {
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle
} from '@/components/effects/GlassCard';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import type { SkillCategory } from '@/types/portfolio';

// ==================== Types ====================

interface SkillsProps {
  className?: string;
  mockData?: SkillCategory[]; // For testing purposes
}

interface SkillItemProps {
  skill: {
    id: string;
    name: string;
    proficiency: number;
    yearsOfExperience?: number;
    icon?: string;
  };
  index: number;
  categoryColor: string;
}

// ==================== Category Icons & Colors ====================

const categoryConfig = {
  'Full-Stack Development': {
    icon: Code2,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  'Cloud & DevOps': {
    icon: Cloud,
    color: 'blue',
    gradient: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  'Databases': {
    icon: Database,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  'Tools & Others': {
    icon: Wrench,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
};

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const skillItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// ==================== Skill Item Component ====================

const SkillItem: React.FC<SkillItemProps> = ({ skill, index, categoryColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { name, proficiency, yearsOfExperience, icon } = skill;

  // Get proficiency level label
  const getProficiencyLabel = (level: number): string => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    if (level >= 40) return 'Proficient';
    return 'Beginner';
  };

  const proficiencyLabel = getProficiencyLabel(proficiency);

  return (
    <motion.div
      variants={skillItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Skill Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-lg" role="img" aria-label={name}>
              {icon}
            </span>
          )}
          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn('font-semibold', `text-${categoryColor}-400`)}>
            {proficiency}%
          </span>
          {yearsOfExperience && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 text-gray-400"
            >
              <Clock className="w-3 h-3" />
              {yearsOfExperience}y
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Animated Background Shimmer */}
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-r',
            categoryConfig[categoryColor as keyof typeof categoryConfig]?.gradient || 'from-gray-500 to-gray-600',
            'opacity-20'
          )}
          animate={isHovered ? { x: ['0%', '100%', '0%'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Progress Fill */}
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r',
            categoryConfig[categoryColor as keyof typeof categoryConfig]?.gradient || 'from-gray-500 to-gray-600'
          )}
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05 }}
        />

        {/* Glow Effect on Hover */}
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            'shadow-lg',
            `shadow-${categoryColor}-500/50`
          )}
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: `${proficiency}%`, opacity: isHovered ? 0.8 : 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05 }}
        />
      </div>

      {/* Hover Details Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        className={cn(
          'absolute -top-12 left-0 right-0 z-10',
          'bg-gray-900/95 backdrop-blur-sm border',
          categoryConfig[categoryColor as keyof typeof categoryConfig]?.borderColor || 'border-gray-700',
          'rounded-lg p-2 shadow-lg pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300">{proficiencyLabel}</span>
          {yearsOfExperience && (
            <span className="text-gray-400">{yearsOfExperience} years exp.</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== Category Card Component ====================

interface CategoryCardProps {
  category: SkillCategory;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const config = categoryConfig[category.name as keyof typeof categoryConfig] || categoryConfig['Tools & Others'];
  const IconComponent = config.icon;

  // Sort skills by proficiency
  const sortedSkills = [...category.skills].sort((a, b) => b.proficiency - a.proficiency);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard
        variant="default"
        className="h-full"
        enableHover
      >
        <GlassCardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                'p-2 rounded-lg',
                config.bgColor,
                'border',
                config.borderColor
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <IconComponent className={cn('w-5 h-5', config.textColor)} />
            </motion.div>
            <div className="flex-1">
              <GlassCardTitle className="text-lg font-bold text-white mb-1">
                {category.name}
              </GlassCardTitle>
              {category.description && (
                <p className="text-xs text-gray-400">{category.description}</p>
              )}
            </div>
            <motion.div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                config.textColor
              )}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Award className="w-3 h-3" />
              {sortedSkills.length}
            </motion.div>
          </div>
        </GlassCardHeader>

        <GlassCardContent className="space-y-4">
          {sortedSkills.map((skill, idx) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              index={idx}
              categoryColor={config.color}
            />
          ))}
        </GlassCardContent>

        {/* Terminal-style footer */}
        <div className={cn(
          'mt-4 pt-3 border-t',
          config.borderColor,
          'flex items-center justify-between text-xs'
        )}>
          <span className="text-gray-500 font-mono">
            $ skills --category "{category.name}"
          </span>
          <span className={cn('font-mono', config.textColor)}>
            {sortedSkills.length} found
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ==================== Loading Skeleton ====================

const SkillsSkeleton: React.FC = () => {
  return (
    <section id="skills" className="relative py-16 md:py-24 lg:py-32 container mx-auto px-4">
      {/* Heading Skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-gray-800 rounded mx-auto mb-2 animate-pulse" />
        <div className="h-6 w-96 max-w-full bg-gray-800/50 rounded mx-auto animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-8 w-16 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gray-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-700 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-800 rounded" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j}>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-24 bg-gray-700 rounded" />
                    <div className="h-4 w-12 bg-gray-700 rounded" />
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

// ==================== Main Skills Component ====================

const Skills: React.FC<SkillsProps> = ({ className, mockData }) => {
  const { data, loading, error } = usePortfolioData();

  // Get skill categories from portfolio data or mock data
  const skillCategories: SkillCategory[] = mockData || data?.skillCategories || [];

  // If using mock data, override loading and error states
  const isLoading = mockData ? false : loading;
  const hasError = mockData ? null : error;

  // Calculate stats
  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
  const averageProficiency = skillCategories.length > 0
    ? Math.round(
      skillCategories.reduce(
        (sum, cat) => sum + cat.skills.reduce((s, skill) => s + skill.proficiency, 0),
        0
      ) / totalSkills
    )
    : 0;
  const expertSkills = skillCategories.reduce(
    (sum, cat) => sum + cat.skills.filter(s => s.proficiency >= 90).length,
    0
  );

  // Loading state
  if (isLoading) {
    return <SkillsSkeleton />;
  }

  // Error state
  if (hasError) {
    return (
      <section id="skills" className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}>
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gradient-animate"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Technical Skills
        </motion.h2>
        <div className="text-center text-red-400">
          <p>Error loading skills data: {hasError.message}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (skillCategories.length === 0) {
    return (
      <section id="skills" className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}>
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gradient-animate"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Technical Skills
        </motion.h2>
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg mb-2">No skills data available yet.</p>
          <p className="text-gray-500 text-sm">Add your skills to Firestore to see them here.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
    >
      {/* Section Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Technical Skills
          <motion.span
            className="block h-1 w-24 mx-auto mt-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </h2>
        <p className="text-gray-400 text-lg mt-2">
          My technical expertise across various domains
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <GlassCard variant="bordered" className="px-6 py-4" enableHover>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-2xl font-bold text-white">{totalSkills}</div>
              <div className="text-xs text-gray-400">Total Skills</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="bordered" className="px-6 py-4" enableHover>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{expertSkills}</div>
              <div className="text-xs text-gray-400">Expert Level</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="bordered" className="px-6 py-4" enableHover>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{averageProficiency}%</div>
              <div className="text-xs text-gray-400">Avg. Proficiency</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {skillCategories
          .sort((a, b) => a.order - b.order)
          .map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
      </motion.div>

      {/* Terminal-style Footer */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-block glass-card px-6 py-3 font-mono text-xs text-gray-400">
          <span className="text-green-400">➜</span> Constantly learning and improving{' '}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            _
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
