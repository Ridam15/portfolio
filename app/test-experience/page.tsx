'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronDown,
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import GlassCard, { GlassCardContent } from '@/components/effects/GlassCard';
import type { Experience as ExperienceType } from '@/types/portfolio';

// ==================== Mock Data ====================

const mockExperiences: ExperienceType[] = [
  {
    id: 'exp-1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    companyUrl: 'https://techcorp.com',
    companyLogo: '',
    location: 'San Francisco, CA',
    locationType: 'remote',
    startDate: '2022-01-01',
    current: true,
    description: 'Leading development of cloud-native applications using Next.js, React, and AWS. Architecting scalable microservices and implementing CI/CD pipelines for rapid deployment.',
    achievements: [
      'Reduced application load time by 60% through performance optimization and code splitting',
      'Led a team of 5 developers in delivering a major product feature ahead of schedule',
      'Implemented automated testing suite that increased code coverage to 85%',
      'Designed and deployed serverless architecture serving 1M+ daily active users',
      'Mentored junior developers and conducted code reviews to maintain high quality standards',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Redis'],
    order: 1,
  },
  {
    id: 'exp-2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    companyUrl: 'https://startupxyz.com',
    location: 'New York, NY',
    locationType: 'hybrid',
    startDate: '2020-06-01',
    endDate: '2021-12-31',
    current: false,
    description: 'Built and maintained multiple client-facing applications using modern JavaScript frameworks. Collaborated with design and product teams to deliver exceptional user experiences.',
    achievements: [
      'Developed 3 production-ready web applications from scratch',
      'Improved API response times by 40% through database query optimization',
      'Implemented real-time chat feature using WebSockets serving 50K+ users',
      'Created reusable component library adopted across multiple projects',
    ],
    techStack: ['React', 'Vue.js', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
    order: 2,
  },
  {
    id: 'exp-3',
    title: 'Frontend Developer',
    company: 'Digital Agency Pro',
    location: 'Austin, TX',
    locationType: 'onsite',
    startDate: '2019-01-01',
    endDate: '2020-05-31',
    current: false,
    description: 'Created responsive and accessible web interfaces for diverse clients. Worked closely with UX designers to implement pixel-perfect designs.',
    achievements: [
      'Delivered 15+ client projects with 100% satisfaction rate',
      'Improved website accessibility scores to meet WCAG 2.1 AA standards',
      'Reduced page load times by 45% through image optimization and lazy loading',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'SASS', 'Webpack', 'Git'],
    order: 3,
  },
];

// ==================== Helper Components ====================

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

// ==================== Animation Variants ====================

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

// ==================== Experience Card ====================

const ExperienceCard = ({ experience, index, isLast }: { experience: ExperienceType; index: number; isLast: boolean }) => {
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

// Local component to avoid state mutation issues
const ExperienceCardWithState = ({ experience, index, isLast }: { experience: ExperienceType; index: number; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return <ExperienceCard experience={experience} index={index} isLast={isLast} />;
};

// ==================== Main Test Page ====================

export default function TestExperiencePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-500/20 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            ← Back to Home
          </a>
          <h1 className="text-lg text-cyan-400">Experience Component Demo</h1>
        </div>
      </nav>
      
      {/* Experience Section */}
      <section
        id="experience"
        ref={sectionRef}
        className="relative py-16 md:py-24 lg:py-32 container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
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
            {mockExperiences.map((exp, index) => (
              <ExperienceCardWithState
                key={exp.id}
                experience={exp}
                index={index}
                isLast={index === mockExperiences.length - 1}
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
                {mockExperiences.length} positions held
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
                <span>Vertical timeline with connecting line</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Animated dots at each experience point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Company icons in timeline dots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>GlassCard styling for each experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Expandable achievements sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Tech stack badges with hover effects</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Scroll-triggered animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Date formatting and duration calculation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>"Current" badge for ongoing positions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Location type badges (Remote/Hybrid/On-site)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">✓</span>
                <span>Smooth expand/collapse animations</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">💡 Interaction Tips:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Click</strong> on "Key Achievements (N)" to expand/collapse achievements</li>
              <li>• <strong>Hover</strong> over tech stack badges to see scale effects</li>
              <li>• <strong>Scroll</strong> up and down to see timeline and card animations</li>
              <li>• <strong>Resize</strong> window to test responsive layout (timeline adjusts for mobile)</li>
              <li>• Notice the pulsing "Current" badge on the first position</li>
              <li>• Observe the gradient timeline line connecting all experiences</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
