'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Contact from '@/components/public/Contact';

export default function TestContactPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-green-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Contact Demo
          </h1>
        </div>
      </nav>

      {/* Contact Component */}
      <Contact />

      {/* Test Features Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-green-400 mb-6">✨ Test Features:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Form Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>React Hook Form integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Zod validation with error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Name, Email, Subject, Message fields</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Loading state on submit button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Sonner toast notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Form clears on successful submission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Glassmorphic input styling</span>
              </li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Info Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Email with copy-to-clipboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Phone number with copy function</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Location display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Social media links with icons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Hover animations on all items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Quick response info card</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Fully responsive layout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Validation Test */}
        <div className="mt-8 glass-card p-6 bg-green-500/5 border-green-500/20">
          <h3 className="text-xl font-bold text-green-400 mb-4">🧪 Test Validation:</h3>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Name:</strong> Must be at least 2 characters</p>
            <p><strong>Email:</strong> Must be a valid email address</p>
            <p><strong>Subject:</strong> Must be at least 3 characters</p>
            <p><strong>Message:</strong> Must be at least 10 characters</p>
            <p className="pt-2 text-gray-500">Try submitting with invalid data to see error messages!</p>
          </div>
        </div>

        {/* API Test */}
        <div className="mt-8 glass-card p-6 bg-blue-500/5 border-blue-500/20">
          <h3 className="text-xl font-bold text-blue-400 mb-4">🔌 API Endpoint:</h3>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>URL:</strong> <code className="bg-gray-800 px-2 py-1 rounded">/api/contact</code></p>
            <p><strong>Method:</strong> POST</p>
            <p><strong>Validation:</strong> Zod schema (contactFormSchema)</p>
            <p><strong>Storage:</strong> Firestore (contact_submissions collection)</p>
            <p><strong>Response:</strong> Success/Error with status codes</p>
          </div>
        </div>

        {/* Interaction Tips */}
        <div className="mt-8 glass-card p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 Interaction Tips:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              • <strong>Click</strong> the copy icons next to email/phone to copy to clipboard
            </li>
            <li>
              • <strong>Fill</strong> the form with valid data and submit to see success toast
            </li>
            <li>
              • <strong>Try</strong> submitting with empty fields to see validation errors
            </li>
            <li>
              • <strong>Watch</strong> the loading state when form is being submitted
            </li>
            <li>
              • <strong>Notice</strong> the form clears automatically on successful submission
            </li>
            <li>
              • <strong>Hover</strong> over contact info cards for animations
            </li>
            <li>
              • <strong>Resize</strong> the window to test responsive layout (2-column to 1-column)
            </li>
          </ul>
        </div>

        {/* Test Data */}
        <div className="mt-8 glass-card p-6 bg-purple-500/5 border-purple-500/20">
          <h3 className="text-xl font-bold text-purple-400 mb-4">📝 Sample Test Data:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 mb-2">Valid Submission:</p>
              <code className="text-green-400 block">
                Name: John Doe<br />
                Email: john@example.com<br />
                Subject: Collaboration Opportunity<br />
                Message: I'd love to discuss a potential project...
              </code>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 mb-2">Invalid Submission (triggers errors):</p>
              <code className="text-red-400 block">
                Name: J<br />
                Email: invalid-email<br />
                Subject: Hi<br />
                Message: Short
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


