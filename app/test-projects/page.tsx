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
import type { Project as ProjectType } from '@/types/portfolio';

// ==================== Mock Data ====================

const mockProjects: ProjectType[] = [
  {
    id: 'proj-1',
    title: 'AI-Powered Analytics Dashboard',
    description: 'Real-time analytics platform with AI-driven insights and predictive modeling for enterprise clients.',
    longDescription: 'A comprehensive analytics platform that leverages machine learning algorithms to provide real-time insights and predictive analytics for enterprise clients. Features include custom dashboards, automated reporting, and AI-driven recommendations.',
    techStack: ['React', 'Next.js', 'TypeScript', 'Python', 'TensorFlow', 'AWS', 'PostgreSQL'],
    features: [
      'Real-time data visualization with interactive charts',
      'AI-powered predictive analytics and forecasting',
      'Custom dashboard builder with drag-and-drop interface',
      'Automated report generation and scheduling',
      'Multi-tenant architecture supporting 100+ clients',
      'Advanced data filtering and search capabilities',
    ],
    links: {
      live: 'https://demo.analytics.com',
      github: 'https://github.com/example/analytics',
      demo: 'https://demo.analytics.com',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        alt: 'Analytics Dashboard',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    featured: true,
    order: 1,
    status: 'completed',
    role: 'Lead Developer',
    teamSize: 4,
  },
  {
    id: 'proj-2',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    longDescription: 'A modern e-commerce platform built with Next.js and Node.js, featuring secure payment processing, real-time inventory management, and a comprehensive admin dashboard.',
    techStack: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Docker'],
    features: [
      'Secure payment processing with Stripe integration',
      'Real-time inventory tracking and management',
      'Advanced product search and filtering',
      'Order management and tracking system',
      'Admin dashboard with analytics',
    ],
    links: {
      live: 'https://shop.example.com',
      github: 'https://github.com/example/ecommerce',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
        alt: 'E-Commerce Platform',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    featured: false,
    order: 2,
    status: 'completed',
  },
  {
    id: 'proj-3',
    title: 'Task Management System',
    description: 'Collaborative task management tool with real-time updates, team chat, and project tracking.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'PostgreSQL'],
    features: [
      'Real-time collaboration with WebSocket connections',
      'Kanban boards with drag-and-drop functionality',
      'Team chat and notifications',
      'Time tracking and reporting',
    ],
    links: {
      github: 'https://github.com/example/taskmanager',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        alt: 'Task Management',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    featured: false,
    order: 3,
    status: 'completed',
  },
  {
    id: 'proj-4',
    title: 'Weather Forecast App',
    description: 'Beautiful weather application with 7-day forecasts, interactive maps, and severe weather alerts.',
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    features: [
      '7-day detailed weather forecasts',
      'Interactive weather maps',
      'Severe weather alerts and notifications',
      'Location-based weather updates',
    ],
    links: {
      live: 'https://weather.example.com',
      github: 'https://github.com/example/weather',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
        alt: 'Weather App',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
    featured: false,
    order: 4,
    status: 'completed',
  },
  {
    id: 'proj-5',
    title: 'Portfolio Builder SaaS',
    description: 'No-code portfolio builder platform allowing users to create stunning portfolios without coding.',
    techStack: ['React', 'Next.js', 'Firebase', 'TypeScript', 'Tailwind CSS'],
    features: [
      'Drag-and-drop portfolio builder',
      'Multiple professional templates',
      'Custom domain support',
      'Analytics dashboard',
      'SEO optimization tools',
    ],
    links: {
      live: 'https://portfoliobuilder.example.com',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
        alt: 'Portfolio Builder',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    featured: true,
    order: 5,
    status: 'in-progress',
  },
  {
    id: 'proj-6',
    title: 'Social Media Dashboard',
    description: 'Unified dashboard for managing multiple social media accounts with scheduling and analytics.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
    features: [
      'Multi-account management',
      'Post scheduling and automation',
      'Engagement analytics',
      'Content calendar',
    ],
    links: {
      github: 'https://github.com/example/social-dashboard',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        alt: 'Social Media Dashboard',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    featured: false,
    order: 6,
    status: 'completed',
  },
];

// ==================== Component Implementation ====================

// Copy the same helper functions and components from the main file
const getAllTechnologies = (projects: ProjectType[]): string[] => {
  const techSet = new Set<string>();
  projects.forEach((project) => {
    project.techStack.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

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

const getCardSize = (project: ProjectType, index: number): 'small' | 'medium' | 'large' => {
  if (project.featured) return 'large';
  if (index % 3 === 0) return 'medium';
  return 'small';
};

const TechBadge = ({ tech, variant = 'default' }: { tech: string; variant?: 'default' | 'colored' }) => {
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
    'TensorFlow': 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    'Socket.io': 'bg-white/10 text-white border-white/30',
    'Stripe': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    'Tailwind CSS': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
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

const ProjectCard = ({ project, size, onClick }: { project: ProjectType; size: 'small' | 'medium' | 'large'; onClick: () => void }) => {
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
                    className={cn(
                      'object-cover transition-all duration-500 group-hover:scale-110',
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading="lazy"
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
              
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 rounded-full text-xs font-semibold text-cyan-300">
                  Featured
                </div>
              )}
              
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
          
          <GlassCardContent className={cn(
            'flex-1 flex flex-col',
            size === 'large' ? 'p-6' : 'p-4'
          )}>
            <h3 className={cn(
              'font-bold text-white group-hover:text-cyan-400 transition-colors mb-2',
              size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
            )}>
              {title}
            </h3>
            
            <p className={cn(
              'text-gray-300 leading-relaxed flex-1',
              size === 'large' ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
            )}>
              {description}
            </p>
            
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

const ProjectModal = ({ project, onClose }: { project: ProjectType; onClose: () => void }) => {
  const { title, description, longDescription, techStack, features, links, media, status, role, teamSize } = project;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="relative" padding="none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {media && media.length > 0 && (
            <div className="relative h-80 bg-gray-800 overflow-hidden">
              <Image
                src={media[0].url}
                alt={media[0].alt || title}
                fill
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>
          )}
          
          <div className="p-8 space-y-6">
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
            
            <div className="space-y-3">
              <p className="text-gray-300 leading-relaxed text-base">
                {longDescription || description}
              </p>
            </div>
            
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
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

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

// ==================== Main Test Page ====================

export default function TestProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  const technologies = useMemo(() => getAllTechnologies(mockProjects), []);
  
  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'All') {
      return mockProjects;
    }
    return mockProjects.filter((project) => 
      project.techStack.includes(selectedFilter)
    );
  }, [selectedFilter]);
  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-500/20 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            ← Back to Home
          </a>
          <h1 className="text-lg text-cyan-400">Projects Component Demo</h1>
        </div>
      </nav>
      
      {/* Projects Section */}
      <section
        id="projects"
        ref={sectionRef}
        className="relative py-16 md:py-24 lg:py-32 container mx-auto px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <FilterButton
              label="All"
              isActive={selectedFilter === 'All'}
              count={mockProjects.length}
              onClick={() => setSelectedFilter('All')}
            />
            {technologies.map((tech) => {
              const count = mockProjects.filter((p) => p.techStack.includes(tech)).length;
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
          
          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  size={getCardSize(project, index)}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
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
                {selectedFilter !== 'All' && ` • ${mockProjects.length} total`}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Info Section */}
      <section className="py-16 container mx-auto px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-lg border border-cyan-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">✨ Test Features:</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Bento grid layout with varying card sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Featured projects displayed larger</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Glassmorphic project cards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Hover effects revealing details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Project image/video preview</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Title, description, tech stack display</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Links to live demo and GitHub</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Color-coded tech stack tags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Filter buttons for technologies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Framer Motion animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Lazy loading for images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Expandable modal/lightbox view</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">💡 Interaction Tips:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Click</strong> any filter button to filter projects by technology</li>
              <li>• <strong>Click</strong> any project card to open detailed modal view</li>
              <li>• <strong>Hover</strong> over cards to see scale animation and image zoom</li>
              <li>• <strong>Hover</strong> over tech badges to see lift effects</li>
              <li>• Notice featured projects (larger cards with "Featured" badge)</li>
              <li>• Observe the bento grid layout with varying card sizes</li>
              <li>• Check status badges (In Progress, Planned, Completed)</li>
              <li>• Resize window to test responsive grid</li>
            </ul>
          </div>
        </div>
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
    </div>
  );
}

