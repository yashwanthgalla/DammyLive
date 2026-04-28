import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Flag } from 'lucide-react';

export default function NotFoundPage() {
  // Smooth easing curve for premium feel
  const ease = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#F5F5F3] relative overflow-hidden flex items-center">
      {/* Noise Texture (Assuming .paper-noise exists in index.css as requested in other parts of the app) */}
      <div className="paper-noise" aria-hidden="true" />

      {/* Subtle Background Racing Lines */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-[#111111] stroke-[0.1] fill-none">
          <motion.path 
            d="M-20,100 C 20,50 50,50 120,0" 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease }}
          />
          <motion.path 
            d="M-20,110 C 30,60 60,60 130,-10" 
            className="stroke-[#C9A44C] stroke-[0.05]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease, delay: 0.2 }}
          />
          <motion.path 
            d="M-20,120 C 40,70 70,70 140,0" 
            className="stroke-[#111111] stroke-[0.02]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease, delay: 0.4 }}
          />
        </svg>
      </motion.div>

      {/* Massive Faint 404 (Parallax effect) */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0"
        animate={{ y: ["-48%", "-52%", "-48%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-serif text-[40vw] lg:text-[25vw] leading-none tracking-tighter text-[#111111] opacity-[0.02] mix-blend-multiply">
          404
        </span>
      </motion.div>

      <div className="max-w-[1600px] w-full mx-auto px-8 md:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* LEFT SIDE: Typography */}
          <div className="relative">
            <motion.div 
              className="relative z-10 flex flex-col items-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Flag className="w-5 h-5 text-[#111111]" strokeWidth={1.5} />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#111111]">
                  Sector Not Found
                </span>
              </div>

              {/* Hero Typography */}
              <h1 className="font-serif text-7xl md:text-8xl lg:text-[140px] text-[#111111] leading-[0.85] tracking-[-0.03em] m-0 drop-shadow-sm">
                Track
              </h1>
              <h1 className="font-serif italic text-7xl md:text-8xl lg:text-[140px] leading-[0.85] tracking-[-0.02em] m-0 bg-gradient-to-r from-[#C9A44C] to-[#E6C76A] text-transparent bg-clip-text drop-shadow-sm">
                Limits
              </h1>
              <h2 className="font-sans text-4xl md:text-5xl lg:text-7xl text-[#111111] font-light mt-4 tracking-[-0.02em]">
                Exceeded
              </h2>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Supporting text & CTAs */}
          <motion.div 
            className="flex flex-col items-start pt-8 lg:pt-32 relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-[#C9A44C] to-transparent mb-8" />
            
            <p className="text-[#111111] font-sans text-lg md:text-xl leading-relaxed mb-4 max-w-md drop-shadow-sm">
              You’ve gone off track. This sector isn’t part of the race map.
            </p>
            <p className="text-[#111111]/70 font-sans text-sm leading-relaxed mb-12 max-w-md">
              Return to the paddock to continue. Ensure your telemetry is correct and coordinates are verified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              {/* Primary CTA */}
              <Link
                to="/"
                className="group relative flex items-center justify-center gap-4 bg-transparent px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#111111] overflow-hidden transition-all duration-500 shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(201,164,76,0.2)]"
              >
                {/* Background Fill Animation */}
                <span className="absolute inset-0 w-full h-full border border-[#C9A44C] transition-colors duration-500 group-hover:border-transparent"></span>
                <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-[#C9A44C] to-[#E6C76A] transition-all duration-700 ease-out group-hover:w-full"></span>
                
                {/* Content */}
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Return to Paddock</span>
                <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-2 group-hover:text-white transition-all duration-500" strokeWidth={1.5} />
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/schedule"
                className="group flex items-center justify-center gap-3 px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#111111] border border-[#111111]/20 hover:border-[#111111] bg-white/50 backdrop-blur-sm transition-all duration-500 shadow-[0_4px_14px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.08)]"
              >
                <Calendar className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1.5} />
                View Schedule
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Bottom fade for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5F5F3] to-transparent pointer-events-none z-20" />
    </div>
  );
}
