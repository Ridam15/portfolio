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
  Edit2,
  Loader2,
  Briefcase,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  Building2,
  Code2,
  Award,
  GripVertical,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useExperiences } from '@/lib/hooks/useExperiences';
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from '@/lib/firebase/firestore';
import { cn, formatDate } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import type { Experience } from '@/types/portfolio';

// ==================== Validation Schema ====================

const experienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  locationType: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  achievements: z.array(z.string().min(1)).optional(),
  techStack: z.array(z.string().min(1)).min(1, 'At least one technology is required'),
  companyUrl: z.string().url().optional().or(z.literal('')),
  companyLogo: z.string().url().optional().or(z.literal('')),
  order: z.number().min(0),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

// ==================== Modal Component ====================

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
  onSave: (data: ExperienceFormData) => Promise<void>;
  maxOrder: number;
}

function ExperienceModal({ isOpen, onClose, experience, onSave, maxOrder }: ExperienceModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      locationType: 'onsite',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
      techStack: [''],
      companyUrl: '',
      companyLogo: '',
      order: maxOrder + 1,
    },
  });

  const {
    fields: achievementFields,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: 'achievements' as never,
  });

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: 'techStack' as never,
  });

  const isCurrent = watch('current');

  // Load experience data when editing
  useEffect(() => {
    if (experience) {
      reset({
        title: experience.title,
        company: experience.company,
        location: experience.location,
        locationType: experience.locationType || 'onsite',
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        current: experience.current || false,
        description: experience.description,
        achievements: experience.achievements?.length ? experience.achievements : [''],
        techStack: experience.techStack || [''],
        companyUrl: experience.companyUrl || '',
        companyLogo: experience.companyLogo || '',
        order: experience.order,
      });
    } else {
      reset({
        title: '',
        company: '',
        location: '',
        locationType: 'onsite',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
        techStack: [''],
        companyUrl: '',
        companyLogo: '',
        order: maxOrder + 1,
      });
    }
  }, [experience, reset, maxOrder]);

  // Auto-clear end date when "current" is checked
  useEffect(() => {
    if (isCurrent) {
      setValue('endDate', '');
    }
  }, [isCurrent, setValue]);

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSaving(true);
    try {
      // Filter out empty achievements and tech
      const cleanedData = {
        ...data,
        achievements: data.achievements?.filter(a => a.trim() !== '') || [],
        techStack: data.techStack.filter(t => t.trim() !== ''),
      };
      await onSave(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <GlassCard variant="default" className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">
                  {experience ? 'Edit Experience' : 'Add New Experience'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g., Senior Full-Stack Developer"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300',
                      errors.title ? 'border-red-500' : 'border-gray-700'
                    )}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    placeholder="e.g., Tech Corp"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300',
                      errors.company ? 'border-red-500' : 'border-gray-700'
                    )}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300',
                      errors.location ? 'border-red-500' : 'border-gray-700'
                    )}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Type
                  </label>
                  <select
                    {...register('locationType')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('startDate')}
                    type="month"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300',
                      errors.startDate ? 'border-red-500' : 'border-gray-700'
                    )}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    {...register('endDate')}
                    type="month"
                    disabled={isCurrent}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white',
                      'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      errors.endDate ? 'border-red-500' : 'border-gray-700'
                    )}
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors w-full">
                    <input
                      {...register('current')}
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-600 focus:ring-2 focus:ring-green-500/50"
                    />
                    <span className="text-sm text-gray-300">Current Position</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe your role and responsibilities..."
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 resize-none',
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Key Achievements
                  </label>
                  <button
                    type="button"
                    onClick={() => appendAchievement('')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {achievementFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`achievements.${index}` as const)}
                        type="text"
                        placeholder="e.g., Increased team productivity by 30%"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                      />
                      {achievementFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Tech Stack <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => appendTech('')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Technology
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {techFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`techStack.${index}` as const)}
                        type="text"
                        placeholder="e.g., React"
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                      />
                      {techFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTech(index)}
                          className="px-2 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.techStack && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.techStack.message}
                  </p>
                )}
              </div>

              {/* Optional URLs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Website (Optional)
                  </label>
                  <input
                    {...register('companyUrl')}
                    type="url"
                    placeholder="https://company.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Logo URL (Optional)
                  </label>
                  <input
                    {...register('companyLogo')}
                    type="url"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  {...register('order', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                    'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
                    'hover:shadow-lg hover:shadow-green-500/30',
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
                      {experience ? 'Update' : 'Create'} Experience
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== Confirmation Dialog ====================

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <GlassCard variant="bordered" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-600/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== Main Component ====================

export default function ExperienceEditor() {
  const { experiences, loading: dataLoading, refetch } = useExperiences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; experience: Experience | null }>({
    isOpen: false,
    experience: null,
  });

  const maxOrder = experiences.length > 0 ? Math.max(...experiences.map(e => e.order)) : 0;

  // Handle add new
  const handleAddNew = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async (formData: ExperienceFormData) => {
    const loadingToast = toast.loading(editingExperience ? 'Updating experience...' : 'Creating experience...');

    try {
      if (editingExperience) {
        // Update existing
        await updateExperience(editingExperience.id, formData);
        toast.dismiss(loadingToast);
        toast.success('Experience updated successfully!');
      } else {
        // Create new
        await addExperience({
          ...formData,
          current: formData.current || false,
          achievements: formData.achievements || [],
        });
        toast.dismiss(loadingToast);
        toast.success('Experience created successfully!');
      }
      await refetch();
      setIsModalOpen(false);
      setEditingExperience(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save experience');
      console.error('Error saving experience:', error);
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.experience) return;

    const loadingToast = toast.loading('Deleting experience...');

    try {
      await deleteExperience(deleteConfirm.experience.id);
      toast.dismiss(loadingToast);
      toast.success('Experience deleted successfully!');
      await refetch();
      setDeleteConfirm({ isOpen: false, experience: null });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete experience');
      console.error('Error deleting experience:', error);
    }
  };

  // Handle reorder (move up/down)
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const loadingToast = toast.loading('Reordering...');

    try {
      const newExperiences = [...experiences];
      const temp = newExperiences[index - 1];
      newExperiences[index - 1] = newExperiences[index];
      newExperiences[index] = temp;

      // Update order values
      for (let i = 0; i < newExperiences.length; i++) {
        await updateExperience(newExperiences[i].id, { order: i });
      }

      await refetch();
      toast.dismiss(loadingToast);
      toast.success('Order updated!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to reorder');
      console.error('Error reordering:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === experiences.length - 1) return;

    const loadingToast = toast.loading('Reordering...');

    try {
      const newExperiences = [...experiences];
      const temp = newExperiences[index + 1];
      newExperiences[index + 1] = newExperiences[index];
      newExperiences[index] = temp;

      // Update order values
      for (let i = 0; i < newExperiences.length; i++) {
        await updateExperience(newExperiences[i].id, { order: i });
      }

      await refetch();
      toast.dismiss(loadingToast);
      toast.success('Order updated!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to reorder');
      console.error('Error reordering:', error);
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Manage Experience
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" className="border-gray-700 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Experience
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your work experience. You have {experiences.length} {experiences.length === 1 ? 'entry' : 'entries'}.
          </p>
        </motion.div>

        {/* Experience List */}
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="subtle" className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Experience Added Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your professional timeline by adding your first experience.
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 font-semibold mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Experience
              </button>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="default" className="p-6" enableHover>
                  <div className="flex gap-4">
                    {/* Drag Handle & Reorder */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <GripVertical className="w-5 h-5 text-gray-600" />
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === experiences.length - 1}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {experience.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {experience.company}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {experience.location}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(experience.startDate, { year: 'numeric', month: 'short' })} -{' '}
                              {experience.current ? 'Present' : formatDate(experience.endDate || '', { year: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(experience)}
                            className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, experience })}
                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {experience.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {experience.techStack.slice(0, 6).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-800 text-cyan-300 text-xs rounded-full border border-cyan-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {experience.techStack.length > 6 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{experience.techStack.length - 6} more
                          </span>
                        )}
                      </div>

                      {/* Achievements Count */}
                      {experience.achievements && experience.achievements.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Award className="w-4 h-4" />
                          {experience.achievements.length} {experience.achievements.length === 1 ? 'achievement' : 'achievements'}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <ExperienceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExperience(null);
          }}
          experience={editingExperience}
          onSave={handleSave}
          maxOrder={maxOrder}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, experience: null })}
          onConfirm={handleDelete}
          title="Delete Experience"
          message={`Are you sure you want to delete "${deleteConfirm.experience?.title}" at ${deleteConfirm.experience?.company}? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}
