import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const Loader = ({ fullPage = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '2s' }}>
          <UtensilsCrossed className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Loading Bar */}
      <div className="space-y-2 w-full max-w-xs">
        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          {/* Outer ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="70.7 282.8"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-primary-500 via-pink-500 to-primary-600 rounded-full" style={{
            animation: 'slideProgress 2s ease-in-out infinite',
            animationDelay: '0s'
          }}></div>
        </div>

        <style>{`
          @keyframes slideProgress {
            0% { width: 0; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 100%; margin-left: 0; }
          }
        `}</style>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-slate-700 font-bold text-lg">
          Loading <span className="bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent">deliciousness</span>
        </p>
        <p className="text-slate-500 text-sm font-medium">This will just take a moment...</p>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary-500 rounded-full"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-white to-slate-50 backdrop-blur-sm z-[9999] flex items-center justify-center overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          {loaderContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-16">
      {loaderContent}
    </div>
  );
};

export default Loader;
