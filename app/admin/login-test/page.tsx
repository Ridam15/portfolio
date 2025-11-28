'use client';

import React from 'react';

export default function LoginTestPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Admin Login Test</h1>
        <p className="text-gray-400">If you can see this, the page is rendering correctly.</p>
        <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}


