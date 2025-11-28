'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the component tree,
 * logs the errors, and displays a fallback UI.
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
          <div className="max-w-2xl w-full">
            {/* Glass Card Effect */}
            <div className="relative rounded-2xl border border-red-500/20 bg-gray-900/90 backdrop-blur-xl p-8 shadow-2xl">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-red-500/10 p-4">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Oops! Something went wrong
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-lg mb-6">
                  We encountered an unexpected error. Don't worry, it's not your fault.
                </p>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 text-left">
                    <details className="cursor-pointer">
                      <summary className="text-sm text-red-400 hover:text-red-300 transition-colors mb-2">
                        Show error details (Development only)
                      </summary>
                      <div className="mt-2 p-4 bg-gray-950/50 rounded-lg border border-red-500/20 text-sm text-gray-300 font-mono overflow-auto max-h-64">
                        <div className="mb-2">
                          <strong className="text-red-400">Error:</strong>{' '}
                          {this.state.error.message}
                        </div>
                        {this.state.error.stack && (
                          <div className="text-xs opacity-75 whitespace-pre-wrap">
                            {this.state.error.stack}
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Try Again
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
                  >
                    <Home className="w-5 h-5" />
                    Go Home
                  </Link>
                </div>

                {/* Help Text */}
                <p className="mt-6 text-sm text-gray-500">
                  If this problem persists, please{' '}
                  <Link href="/#contact" className="text-cyan-400 hover:text-cyan-300 underline">
                    contact support
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Error ID: {Date.now()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
