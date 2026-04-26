/**
 * SnakeTrack — F1 Logo Scroll tracing a snaking path ending in a Silverstone layout
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

export default function SnakeTrack() {
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })
  const iconRef = useRef<HTMLImageElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    // Update dimensions on load and resize to ensure the SVG perfectly covers the document height
    const update = () => {
      setDimensions({ 
        w: document.documentElement.scrollWidth, 
        h: document.documentElement.scrollHeight 
      })
    }
    
    // Slight delay to ensure all content (and fonts) are loaded for accurate height
    setTimeout(update, 500)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Hook into Framer Motion's precise scroll progress to literally push the F1 logo down the SVG path coordinates
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (pathRef.current && iconRef.current && dimensions.h > 0) {
      const length = pathRef.current.getTotalLength()
      // Ensure we don't exceed max length
      const point = pathRef.current.getPointAtLength(length * Math.min(latest, 0.9999))
      
      // Calculate rotation to make the F1 logo point along the path
      let nextPoint = point
      if (latest < 0.99) {
        nextPoint = pathRef.current.getPointAtLength(length * (latest + 0.001))
      }
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI)

      iconRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) rotate(${angle + 90}deg)`
    }
  })

  if (!dimensions.w || !dimensions.h) return null

  const { w, h } = dimensions
  // Center alignment for the snake path
  const cx = w > 1400 ? w / 2 : w * 0.7  // Shift right on smaller screens

  // Start at the top center
  let d = `M ${cx} 0 `
  d += `L ${cx} 200 `

  // ── Snaking Path ──
  const snakeHeight = h - 1400 // Leave ample room at the bottom for the Silverstone drawing
  const segments = 4
  const segmentH = snakeHeight / segments
  const amp = Math.min(w * 0.25, 300) // The curve width

  for (let i = 0; i < segments; i++) {
    const yStart = 200 + i * segmentH
    const yEnd = 200 + (i + 1) * segmentH
    const yMid1 = yStart + segmentH * 0.33
    const yMid2 = yStart + segmentH * 0.66
    const dir = i % 2 === 0 ? 1 : -1
    d += `C ${cx + amp*dir} ${yMid1}, ${cx + amp*dir} ${yMid2}, ${cx} ${yEnd} `
  }


  // ── Silverstone GP Track Outline ──
  // Base coordinates mapping for Silverstone
  const S = Math.min(w/800, 1.3) * 1.5 // Responsive scale factor
  const sY = Math.max(200 + snakeHeight + 200, h - 800) // Position near footer
  
  const pt = (x: number, y: number) => `${cx + x*S} ${sY + y*S}`

  d += `L ${pt(0, 0)} ` // Connect snake to Copse

  // Copse -> Maggotts
  d += `C ${pt(30, -30)}, ${pt(70, -40)}, ${pt(100, -20)} `
  // Maggotts/Becketts -> Chapel
  d += `C ${pt(120, 0)}, ${pt(90, 20)}, ${pt(110, 50)} `
  // Hangar Straight 
  d += `L ${pt(220, 200)} `
  // Stowe
  d += `C ${pt(250, 250)}, ${pt(220, 300)}, ${pt(180, 280)} `
  // Vale/Club
  d += `C ${pt(150, 270)}, ${pt(120, 320)}, ${pt(80, 290)} `
  // Hamilton Straight
  d += `L ${pt(-50, 150)} `
  // Abbey/Farm
  d += `C ${pt(-90, 110)}, ${pt(-120, 100)}, ${pt(-150, 130)} `
  // Village/Loop
  d += `C ${pt(-180, 160)}, ${pt(-220, 140)}, ${pt(-180, 100)} `
  // Aintree & Wellington 
  d += `L ${pt(-50, -20)} `
  // Brooklands & Luffield
  d += `C ${pt(-80, -60)}, ${pt(-120, -80)}, ${pt(-80, -120)} `
  // Woodcote -> back to Copse
  d += `C ${pt(-40, -140)}, ${pt(-20, -50)}, ${pt(0, 0)} `

  // Run straight down off the page into the footer
  d += `L ${pt(0, 0)} `
  d += `C ${pt(-20, 100)}, ${pt(0, 200)}, ${cx} ${sY + 400*S} `
  d += `L ${cx} ${h + 100}`

  return (
    <div className="absolute top-0 left-0 w-full z-0 pointer-events-none overflow-hidden" style={{ height: h }}>
      <svg 
        className="w-full h-full" 
        viewBox={`0 0 ${w} ${h}`} 
        preserveAspectRatio="xMidYMid slice"
        style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))' }}
      >
        {/* Faint background skeleton of the path */}
        <path
          d={d}
          fill="none"
          stroke="#1A1A1A"
          strokeOpacity="0.03"
          strokeWidth="2"
        />
        {/* Animated tracing path */}
        <motion.path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="3"
          strokeDasharray="4 8"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
    </div>
  )
}
