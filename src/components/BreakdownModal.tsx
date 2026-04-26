import { Employee, PayrollSettings } from '../types';
import { motion } from 'motion/react';

interface BreakdownModalProps {
  employee: Employee;
  settings: PayrollSettings;
  onClose: () => void;
}

export function BreakdownModal({ employee, settings, onClose }: BreakdownModalProps) {
  const dynamicAllowances = (settings.customAllowances || []).map(ca => ({
    label: `+ ${ca.label}`,
    value: (employee.customAllowances?.[ca.id] || 0)
      .toLocaleString('en-US', { minimumFractionDigits: 2 }),
    color: "#00ff88"
  }));

  const list = [
    { label: "Employee No", value: employee.empNo, color: "#00ffcc" },
    { label: "Job Title", value: employee.job, color: "#00d2ff" },
    { label: "Basic Salary", value: employee.basicSalary.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#ffffff" },
    { label: `+ ${settings.daLabel}`, value: employee.da.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#00ff88" },
    { label: `+ ${settings.hraLabel}`, value: employee.hra.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#00ff88" },
    { label: `+ ${settings.allowanceLabel}`, value: employee.otherAllowance.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#00ff88" },
    ...dynamicAllowances,
    { label: `= ${settings.grossLabel} Salary`, value: employee.grossSalary.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#ffa502" },
    { label: `− ${settings.taxLabel}`, value: employee.tax.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#ff3366" },
    { label: `− ${settings.healthLabel}`, value: employee.healthInsurance.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#ff3366" },
    { label: `− ${settings.carLabel}`, value: employee.carInsurance.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#ff3366" },
    { label: `✅ ${settings.netLabel} Salary`, value: employee.netSalary.toLocaleString('en-US', {minimumFractionDigits:2}), color: "#f9ca24" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-2xl border-[3px] rounded-3xl p-8 max-w-[440px] w-full"
        style={{ borderColor: "#e056fd", boxShadow: "0 20px 80px #e056fd30" }}
      >
        <h2 className="text-xl font-bold text-center mb-6 text-[#e056fd] drop-shadow-md">
          🧾 {employee.name} — Salary Breakdown
        </h2>

        <div className="space-y-3 mb-8 bg-black/20 p-5 rounded-2xl border border-white/5 max-h-[50vh] overflow-y-auto purple-scrollbar">
          {list.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#a0a0a0] text-sm font-medium">{item.label}</span>
                <span className="font-mono font-bold text-base text-right" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
              {i < list.length - 1 && <div className="border-b border-white/10 mt-1.5 w-full"></div>}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#e056fd] to-[#c030d0] hover:from-[#f0aaff] hover:to-[#e056fd] active:scale-95 text-[#1a1a2e] rounded-xl font-bold text-sm px-8 py-4 transition-all tracking-wider shadow-[0_0_20px_#e056fd50]"
          >
            ✖ CLOSE BREAKDOWN
          </button>
        </div>
      </motion.div>
    </div>
  );
}
