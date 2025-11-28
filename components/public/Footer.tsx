'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  Heart,
  Code,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ==================== Types ====================

interface FooterProps {
  className?: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ==================== Configuration ====================

const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/ridamchhapiya',
    icon: Github,
    color: 'hover:text-purple-400',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/ridamchhapiya',
    icon: Linkedin,
    color: 'hover:text-blue-400',
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/ridamchhapiya',
    icon: Twitter,
    color: 'hover:text-cyan-400',
  },
  {
    platform: 'Email',
    url: 'mailto:ridamchhapiya5@gmail.com',
    icon: Mail,
    color: 'hover:text-green-400',
  },
];

// ==================== Main Component ====================

const Footer: React.FC<FooterProps> = ({ className }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer
      className={cn(
        'relative w-full border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-lg',
        className
      )}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <motion.h3
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              whileHover={{ scale: 1.05 }}
            >
              Ridam Chhapiya
            </motion.h3>
            <p className="text-sm text-gray-400">
              © {currentYear} Ridam Chhapiya.
              <br className="md:hidden" /> All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
              <span>using</span>
              <motion.div
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700/50"
                whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.5)' }}
              >
                <Code className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-300">Next.js</span>
              </motion.div>
              <span>&</span>
              <motion.div
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/50 border border-gray-700/50"
                whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.5)' }}
              >
                <span className="text-yellow-500">🔥</span>
                <span className="text-gray-300">Firebase</span>
              </motion.div>
            </div>
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-col items-center space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Right: Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-2 rounded-lg bg-gray-800/50 text-gray-400 transition-all',
                    'border border-gray-700/50 hover:border-gray-600',
                    social.color
                  )}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.platform}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Additional Info */}
        <div className="pt-6 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe className="w-3 h-3" />
            <span>Designed & Developed by Ridam Chhapiya</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms
            </Link>
            <span>•</span>
            <a
              href="https://github.com/ridamchhapiya/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              Source
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={cn(
              'fixed bottom-8 right-8 z-40',
              'p-3 rounded-full',
              'bg-gradient-to-r from-cyan-500 to-blue-500',
              'text-white shadow-lg shadow-cyan-500/20',
              'hover:shadow-xl hover:shadow-cyan-500/30',
              'transition-all duration-300'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
