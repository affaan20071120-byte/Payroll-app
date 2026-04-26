import React, { useState } from 'react';
import { GlowButton } from './GlowButton';
import { Employee, PayrollSettings } from '../types';
import { calculateSalaryComponents } from '../lib/payroll-utils';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeeFormProps {
  employee?: Employee;
  settings: PayrollSettings;
  existingEmployees: Employee[];
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

const JOBS = ["OFFICER", "MANAGER", "TEACHER", "CLERK", "ASSISTANT", "SUPERVISOR"];

export function EmployeeForm({ employee, settings, existingEmployees, onSave, onCancel }: EmployeeFormProps) {
  const isEdit = !!employee;
  const bc = isEdit ? '#ff6b35' : '#00e5ff';

  const [empNo, setEmpNo] = useState(employee?.empNo?.toString() || '');
  
  // Removed automatic sequential ID generation to allow free entry

  const [name, setName] = useState(employee?.name || '');
  const [job, setJob] = useState(employee?.job || '');
  const [basicSalary, setBasicSalary] = useState(employee?.basicSalary?.toString() || '');
  
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [hiddenJobs, setHiddenJobs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('payroll_hidden_jobs') || '[]'); } catch { return []; }
  });
  
  const handleHideJob = (j: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newHidden = [...hiddenJobs, j];
    setHiddenJobs(newHidden);
    localStorage.setItem('payroll_hidden_jobs', JSON.stringify(newHidden));
  };

  const dynamicJobs = Array.from(new Set([...JOBS, ...existingEmployees.map(e => e.job).filter(Boolean)])).filter(j => !hiddenJobs.includes(j));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!empNo || !name || !job || !basicSalary) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    const basic = parseFloat(basicSalary);
    const id = parseInt(empNo, 10);
    
    if (isNaN(basic)) {
       setErrorMsg("Basic Salary must be a number.");
       return;
    }
    if (isNaN(id)) {
       setErrorMsg("Employee Number must be a number.");
       return;
    }

    const { 
      da, hra, otherAllowance, customAllowances, grossSalary, 
      tax, healthInsurance, carInsurance, netSalary 
    } = calculateSalaryComponents(job, basic, settings);

    try {
      onSave({
        empNo: id,
        name,
        job,
        basicSalary: basic,
        da,
        hra,
        otherAllowance,
        customAllowances,
        grossSalary,
        tax,
        healthInsurance,
        carInsurance,
        netSalary,
        createdAt: employee?.createdAt || new Date().toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        })
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save employee.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/60 backdrop-blur-sm" onClick={onCancel}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative bg-gradient-to-b from-[#1a1a2e]/95 to-[#0b0b1a]/95 backdrop-blur-2xl border rounded-[30px] p-10 max-w-[500px] w-full max-h-[90vh] overflow-y-auto ${isEdit ? 'orange-scrollbar' : 'cyan-scrollbar'} shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
        style={{ borderColor: `${bc}80` }}
      >
        <div className="absolute inset-0 rounded-[30px] shadow-[0_0_30px_inset] pointer-events-none" style={{ color: `${bc}20` }}></div>
        <h2 
          className="text-3xl font-bold text-center mb-8 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ color: bc }}
        >
          {isEdit ? `✏️ Edit ${employee.name}` : "✨ Create New Employee"}
        </h2>

        {errorMsg && (
          <div className="bg-[#ff4757]/10 border border-[#ff4757]/50 text-[#ff4757] px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[#00d2ff] text-xs font-bold uppercase tracking-widest pl-1">📝 {settings.empNoLabel}:</label>
            <input
              type="number"
              value={empNo}
              onChange={(e) => setEmpNo(e.target.value)}
              className="w-full bg-[#05050f]/50 border-2 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-[#05050f]/80 transition-all font-mono text-lg"
              style={{ borderColor: `${bc}50` }}
              placeholder={`Enter ${settings.empNoLabel.toLowerCase()}...`}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#00d2ff] text-xs font-bold uppercase tracking-widest pl-1">👤 {settings.nameLabel}:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#05050f]/50 border-2 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-[#05050f]/80 transition-all font-sans text-lg"
              style={{ borderColor: `${bc}50` }}
              placeholder={`Enter ${settings.nameLabel.toLowerCase()}...`}
            />
          </div>

          <div className="space-y-2 relative">
            <label className="block text-[#00d2ff] text-xs font-bold uppercase tracking-widest pl-1">💼 {settings.jobLabel}:</label>
            <div className="relative">
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                onFocus={() => setShowJobDropdown(true)}
                onBlur={() => setShowJobDropdown(false)}
                className="w-full bg-[#05050f]/50 border-2 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-[#05050f]/80 transition-all font-sans text-lg relative z-20"
                style={{ borderColor: `${bc}50` }}
                placeholder={`Select ${settings.jobLabel.toLowerCase()}...`}
              />
              <div 
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-30"
                onClick={() => setShowJobDropdown(!showJobDropdown)}
                style={{ color: bc }}
              >
                ▼
              </div>
            </div>
            
              <AnimatePresence>
              {showJobDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[100] w-full mt-2 bg-[#0b0b1a] border rounded-2xl overflow-hidden shadow-2xl"
                  style={{ borderColor: `${bc}50` }}
                >
                  <div className={`max-h-48 overflow-y-auto overflow-x-hidden ${isEdit ? 'orange-scrollbar' : 'cyan-scrollbar'}`}>
                    <AnimatePresence>
                      {dynamicJobs.map(j => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          key={j} 
                          className="px-5 py-3 cursor-pointer text-white/90 font-medium transition-colors hover:bg-white/10 flex justify-between items-center group"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setJob(j);
                            setShowJobDropdown(false);
                          }}
                        >
                          <span>{j}</span>
                          <button
                            type="button"
                            className="opacity-0 group-hover:opacity-100 text-[#ff4757] hover:bg-[#ff4757]/20 rounded-md px-2 py-1 transition-all"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleHideJob(j, e);
                            }}
                            title="Remove from suggestions"
                          >
                            ✖
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="block text-[#00d2ff] text-xs font-bold uppercase tracking-widest pl-1">💰 {settings.basicLabel}:</label>
            <input
              type="number"
              step="0.01"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className="w-full bg-[#05050f]/50 border-2 rounded-2xl px-5 py-4 text-[#00ff88] placeholder-white/30 focus:outline-none focus:bg-[#05050f]/80 transition-all font-mono text-lg font-bold"
              style={{ borderColor: `${bc}50` }}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-center gap-6 pt-8">
            <GlowButton type="submit" color={bc} glowColor={bc} className="flex-1 h-[50px] px-6 text-xs tracking-widest font-bold uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               💾 Save
            </GlowButton>
            <GlowButton type="button" onClick={onCancel} color="#ff4757" glowColor="#ff4757" className="flex-1 h-[50px] px-6 text-xs tracking-widest font-bold uppercase shadow-[0_0_20px_rgba(255,71,87,0.3)]">
               ❌ Cancel
            </GlowButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
