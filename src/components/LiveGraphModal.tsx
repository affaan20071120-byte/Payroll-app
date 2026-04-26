import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Employee } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LiveGraphModalProps {
  employees: Employee[];
  onClose: () => void;
}

export function LiveGraphModal({ employees, onClose }: LiveGraphModalProps) {
  const data = useMemo(() => {
    return employees.map(e => ({
      name: e.name.substring(0, 15) + (e.name.length > 15 ? '...' : ''),
      id: e.empNo,
      'Net Salary': e.netSalary,
      'Gross Salary': e.grossSalary,
      'Basic Salary': e.basicSalary,
    }));
  }, [employees]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-[#16213e]/95 backdrop-blur-xl border-2 rounded-3xl p-6 max-w-[900px] w-full h-[550px] flex flex-col shadow-2xl"
        style={{ borderColor: "#2bcbba", boxShadow: "0 20px 60px rgba(43, 203, 186, 0.4)" }}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-black text-[#2bcbba] tracking-tight flex items-center gap-2">
              📈 Salary Comparison Chart
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {employees.length === 0 
                ? "No data to display." 
                : `Showing salary progression for ${employees.length} ${employees.length === 1 ? 'employee' : 'employees'}.`}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 w-full bg-[#0b0b1a]/50 rounded-2xl p-4 mt-4 border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {data.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-3">
              <span className="text-4xl">📭</span>
              <span>No employee data selected or available.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a5b1c2" 
                  tick={{ fill: '#a5b1c2', fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  dy={10}
                />
                <YAxis 
                  stroke="#a5b1c2" 
                  tick={{ fill: '#a5b1c2', fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(11, 11, 26, 0.95)', 
                    borderColor: '#2bcbba', 
                    borderRadius: '12px', 
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#a5b1c2', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Net Salary" 
                  stroke="#00ff88" 
                  strokeWidth={4} 
                  activeDot={{ r: 8, fill: "#00ff88", stroke: "#0b0b1a", strokeWidth: 2 }} 
                  dot={{ r: 4, fill: "#00ff88", strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Gross Salary" 
                  stroke="#ffa502" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  dot={{ r: 3, fill: "#ffa502", strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Basic Salary" 
                  stroke="#00d2ff" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  activeDot={{ r: 4 }} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
}
