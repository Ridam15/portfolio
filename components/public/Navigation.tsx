'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== Types ====================

interface NavLink {
  name: string;
  href: string;
  label: string;
}

interface NavigationProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom logo text
   * @default 'RIDAM CHHAPIYA'
   */
  logo?: string;
  
  /**
   * Custom navigation links
   */
  links?: NavLink[];
}

// ==================== Constants ====================

const DEFAULT_NAV_LINKS: NavLink[] = [
  { name: 'About', href: '#about', label: 'About Me' },
  { name: 'Experience', href: '#experience', label: 'Work Experience' },
  { name: 'Projects', href: '#projects', label: 'My Projects' },
  { name: 'Skills', href: '#skills', label: 'Technical Skills' },
  { name: 'Contact', href: '#contact', label: 'Get In Touch' },
];

// ==================== Animation Variants ====================

const navVariants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

const mobileMenuVariants = {
  closed: {
    x: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut' as const,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut' as const,
    },
  },
};

const menuItemVariants = {
  closed: {
    x: 50,
    opacity: 0,
  },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
};

const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

// ==================== Component ====================

/**
 * Navigation - Responsive navigation bar with glassmorphic design
 * 
 * @example
 * // Basic usage
 * <Navigation />
 * 
 * @example
 * // Custom logo
 * <Navigation logo="MY NAME" />
 * 
 * @example
 * // Custom links
 * <Navigation 
 *   links={[
 *     { name: 'Home', href: '#home', label: 'Home Page' },
 *     { name: 'About', href: '#about', label: 'About Me' },
 *   ]}
 * />
 */
export default function Navigation({
  className,
  logo = 'RIDAM CHHAPIYA',
  links = DEFAULT_NAV_LINKS,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ==================== Scroll Effects ====================

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show/hide nav based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          
          // Add backdrop blur when scrolled
          setIsScrolled(currentScrollY > 50);
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // ==================== Active Section Detection ====================

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    links.forEach((link) => {
      const element = document.querySelector(link.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [links]);

  // ==================== Smooth Scroll Handler ====================

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // ==================== Mobile Menu Toggle ====================

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // ==================== Render ====================

  return (
    <>
      <motion.nav
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={navVariants}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          className
        )}
      >
        <div
          className={cn(
            'border-b transition-all duration-300',
            isScrolled
              ? 'bg-gray-900/80 backdrop-blur-xl border-cyan-500/20 shadow-lg shadow-cyan-500/5'
              : 'bg-gray-900/40 backdrop-blur-md border-gray-800/50'
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                className="flex-shrink-0"
              >
                <a
                  href="#"
                  className="text-xl md:text-2xl font-bold tracking-wider"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-300 hover:to-cyan-300 transition-all duration-300">
                    {logo}
                  </span>
                </a>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {links.map((link) => {
                    const isActive = activeSection === link.href;
                    
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        aria-label={link.label}
                        className={cn(
                          'relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-300 group',
                          isActive
                            ? 'text-cyan-400'
                            : 'text-gray-300 hover:text-white'
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.span
                            layoutId="activeSection"
                            className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        
                        {/* Text */}
                        <span className="relative z-10">{link.name}</span>
                        
                        {/* Hover underline */}
                        <span
                          className={cn(
                            'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100',
                            isActive && 'scale-x-100'
                          )}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-gray-900/95 backdrop-blur-xl border-l border-cyan-500/20 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                  <div className="space-y-2">
                    {links.map((link, index) => {
                      const isActive = activeSection === link.href;
                      
                      return (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          custom={index}
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={cn(
                            'block px-4 py-3 rounded-lg font-medium transition-all duration-200',
                            isActive
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          )}
                        >
                          <span className="flex items-center justify-between">
                            {link.name}
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-cyan-400"
                              />
                            )}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    © 2024 {logo.split(' ')[0]}. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
