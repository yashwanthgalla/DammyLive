import React from 'react';

interface RacingLineProps {
  className?: string;
  color?: string;
}

export function RacingLine({ className = '', color = '#e10600' }: RacingLineProps) {
  return (
    <div className={`w-full overflow-hidden leading-none flex ${className}`} aria-hidden="true">
      <svg 
        viewBox="0 0 25200 200" 
        preserveAspectRatio="xMinYMid slice"
        className="w-full h-2 md:h-3 lg:h-4"
        style={{ color, fill: 'currentColor' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path d="M200 0h25000v91h-25091Z"></path>
          <path d="M0 200h25200v-97h-25103Z"></path>
        </g>
      </svg>
    </div>
  );
}
