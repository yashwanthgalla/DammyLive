import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#F9F8F6] relative overflow-hidden flex flex-col items-center justify-center px-4 md:px-8">
      {/* Noise Texture */}
      <div className="paper-noise" aria-hidden="true" />

      {/* Massive Centered 404 */}
      <div className="relative w-full max-w-[1400px] flex justify-center items-center">
        <motion.div 
          className="font-serif text-[45vw] md:text-[350px] lg:text-[450px] leading-none tracking-tighter text-[#1A1A1A] text-center select-none relative flex justify-center items-center w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="relative z-10 drop-shadow-sm">4</span>
          
          <span className="relative inline-flex items-center justify-center mx-[-2vw] md:mx-[-20px] z-20">
            {/* The actual 0 */}
            <span className="relative z-20 drop-shadow-sm">0</span>
            
            {/* Red/Gold Aura mimicking the central visual weight from the reference */}
            <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-[#D4AF37] to-[#e10600] rounded-full blur-[60px] md:blur-[100px] opacity-10 z-10"
               animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>

          <span className="relative z-10 drop-shadow-sm">4</span>
        </motion.div>

        {/* Fog/Cloud effect from the reference image, adapted to theme */}
        <div className="absolute bottom-[-10%] left-0 right-0 h-[45%] bg-gradient-to-t from-[#F9F8F6] via-[#F9F8F6]/90 to-transparent z-30 pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <motion.div 
        className="relative z-40 flex flex-col items-center text-center mt-[-8vh] md:mt-[-80px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        <h2 className="font-serif text-3xl md:text-5xl lg:text-[56px] text-[#1A1A1A] mb-4 font-normal tracking-tight">
          Oops i think we're Lost
        </h2>
        
        <p className="font-sans text-sm md:text-base text-[#6C6863] mb-10 tracking-wide">
          Let's Get You Back To Somewhere Familiar
        </p>
        
        <Link
          to="/"
          className="group flex items-center gap-3 bg-white border border-[#1A1A1A]/10 px-6 py-3 md:px-8 md:py-4 rounded-full font-sans text-sm font-medium text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#1A1A1A]/20 group-hover:border-[#F9F8F6]/30 transition-colors duration-300">
            <ArrowLeft className="w-3 h-3" strokeWidth={2} />
          </div>
          Back Home
        </Link>
      </motion.div>
    </div>
  );
}
