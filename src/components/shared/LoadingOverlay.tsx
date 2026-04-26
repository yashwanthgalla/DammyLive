/**
 * LoadingOverlay Component — Luxury Editorial
 * Full-screen, serene loading state with paper texture feel
 */

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Curating...", 
  subMessage = "Preparing Your Editorial" 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#F9F8F6] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Decorative gold line */}
        <div className="w-12 h-px bg-[#D4AF37] mb-12" />
        
        <LoadingSpinner />
        
        <div className="mt-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-tight mb-3">
            {message}
          </h2>
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
            {subMessage}
          </p>
        </div>
      </div>
      
      {/* Bottom label */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <span className="font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">Editorial</span>
        <div className="w-8 h-px bg-[#1A1A1A]/10" />
        <span className="font-serif text-[8px] italic text-[#6C6863]">Vol. 01</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
