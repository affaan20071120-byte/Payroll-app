import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Play, RotateCcw } from 'lucide-react';

interface TabProps {
  onClose: () => void;
}

export function SnakeGame({ onClose }: TabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];

  const snakeRef = useRef(INITIAL_SNAKE);
  const directionRef = useRef({ x: 0, y: -1 });
  const foodRef = useRef({ x: 5, y: 5 });

  const spawnFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (directionRef.current.y !== 1) directionRef.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': if (directionRef.current.y !== -1) directionRef.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': if (directionRef.current.x !== 1) directionRef.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': if (directionRef.current.x !== -1) directionRef.current = { x: 1, y: 0 }; break;
    }
  };

  useEffect(() => {
    if (!isStarted || isGameOver) return;
    window.addEventListener('keydown', handleKeyDown);
    
    const interval = setInterval(() => {
      const head = { ...snakeRef.current[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return;
      }

      // Self collision
      if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      // Draw
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, 400, 400);

        // Grid lines (faint)
        ctx.strokeStyle = '#222';
        for(let i=0; i<=400; i+=20) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 400); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(400, i); ctx.stroke();
        }

        // Snake
        snakeRef.current.forEach((seg, i) => {
          ctx.fillStyle = i === 0 ? '#00ff88' : '#00ff8880';
          ctx.shadowBlur = i === 0 ? 15 : 5;
          ctx.shadowColor = '#00ff88';
          ctx.fillRect(seg.x * CELL_SIZE + 2, seg.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        });

        // Food
        ctx.fillStyle = '#ff3c00';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff3c00';
        ctx.beginPath();
        ctx.arc(foodRef.current.x * CELL_SIZE + 10, foodRef.current.y * CELL_SIZE + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }, 120);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [isStarted, isGameOver]);

  const startGame = () => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = { x: 0, y: -1 };
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    spawnFood();
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#1a1a2e] border-2 border-[#00ff88] rounded-[24px] overflow-hidden shadow-[0_0_60px_#00ff8830] w-full max-w-[450px]"
      >
        <div className="bg-[#00ff88]/10 p-5 border-b border-[#00ff88]/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Trophy className="text-[#00ff88] w-5 h-5 shadow-[0_0_10px_#00ff88]" />
             <h2 className="text-[#00ff88] font-black tracking-widest text-sm uppercase">Neon Snake Pro</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
             <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 px-2">
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Score: <span className="text-[#00ff88] ml-2">{score}</span></div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest">High: <span className="text-[#ff9f43] ml-2">{highScore}</span></div>
            </div>

            <div className="relative border-4 border-[#00ff88]/20 rounded-xl overflow-hidden bg-[#050510]">
                <canvas ref={canvasRef} width={400} height={400} className="block" />
                
                {(!isStarted || isGameOver) && (
                    <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                        {isGameOver && (
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mb-6"
                            >
                                <h3 className="text-red-500 font-black text-3xl mb-2 drop-shadow-[0_0_15px_#ff0000]">GAME OVER</h3>
                                <p className="text-white/60 text-sm">You collided with the wall or yourself!</p>
                            </motion.div>
                        )}
                        <button 
                            onClick={startGame}
                            className="flex items-center gap-3 bg-[#00ff88] text-black font-black px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_#00ff88]"
                        >
                            {isGameOver ? <RotateCcw size={20} /> : <Play size={20} />}
                            {isGameOver ? 'RETRY' : 'START GAME'}
                        </button>
                        <p className="mt-6 text-white/30 text-[10px] uppercase tracking-widest">Use Arrow Keys to Move</p>
                    </div>
                )}
            </div>

            <div className="mt-6 text-center text-[10px] text-white/20 tracking-tighter uppercase w-full">
               Developed by Mohammed Affaan Delvi • v1.0
            </div>
        </div>
      </motion.div>
    </div>
  );
}
