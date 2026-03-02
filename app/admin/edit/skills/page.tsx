'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
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
  Code2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import {
  addSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  addSkillToCategory,
  updateSkillInCategory,
  deleteSkillFromCategory,
  reorderSkillsInCategory,
} from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import type { SkillCategory, Skill } from '@/types/portfolio';

// ==================== Validation Schemas ====================

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().min(0),
});

const skillSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  proficiency: z.number().min(0, 'Proficiency must be at least 0').max(100, 'Proficiency must be at most 100'),
  yearsOfExperience: z.number().min(0, 'Years must be positive').optional(),
  icon: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type SkillFormData = z.infer<typeof skillSchema>;

// ==================== Category Modal ====================

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: SkillCategory | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  maxOrder: number;
}

function CategoryModal({ isOpen, onClose, category, onSave, maxOrder }: CategoryModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      order: maxOrder + 1,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        order: category.order,
      });
    } else {
      reset({
        name: '',
        description: '',
        icon: '',
        order: maxOrder + 1,
      });
    }
  }, [category, reset, maxOrder]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <GlassCard variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category ? 'Edit Category' : 'Add New Category'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g., Full-Stack Development"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300',
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  {...register('description')}
                  type="text"
                  placeholder="Brief description"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon Name (Lucide)
                </label>
                <input
                  {...register('icon')}
                  type="text"
                  placeholder="e.g., Code2, Cloud, Database"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  {...register('order', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    'flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
                    'hover:shadow-lg hover:shadow-indigo-500/30',
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
                      {category ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
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

// ==================== Skill Modal ====================

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill | null;
  categoryId: string;
  categoryName: string;
  onSave: (data: SkillFormData) => Promise<void>;
}

function SkillModal({ isOpen, onClose, skill, categoryId, categoryName, onSave }: SkillModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      proficiency: 50,
      yearsOfExperience: 0,
      icon: '',
      category: categoryName,
    },
  });

  const proficiencyValue = watch('proficiency');

  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience || 0,
        icon: skill.icon || '',
        category: categoryName,
      });
    } else {
      reset({
        name: '',
        proficiency: 50,
        yearsOfExperience: 0,
        icon: '',
        category: categoryName,
      });
    }
  }, [skill, reset, categoryName]);

  const onSubmit = async (data: SkillFormData) => {
    setIsSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving skill:', error);
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <GlassCard variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {skill ? 'Edit Skill' : 'Add New Skill'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g., React, Node.js, AWS"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300',
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proficiency: {proficiencyValue}% <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('proficiency', { valueAsNumber: true })}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
                {errors.proficiency && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.proficiency.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  {...register('yearsOfExperience', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 3"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon/Emoji
                </label>
                <input
                  {...register('icon')}
                  type="text"
                  placeholder="e.g., ⚛️, 🟢, 🐍"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    'flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                    'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
                    'hover:shadow-lg hover:shadow-cyan-500/30',
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
                      {skill ? 'Update' : 'Add'} Skill
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
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

export default function SkillsEditor() {
  const { data, loading: dataLoading, refetch } = usePortfolioData();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ skill: Skill; categoryId: string } | null>(null);
  const [selectedCategoryForSkill, setSelectedCategoryForSkill] = useState<{ id: string; name: string } | null>(null);

  // Delete confirmations
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<{ isOpen: boolean; category: SkillCategory | null }>({
    isOpen: false,
    category: null,
  });
  const [deleteSkillConfirm, setDeleteSkillConfirm] = useState<{ isOpen: boolean; skill: Skill | null; categoryId: string | null }>({
    isOpen: false,
    skill: null,
    categoryId: null,
  });

  // Load categories
  useEffect(() => {
    if (data?.skillCategories) {
      const sorted = [...data.skillCategories].sort((a, b) => a.order - b.order);
      setCategories(sorted);
      // Expand all by default
      setExpandedCategories(new Set(sorted.map(c => c.id)));
    }
  }, [data]);

  const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Category CRUD
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: SkillCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (formData: CategoryFormData) => {
    const loadingToast = toast.loading(editingCategory ? 'Updating category...' : 'Creating category...');

    try {
      if (editingCategory) {
        await updateSkillCategory(editingCategory.id, formData);
        toast.dismiss(loadingToast);
        toast.success('Category updated successfully!');
      } else {
        await addSkillCategory(formData);
        toast.dismiss(loadingToast);
        toast.success('Category created successfully!');
      }
      await refetch();
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save category');
      console.error('Error saving category:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryConfirm.category) return;

    const loadingToast = toast.loading('Deleting category...');

    try {
      await deleteSkillCategory(deleteCategoryConfirm.category.id);
      toast.dismiss(loadingToast);
      toast.success('Category deleted successfully!');
      await refetch();
      setDeleteCategoryConfirm({ isOpen: false, category: null });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  // Skill CRUD
  const handleAddSkill = (categoryId: string, categoryName: string) => {
    setSelectedCategoryForSkill({ id: categoryId, name: categoryName });
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const handleEditSkill = (skill: Skill, categoryId: string, categoryName: string) => {
    setSelectedCategoryForSkill({ id: categoryId, name: categoryName });
    setEditingSkill({ skill, categoryId });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (formData: SkillFormData) => {
    if (!selectedCategoryForSkill) return;

    const loadingToast = toast.loading(editingSkill ? 'Updating skill...' : 'Adding skill...');

    try {
      const skillData: Omit<Skill, 'id'> = {
        name: formData.name,
        proficiency: formData.proficiency,
        yearsOfExperience: formData.yearsOfExperience,
        icon: formData.icon || '',
        category: formData.category,
      };

      if (editingSkill) {
        await updateSkillInCategory(selectedCategoryForSkill.id, editingSkill.skill.id, skillData);
        toast.dismiss(loadingToast);
        toast.success('Skill updated successfully!');
      } else {
        await addSkillToCategory(selectedCategoryForSkill.id, skillData);
        toast.dismiss(loadingToast);
        toast.success('Skill added successfully!');
      }
      await refetch();
      setIsSkillModalOpen(false);
      setEditingSkill(null);
      setSelectedCategoryForSkill(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save skill');
      console.error('Error saving skill:', error);
      throw error;
    }
  };

  const handleDeleteSkill = async () => {
    if (!deleteSkillConfirm.skill || !deleteSkillConfirm.categoryId) return;

    const loadingToast = toast.loading('Deleting skill...');

    try {
      await deleteSkillFromCategory(deleteSkillConfirm.categoryId, deleteSkillConfirm.skill.id);
      toast.dismiss(loadingToast);
      toast.success('Skill deleted successfully!');
      await refetch();
      setDeleteSkillConfirm({ isOpen: false, skill: null, categoryId: null });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete skill');
      console.error('Error deleting skill:', error);
    }
  };

  // Reorder skills
  const handleMoveSkillUp = async (categoryId: string, skillIndex: number) => {
    if (skillIndex === 0) return;

    const loadingToast = toast.loading('Reordering...');

    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      const newSkills = [...category.skills];
      [newSkills[skillIndex - 1], newSkills[skillIndex]] = [newSkills[skillIndex], newSkills[skillIndex - 1]];

      await reorderSkillsInCategory(categoryId, newSkills);
      await refetch();
      toast.dismiss(loadingToast);
      toast.success('Skill reordered!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to reorder');
      console.error('Error reordering:', error);
    }
  };

  const handleMoveSkillDown = async (categoryId: string, skillIndex: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || skillIndex === category.skills.length - 1) return;

    const loadingToast = toast.loading('Reordering...');

    try {
      const newSkills = [...category.skills];
      [newSkills[skillIndex + 1], newSkills[skillIndex]] = [newSkills[skillIndex], newSkills[skillIndex + 1]];

      await reorderSkillsInCategory(categoryId, newSkills);
      await refetch();
      toast.dismiss(loadingToast);
      toast.success('Skill reordered!');
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
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-indigo-400" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Manage Skills
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                  Organize your skills by categories. You have {categories.length} {categories.length === 1 ? 'category' : 'categories'}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="btn-back-dashboard">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <button
                onClick={handleAddCategory}
                className="admin-btn px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
          </div>
        </motion.div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="subtle" className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Skill Categories Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start organizing your skills by creating your first category.
              </p>
              <button
                onClick={handleAddCategory}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 font-semibold mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Category
              </button>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => {
              const isExpanded = expandedCategories.has(category.id);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard variant="default" className="overflow-hidden">
                    {/* Category Header */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </motion.div>
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
                            <span className="px-2 py-1 bg-indigo-600/20 text-indigo-300 text-xs rounded-full">
                              {category.skills.length} {category.skills.length === 1 ? 'skill' : 'skills'}
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSkill(category.id, category.name)}
                          className="px-3 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Skill
                        </button>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryConfirm({ isOpen: true, category })}
                          className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Skills List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-800"
                        >
                          {category.skills.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">
                              No skills in this category yet. Click "Add Skill" to get started.
                            </div>
                          ) : (
                            <div className="p-4 space-y-2">
                              {category.skills.map((skill, skillIndex) => (
                                <motion.div
                                  key={skill.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: skillIndex * 0.05 }}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-50 dark:bg-gray-800/50 transition-colors group"
                                >
                                  {/* Reorder buttons */}
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => handleMoveSkillUp(category.id, skillIndex)}
                                      disabled={skillIndex === 0}
                                      className="p-1 text-gray-500 hover:text-gray-900 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveSkillDown(category.id, skillIndex)}
                                      disabled={skillIndex === category.skills.length - 1}
                                      className="p-1 text-gray-500 hover:text-gray-900 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Icon */}
                                  <div className="flex-shrink-0 w-8 text-center text-xl">
                                    {skill.icon || '💻'}
                                  </div>

                                  {/* Skill Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-gray-900 dark:text-white">{skill.name}</span>
                                      {skill.yearsOfExperience && (
                                        <span className="text-xs text-gray-500">
                                          {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                                        </span>
                                      )}
                                    </div>
                                    {/* Proficiency Bar */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${skill.proficiency}%` }}
                                          transition={{ duration: 0.5, delay: 0.2 }}
                                          className={cn(
                                            'h-full rounded-full',
                                            skill.proficiency >= 90 ? 'bg-green-500' :
                                              skill.proficiency >= 70 ? 'bg-cyan-500' :
                                                skill.proficiency >= 50 ? 'bg-blue-500' :
                                                  'bg-gray-500'
                                          )}
                                        />
                                      </div>
                                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                                        {skill.proficiency}%
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEditSkill(skill, category.id, category.name)}
                                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteSkillConfirm({ isOpen: true, skill, categoryId: category.id })}
                                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modals */}
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
          onSave={handleSaveCategory}
          maxOrder={maxOrder}
        />

        <SkillModal
          isOpen={isSkillModalOpen}
          onClose={() => {
            setIsSkillModalOpen(false);
            setEditingSkill(null);
            setSelectedCategoryForSkill(null);
          }}
          skill={editingSkill?.skill || null}
          categoryId={selectedCategoryForSkill?.id || ''}
          categoryName={selectedCategoryForSkill?.name || ''}
          onSave={handleSaveSkill}
        />

        {/* Delete Confirmations */}
        <ConfirmDialog
          isOpen={deleteCategoryConfirm.isOpen}
          onClose={() => setDeleteCategoryConfirm({ isOpen: false, category: null })}
          onConfirm={handleDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteCategoryConfirm.category?.name}"? This will also delete all skills in this category.`}
        />

        <ConfirmDialog
          isOpen={deleteSkillConfirm.isOpen}
          onClose={() => setDeleteSkillConfirm({ isOpen: false, skill: null, categoryId: null })}
          onConfirm={handleDeleteSkill}
          title="Delete Skill"
          message={`Are you sure you want to delete "${deleteSkillConfirm.skill?.name}"?`}
        />
      </div>
    </div>
  );
}
