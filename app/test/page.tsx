'use client';

import GlassCard from '@/components/effects/GlassCard';
import { useState } from 'react';

export default function TestPage() {
  const [error, setError] = useState(false);

  if (error) {
    throw new Error('Test error for ErrorBoundary');
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Component Tests</h1>

        {/* Test GlassCard variants */}
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">GlassCard Variants</h2>
          <div className="grid gap-4">
            <GlassCard variant="default">
              <p className="text-white">Default variant</p>
            </GlassCard>
            
            <GlassCard variant="subtle">
              <p className="text-white">Subtle variant</p>
            </GlassCard>
            
            <GlassCard variant="strong">
              <p className="text-white">Strong variant</p>
            </GlassCard>
            
            <GlassCard variant="bordered">
              <p className="text-white">Bordered variant</p>
            </GlassCard>
            
            <GlassCard variant="glow">
              <p className="text-white">Glow variant</p>
            </GlassCard>
          </div>
        </section>

        {/* Test interactive GlassCard */}
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Interactive GlassCard</h2>
          <GlassCard 
            variant="bordered" 
            interactive 
            onClick={() => alert('Card clicked!')}
          >
            <p className="text-white">Click me! I have hover and tap animations.</p>
          </GlassCard>
        </section>

        {/* Test ErrorBoundary */}
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">ErrorBoundary Test</h2>
          <GlassCard variant="default">
            <button
              onClick={() => setError(true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Trigger Error (Test ErrorBoundary)
            </button>
          </GlassCard>
        </section>

        {/* Visual indicators */}
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Visual Checks</h2>
          <GlassCard variant="default">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
                <span className="text-white">Cyan accent color</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-white">Blue accent color</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-purple-500" />
                <span className="text-white">Purple accent color</span>
              </div>
              <div className="p-4 bg-gray-900/60 backdrop-blur-lg rounded-lg border border-cyan-500/20">
                <span className="text-white">Glassmorphism effect test</span>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

