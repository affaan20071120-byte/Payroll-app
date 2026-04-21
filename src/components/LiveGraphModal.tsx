import React from 'react';
import { motion } from 'motion/react';
import { Employee } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LiveGraphModalProps {
  employees: Employee[];
  onClose: () => void;
}

export function LiveGraphModal({ employees, onClose }: LiveGraphModalProps) {
  const data = employees.map(e => ({
    name: e.name.substring(0, 10),
    NetSalary: e.netSalary,
    GrossSalary: e.grossSalary,
    Basic: e.basicSalary,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-[#16213e]/95 backdrop-blur-xl border-2 rounded-3xl p-6 max-w-[800px] w-full h-[500px] flex flex-col"
        style={{ borderColor: "#2bcbba", boxShadow: "0 10px 40px #2bcbba30" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2bcbba]">
            📈 Live Salary Trends (Line Graph)
          </h2>
          <button onClick={onClose} className="text-[#2bcbba] hover:text-white font-bold text-xl px-2">✕</button>
        </div>

        <div className="flex-1 w-full bg-black/20 rounded-xl p-4 border border-white/5">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              No employee data for graph.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a5b1c2" tick={{ fill: '#a5b1c2' }} />
                <YAxis stroke="#a5b1c2" tick={{ fill: '#a5b1c2' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(26,26,46,0.9)', borderColor: '#2bcbba', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="NetSalary" stroke="#00ff88" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="GrossSalary" stroke="#ffa502" strokeWidth={2} />
                <Line type="monotone" dataKey="Basic" stroke="#00d2ff" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
}
