'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Github,
  X,
  Play,
  Code2,
  Sparkles,
  Filter,
  Layers,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import GlassCard, { GlassCardContent } from '@/components/effects/GlassCard';
import { useProjects } from '@/lib/hooks/useProjects';
import type { Project as ProjectType } from '@/types/portfolio';

// ==================== Types ====================

interface ProjectsProps {
  className?: string;
}

interface ProjectCardProps {
  project: ProjectType;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
}

interface ProjectModalProps {
  project: ProjectType;
  onClose: () => void;
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

const filterVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ==================== Helper Functions ====================

/**
 * Get all unique technologies from projects
 */
const getAllTechnologies = (projects: ProjectType[]): string[] => {
  const techSet = new Set<string>();
  projects.forEach((project) => {
    project.techStack.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

/**
 * Get grid size class based on card size
 */
const getGridSizeClass = (size: 'small' | 'medium' | 'large'): string => {
  switch (size) {
    case 'large':
      return 'md:col-span-2 md:row-span-2';
    case 'medium':
      return 'md:col-span-2';
    case 'small':
    default:
      return 'md:col-span-1';
  }
};

/**
 * Determine card size based on project properties
 */
const getCardSize = (project: ProjectType, index: number): 'small' | 'medium' | 'large' => {
  // Featured projects are large
  if (project.featured) return 'large';

  // Every 3rd project is medium
  if (index % 3 === 0) return 'medium';

  // Default is small
  return 'small';
};

// ==================== Tech Badge Component ====================

const TechBadge = ({ tech, variant = 'default' }: { tech: string; variant?: 'default' | 'colored' }) => {
  // Color mapping for common technologies
  const techColors: Record<string, string> = {
    'React': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    'Next.js': 'bg-white/10 text-white border-white/30',
    'TypeScript': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'Node.js': 'bg-green-500/10 text-green-300 border-green-500/30',
    'Python': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    'Firebase': 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    'AWS': 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    'Docker': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'MongoDB': 'bg-green-500/10 text-green-300 border-green-500/30',
    'PostgreSQL': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  };

  const colorClass = variant === 'colored'
    ? (techColors[tech] || 'bg-purple-500/10 text-purple-300 border-purple-500/30')
    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';

  return (
    <motion.span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200',
        colorClass
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {tech}
    </motion.span>
  );
};

// ==================== Project Card Component ====================

const ProjectCard = ({ project, size, onClick }: ProjectCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const { title, description, techStack, links, thumbnail, media, featured, status } = project;
  const imageUrl = thumbnail || media[0]?.url;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn(
        'group cursor-pointer',
        getGridSizeClass(size)
      )}
      onClick={onClick}
    >
      <GlassCard
        className={cn(
          'h-full overflow-hidden hover:border-cyan-500/40 transition-all duration-300',
          featured && 'ring-2 ring-cyan-500/20'
        )}
        enableHover={false}
        padding="none"
      >
        <div className="relative h-full flex flex-col">
          {/* Image/Video Preview */}
          {imageUrl && (
            <div className={cn(
              'relative overflow-hidden bg-gray-800',
              size === 'large' ? 'h-64 md:h-80' : size === 'medium' ? 'h-48 md:h-56' : 'h-40 md:h-48'
            )}>
              {!imageError ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={cn(
                      'object-cover transition-all duration-500 group-hover:scale-110',
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading={featured ? 'eager' : 'lazy'}
                    priority={featured}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <Layers className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Featured Badge */}
              {featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 rounded-full text-xs font-semibold text-cyan-300">
                  Featured
                </div>
              )}

              {/* Status Badge */}
              {status && status !== 'completed' && (
                <div className={cn(
                  'absolute top-4 left-4 px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-semibold',
                  status === 'in-progress' && 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
                  status === 'planned' && 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                )}>
                  {status === 'in-progress' ? 'In Progress' : 'Planned'}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <GlassCardContent className={cn(
            'flex-1 flex flex-col',
            size === 'large' ? 'p-6' : 'p-4'
          )}>
            {/* Title */}
            <h3 className={cn(
              'font-bold text-white group-hover:text-cyan-400 transition-colors mb-2',
              size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
            )}>
              {title}
            </h3>

            {/* Description */}
            <p className={cn(
              'text-gray-300 leading-relaxed flex-1',
              size === 'large' ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
            )}>
              {description}
            </p>

            {/* Tech Stack */}
            {techStack && techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {techStack.slice(0, size === 'large' ? 6 : 4).map((tech, idx) => (
                  <TechBadge key={idx} tech={tech} variant="colored" />
                ))}
                {techStack.length > (size === 'large' ? 6 : 4) && (
                  <span className="text-xs text-gray-500">
                    +{techStack.length - (size === 'large' ? 6 : 4)} more
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center gap-3">
              {links.live && (
                <motion.a
                  href={links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  whileHover={{ x: 2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </motion.a>
              )}
              {links.github && (
                <motion.a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </motion.a>
              )}

              {/* View Details indicator */}
              <div className="ml-auto text-xs text-gray-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                <span>View Details</span>
                <motion.div
                  className="w-4 h-4 flex items-center justify-center"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </div>
          </GlassCardContent>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ==================== Project Modal Component ====================

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const { title, description, longDescription, techStack, features, links, media, status, role, teamSize } = project;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="relative" padding="none">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Media Gallery */}
          {media && media.length > 0 && (
            <div className="relative h-80 bg-gray-800 overflow-hidden">
              <Image
                src={media[0].url}
                alt={media[0].alt || title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {title}
                </h2>
                {status && (
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold border',
                    status === 'completed' && 'bg-green-500/10 text-green-400 border-green-500/30',
                    status === 'in-progress' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                    status === 'planned' && 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                  )}>
                    {status === 'in-progress' ? 'In Progress' : status === 'planned' ? 'Planned' : 'Completed'}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              {(role || teamSize) && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {role && (
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4" />
                      <span>{role}</span>
                    </div>
                  )}
                  {teamSize && (
                    <div className="flex items-center gap-1.5">
                      <span>👥</span>
                      <span>Team of {teamSize}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-gray-300 leading-relaxed text-base">
                {longDescription || description}
              </p>
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Key Features
                </h3>
                <ul className="grid gap-2">
                  {features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2 text-gray-300"
                    >
                      <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            {techStack && techStack.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <TechBadge key={idx} tech={tech} variant="colored" />
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4">
              {links.live && (
                <a
                  href={links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-cyan-400 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">Live Demo</span>
                </a>
              )}
              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                  <span className="font-medium">View Code</span>
                </a>
              )}
              {links.demo && links.demo !== links.live && (
                <a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-400 transition-all duration-200"
                >
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Demo</span>
                </a>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// ==================== Filter Button Component ====================

const FilterButton = ({
  label,
  isActive,
  count,
  onClick
}: {
  label: string;
  isActive: boolean;
  count?: number;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
        isActive
          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
          : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-800 hover:text-gray-300 hover:border-gray-600'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          'ml-1.5 text-xs',
          isActive ? 'text-cyan-400' : 'text-gray-500'
        )}>
          ({count})
        </span>
      )}
    </motion.button>
  );
};

// ==================== Loading Skeleton ====================

const ProjectsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div
          key={index}
          className={cn(
            'opacity-50',
            index === 1 && 'md:col-span-2 md:row-span-2',
            index === 3 && 'md:col-span-2'
          )}
        >
          <GlassCard className="h-full" padding="none">
            <div className={cn(
              'bg-gray-800/30 animate-pulse',
              index === 1 ? 'h-64 md:h-80' : index === 3 ? 'h-48 md:h-56' : 'h-40 md:h-48'
            )} />
            <GlassCardContent className="p-4 space-y-3">
              <div className="h-7 bg-gray-700/30 rounded animate-pulse w-3/4" />
              <div className="h-16 bg-gray-700/30 rounded animate-pulse" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 bg-gray-700/30 rounded-full animate-pulse" />
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      ))}
    </div>
  );
};

// ==================== Main Projects Component ====================

const Projects = ({ className }: ProjectsProps) => {
  const { projects: fetchedProjects, loading, error } = useProjects();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Get projects and sort by order
  const projects = useMemo(() => {
    if (!fetchedProjects || !Array.isArray(fetchedProjects)) {
      return [];
    }
    return [...fetchedProjects].sort((a, b) => {
      // Featured projects first, then by order
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.order - b.order;
    });
  }, [fetchedProjects]);

  // Get all technologies for filters
  const technologies = useMemo(() => getAllTechnologies(projects), [projects]);

  // Filter projects by selected technology
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') {
      return projects;
    }
    return projects.filter((project) =>
      project.techStack.includes(selectedFilter)
    );
  }, [projects, selectedFilter]);

  // Error State
  if (error) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-red-400 mt-8">Failed to load projects. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Loading State
  if (loading) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Heading Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-700/30 rounded w-96 max-w-full mx-auto animate-pulse mb-4" />
            <div className="h-6 bg-gray-700/30 rounded w-64 max-w-full mx-auto animate-pulse" />
          </div>

          {/* Filter Skeleton */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-24 bg-gray-700/30 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Projects Skeleton */}
          <ProjectsSkeleton />
        </motion.div>
      </section>
    );
  }

  // Empty State
  if (projects.length === 0) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 mt-8">No projects available yet.</p>
        </div>
      </section>
    );
  }

  // Main Render
  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className={cn('relative py-16 md:py-24 lg:py-32 container mx-auto px-4', className)}
      >
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Heading */}
          <motion.div variants={headingVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative inline-block">
              Featured Projects
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ originX: 0.5 }}
              />
            </h2>
            <p className="text-gray-400 text-lg mt-6">
              Showcasing my best work and technical expertise
            </p>
          </motion.div>

          {/* Filter Buttons */}
          {technologies.length > 0 && (
            <motion.div
              variants={filterVariants}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              <FilterButton
                label="All"
                isActive={selectedFilter === 'All'}
                count={projects.length}
                onClick={() => setSelectedFilter('All')}
              />
              {technologies.map((tech) => {
                const count = projects.filter((p) => p.techStack.includes(tech)).length;
                return (
                  <FilterButton
                    key={tech}
                    label={tech}
                    isActive={selectedFilter === tech}
                    count={count}
                    onClick={() => setSelectedFilter(tech)}
                  />
                );
              })}
            </motion.div>
          )}

          {/* Projects Grid - Bento Layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    size={getCardSize(project, index)}
                    onClick={() => setSelectedProject(project)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    No projects found with <span className="text-cyan-400 font-semibold">{selectedFilter}</span>
                  </p>
                  <button
                    onClick={() => setSelectedFilter('All')}
                    className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} displayed
                {selectedFilter !== 'All' && ` • ${projects.length} total`}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;
