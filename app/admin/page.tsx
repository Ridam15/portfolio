'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  FolderGit2,
  Code2,
  Award,
  Mail,
  Home,
  Edit3,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  Eye,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuth from '@/lib/hooks/useAuth';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import { useExperiences } from '@/lib/hooks/useExperiences';
import { logOut } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/config';
import { collection, getCountFromServer } from 'firebase/firestore';
import { cn, formatDate } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';

// ==================== Types ====================

interface QuickStat {
  id: string;
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// ==================== Main Component ====================

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error } = usePortfolioData();
  const { experiences, loading: experiencesLoading } = useExperiences();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [contactSubmissionsCount, setContactSubmissionsCount] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get admin name from user email or display name
  const adminName = user?.displayName || user?.email?.split('@')[0] || 'Admin';

  // Handle logout
  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    setIsLoggingOut(true);
    const loadingToast = toast.loading('Logging out...');

    try {
      await logOut();
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      router.push('/admin-login');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to logout');
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  // Calculate stats - use real data from collections
  const totalProjects = data?.projects?.length || 0; // TODO: Create useProjects hook
  const totalExperiences = experiences?.length || 0; // ✅ Now using real data!
  const totalSkills = data?.skillCategories?.reduce((acc, cat) => acc + cat.skills.length, 0) || 0; // TODO: Create useSkills hook
  const totalCertifications = (data?.certifications?.length || 0) + (data?.achievements?.length || 0);

  // Quick stats configuration
  const quickStats: QuickStat[] = [
    {
      id: 'projects',
      label: 'Total Projects',
      value: totalProjects,
      icon: FolderGit2,
      color: 'text-blue-400',
      change: totalProjects > 0 ? '+' + totalProjects : undefined,
    },
    {
      id: 'experience',
      label: 'Work Experience',
      value: totalExperiences,
      icon: Briefcase,
      color: 'text-purple-400',
      change: totalExperiences > 0 ? '+' + totalExperiences : undefined,
    },
    {
      id: 'submissions',
      label: 'Contact Submissions',
      value: contactSubmissionsCount,
      icon: Mail,
      color: 'text-green-400',
      change: contactSubmissionsCount > 0 ? 'New' : undefined,
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: formatDate(lastUpdated.toISOString(), { month: 'short', day: 'numeric' }),
      icon: Calendar,
      color: 'text-cyan-400',
    },
  ];

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: 'hero',
      title: 'Edit Hero Section',
      description: 'Update your name, roles, and hero content',
      icon: Home,
      href: '/admin/edit/hero',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'about',
      title: 'Edit About',
      description: 'Manage your bio and professional summary',
      icon: User,
      href: '/admin/edit/about',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'experience',
      title: 'Manage Experience',
      description: 'Add or edit your work experience',
      icon: Briefcase,
      href: '/admin/edit/experience',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'projects',
      title: 'Manage Projects',
      description: 'Showcase your portfolio projects',
      icon: FolderGit2,
      href: '/admin/edit/projects',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'skills',
      title: 'Manage Skills',
      description: 'Update your technical skills and expertise',
      icon: Code2,
      href: '/admin/edit/skills',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'certifications',
      title: 'Manage Certifications',
      description: 'Add certifications and achievements',
      icon: Award,
      href: '/admin/edit/certifications',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'contact',
      title: 'View Contact Submissions',
      description: 'Review messages from visitors',
      icon: Mail,
      href: '/admin/contact-submissions',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'settings',
      title: 'Site Settings',
      description: 'Configure site metadata and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-600',
    },
  ];

  // Fetch contact submissions count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const coll = collection(db, 'contact_submissions');
        const snapshot = await getCountFromServer(coll);
        setContactSubmissionsCount(snapshot.data().count);
      } catch (error) {
        console.error('Error fetching contact submissions count:', error);
      }
    };

    fetchCount();
  }, []);

  // Loading state
  if (loading || experiencesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard variant="bordered" className="p-8 max-w-md text-center">
          <div className="text-red-400 mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome back, <span className="text-gradient-animate">{adminName}</span>!
                </h1>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                Manage your portfolio content and track engagement from your dashboard.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600 flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassCard variant="subtle" className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-3 rounded-lg bg-gray-800/50', stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    {stat.change && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-500/30">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                custom={index}
              >
                <Link href={action.href}>
                  <motion.div
                    variants={cardHoverVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <GlassCard
                      variant="default"
                      className="p-6 h-full cursor-pointer group relative overflow-hidden"
                      enableHover={false}
                    >
                      {/* Gradient overlay */}
                      <div
                        className={cn(
                          'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                          'bg-gradient-to-br',
                          action.color
                        )}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={cn(
                              'p-3 rounded-lg bg-gradient-to-br shadow-lg',
                              action.color
                            )}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gradient-animate transition-colors duration-300">
                            {action.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Activity */}
            <GlassCard variant="bordered" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-gray-500 text-sm">Loading activity...</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-gray-300 text-sm">Dashboard accessed</span>
                      </div>
                      <span className="text-gray-500 text-xs">Just now</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-300 text-sm">Portfolio data loaded</span>
                      </div>
                      <span className="text-gray-500 text-xs">1m ago</span>
                    </div>
                    {totalProjects === 0 && totalExperiences === 0 && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-gray-300 text-sm">Add your first content</span>
                        </div>
                        <span className="text-gray-500 text-xs">Pending</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </GlassCard>

            {/* Quick Links */}
            <GlassCard variant="bordered" className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              </div>
              <div className="space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      View Live Site
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      View Analytics
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      Site Settings
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Call to Action for Empty Content */}
        {totalProjects === 0 && totalExperiences === 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <GlassCard variant="glow" className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Let's Get Started!
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Your portfolio is empty. Start by adding your experience, projects, and skills to showcase your work to the world.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/admin/edit/experience">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Add Experience
                  </motion.button>
                </Link>
                <Link href="/admin/edit/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Add Projects
                  </motion.button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
