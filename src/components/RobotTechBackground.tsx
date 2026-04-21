import React, { useEffect, useRef } from 'react';

export function RobotTechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const circuitNodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 60; i++) {
        circuitNodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
        });
    }

    const render = () => {
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, width, height);

      // Draw circuitry connections
      ctx.strokeStyle = '#00ffcc40';
      ctx.lineWidth = 1;

      for (let i = 0; i < circuitNodes.length; i++) {
        for (let j = i + 1; j < circuitNodes.length; j++) {
            const dx = circuitNodes[i].x - circuitNodes[j].x;
            const dy = circuitNodes[i].y - circuitNodes[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.5;
                ctx.strokeStyle = `rgba(0, 255, 204, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(circuitNodes[i].x, circuitNodes[i].y);
                ctx.lineTo(circuitNodes[j].x, circuitNodes[j].y);
                ctx.stroke();
            }
        }
      }

      // Draw nodes
      ctx.fillStyle = '#00ffcc';
      for (const n of circuitNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00ffcc';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Floating Tech Elements
      ctx.fillStyle = '#00ffcc20';
      ctx.fillRect(100, 100, 50, 2);
      ctx.fillRect(width - 150, height - 150, 100, 2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#050510]"
    />
  );
}
