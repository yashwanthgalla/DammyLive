import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mrernpbb");

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#F9F8F6] relative overflow-hidden py-20 px-8 md:px-16 flex items-center">
      <div className="paper-noise" aria-hidden="true" />
      <div className="max-w-[1600px] w-full mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Typography & Context */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <MessageSquare className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
                Pit Wall
              </span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl text-[#1A1A1A] leading-[0.9] tracking-tight mb-8">
              Report an <br />
              <em className="text-[#D4AF37]">Anomaly</em>
            </h1>
            
            <div className="w-16 h-px bg-[#D4AF37] mb-8" />
            
            <p className="text-[#1A1A1A] font-serif text-2xl leading-relaxed mb-6">
              Encountered an issue on the circuit? Our editorial pit crew is on standby.
            </p>
            <p className="text-[#6C6863] font-sans text-sm leading-relaxed max-w-md mb-12">
              Whether it's a telemetry glitch, a broken link, or a missing data point, let us know. Precision is our priority.
            </p>

            <div className="flex flex-col gap-4 font-sans text-xs uppercase tracking-[0.2em] text-[#1A1A1A]">
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                <span>support@dammylive.com</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-[0_8px_32px_rgba(26,26,26,0.04)] relative border border-[#1A1A1A]/5"
          >
            {state.succeeded ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-16 h-16 rounded-full bg-[#F9F8F6] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-3xl text-[#1A1A1A] mb-4">Message Received</h3>
                <p className="font-sans text-sm text-[#6C6863] max-w-xs leading-relaxed mb-8">
                  The data has been transmitted to our pit wall. We'll investigate the anomaly shortly.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors duration-300"
                >
                  Report another issue
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="relative">
                  <label htmlFor="name" className="absolute top-0 left-0 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] flex items-center gap-2">
                    <User className="w-3 h-3" /> Driver Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 pt-8 pb-3 font-serif text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                    placeholder="Your Name"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-[#e10600] text-xs mt-1 absolute -bottom-5" />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="absolute top-0 left-0 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Radio Frequency (Email)
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 pt-8 pb-3 font-serif text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                    placeholder="Your Email"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-[#e10600] text-xs mt-1 absolute -bottom-5" />
                </div>

                <div className="relative">
                  <label htmlFor="issue" className="absolute top-0 left-0 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> Anomaly Type
                  </label>
                  <select 
                    id="issue"
                    name="issue"
                    required
                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 pt-8 pb-3 font-serif text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Select an issue...</option>
                    <option value="bug">UI Glitch / Visual Error</option>
                    <option value="data">Telemetry / Data Inaccuracy</option>
                    <option value="auth">Paddock Pass (Login) Issue</option>
                    <option value="other">Other Incident</option>
                  </select>
                  <ValidationError prefix="Issue Type" field="issue" errors={state.errors} className="text-[#e10600] text-xs mt-1 absolute -bottom-5" />
                </div>

                <div className="relative">
                  <label htmlFor="message" className="absolute top-0 left-0 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863]">
                    Incident Report
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-[#1A1A1A]/20 pt-8 pb-3 font-serif text-lg text-[#1A1A1A] focus:outline-none focus:border-[#D4AF37] transition-colors resize-none rounded-none"
                    placeholder="Describe the issue you encountered on track..."
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-[#e10600] text-xs mt-1 absolute -bottom-5" />
                </div>

                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="group relative flex items-center justify-center gap-4 bg-[#1A1A1A] px-8 py-5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#F9F8F6] overflow-hidden transition-all duration-500 hover:shadow-[0_4px_20px_rgba(212,175,55,0.2)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  <span className="absolute inset-0 w-0 h-full bg-[#D4AF37] transition-all duration-700 ease-out group-hover:w-full"></span>
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-[#1A1A1A]">
                    {state.submitting ? 'Transmitting...' : 'Submit Report'}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
