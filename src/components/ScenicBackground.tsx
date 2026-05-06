import React from 'react';

export function ScenicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#1a1c23]">
      {/* Simulation of a dark, scenic landscape */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(to bottom right, #1a1c23 0%, #0f1115 100%)',
        }}
      />
      {/* Decorative lines from reference */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
            <path d="M1000 0 C 800 200, 900 600, 700 1000" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}
