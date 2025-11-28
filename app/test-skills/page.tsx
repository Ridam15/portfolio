'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Skills from '@/components/public/Skills';

// Mock data for testing
const mockSkillsData = {
  skillCategories: [
    {
      id: 'cat-1',
      name: 'Full-Stack Development',
      description: 'Frontend and backend technologies',
      skills: [
        { id: 'skill-1', name: 'React', proficiency: 95, yearsOfExperience: 4, icon: '⚛️', category: 'Full-Stack Development' },
        { id: 'skill-2', name: 'Next.js', proficiency: 90, yearsOfExperience: 3, icon: '▲', category: 'Full-Stack Development' },
        { id: 'skill-3', name: 'TypeScript', proficiency: 92, yearsOfExperience: 4, icon: 'TS', category: 'Full-Stack Development' },
        { id: 'skill-4', name: 'Node.js', proficiency: 88, yearsOfExperience: 4, icon: '🟢', category: 'Full-Stack Development' },
        { id: 'skill-5', name: 'Express.js', proficiency: 85, yearsOfExperience: 3, icon: '🚂', category: 'Full-Stack Development' },
        { id: 'skill-6', name: 'Python', proficiency: 80, yearsOfExperience: 3, icon: '🐍', category: 'Full-Stack Development' },
      ],
      order: 1,
    },
    {
      id: 'cat-2',
      name: 'Cloud & DevOps',
      description: 'Cloud platforms and deployment',
      skills: [
        { id: 'skill-7', name: 'AWS', proficiency: 85, yearsOfExperience: 3, icon: '☁️', category: 'Cloud & DevOps' },
        { id: 'skill-8', name: 'Docker', proficiency: 88, yearsOfExperience: 3, icon: '🐳', category: 'Cloud & DevOps' },
        { id: 'skill-9', name: 'Kubernetes', proficiency: 75, yearsOfExperience: 2, icon: '☸️', category: 'Cloud & DevOps' },
        { id: 'skill-10', name: 'CI/CD', proficiency: 82, yearsOfExperience: 3, icon: '🔄', category: 'Cloud & DevOps' },
        { id: 'skill-11', name: 'Terraform', proficiency: 70, yearsOfExperience: 2, icon: '🏗️', category: 'Cloud & DevOps' },
      ],
      order: 2,
    },
    {
      id: 'cat-3',
      name: 'Databases',
      description: 'SQL and NoSQL databases',
      skills: [
        { id: 'skill-12', name: 'PostgreSQL', proficiency: 90, yearsOfExperience: 4, icon: '🐘', category: 'Databases' },
        { id: 'skill-13', name: 'MongoDB', proficiency: 88, yearsOfExperience: 3, icon: '🍃', category: 'Databases' },
        { id: 'skill-14', name: 'Redis', proficiency: 80, yearsOfExperience: 2, icon: '📦', category: 'Databases' },
        { id: 'skill-15', name: 'Firebase', proficiency: 85, yearsOfExperience: 3, icon: '🔥', category: 'Databases' },
        { id: 'skill-16', name: 'MySQL', proficiency: 82, yearsOfExperience: 4, icon: '🐬', category: 'Databases' },
      ],
      order: 3,
    },
    {
      id: 'cat-4',
      name: 'Tools & Others',
      description: 'Development tools and methodologies',
      skills: [
        { id: 'skill-17', name: 'Git', proficiency: 95, yearsOfExperience: 5, icon: '🔱', category: 'Tools & Others' },
        { id: 'skill-18', name: 'VS Code', proficiency: 92, yearsOfExperience: 5, icon: '💻', category: 'Tools & Others' },
        { id: 'skill-19', name: 'Figma', proficiency: 78, yearsOfExperience: 2, icon: '🎨', category: 'Tools & Others' },
        { id: 'skill-20', name: 'Agile/Scrum', proficiency: 85, yearsOfExperience: 3, icon: '🔄', category: 'Tools & Others' },
        { id: 'skill-21', name: 'REST APIs', proficiency: 90, yearsOfExperience: 4, icon: '🔌', category: 'Tools & Others' },
        { id: 'skill-22', name: 'GraphQL', proficiency: 80, yearsOfExperience: 2, icon: '◈', category: 'Tools & Others' },
      ],
      order: 4,
    },
  ],
};

export default function TestSkillsPage() {
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
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Skills Component Demo
          </h1>
        </div>
      </nav>

      {/* Skills Component with Mock Data */}
      <Skills mockData={mockSkillsData.skillCategories} />

      {/* Test Features Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">✨ Test Features:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Visual Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>4 skill categories with custom icons and colors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Animated progress bars for each skill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Proficiency percentage display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Years of experience badges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Skill icons/emojis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Glassmorphic category cards</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Interactive Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Hover effects showing additional details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Scroll-triggered bar animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Staggered entrance animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Shimmer effect on hover</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Terminal-style aesthetic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Responsive grid (stacks on mobile)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Component Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">4</div>
              <div className="text-xs text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">22</div>
              <div className="text-xs text-gray-400">Skills</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">8</div>
              <div className="text-xs text-gray-400">Expert Level (90%+)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">86%</div>
              <div className="text-xs text-gray-400">Avg. Proficiency</div>
            </div>
          </div>
        </div>

        {/* Interaction Tips */}
        <div className="mt-8 glass-card p-6 bg-cyan-500/5 border-cyan-500/20">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 Interaction Tips:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              • <strong>Hover</strong> over any skill to see a tooltip with proficiency level and years of experience
            </li>
            <li>
              • <strong>Scroll</strong> to trigger progress bar animations
            </li>
            <li>
              • <strong>Notice</strong> the terminal-style footer on each category card
            </li>
            <li>
              • <strong>Observe</strong> the shimmer effect on progress bars when hovering
            </li>
            <li>
              • <strong>Check</strong> the stats bar at the top showing totals and averages
            </li>
            <li>
              • <strong>Resize</strong> the window to test responsive behavior (categories stack on mobile)
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

