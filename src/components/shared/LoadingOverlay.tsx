/**
 * LoadingOverlay Component
 * A premium, full-screen loading state that hides internal system activity.
 * Designed with the White & Red F1 aesthetic.
 */

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Syncing Hub...", 
  subMessage = "Data Transmission Active" 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center animate-fade-in">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-f1-red/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-f1-red/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated F1 Red Bar */}
        <div className="w-8 h-1 bg-f1-red mb-8 animate-[width-expand_2s_infinite_ease-in-out]" />
        
        <LoadingSpinner />
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-black text-text-primary uppercase italic tracking-tighter mb-2">
            {message}
          </h2>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] animate-pulse">
            {subMessage}
          </p>
        </div>
      </div>
      
      {/* Bottom Technical Line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">Protocol 77</div>
          <div className="w-8 h-px bg-border" />
          <div className="text-[8px] font-black text-text-muted uppercase tracking-widest italic">Race Engine Active</div>
      </div>

      <style>{`
        @keyframes width-expand {
          0%, 100% { width: 32px; opacity: 0.5; }
          50% { width: 128px; opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
