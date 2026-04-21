import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Delete, RotateCcw } from 'lucide-react';

interface TabProps {
  onClose: () => void;
}

export function ScientificCalculator({ onClose }: TabProps) {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  const buttons = [
    ['sin', 'cos', 'tan', 'C', 'AC'],
    ['log', 'ln', '(', ')', '/'],
    ['pi', '7', '8', '9', '*'],
    ['^', '4', '5', '6', '-'],
    ['sqrt', '1', '2', '3', '+'],
    ['e', '0', '.', 'exp', '=']
  ];

  const handleAction = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      setHistory([]);
    } else if (val === 'C') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        // Safe evaluation basics
        let expr = display
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/log/g, 'Math.log10')
          .replace(/ln/g, 'Math.log')
          .replace(/pi/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/\^/g, '**');
        
        const result = eval(expr); // Using eval carefully for a calculator demo
        setHistory(prev => [...prev.slice(-4), `${display} = ${result}`]);
        setDisplay(result.toString());
      } catch (err) {
        setDisplay('Error');
        setTimeout(() => setDisplay('0'), 1000);
      }
    } else {
      setDisplay(prev => (prev === '0' && !isNaN(parseInt(val))) ? val : prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#16213e] border-2 border-[#00ffcc] rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(0,255,204,0.3)] w-full max-w-[420px]"
      >
        <div className="bg-[#00ffcc]/10 p-5 border-b border-[#00ffcc]/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00ffcc] flex items-center justify-center text-black font-bold">∑</div>
            <h2 className="text-[#00ffcc] font-black tracking-widest text-sm uppercase">HyperCalc Pro</h2>
          </div>
          <button onClick={onClose} className="text-[#00ffcc] hover:text-white transition-colors">
             <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#05050a] border-2 border-[#00ffcc]/50 rounded-2xl p-5 shadow-inner">
            <div className="h-6 text-right text-[#00ffcc]/40 text-xs font-mono overflow-hidden">
               {history.map((h, i) => <div key={i}>{h}</div>)}
            </div>
            <div className="text-right text-4xl font-mono text-[#00ffcc] truncate pt-2 font-bold drop-shadow-[0_0_10px_rgba(0,255,204,0.6)]">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {buttons.map((row, i) => (
              <React.Fragment key={i}>
                {row.map(btn => {
                  const isSpecial = ['C', 'AC', '=', '/', '*', '-', '+'].includes(btn);
                  const isSci = ['sin', 'cos', 'tan', 'log', 'ln', 'pi', 'e', 'sqrt', '^', '(', ')'].includes(btn);
                  
                  return (
                    <button
                      key={btn}
                      onClick={() => handleAction(btn)}
                      className={`
                        py-3 text-[11px] font-black uppercase rounded-xl transition-all active:scale-90
                        ${btn === '=' ? 'col-span-1 bg-[#00ffcc] text-black shadow-[0_0_15px_#00ffcc]' : ''}
                        ${isSpecial && btn !== '=' ? 'bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30 hover:bg-[#00ffcc]/40' : ''}
                        ${isSci ? 'bg-[#0055ff]/10 text-[#0080ff] border border-[#0080ff]/20 hover:bg-[#0080ff]/30 text-[9px]' : ''}
                        ${!isSpecial && !isSci ? 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white' : ''}
                      `}
                    >
                      {btn}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border-t border-white/5 text-center text-[10px] text-white/20 tracking-widest uppercase">
           Powered by Affaan's Algorithm
        </div>
      </motion.div>
    </div>
  );
}
