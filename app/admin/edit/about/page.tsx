'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  User,
  Upload,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Code2,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePortfolioData } from '@/lib/hooks/useFirestore';
import { updatePortfolioSection } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/firebase/storage';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import type { About, TechStackItem } from '@/types/portfolio';

// ==================== Validation Schema ====================

const techStackSchema = z.object({
  name: z.string().min(1, 'Tech name is required'),
  icon: z.string().optional(),
  color: z.string().optional(),
  proficiency: z.number().min(0).max(100).optional(),
});

const aboutSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  summary: z.string().optional(),
  yearsOfExperience: z.number().min(0, 'Years of experience must be positive'),
  techStack: z.array(techStackSchema).optional(),
  resumeUrl: z.string().optional(),
  photoUrl: z.string().optional(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

// ==================== Main Component ====================

export default function AboutEditor() {
  const { data, loading: dataLoading, refetch } = usePortfolioData();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio: '',
      summary: '',
      yearsOfExperience: 0,
      techStack: [],
      resumeUrl: '',
      photoUrl: '',
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

  // Watch form values for preview
  const watchedValues = watch();

  // Load current about data
  useEffect(() => {
    if (data?.about) {
      reset({
        bio: data.about.bio || '',
        summary: data.about.summary || '',
        yearsOfExperience: data.about.yearsOfExperience || 0,
        techStack: data.about.techStack || [],
        resumeUrl: data.about.resumeUrl || '',
        photoUrl: data.about.photoUrl || '',
      });
      if (data.about.photoUrl) {
        setPhotoPreview(data.about.photoUrl);
      }
    }
  }, [data, reset]);

  // Handle resume file upload
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
    setIsUploadingResume(true);
    const uploadToast = toast.loading('Uploading resume...');

    try {
      const fileName = `resume-${Date.now()}.pdf`;
      const url = await uploadFile(`resumes/${fileName}`, file);
      setValue('resumeUrl', url, { shouldDirty: true });
      toast.dismiss(uploadToast);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.dismiss(uploadToast);
      toast.error('Failed to upload resume');
      console.error('Resume upload error:', error);
    } finally {
      setIsUploadingResume(false);
    }
  };

  // Handle photo file upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingPhoto(true);
    const uploadToast = toast.loading('Uploading photo...');

    try {
      const fileName = `photo-${Date.now()}.${file.name.split('.').pop()}`;
      const url = await uploadFile(`photos/${fileName}`, file);
      setValue('photoUrl', url, { shouldDirty: true });
      toast.dismiss(uploadToast);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      toast.dismiss(uploadToast);
      toast.error('Failed to upload photo');
      console.error('Photo upload error:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle form submission
  const onSubmit = async (formData: AboutFormData) => {
    setIsSaving(true);
    const loadingToast = toast.loading('Saving about section...');

    try {
      // Prepare data for Firestore
      const aboutData: Partial<About> = {
        bio: formData.bio,
        summary: formData.summary || '',
        yearsOfExperience: formData.yearsOfExperience,
        techStack: formData.techStack || [],
        resumeUrl: formData.resumeUrl || '',
        photoUrl: formData.photoUrl || '',
      };

      // Update Firestore
      await updatePortfolioSection('about', aboutData);

      // Refetch data
      await refetch();

      toast.dismiss(loadingToast);
      toast.success('About section updated successfully!');

      // Reset dirty state
      reset(formData);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update about section');
      console.error('Error updating about:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscard = () => {
    if (data?.about) {
      reset({
        bio: data.about.bio || '',
        summary: data.about.summary || '',
        yearsOfExperience: data.about.yearsOfExperience || 0,
        techStack: data.about.techStack || [],
        resumeUrl: data.about.resumeUrl || '',
        photoUrl: data.about.photoUrl || '',
      });
      setPhotoPreview(data.about.photoUrl || null);
      toast.info('Changes discarded');
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Loading about data...</p>
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Edit About Section
                </h1>
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  Update your bio, tech stack, experience, and profile information.
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
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
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
                  <Eye className="w-5 h-5 text-purple-400" />
                  Live Preview
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Photo Preview */}
                  {photoPreview && (
                    <div className="md:col-span-1">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-purple-500/30">
                        <Image
                          src={photoPreview}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {/* Bio Preview */}
                  <div className={photoPreview ? 'md:col-span-2' : 'md:col-span-3'}>
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-semibold text-cyan-300">
                        {watchedValues.yearsOfExperience}+ Years Experience
                      </span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {watchedValues.bio || 'Your bio will appear here...'}
                    </p>
                    {watchedValues.summary && (
                      <p className="text-gray-400 text-sm mt-4">
                        {watchedValues.summary}
                      </p>
                    )}
                    {/* Tech Stack Preview */}
                    {watchedValues.techStack && watchedValues.techStack.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-white mb-3">Tech Stack:</h4>
                        <div className="flex flex-wrap gap-2">
                          {watchedValues.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCard variant="default" className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Bio Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio / Professional Summary <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register('bio')}
                  rows={6}
                  placeholder="Write a compelling professional summary..."
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none',
                    errors.bio ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Summary Field (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Summary (Optional)
                </label>
                <textarea
                  {...register('summary')}
                  rows={3}
                  placeholder="Additional information or tagline..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('yearsOfExperience', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 5"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg bg-gray-800/50 border text-white placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300',
                    errors.yearsOfExperience ? 'border-red-500' : 'border-gray-700'
                  )}
                />
                {errors.yearsOfExperience && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.yearsOfExperience.message}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Tech Stack
                  </label>
                  <button
                    type="button"
                    onClick={() => appendTech({ name: '', icon: '', color: '' })}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Technology
                  </button>
                </div>
                <div className="space-y-3">
                  {techFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`techStack.${index}.name` as const)}
                        type="text"
                        placeholder="e.g., React, Node.js"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      />
                      <input
                        {...register(`techStack.${index}.icon` as const)}
                        type="text"
                        placeholder="Icon/Emoji (optional)"
                        className="w-24 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeTech(index)}
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {techFields.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No tech stack added yet. Click "Add Technology" to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume (PDF)
                  </label>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isUploadingResume}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border-2 border-dashed transition-all duration-300',
                      'flex flex-col items-center justify-center gap-2 min-h-[120px]',
                      isUploadingResume
                        ? 'border-purple-500/50 bg-purple-600/10 cursor-wait'
                        : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50 cursor-pointer'
                    )}
                  >
                    {isUploadingResume ? (
                      <>
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        <span className="text-sm text-gray-400">Uploading...</span>
                      </>
                    ) : watchedValues.resumeUrl ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <span className="text-sm text-green-400">Resume Uploaded</span>
                        <span className="text-xs text-gray-500">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-8 h-8 text-gray-500" />
                        <span className="text-sm text-gray-400">Upload Resume</span>
                        <span className="text-xs text-gray-500">PDF, max 5MB</span>
                      </>
                    )}
                  </button>
                  {watchedValues.resumeUrl && (
                    <a
                      href={watchedValues.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors block text-center"
                    >
                      View Current Resume
                    </a>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo (Optional)
                  </label>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border-2 border-dashed transition-all duration-300',
                      'flex flex-col items-center justify-center gap-2 min-h-[120px] relative overflow-hidden',
                      isUploadingPhoto
                        ? 'border-purple-500/50 bg-purple-600/10 cursor-wait'
                        : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50 cursor-pointer'
                    )}
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        <span className="text-sm text-gray-400">Uploading...</span>
                      </>
                    ) : photoPreview ? (
                      <>
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                          <Image
                            src={photoPreview}
                            alt="Profile Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-green-400">Photo Uploaded</span>
                        <span className="text-xs text-gray-500">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                        <span className="text-sm text-gray-400">Upload Photo</span>
                        <span className="text-xs text-gray-500">Image, max 2MB</span>
                      </>
                    )}
                  </button>
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
                  'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
                  'hover:shadow-lg hover:shadow-purple-500/30',
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
