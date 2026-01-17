
import React from 'react';

interface Props {
  activeRegions: string[];
}

const BrainVisualizer: React.FC<Props> = ({ activeRegions }) => {
  const isRegionActive = (name: string) => activeRegions.includes(name);

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        {/* Brain Outline */}
        <path
          d="M100 20 C60 20, 20 50, 20 100 C20 150, 60 180, 100 180 C140 180, 180 150, 180 100 C180 50, 140 20, 100 20 Z"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        
        {/* Regions */}
        {/* Frontal Cortex */}
        <path
          d="M100 25 C130 25, 175 45, 175 90 L100 90 Z"
          fill={isRegionActive('Frontal Cortex') ? '#ec4899' : '#334155'}
          className="transition-all duration-500"
          opacity={isRegionActive('Frontal Cortex') ? '0.8' : '0.4'}
        />
        
        {/* Nucleus Accumbens / VTA (Centerish) */}
        <circle
          cx="100"
          cy="110"
          r="25"
          fill={isRegionActive('Nucleus Accumbens') || isRegionActive('Ventral Tegmental Area') ? '#eab308' : '#334155'}
          className="transition-all duration-500"
          opacity={isRegionActive('Nucleus Accumbens') ? '0.8' : '0.4'}
        />

        {/* Hypothalamus */}
        <ellipse
          cx="100"
          cy="130"
          rx="15"
          ry="10"
          fill={isRegionActive('Hypothalamus') ? '#3b82f6' : '#334155'}
          className="transition-all duration-500"
          opacity={isRegionActive('Hypothalamus') ? '0.8' : '0.4'}
        />
      </svg>
      
      <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 text-[10px] font-mono uppercase">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRegionActive('Frontal Cortex') ? 'bg-pink-500' : 'bg-slate-700'}`}></div>
          <span className={isRegionActive('Frontal Cortex') ? 'text-pink-500 font-bold' : 'text-slate-500'}>Frontal Cortex</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRegionActive('Nucleus Accumbens') ? 'bg-yellow-500' : 'bg-slate-700'}`}></div>
          <span className={isRegionActive('Nucleus Accumbens') ? 'text-yellow-500 font-bold' : 'text-slate-500'}>Reward System (VTA/NA)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRegionActive('Hypothalamus') ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          <span className={isRegionActive('Hypothalamus') ? 'text-blue-500 font-bold' : 'text-slate-500'}>Hypothalamus</span>
        </div>
      </div>
    </div>
  );
};

export default BrainVisualizer;
