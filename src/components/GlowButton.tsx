import { cn } from '../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';
import React, { useState } from 'react';

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "color"> {
  color: string;
  glowColor?: string;
  enableZoom?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, color, glowColor, enableZoom = true, pulse = false, children, ...props }, ref) => {
    const activeColor = glowColor || color;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.button
        ref={ref}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          boxShadow: pulse ? [
              `0 0 15px ${activeColor}`,
              `0 0 45px ${activeColor}`,
              `0 0 15px ${activeColor}`
          ] : `0 0 15px ${activeColor}`,
        }}
        transition={pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        whileHover={{ 
            scale: enableZoom ? 1.05 : 1, 
            boxShadow: `0 0 60px ${activeColor}, inset 0 0 20px ${activeColor}`, 
            backgroundColor: `${activeColor}30`,
            transition: { duration: 0.2 } 
        }}
        whileTap={{ scale: 0.95, boxShadow: `0 0 20px ${activeColor}, inset 0 0 10px ${activeColor}` }}
        className={cn(
          "relative font-extrabold transition-all duration-300 rounded-full",
          "border-[3px] bg-transparent backdrop-blur-sm overflow-hidden group",
          className
        )}
        style={{
          borderColor: color,
          color: isHovered ? '#fff' : color,
          textShadow: isHovered ? `0 0 8px ${activeColor}` : 'none'
        }}
        {...props}
      >
        {/* Sweeping Shine Effect */}
        <div 
          className="absolute inset-0 -translate-x-[150%] skew-x-[-30deg] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-sweep pointer-events-none" 
        />
        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    );
  }
);
GlowButton.displayName = 'GlowButton';
