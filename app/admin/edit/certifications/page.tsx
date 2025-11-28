'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Award,
  Plus,
  X,
  Edit,
  Trash2,
  Loader2,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { uploadFile, deleteFile } from '@/lib/firebase/storage';
import useAuth from '@/lib/hooks/useAuth';
import { cn, formatDate } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// ==================== Types ====================

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  badgeUrl?: string;
  order: number;
  createdAt?: any;
  updatedAt?: any;
}

// ==================== Validation Schema ====================

const certificationSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  issuer: z.string().min(2, 'Issuer must be at least 2 characters'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  badgeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  order: z.number().min(0),
});

type CertificationFormData = z.infer<typeof certificationSchema>;

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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// ==================== Main Component ====================

export default function CertificationsEditor() {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [badgePreview, setBadgePreview] = useState<string | null>(null);
  const [badgeUploadProgress, setBadgeUploadProgress] = useState(0);
  const badgeInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      badgeUrl: '',
      order: 0,
    },
  });

  const watchedBadgeUrl = watch('badgeUrl');

  // Real-time listener for certifications
  useEffect(() => {
    const q = query(collection(db, 'certifications'), orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const certsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Certification[];
        setCertifications(certsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching certifications:', error);
        toast.error('Failed to load certifications');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update form when editing
  useEffect(() => {
    if (editingCert) {
      reset({
        title: editingCert.title || '',
        issuer: editingCert.issuer || '',
        issueDate: editingCert.issueDate || '',
        expiryDate: editingCert.expiryDate || '',
        credentialId: editingCert.credentialId || '',
        credentialUrl: editingCert.credentialUrl || '',
        description: editingCert.description || '',
        badgeUrl: editingCert.badgeUrl || '',
        order: editingCert.order || 0,
      });
      setBadgePreview(editingCert.badgeUrl || null);
    } else {
      const maxOrder = certifications.length > 0 ? Math.max(...certifications.map((c) => c.order)) + 1 : 0;
      reset({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        badgeUrl: '',
        order: maxOrder,
      });
      setBadgePreview(null);
      setBadgeFile(null);
    }
  }, [editingCert, reset, certifications]);

  const handleBadgeUpload = async (file: File) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setBadgeFile(file);
    setBadgePreview(URL.createObjectURL(file));
    setBadgeUploadProgress(0);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const uploadPath = `certification_badges/${user.uid}/${fileName}`;

      const downloadURL = await uploadFile(uploadPath, file);

      setValue('badgeUrl', downloadURL, { shouldValidate: true });
      setBadgeUploadProgress(100);
      toast.success('Badge uploaded successfully');
    } catch (error) {
      console.error('Badge upload error:', error);
      toast.error('Failed to upload badge');
      setBadgeFile(null);
      setBadgePreview(null);
      setBadgeUploadProgress(0);
    }
  };

  const onSubmit = async (formData: CertificationFormData) => {
    setIsSaving(true);
    const loadingToast = toast.loading(editingCert ? 'Updating certification...' : 'Creating certification...');

    try {
      if (editingCert) {
        // Update existing
        await updateDoc(doc(db, 'certifications', editingCert.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast.dismiss(loadingToast);
        toast.success('Certification updated successfully!');
      } else {
        // Create new
        await addDoc(collection(db, 'certifications'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.dismiss(loadingToast);
        toast.success('Certification created successfully!');
      }

      setIsModalOpen(false);
      setEditingCert(null);
      reset();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save certification');
      console.error('Error saving certification:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, badgeUrl?: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    const loadingToast = toast.loading('Deleting certification...');

    try {
      // Delete badge from storage if it exists
      if (badgeUrl) {
        try {
          await deleteFile(badgeUrl);
        } catch (error) {
          console.error('Error deleting badge file:', error);
          // Continue even if file deletion fails
        }
      }

      // Delete certification document
      await deleteDoc(doc(db, 'certifications', id));
      toast.dismiss(loadingToast);
      toast.success('Certification deleted successfully');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete certification');
      console.error('Error deleting certification:', error);
    }
  };

  const handleAddNew = () => {
    setEditingCert(null);
    setIsModalOpen(true);
  };

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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Certifications</h1>
              <p className="text-gray-400">Manage your professional certifications and achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" className="border-gray-700 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={handleAddNew} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30">
              <Plus className="w-5 h-5 mr-2" />
              Add Certification
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && certifications.length === 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <Award className="w-12 h-12 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Certifications Yet</h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first professional certification.
                </p>
                <Button onClick={handleAddNew} className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Certification
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Certifications Grid */}
      {!loading && certifications.length > 0 && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 h-full flex flex-col hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                {/* Badge Image */}
                {cert.badgeUrl && (
                  <div className="mb-4 flex justify-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-800/30 flex items-center justify-center">
                      <img
                        src={cert.badgeUrl}
                        alt={cert.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-blue-400 font-medium mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {cert.issuer}
                  </p>
                  <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Issued: {formatDate(new Date(cert.issueDate))}
                  </p>
                  {cert.expiryDate && (
                    <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Expires: {formatDate(new Date(cert.expiryDate))}
                    </p>
                  )}
                  {cert.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{cert.description}</p>
                  )}
                  {cert.credentialId && (
                    <p className="text-xs text-gray-500 mb-3 font-mono">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                  {cert.credentialUrl && (
                    <Button
                      onClick={() => window.open(cert.credentialUrl, '_blank')}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button onClick={() => handleEdit(cert)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(cert.id, cert.badgeUrl)}
                    size="sm"
                    variant="outline"
                    className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSaving && setIsModalOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard className="p-6 md:p-8">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {editingCert ? 'Edit Certification' : 'Add Certification'}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {editingCert ? 'Update certification details' : 'Add a new professional certification'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isSaving && setIsModalOpen(false)}
                    disabled={isSaving}
                    className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Certification Title *
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      className="bg-gray-800/30 border-gray-700"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Issuer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Issuing Organization *
                    </label>
                    <Input
                      {...register('issuer')}
                      placeholder="e.g., Amazon Web Services"
                      className="bg-gray-800/30 border-gray-700"
                    />
                    {errors.issuer && (
                      <p className="text-red-400 text-xs mt-1">{errors.issuer.message}</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issue Date *
                      </label>
                      <Input
                        type="date"
                        {...register('issueDate')}
                        className="bg-gray-800/30 border-gray-700"
                      />
                      {errors.issueDate && (
                        <p className="text-red-400 text-xs mt-1">{errors.issueDate.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date (optional)
                      </label>
                      <Input
                        type="date"
                        {...register('expiryDate')}
                        className="bg-gray-800/30 border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Credential ID & URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Credential ID (optional)
                      </label>
                      <Input
                        {...register('credentialId')}
                        placeholder="e.g., ABC123XYZ"
                        className="bg-gray-800/30 border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Verification URL (optional)
                      </label>
                      <Input
                        {...register('credentialUrl')}
                        placeholder="https://..."
                        className="bg-gray-800/30 border-gray-700"
                      />
                      {errors.credentialUrl && (
                        <p className="text-red-400 text-xs mt-1">{errors.credentialUrl.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Brief description of the certification..."
                      rows={3}
                      className="bg-gray-800/30 border-gray-700"
                    />
                  </div>

                  {/* Badge Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Certification Badge (optional)
                    </label>
                    <div className="space-y-3">
                      {badgePreview || watchedBadgeUrl ? (
                        <div className="relative inline-block">
                          <img
                            src={badgePreview || watchedBadgeUrl || ''}
                            alt="Badge preview"
                            className="w-32 h-32 object-contain rounded-lg bg-gray-800/30 border border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBadgeFile(null);
                              setBadgePreview(null);
                              setValue('badgeUrl', '');
                            }}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => badgeInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/20 transition-all"
                        >
                          <UploadCloud className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm mb-1">Click to upload badge image</p>
                          <p className="text-gray-600 text-xs">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                      <input
                        ref={badgeInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error('Image must be less than 2MB');
                              return;
                            }
                            handleBadgeUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                      {badgeUploadProgress > 0 && badgeUploadProgress < 100 && (
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${badgeUploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-800">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {editingCert ? 'Update' : 'Create'} Certification
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => !isSaving && setIsModalOpen(false)}
                      disabled={isSaving}
                      variant="outline"
                      className="border-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

