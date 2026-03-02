'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Settings,
  Save,
  Loader2,
  Globe,
  FileText,
  Tag,
  User,
  Mail,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Shield,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import { updatePortfolioSection } from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// ==================== Types ====================

const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  siteDescription: z.string().min(10, 'Description must be at least 10 characters'),
  siteUrl: z.string().url('Invalid URL').or(z.literal('')),
  ogImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  keywords: z.string().optional(),
  author: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleVerification: z.string().optional(),
  twitterHandle: z.string().optional(),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

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

// ==================== Main Component ====================

export default function SiteSettingsPage() {
  const { data, loading, error, refetch } = usePortfolioData();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: '',
      siteDescription: '',
      siteUrl: '',
      ogImage: '',
      keywords: '',
      author: '',
      googleAnalyticsId: '',
      googleVerification: '',
      twitterHandle: '',
    },
  });

  // Load current metadata
  useEffect(() => {
    if (data?.metadata) {
      reset({
        siteTitle: data.metadata.siteTitle || '',
        siteDescription: data.metadata.siteDescription || '',
        siteUrl: data.metadata.siteUrl || '',
        ogImage: data.metadata.ogImage || '',
        keywords: data.metadata.seo?.keywords?.join(', ') || '',
        author: data.metadata.seo?.author || '',
        googleAnalyticsId: data.metadata.analytics?.googleAnalyticsId || '',
        googleVerification: '', // Not stored, just for reference
        twitterHandle: '', // Not stored in metadata yet
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: SiteSettingsFormData) => {
    setIsSaving(true);
    const loadingToast = toast.loading('Saving site settings...');

    try {
      const metadataUpdate = {
        siteTitle: formData.siteTitle,
        siteDescription: formData.siteDescription,
        siteUrl: formData.siteUrl,
        ogImage: formData.ogImage || '',
        seo: {
          keywords: formData.keywords ? formData.keywords.split(',').map((k) => k.trim()) : [],
          author: formData.author || '',
        },
        analytics: {
          googleAnalyticsId: formData.googleAnalyticsId || '',
        },
        version: '1.0.0',
      };

      await updatePortfolioSection('metadata', metadataUpdate);

      toast.dismiss(loadingToast);
      toast.success('Site settings saved successfully!');
      await refetch();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm('Discard all unsaved changes?')) {
      if (data?.metadata) {
        reset({
          siteTitle: data.metadata.siteTitle || '',
          siteDescription: data.metadata.siteDescription || '',
          siteUrl: data.metadata.siteUrl || '',
          ogImage: data.metadata.ogImage || '',
          keywords: data.metadata.seo?.keywords?.join(', ') || '',
          author: data.metadata.seo?.author || '',
          googleAnalyticsId: data.metadata.analytics?.googleAnalyticsId || '',
          googleVerification: '',
          twitterHandle: '',
        });
      }
      toast.info('Changes discarded');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Site Settings</h1>
                  <p className="text-gray-600 dark:text-gray-400">Configure site metadata and SEO settings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="btn-back-dashboard">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                {isDirty && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 md:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* General Settings */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    General Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Title *
                      </label>
                      <Input
                        {...register('siteTitle')}
                        placeholder="e.g., Ridam Chhapiya | Full-Stack Developer"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      {errors.siteTitle && (
                        <p className="text-red-400 text-xs mt-1">{errors.siteTitle.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Description *
                      </label>
                      <Textarea
                        {...register('siteDescription')}
                        placeholder="Brief description of your portfolio site for search engines..."
                        rows={3}
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      {errors.siteDescription && (
                        <p className="text-red-400 text-xs mt-1">{errors.siteDescription.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site URL
                      </label>
                      <Input
                        {...register('siteUrl')}
                        placeholder="https://yourdomain.com"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      {errors.siteUrl && (
                        <p className="text-red-400 text-xs mt-1">{errors.siteUrl.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="pt-6 border-t border-gray-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Tag className="w-6 h-6 text-green-400" />
                    SEO Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Keywords (comma-separated)
                      </label>
                      <Input
                        {...register('keywords')}
                        placeholder="React, Next.js, Full-Stack Developer, Portfolio"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Author Name
                      </label>
                      <Input
                        {...register('author')}
                        placeholder="Your Name"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Open Graph Image URL
                      </label>
                      <Input
                        {...register('ogImage')}
                        placeholder="https://yourdomain.com/og-image.png"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Image shown when sharing on social media (1200x630px recommended)
                      </p>
                      {errors.ogImage && (
                        <p className="text-red-400 text-xs mt-1">{errors.ogImage.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Twitter Handle
                      </label>
                      <Input
                        {...register('twitterHandle')}
                        placeholder="@yourusername"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics & Verification */}
                <div className="pt-6 border-t border-gray-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Code2 className="w-6 h-6 text-purple-400" />
                    Analytics & Verification
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Analytics ID
                      </label>
                      <Input
                        {...register('googleAnalyticsId')}
                        placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your Google Analytics measurement ID
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Search Console Verification
                      </label>
                      <Input
                        {...register('googleVerification')}
                        placeholder="Your verification code"
                        className="bg-gray-800/30 border-gray-300 dark:border-gray-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Verification meta tag content (update in app/layout.tsx)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-800">
                  <Button
                    type="submit"
                    disabled={isSaving || !isDirty}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                  {isDirty && (
                    <Button
                      type="button"
                      onClick={handleDiscard}
                      disabled={isSaving}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-700"
                    >
                      Discard Changes
                    </Button>
                  )}
                </div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Info Card */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 bg-blue-500/5 border-blue-500/20">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About Site Settings</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• These settings control your site's metadata and SEO</li>
                    <li>• Changes here affect how your site appears in search results</li>
                    <li>• Make sure to update your OG image for better social sharing</li>
                    <li>• Google Analytics helps track visitor engagement</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

