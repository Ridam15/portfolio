'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Save,
  X,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  FolderGit2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Github,
  Code2,
  Star,
  Filter,
  GripVertical,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjects } from '@/lib/hooks/useProjects';
import {
  addProject,
  updateProject,
  deleteProject,
} from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/firebase/storage';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/portfolio';

// ==================== Validation Schema ====================

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  techStack: z.array(z.string().min(1)).min(1, 'At least one technology is required'),
  features: z.array(z.string().min(1)).optional(),
  links: z.object({
    live: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
  }).optional(),
  thumbnail: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().min(0),
  category: z.string().optional(),
  status: z.enum(['completed', 'in-progress', 'planned']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  role: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// ==================== Project Modal Component ====================

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSave: (data: ProjectFormData, thumbnailFile?: File) => Promise<void>;
  maxOrder: number;
}

function ProjectModal({ isOpen, onClose, project, onSave, maxOrder }: ProjectModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      techStack: [''],
      features: [''],
      links: {
        live: '',
        github: '',
        demo: '',
      },
      thumbnail: '',
      featured: false,
      order: maxOrder + 1,
      category: '',
      status: 'completed',
      startDate: '',
      endDate: '',
      role: '',
    },
  });

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: 'techStack' as never,
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: 'features' as never,
  });

  // Load project data when editing
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || '',
        techStack: project.techStack || [''],
        features: project.features?.length ? project.features : [''],
        links: {
          live: project.links?.live || '',
          github: project.links?.github || '',
          demo: project.links?.demo || '',
        },
        thumbnail: project.thumbnail || '',
        featured: project.featured || false,
        order: project.order,
        category: project.category || '',
        status: project.status || 'completed',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        role: project.role || '',
      });
      if (project.thumbnail) {
        setThumbnailPreview(project.thumbnail);
      }
    } else {
      reset({
        title: '',
        description: '',
        longDescription: '',
        techStack: [''],
        features: [''],
        links: {
          live: '',
          github: '',
          demo: '',
        },
        thumbnail: '',
        featured: false,
        order: maxOrder + 1,
        category: '',
        status: 'completed',
        startDate: '',
        endDate: '',
        role: '',
      });
      setThumbnailPreview(null);
    }
  }, [project, reset, maxOrder]);

  // Handle thumbnail upload
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setThumbnailFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    try {
      await onSave(data, thumbnailFile || undefined);
      onClose();
      setThumbnailFile(null);
      setThumbnailPreview(null);
    } catch (error) {
      console.error('Error saving project:', error);
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
          className="w-full max-w-5xl max-h-[90vh] overflow-y-auto my-8"
        >
          <GlassCard variant="default" className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">
                  {project ? 'Edit Project' : 'Add New Project'}
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
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Thumbnail
                </label>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className={cn(
                    'relative w-full h-48 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer',
                    'flex items-center justify-center overflow-hidden',
                    thumbnailPreview
                      ? 'border-orange-500/50 bg-gray-800/30'
                      : 'border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/50'
                  )}
                >
                  {thumbnailPreview ? (
                    <>
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-12 h-12 text-gray-500" />
                      <span className="text-sm text-gray-400">Click to upload thumbnail</span>
                      <span className="text-xs text-gray-500">Image, max 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="e.g., E-commerce Platform"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300',
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
                    Category
                  </label>
                  <input
                    {...register('category')}
                    type="text"
                    placeholder="e.g., Web Development"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Brief description for project cards..."
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none',
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

              {/* Long Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Description (Optional)
                </label>
                <textarea
                  {...register('longDescription')}
                  rows={5}
                  placeholder="Full project details, implementation, challenges, outcomes..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 resize-none"
                />
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
                    className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tech
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {techFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`techStack.${index}` as const)}
                        type="text"
                        placeholder="e.g., React"
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
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

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Key Features
                  </label>
                  <button
                    type="button"
                    onClick={() => appendFeature('')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {featureFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`features.${index}` as const)}
                        type="text"
                        placeholder="e.g., Real-time notifications"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live URL
                  </label>
                  <input
                    {...register('links.live')}
                    type="url"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    {...register('links.github')}
                    type="url"
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Demo URL
                  </label>
                  <input
                    {...register('links.demo')}
                    type="url"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role
                  </label>
                  <input
                    {...register('role')}
                    type="text"
                    placeholder="e.g., Lead Developer"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    {...register('startDate')}
                    type="month"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    {...register('endDate')}
                    type="month"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Order & Featured */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    {...register('order', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors w-full">
                    <input
                      {...register('featured')}
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-2 focus:ring-orange-500/50"
                    />
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Featured Project</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={cn(
                    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2',
                    'bg-gradient-to-r from-orange-600 to-red-600 text-white',
                    'hover:shadow-lg hover:shadow-orange-500/30',
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
                      {project ? 'Update' : 'Create'} Project
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

export default function ProjectEditor() {
  const { projects: fetchedProjects, loading: dataLoading, refetch } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  });

  // Load projects
  useEffect(() => {
    if (fetchedProjects) {
      const sorted = [...fetchedProjects].sort((a, b) => a.order - b.order);
      setProjects(sorted);
      setFilteredProjects(sorted);
    }
  }, [fetchedProjects]);

  // Filter projects by technology
  useEffect(() => {
    if (selectedTech === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.techStack.includes(selectedTech)));
    }
  }, [selectedTech, projects]);

  // Get all unique technologies
  const allTechnologies = ['All', ...Array.from(new Set(projects.flatMap(p => p.techStack)))].sort();

  const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order)) : 0;

  // Handle add new
  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async (formData: ProjectFormData, thumbnailFile?: File) => {
    const loadingToast = toast.loading(editingProject ? 'Updating project...' : 'Creating project...');

    try {
      let thumbnailUrl = formData.thumbnail || '';

      // Upload thumbnail if provided
      if (thumbnailFile) {
        const uploadingToast = toast.loading('Uploading thumbnail...');
        const fileName = `project-${Date.now()}.${thumbnailFile.name.split('.').pop()}`;
        thumbnailUrl = await uploadFile(`projects/${fileName}`, thumbnailFile);
        toast.dismiss(uploadingToast);
      }

      // Prepare project data
      const projectData: Partial<Project> = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription || '',
        techStack: formData.techStack.filter(t => t.trim() !== ''),
        features: formData.features?.filter(f => f.trim() !== '') || [],
        links: {
          live: formData.links?.live || '',
          github: formData.links?.github || '',
          demo: formData.links?.demo || '',
        },
        thumbnail: thumbnailUrl,
        featured: formData.featured || false,
        order: formData.order,
        category: formData.category || '',
        status: formData.status || 'completed',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        role: formData.role || '',
        media: thumbnailUrl ? [{ type: 'image', url: thumbnailUrl, alt: formData.title }] : [],
      };

      if (editingProject) {
        // Update existing
        await updateProject(editingProject.id, projectData);
        toast.dismiss(loadingToast);
        toast.success('Project updated successfully!');
      } else {
        // Create new
        await addProject(projectData as Omit<Project, 'id'>);
        toast.dismiss(loadingToast);
        toast.success('Project created successfully!');
      }

      await refetch();
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save project');
      console.error('Error saving project:', error);
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.project) return;

    const loadingToast = toast.loading('Deleting project...');

    try {
      await deleteProject(deleteConfirm.project.id);
      toast.dismiss(loadingToast);
      toast.success('Project deleted successfully!');
      await refetch();
      setDeleteConfirm({ isOpen: false, project: null });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-8 h-8 text-orange-400" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Manage Projects
                </h1>
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  Manage your portfolio projects. You have {projects.length} {projects.length === 1 ? 'project' : 'projects'}.
                </p>
              </div>
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
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">Filter by Technology:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTechnologies.map(tech => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    selectedTech === tech
                      ? 'bg-orange-600/40 text-white border border-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50 hover:border-orange-500/30'
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 && selectedTech !== 'All' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="subtle" className="p-12 text-center">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Projects Found
              </h3>
              <p className="text-gray-500 mb-6">
                No projects use "{selectedTech}". Try a different filter or add a new project.
              </p>
              <button
                onClick={() => setSelectedTech('All')}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Show All Projects
              </button>
            </GlassCard>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard variant="subtle" className="p-12 text-center">
              <FolderGit2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Projects Added Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start showcasing your work by adding your first project.
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 font-semibold mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Project
              </button>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard variant="default" className="p-0 overflow-hidden group" enableHover>
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 bg-gray-800">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-800 text-cyan-300 text-xs rounded-full border border-cyan-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, project })}
                        className="flex-1 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSave={handleSave}
          maxOrder={maxOrder}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, project: null })}
          onConfirm={handleDelete}
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteConfirm.project?.title}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}
