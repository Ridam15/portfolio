'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Loader2,
  Home,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import { updatePortfolioSection } from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import type { Hero, SocialLink, CTAButton } from '@/types/portfolio';

// ==================== Validation Schema ====================

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
});

const ctaButtonSchema = z.object({
  text: z.string().min(1, 'Button text is required'),
  url: z.string().min(1, 'Button link is required'),
  variant: z.enum(['primary', 'secondary', 'outline']).optional(),
  icon: z.string().optional(),
});

const heroSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  roles: z.array(z.string().min(1, 'Role cannot be empty')).min(1, 'At least one role is required'),
  location: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  ctaButtons: z.array(ctaButtonSchema).optional(),
});

type HeroFormData = z.infer<typeof heroSchema>;

// ==================== Social Platform Icons ====================

const socialPlatforms = [
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'website', label: 'Website', icon: Globe },
];

// ==================== Main Component ====================

export default function HeroEditor() {
  const { data, loading: dataLoading, refetch } = usePortfolioData();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: '',
      tagline: '',
      roles: [''],
      location: '',
      socialLinks: [],
      ctaButtons: [],
    },
  });

  const {
    fields: roleFields,
    append: appendRole,
    remove: removeRole,
  } = useFieldArray({
    control,
    name: 'roles' as never,
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: 'socialLinks' as never,
  });

  const {
    fields: ctaFields,
    append: appendCTA,
    remove: removeCTA,
  } = useFieldArray({
    control,
    name: 'ctaButtons' as never,
  });

  // Watch form values for preview
  const watchedValues = watch();

  // Load current hero data
  useEffect(() => {
    if (data?.hero) {
      reset({
        name: data.hero.name || '',
        tagline: data.hero.tagline || '',
        roles: data.hero.roles?.length ? data.hero.roles : [''],
        location: data.hero.location || '',
        socialLinks: data.hero.socialLinks || [],
        ctaButtons: data.hero.ctaButtons || [],
      });
    }
  }, [data, reset]);

  // Handle form submission
  const onSubmit = async (formData: HeroFormData) => {
    setIsSaving(true);
    const loadingToast = toast.loading('Saving hero section...');

    try {
      // Prepare data for Firestore
      const heroData: Partial<Hero> = {
        name: formData.name,
        tagline: formData.tagline,
        roles: formData.roles.filter(role => role.trim() !== ''),
        location: formData.location || '',
        socialLinks: formData.socialLinks || [],
        ctaButtons: formData.ctaButtons || [],
      };

      // Update Firestore
      await updatePortfolioSection('hero', heroData);

      // Refetch data
      await refetch();

      toast.dismiss(loadingToast);
      toast.success('Hero section updated successfully!');
      
      // Reset dirty state
      reset(formData);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update hero section');
      console.error('Error updating hero:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscard = () => {
    if (data?.hero) {
      reset({
        name: data.hero.name || '',
        tagline: data.hero.tagline || '',
        roles: data.hero.roles?.length ? data.hero.roles : [''],
        location: data.hero.location || '',
        socialLinks: data.hero.socialLinks || [],
        ctaButtons: data.hero.ctaButtons || [],
      });
      toast.info('Changes discarded');
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading hero data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Edit Hero Section
                </h1>
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  Update your name, tagline, roles, and social links for the hero section.
                </p>
              </div>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-gray-700 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2',
              showPreview
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            )}
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </motion.div>

        {/* Preview Panel */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <GlassCard variant="bordered" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Live Preview
                </h3>
                <div className="space-y-2 text-center">
                  <h1 className="text-4xl font-bold text-white">
                    {watchedValues.name || 'Your Name'}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-2 text-cyan-400">
                    {watchedValues.roles?.filter(r => r).map((role, idx) => (
                      <span key={idx} className="text-lg">
                        {role}
                        {idx < (watchedValues.roles?.filter(r => r).length || 0) - 1 && ' •'}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    {watchedValues.tagline || 'Your tagline'}
                  </p>
                  {watchedValues.location && (
                    <p className="text-gray-500 text-sm">{watchedValues.location}</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCard variant="default" className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Your full name"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300',
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Tagline Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tagline <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register('tagline')}
                  rows={3}
                  placeholder="A brief description about you"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-none',
                    errors.tagline ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                {errors.tagline && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.tagline.message}
                  </p>
                )}
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  placeholder="City, Country"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Roles Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Roles <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => appendRole('')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Role
                  </button>
                </div>
                <div className="space-y-3">
                  {roleFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`roles.${index}` as const)}
                        type="text"
                        placeholder="e.g., Full-Stack Developer"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                      {roleFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.roles && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.roles.message}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Social Links
                  </label>
                  <button
                    type="button"
                    onClick={() => appendSocial({ platform: 'github', url: '', icon: '' })}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {socialFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <select
                        {...register(`socialLinks.${index}.platform` as const)}
                        className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      >
                        {socialPlatforms.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register(`socialLinks.${index}.url` as const)}
                        type="url"
                        placeholder="https://..."
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    CTA Buttons
                  </label>
                  <button
                    type="button"
                    onClick={() => appendCTA({ text: '', url: '', variant: 'primary' })}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Button
                  </button>
                </div>
                <div className="space-y-3">
                  {ctaFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 flex-wrap">
                      <input
                        {...register(`ctaButtons.${index}.text` as const)}
                        type="text"
                        placeholder="Button Text"
                        className="flex-1 min-w-[150px] px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                      <input
                        {...register(`ctaButtons.${index}.url` as const)}
                        type="text"
                        placeholder="Link or #section"
                        className="flex-1 min-w-[150px] px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      />
                      <select
                        {...register(`ctaButtons.${index}.variant` as const)}
                        className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="outline">Outline</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeCTA(index)}
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-800">
              <button
                type="submit"
                disabled={isSaving || !isDirty}
                className={cn(
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                  'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
                  'hover:shadow-lg hover:shadow-blue-500/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isSaving || !isDirty}
                className={cn(
                  'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                  'bg-gray-800 text-gray-300 hover:bg-gray-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <X className="w-5 h-5" />
                Discard Changes
              </button>
            </div>
          </GlassCard>
        </form>
      </div>
    </div>
  );
}
