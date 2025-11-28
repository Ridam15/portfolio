'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, Lock, Shield, AlertCircle, Chrome } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { signInWithGoogle } from '@/lib/firebase/auth';
import useAuth from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/effects/GlassCard';

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
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

// Removed glowVariants - using inline animations instead

// ==================== Google Icon Component ====================

const GoogleIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ==================== Main Component ====================

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdminUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && user && isAdminUser) {
      router.push('/admin');
    }
  }, [user, authLoading, isAdminUser, router]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setError(null);
    const loadingToast = toast.loading('Signing in with Google...');

    try {
      await signInWithGoogle();
      toast.dismiss(loadingToast);
      toast.success('Successfully signed in!');
      router.push('/admin');
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Sign in error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-sm">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (user && isAdminUser) {
    return null;
  }

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-4"
      >
        <GlassCard
          variant="glow"
          className="p-8 md:p-10 lg:p-12 backdrop-blur-xl"
          enableHover={false}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-4 shadow-lg shadow-blue-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400 text-sm">
              Secure access to portfolio management
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-medium">
                    Authentication Failed
                  </p>
                  <p className="text-red-300 text-xs mt-1">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className={cn(
                'w-full px-6 py-4 rounded-lg font-semibold text-white',
                'bg-gradient-to-r from-blue-600 to-cyan-600',
                'hover:from-blue-700 hover:to-cyan-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                'transition-all duration-300',
                'flex items-center justify-center gap-3',
                'shadow-lg shadow-blue-500/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'group'
              )}
              whileHover={!isLoggingIn ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isLoggingIn ? { scale: 0.98 } : {}}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Info Section */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-start gap-3 text-gray-400 text-xs">
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-300 mb-1">Secure Authentication</p>
                <p>
                  Only authorized administrators can access this area. Your credentials
                  are protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Chrome className="w-4 h-4" />
              <span>Powered by Firebase Authentication</span>
            </div>
          </motion.div>
        </GlassCard>

        {/* Bottom Link */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Portfolio
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
    </>
  );
}
