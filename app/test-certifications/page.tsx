'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Certifications from '@/components/public/Certifications';

// Mock data for testing
const mockData = {
  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023-06-15',
      expirationDate: '2026-06-15',
      credentialUrl: 'https://aws.amazon.com/verification/123456',
      order: 1,
      icon: '☁️',
    },
    {
      id: 'cert-2',
      title: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      issueDate: '2023-03-10',
      expirationDate: '2025-03-10',
      credentialUrl: 'https://cloud.google.com/certification/verify/123456',
      order: 2,
      icon: '🌐',
    },
    {
      id: 'cert-3',
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      issueDate: '2022-11-20',
      expirationDate: '2025-11-20',
      credentialUrl: 'https://training.linuxfoundation.org/certification/verify/123456',
      order: 3,
      icon: '⚓',
    },
    {
      id: 'cert-4',
      title: 'MongoDB Certified Developer',
      issuer: 'MongoDB University',
      issueDate: '2022-08-05',
      credentialUrl: 'https://university.mongodb.com/verify/123456',
      order: 4,
      icon: '🍃',
    },
    {
      id: 'cert-5',
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta (Facebook)',
      issueDate: '2021-12-15',
      credentialUrl: 'https://coursera.org/verify/123456',
      order: 5,
      icon: '⚛️',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Hackathon Winner - TechCrunch Disrupt',
      description: 'Won first place at TechCrunch Disrupt 2023 with an AI-powered productivity tool that gained 10K users in the first week.',
      date: '2023-09-15',
      category: 'Award',
      url: 'https://techcrunch.com/disrupt-2023-winners',
      order: 1,
    },
    {
      id: 'ach-2',
      title: 'Open Source Contributor - React Core',
      description: 'Contributed multiple bug fixes and performance improvements to React core library, impacting millions of developers worldwide.',
      date: '2023-05-20',
      category: 'Contribution',
      url: 'https://github.com/facebook/react/pulls',
      order: 2,
    },
    {
      id: 'ach-3',
      title: 'Published Research Paper on ML Optimization',
      description: 'Co-authored research paper on machine learning model optimization techniques, published in IEEE conference proceedings.',
      date: '2023-01-10',
      category: 'Publication',
      url: 'https://ieeexplore.ieee.org/document/123456',
      order: 3,
    },
    {
      id: 'ach-4',
      title: 'Top 1% Contributor on Stack Overflow',
      description: 'Achieved top 1% ranking on Stack Overflow with over 50K reputation, helping thousands of developers solve complex problems.',
      date: '2022-12-01',
      category: 'Recognition',
      url: 'https://stackoverflow.com/users/123456',
      order: 4,
    },
    {
      id: 'ach-5',
      title: 'Speaker at React Conf 2022',
      description: 'Delivered a keynote talk on "Building Scalable Applications with React Server Components" to an audience of 2000+ developers.',
      date: '2022-10-25',
      category: 'Recognition',
      url: 'https://conf.reactjs.org/2022',
      order: 5,
    },
    {
      id: 'ach-6',
      title: 'Employee of the Year 2021',
      description: 'Recognized as Employee of the Year for exceptional contributions to product development and team leadership.',
      date: '2021-12-31',
      category: 'Award',
      order: 6,
    },
  ],
};

export default function TestCertificationsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Certifications & Achievements Demo
          </h1>
        </div>
      </nav>

      {/* Certifications Component with Mock Data */}
      <Certifications 
        mockCertifications={mockData.certifications} 
        mockAchievements={mockData.achievements}
      />

      {/* Test Features Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">✨ Test Features:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Certifications Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Card grid layout with 3 columns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Name, issuer, and dates displayed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Badge icons for each certification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>External verification links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Active/Expired status badges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Expiration warnings (yellow for expiring soon)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Hover glow effects</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Achievements Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Card grid layout matching certifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Title and detailed description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Dynamic icon based on category</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Category badges (Award, Publication, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Date display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>External "Learn More" links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Hover effects with purple glow</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Component Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">5</div>
              <div className="text-xs text-gray-400">Certifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">4</div>
              <div className="text-xs text-gray-400">Active Certs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">6</div>
              <div className="text-xs text-gray-400">Achievements</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">100%</div>
              <div className="text-xs text-gray-400">Responsive</div>
            </div>
          </div>
        </div>

        {/* Interaction Tips */}
        <div className="mt-8 glass-card p-6 bg-cyan-500/5 border-cyan-500/20">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 Interaction Tips:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              • <strong>Hover</strong> over any certification or achievement card to see the glow effect
            </li>
            <li>
              • <strong>Click</strong> "View Credential" links to verify certifications (external links)
            </li>
            <li>
              • <strong>Notice</strong> the animated counters at the top (counts up from 0)
            </li>
            <li>
              • <strong>Observe</strong> the status badges (Active/Expired) on certifications
            </li>
            <li>
              • <strong>Check</strong> the different icon animations on hover (rotate effects)
            </li>
            <li>
              • <strong>Scroll</strong> to trigger entrance animations with staggered delays
            </li>
            <li>
              • <strong>Resize</strong> the window to test responsive behavior (cards stack on mobile)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

