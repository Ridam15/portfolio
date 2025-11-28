'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-2xl w-full text-center">
        {/* Glass Card Effect */}
        <div className="relative rounded-2xl border border-cyan-500/20 bg-gray-900/90 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          {/* Animated Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent pointer-events-none animate-pulse" />

          {/* Content */}
          <div className="relative z-10">
            {/* 404 Number with Gradient */}
            <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              404
            </h1>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Page Not Found
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Suggested Links */}
            <div className="mb-8 p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-500 mb-3">Maybe you're looking for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  href="/#about"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  About
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/#projects"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  Projects
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/#experience"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  Experience
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/#contact"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Help Text */}
            <p className="mt-8 text-sm text-gray-500">
              Lost? Feel free to{' '}
              <Link href="/#contact" className="text-cyan-400 hover:text-cyan-300 underline">
                reach out
              </Link>{' '}
              if you need help finding something.
            </p>
          </div>
        </div>

        {/* Floating Elements (Decorative) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </div>
  );
}

