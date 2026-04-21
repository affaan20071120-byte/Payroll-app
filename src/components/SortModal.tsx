import { useState } from 'react';
import { motion } from 'motion/react';

interface SortModalProps {
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  onClose: () => void;
}

export function SortModal({ onSort, onClose }: SortModalProps) {
  const [column, setColumn] = useState('empNo');
  
  const columns = [
    { value: 'empNo', label: 'Emp No' },
    { value: 'name', label: 'Name' },
    { value: 'job', label: 'Job' },
    { value: 'basicSalary', label: 'Basic Salary' },
    { value: 'da', label: 'DA' },
    { value: 'hra', label: 'HRA' },
    { value: 'grossSalary', label: 'Gross Salary' },
    { value: 'tax', label: 'Tax' },
    { value: 'netSalary', label: 'Net Salary' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-[#16213e]/95 backdrop-blur-xl border-2 rounded-2xl p-6 max-w-[360px] w-full"
        style={{ borderColor: "#00d2ff", boxShadow: "0 10px 40px #00d2ff30" }}
      >
        <div className="space-y-5">
          <label className="block text-[#00d2ff] text-sm font-bold">Sort by column:</label>
          <select 
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            className="w-full bg-white/10 border-2 border-[#00d2ff] rounded-lg px-3 py-2.5 text-white focus:outline-none appearance-none"
          >
            {columns.map(c => (
              <option key={c.value} value={c.value} className="bg-[#16213e] text-white">
                {c.label}
              </option>
            ))}
          </select>
          
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => { onSort(column, 'asc'); onClose(); }}
              className="flex-1 bg-transparent hover:bg-white/10 border-2 border-[#00d2ff] text-[#00d2ff] rounded-lg py-2 text-xs font-bold transition-colors"
            >
              ▲ Ascending
            </button>
            <button 
              onClick={() => { onSort(column, 'desc'); onClose(); }}
              className="flex-1 bg-transparent hover:bg-white/10 border-2 border-[#ff6b35] text-[#ff6b35] rounded-lg py-2 text-xs font-bold transition-colors"
            >
              ▼ Descending
            </button>
          </div>
          
          <div className="flex justify-center mt-4">
               <button
                  onClick={onClose}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-6 py-2 text-xs transition-colors"
                >
                  Cancel
                </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
