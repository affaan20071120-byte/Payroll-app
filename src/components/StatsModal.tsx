import { Employee } from '../types';
import { motion } from 'motion/react';

interface StatsModalProps {
  employees: Employee[];
  onClose: () => void;
}

export function StatsModal({ employees, onClose }: StatsModalProps) {
  const cnt = employees.length;
  
  let mn = 0;
  let mx = 0;
  let avg = 0;
  let total = 0;

  if (cnt > 0) {
    const netSalaries = employees.map(e => e.netSalary);
    mn = Math.min(...netSalaries);
    mx = Math.max(...netSalaries);
    total = netSalaries.reduce((sum, val) => sum + val, 0);
    avg = total / cnt;
  }

  const stats = [
    { label: "👥 Total Employees", value: cnt, color: "#00ffcc" },
    { label: "💰 Minimum Net", value: mn.toLocaleString('en-US', {minimumFractionDigits: 2}), color: "#ff6b81" },
    { label: "🏆 Maximum Net", value: mx.toLocaleString('en-US', {minimumFractionDigits: 2}), color: "#00ff88" },
    { label: "📊 Average Net", value: avg.toLocaleString('en-US', {minimumFractionDigits: 2}), color: "#ffa502" },
    { label: "💵 Total Payroll", value: total.toLocaleString('en-US', {minimumFractionDigits: 2}), color: "#a29bfe" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-[#16213e]/95 backdrop-blur-xl border-2 rounded-3xl p-8 max-w-[400px] w-full"
        style={{ borderColor: "#f9ca24", boxShadow: "0 10px 40px #f9ca2430" }}
      >
        <h2 className="text-xl font-bold text-center mb-6 text-[#f9ca24]">
          📈 Salary Statistics
        </h2>

        {cnt === 0 ? (
          <p className="text-center text-white/70 mb-8">No employee data found.</p>
        ) : (
          <div className="space-y-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/80 text-sm">{stat.label}</span>
                  <span className="font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
                {i < stats.length - 1 && <div className="border-b border-white/10 mt-3"></div>}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#f9ca24] hover:bg-[#ffeaa7] active:bg-[#e0b800] text-[#1a1a2e] border-none rounded-xl font-bold text-sm px-10 py-3 transition-colors tracking-widest"
          >
            ✖ CLOSE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
