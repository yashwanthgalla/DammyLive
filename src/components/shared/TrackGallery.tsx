import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { trackImageMap } from '../../lib/imageMap'

const tracks = [
  { id: 'monaco', name: 'Monaco', img: trackImageMap['monaco'] },
  { id: 'spa', name: 'Spa-Francorchamps', img: trackImageMap['spa'] },
  { id: 'silverstone', name: 'Silverstone', img: trackImageMap['silverstone'] },
  { id: 'monza', name: 'Monza', img: trackImageMap['monza'] },
  { id: 'suzuka', name: 'Suzuka', img: trackImageMap['suzuka'] },
  { id: 'interlagos', name: 'Interlagos', img: trackImageMap['interlagos'] },
  { id: 'miami', name: 'Miami', img: trackImageMap['miami'] },
  { id: 'americas', name: 'Austin', img: trackImageMap['americas'] },
  { id: 'catalana', name: 'Barcelona', img: trackImageMap['catalunya'] },
  { id: 'villeneuve', name: 'Montreal', img: trackImageMap['villeneuve'] },
  { id: 'hungaroring', name: 'Budapest', img: trackImageMap['hungaroring'] },
  { id: 'zandvoort', name: 'Zandvoort', img: trackImageMap['zandvoort'] },
]

// Duplicate tracks for infinite scroll effect
const infiniteTracks = [...tracks, ...tracks]

export default function TrackGallery() {
  const [offset, setOffset] = useState(0)
  const targetRef = useRef(null)

  // Continuous smooth rotation - no jumping
  useEffect(() => {
    const trackWidth = window.innerWidth > 768 ? 450 : 280
    const gapWidth = window.innerWidth > 768 ? 64 : 32
    const itemWidth = trackWidth + gapWidth
    
    const animationSpeed = 60 // pixels per second for smooth movement
    let animationFrameId: number
    let lastTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      setOffset((prev) => {
        const newOffset = prev + animationSpeed * deltaTime
        // Loop back seamlessly when reaching the middle
        if (newOffset >= itemWidth * tracks.length) {
          return 0
        }
        return newOffset
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <section ref={targetRef} className="relative bg-[#F9F8F6] mb-20 md:mb-32 overflow-hidden">
      <div className="flex flex-col h-screen overflow-hidden pt-20 md:pt-32">
        <div className="px-8 md:px-16 mb-8 md:mb-12 shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 md:w-12 bg-[#1A1A1A]" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#6C6863]">
              Venues
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#1A1A1A] leading-[0.9]">
            Iconic <em className="text-[#D4AF37]">Circuits</em>
          </h2>
        </div>
        
        <div className="flex-1 w-full flex items-center overflow-hidden">
          <motion.div 
            className="flex gap-8 md:gap-16 will-change-transform"
            style={{ 
              x: -offset,
              width: 'fit-content'
            }}
          >
            {infiniteTracks.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                className="group relative h-[55vh] md:h-[60vh] xl:h-[65vh] aspect-[3/4] md:aspect-[4/5] flex-shrink-0 overflow-hidden bg-[#EBE5DE] border border-[#1A1A1A]/10"
              >
                <img 
                  src={track.img} 
                  alt={track.name} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[2000ms]" 
                />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-t from-[#EBE5DE] via-[#EBE5DE]/80 to-transparent">
                  <div className="h-px w-12 bg-[#D4AF37] mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                  <h3 className="font-serif text-2xl md:text-4xl text-[#1A1A1A] leading-tight mb-2">
                    {track.name}
                  </h3>
                  <div className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    Explore Venue
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
