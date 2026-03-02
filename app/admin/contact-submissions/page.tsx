'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Trash2,
  Eye,
  X,
  Calendar,
  User,
  Briefcase,
  Phone,
  MessageSquare,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Archive,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { cn, formatDate } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';

// ==================== Types ====================

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  status?: 'new' | 'read' | 'archived';
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

// ==================== Submission Detail Modal ====================

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ContactSubmission | null;
  onDelete: (id: string) => void;
}

function SubmissionModal({ isOpen, onClose, submission, onDelete }: SubmissionModalProps) {
  if (!submission) return null;

  if (!submission) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Submission</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {submission.createdAt?.seconds
                        ? formatDate(new Date(submission.createdAt.seconds * 1000))
                        : 'Date unknown'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-50 dark:bg-gray-800/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Content Grid */}
              <div className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <User className="w-4 h-4" />
                      Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{submission.name}</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors underline"
                    >
                      {submission.email}
                    </a>
                  </div>
                </div>

                {/* Phone & Company (if provided) */}
                {(submission.phone || submission.company) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submission.phone && (
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </label>
                        <p className="text-gray-900 dark:text-white">{submission.phone}</p>
                      </div>
                    )}
                    {submission.company && (
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          <Briefcase className="w-4 h-4" />
                          Company
                        </label>
                        <p className="text-gray-900 dark:text-white">{submission.company}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <FileText className="w-4 h-4" />
                    Subject
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">{submission.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </label>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-700/50">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {submission.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-800">
                <Button
                  onClick={() => {
                    onDelete(submission.id);
                    onClose();
                  }}
                  variant="outline"
                  className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                  Close
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==================== Main Component ====================

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real-time listener for contact submissions
  useEffect(() => {
    const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const submissionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ContactSubmission[];
        setSubmissions(submissionsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contact submissions:', error);
        toast.error('Failed to load contact submissions');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const loadingToast = toast.loading('Deleting submission...');

    try {
      await deleteDoc(doc(db, 'contact_submissions', id));
      toast.dismiss(loadingToast);
      toast.success('Submission deleted successfully');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete submission');
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusBadge = (submission: ContactSubmission) => {
    const isNew = submission.status === 'new' || !submission.status;
    return (
      <span
        className={cn(
          'px-2 py-1 text-xs font-medium rounded-full',
          isNew
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-700/50 text-gray-600 dark:text-gray-400'
        )}
      >
        {isNew ? 'New' : 'Read'}
      </span>
    );
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Contact Submissions</h1>
                  <p className="text-gray-600 dark:text-gray-400">Review and manage messages from visitors</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="btn-back-dashboard">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                <span className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
                </span>
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
          {!loading && submissions.length === 0 && (
            <motion.div variants={itemVariants}>
              <GlassCard className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 rounded-full bg-gray-800/30">
                    <Mail className="w-12 h-12 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Submissions Yet</h3>
                    <p className="text-gray-500">
                      Contact form submissions will appear here when visitors reach out.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Submissions List */}
          {!loading && submissions.length > 0 && (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Icon */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {submission.subject}
                              </h3>
                              {getStatusBadge(submission)}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {submission.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {submission.email}
                              </span>
                              {submission.company && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {submission.company}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {submission.createdAt?.seconds
                              ? formatDate(new Date(submission.createdAt.seconds * 1000))
                              : 'Date unknown'}
                          </span>
                        </div>

                        {/* Message Preview */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                          {submission.message}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handleViewSubmission(submission)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            onClick={() => handleDelete(submission.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          <SubmissionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            submission={selectedSubmission}
            onDelete={handleDelete}
          />
        </motion.div>
      </div>
    </div>
  );
}

