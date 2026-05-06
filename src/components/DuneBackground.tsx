import React from 'react';

export function DuneBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#00050e] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
        alt="Dark mountain landscape"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#000c1e]/30 via-[#000512]/40 to-[#000206]/70" />
    </div>
  );
}
