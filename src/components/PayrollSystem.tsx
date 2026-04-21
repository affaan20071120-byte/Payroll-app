import React, { useState } from 'react';
import { UniverseBackground } from './UniverseBackground';
import { GlowButton } from './GlowButton';
import { Employee, PayrollSettings, defaultSettings } from '../types';
import { EmployeeForm } from './EmployeeForm';
import { StatsModal } from './StatsModal';
import { BreakdownModal } from './BreakdownModal';
import { SortModal } from './SortModal';
import { ChatBot } from './ChatBot';
import { SettingsModal } from './SettingsModal';
import { LiveGraphModal } from './LiveGraphModal';
import { DeleteModal } from './DeleteModal';
import { exportToPDF } from '../lib/pdf-export';
import { Menu, Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PayrollSystem() {
  const [tabsData, setTabsData] = useState<Record<number, Employee[]>>(() => {
    const saved = localStorage.getItem('payroll_tabs_data');
    return saved ? JSON.parse(saved) : { 1: [] };
  });

  const [settings, setSettings] = useState<PayrollSettings>(() => {
    const saved = localStorage.getItem('payroll_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure new fields like 'geminiApiKey' always exist
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save everything whenever it changes
  React.useEffect(() => {
    localStorage.setItem('payroll_settings', JSON.stringify(settings));
  }, [settings]);

  React.useEffect(() => {
    localStorage.setItem('payroll_tabs_data', JSON.stringify(tabsData));
  }, [tabsData]);

  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTableVisible, setIsTableVisible] = useState(true);
  
  const [selectedEmpIds, setSelectedEmpIds] = useState<Set<number>>(new Set());

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | undefined>();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'selected' | 'all'>('selected');

  // Tabs state
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem('payroll_tabs');
    return saved ? JSON.parse(saved) : [{ id: 1, title: 'Payroll 1' }];
  });

  React.useEffect(() => {
    localStorage.setItem('payroll_tabs', JSON.stringify(tabs));
  }, [tabs]);

  const [activeTab, setActiveTab] = useState(1);
  const employees = tabsData[activeTab] || [];

  const handleAddTab = () => {
    const newId = Date.now();
    const count = tabs.length + 1;
    setTabs([...tabs, { id: newId, title: `Payroll ${count}` }]);
    setActiveTab(newId);
  };
  const handleSetEmployees = (newEmployees: Employee[] | ((prev: Employee[]) => Employee[])) => {
    setTabsData(prev => ({
      ...prev,
      [activeTab]: typeof newEmployees === 'function' ? newEmployees(prev[activeTab] || []) : newEmployees
    }));
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.empNo.toString().includes(search)
  );

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleToggleTable = () => setIsTableVisible(!isTableVisible);

  const handleAddEmployee = () => {
    setEditingEmp(undefined);
    setIsFormOpen(true);
  };

  const handleEditEmployee = () => {
    if (selectedEmpIds.size !== 1) {
      alert("Please select exactly one employee to edit.");
      return;
    }
    const empId = Array.from(selectedEmpIds)[0];
    const emp = employees.find(e => e.empNo === empId);
    if (emp) {
      setEditingEmp(emp);
      setIsFormOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedEmpIds.size > 0) {
      setDeleteMode('selected');
      setIsDeleteConfirmOpen(true);
    } else {
      setDeleteMode('all');
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteMode === 'selected') {
      handleSetEmployees(employees.filter(e => !selectedEmpIds.has(e.empNo)));
      setSelectedEmpIds(new Set());
    } else {
      handleSetEmployees([]);
      setSelectedEmpIds(new Set());
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleSaveEmployee = (emp: Employee) => {
    if (editingEmp) {
      handleSetEmployees(employees.map(e => e.empNo === emp.empNo ? emp : e));
    } else {
      if (employees.some(e => e.empNo === emp.empNo)) {
         alert("Employee Number already exists!");
         return;
      }
      handleSetEmployees([...employees, emp]);
    }
    setIsFormOpen(false);
  };

  const handleSort = (col: string, dir: 'asc' | 'desc') => {
    const sorted = [...employees].sort((a, b) => {
      const valA = (a as any)[col];
      const valB = (b as any)[col];
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    handleSetEmployees(sorted);
  };

  const handleRowClick = (empNo: number, e: React.MouseEvent) => {
    const newSelected = new Set(selectedEmpIds);
    if (e.ctrlKey || e.metaKey) {
      if (newSelected.has(empNo)) newSelected.delete(empNo);
      else newSelected.add(empNo);
    } else {
      newSelected.clear();
      newSelected.add(empNo);
    }
    setSelectedEmpIds(newSelected);
  };

  const handleShowBreakdown = () => {
     if (selectedEmpIds.size !== 1) {
       alert("Please select exactly one employee.");
       return;
     }
     setIsBreakdownOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden text-white font-sans selection:bg-[#0080ff]/40 bg-[#05050f]">
      <UniverseBackground />
      
  <div className="flex items-end h-14 w-full bg-gradient-to-b from-[#0a0a14] to-[#161625] px-2 pt-2 gap-1 select-none relative z-20 shadow-[0_4px_20px_rgba(0,128,255,0.1)]">
        <div className="flex gap-1 overflow-x-auto flex-1 h-full items-end blue-horizontal-scrollbar shrink-0 pb-1">
          <AnimatePresence initial={false}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
              <motion.div 
                key={tab.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 15, width: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, width: 200, paddingLeft: 12, paddingRight: 8, marginRight: 4 }}
                exit={{ opacity: 0, scale: 0.5, y: 10, width: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: isActive ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex shrink-0 items-center gap-2 h-[42px] max-w-[240px] rounded-t-[14px] transition-colors duration-300 cursor-pointer group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-b from-[#2a2a4a] to-[#1e1e35] z-10 text-white shadow-[0_-8px_20px_rgba(0,128,255,0.15)] border-t border-[#0080ff]/30' 
                    : 'bg-gradient-to-b from-[#161625] to-[#10101d] hover:bg-[#1c1c30] text-white/60 hover:text-white/90 border-t border-transparent hover:border-white/10'
                }`}
              >
                <div className={`w-[18px] h-[18px] rounded-[4px] shrink-0 flex items-center justify-center text-white transition-all duration-300 ${
                    isActive ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-110' : 'bg-indigo-500/50 grayscale group-hover:grayscale-0 group-hover:bg-indigo-500/80'
                }`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <span className="text-sm font-bold tracking-wide truncate flex-1">{tab.title}</span>
                {tab.id !== 1 && (
                  <motion.button 
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTabs = tabs.filter(t => t.id !== tab.id);
                      setTabs(newTabs);
                      if (activeTab === tab.id) setActiveTab(newTabs[newTabs.length - 1].id);
                    }}
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center hover:bg-[#ff003c]/20 hover:shadow-[0_0_10px_rgba(255,0,60,0.5)] transition-all"
                  >
                    <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#ff003c] transition-colors" strokeWidth={3} />
                  </motion.button>
                )}
                {isActive && (
                    <motion.div 
                        layoutId="activeTabBottom"
                        className="absolute inset-x-0 bottom-0 h-[3px] bg-white z-20 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                    />
                )}
              </motion.div>
              );
            })}
          </AnimatePresence>
          <motion.button 
            layout
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddTab}
            className="w-[38px] h-[38px] mb-1 ml-2 rounded-full flex items-center justify-center bg-transparent hover:bg-[#00d2ff]/20 text-[#00d2ff] transition-all shrink-0 shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.9)] border-[2.5px] border-[#00d2ff] relative z-20 overflow-hidden"
          >
            <Plus className="w-5 h-5 drop-shadow-[0_0_5px_rgba(0,210,255,1)]" strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
              <motion.div 
              initial={{ width: 0, opacity: 0, x: -50 }}
              animate={{ width: 280, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -50 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="flex-shrink-0 flex flex-col bg-gradient-to-b from-[#1a1a2e]/95 to-[#0b0b1a]/95 border-r border-[#00d2ff]/50 backdrop-blur-3xl z-10 shadow-[0_0_40px_rgba(0,210,255,0.2)] overflow-hidden"
            >
              <div className="w-[280px] p-6 h-full overflow-y-auto cyan-scrollbar flex flex-col gap-4">
                <div className="bg-gradient-to-r from-[#0080ff]/20 to-[#00d2ff]/20 text-[#00d2ff] font-bold text-lg text-center p-4 rounded-2xl mb-8 border border-[#00d2ff]/40 flex items-center justify-center gap-3 drop-shadow-[0_0_10px_rgba(0,210,255,0.5)] shrink-0">
                  <span className="text-2xl">⚡</span> PAYROLL HUB
                </div>

                <div className="flex flex-col gap-4 pb-8 shrink-0">
                  <GlowButton color="#00d2ff" glowColor="#00d2ff" onClick={handleAddEmployee} pulse={true} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(0,210,255,0.5)]">
                    ➕ Add Employee
                  </GlowButton>
                  <GlowButton color="#ff6b35" glowColor="#ff6b35" onClick={handleEditEmployee} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(255,107,53,0.5)]">
                     ✏️ Edit Employee
                  </GlowButton>
                  <GlowButton color="#ff003c" glowColor="#ff003c" onClick={handleDeleteClick} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(255,0,60,0.5)]">
                     🗑️ Delete
                  </GlowButton>
                  <GlowButton color="#ffa502" glowColor="#ffa502" onClick={handleToggleTable} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(255,165,2,0.5)]">
                     👁️ {isTableVisible ? "Hide" : "Show"} Table
                  </GlowButton>
                  <GlowButton color="#9b59b6" glowColor="#9b59b6" onClick={() => exportToPDF(selectedEmpIds.size > 0 ? employees.filter(e => selectedEmpIds.has(e.empNo)) : employees)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_18px_rgba(155,89,182,0.5)]">
                     📄 Export PDF
                  </GlowButton>
                  <GlowButton color="#00e5ff" glowColor="#00e5ff" onClick={() => setIsSortOpen(true)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                     🔃 Sort Table
                  </GlowButton>
                  <GlowButton color="#f9ca24" glowColor="#f9ca24" onClick={() => setIsStatsOpen(true)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(249,202,36,0.4)]">
                     📈 Salary Stats
                  </GlowButton>
                  <GlowButton color="#2bcbba" glowColor="#2bcbba" onClick={() => setIsGraphOpen(true)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(43,203,186,0.4)]">
                     📈 Live Graph
                  </GlowButton>
                  <GlowButton color="#e056fd" glowColor="#e056fd" onClick={handleShowBreakdown} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(224,86,253,0.4)]">
                     🧾 Breakdown
                  </GlowButton>
                  <GlowButton color="#fc5c65" glowColor="#fc5c65" onClick={() => setIsSettingsOpen(true)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(252,92,101,0.4)]">
                     ⚙️ Settings
                  </GlowButton>
                  <GlowButton color="#fd79a8" glowColor="#fd79a8" onClick={() => setIsChatOpen(true)} className="py-4 text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(253,121,168,0.4)]">
                     🤖 AI ChatBot
                  </GlowButton>

                  <GlowButton color="#ff4757" glowColor="#ff4757" onClick={() => window.location.reload()} className="py-4 mt-auto text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,71,87,0.5)] bg-red-500/10">
                     🚪 Logout
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-0 p-5 gap-5">
          
          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleSidebar}
              className="w-12 h-12 rounded-full border-2 border-[#0080ff] bg-[#0080ff]/20 text-[#0080ff] flex items-center justify-center hover:bg-[#0080ff]/40 transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/50" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or employee number..."
                className="w-full bg-[#161625]/80 backdrop-blur-sm border-2 border-[#00d2ff] rounded-full pl-11 pr-5 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#00ffff] focus:ring-4 focus:ring-[#00ffff]/30 transition-all shadow-[0_0_40px_10px_rgba(0,210,255,0.6)]"
              />
            </div>
          </div>

          {/* Table Container */}
          {isTableVisible && (
            <div className="flex-1 overflow-auto bg-[#0a0a1a] border border-[#00d2ff] rounded-[20px] cyan-scrollbar relative shadow-[0_0_60px_rgba(0,210,255,0.25)]">
              <table className="w-full text-left border-separate border-spacing-0 text-sm min-w-[max-content]">
                <thead className="sticky top-0 bg-[#5b69a2] z-20 shadow-xl border-b-2 border-[#6c7bbd]">
                  <tr>
                    {[
                      settings.empNoLabel, settings.nameLabel, settings.jobLabel, 
                      settings.basicLabel, settings.daLabel, settings.hraLabel, 
                      settings.allowanceLabel,
                      ...(settings.customAllowances || []).map(ca => ca.label),
                      settings.grossLabel, settings.taxLabel, 
                      settings.healthLabel, settings.carLabel, settings.netLabel, 
                      "Actions"
                    ].map((h, i) => (
                      <th key={`${h}-${i}`} className="p-4 font-bold text-white whitespace-nowrap drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={13 + (settings.customAllowances?.length || 0)} className="p-10 text-center text-white/60">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-5xl opacity-80">👥</div>
                          <div className="text-base font-semibold text-white/80">No employees found. Add some to get started!</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const isSelected = selectedEmpIds.has(emp.empNo);
                      return (
                        <tr 
                          key={emp.empNo} 
                          onClick={(e) => handleRowClick(emp.empNo, e)}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'bg-[#00d2ff]/20' : 'bg-[#1a1a2e]/20 hover:bg-[#00d2ff]/10'
                          }`}
                        >
                          <td className={`p-4 font-mono text-cyan-200 border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.empNo}</td>
                          <td className={`p-4 font-semibold text-sm text-white border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.name}</td>
                          <td className={`p-4 text-white/90 border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.job}</td>
                          <td className={`p-4 font-mono text-white/90 border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.basicSalary.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#00ff88] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.da.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#00ff88] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.hra.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#00ff88] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.otherAllowance.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          
                          {/* Dynamic Columns */}
                          {(settings.customAllowances || []).map(ca => (
                            <td key={ca.id} className={`p-4 font-mono text-[#00ff88] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>
                              {(emp.customAllowances?.[ca.id] || 0).toLocaleString('en-US', {minimumFractionDigits:2})}
                            </td>
                          ))}

                          <td className={`p-4 font-mono font-semibold text-[#ffa502] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.grossSalary.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#ff4757] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.tax.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#ff4757] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.healthInsurance.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#ff4757] border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.carInsurance.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 font-mono text-[#00ffff] font-bold bg-[#00ffff]/10 border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>{emp.netSalary.toLocaleString('en-US', {minimumFractionDigits:2})}</td>
                          <td className={`p-4 border-b ${isSelected ? 'border-t border-b border-[#00d2ff]' : 'border-[#00d2ff]/20'}`}>
                            <div className="flex flex-col gap-2">
                              <span className="font-mono text-[#feca57] text-xs whitespace-nowrap">{emp.createdAt || '-'}</span>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setEditingEmp(emp); setIsFormOpen(true); }} className="hover:scale-125 active:scale-95 transition-transform" title="Edit">✏️</button>
                                <button onClick={(e) => { e.stopPropagation(); handleSetEmployees(employees.filter(x => x.empNo !== emp.empNo)); }} className="hover:scale-125 active:scale-95 transition-transform" title="Delete">🗑️</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <DeleteModal 
            mode={deleteMode}
            count={selectedEmpIds.size}
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsDeleteConfirmOpen(false)}
          />
        )}
        {isFormOpen && (
          <EmployeeForm 
            employee={editingEmp} 
            settings={settings}
            existingEmployees={employees}
            onSave={handleSaveEmployee} 
            onCancel={() => setIsFormOpen(false)} 
          />
        )}
        {isStatsOpen && (
          <StatsModal employees={employees} onClose={() => setIsStatsOpen(false)} />
        )}
        {isBreakdownOpen && (
          <BreakdownModal 
            employee={employees.find(e => e.empNo === Array.from(selectedEmpIds)[0])!} 
            settings={settings}
            onClose={() => setIsBreakdownOpen(false)} 
          />
        )}
        {isSortOpen && (
          <SortModal onSort={handleSort} onClose={() => setIsSortOpen(false)} />
        )}
        {isGraphOpen && (
          <LiveGraphModal employees={employees} onClose={() => setIsGraphOpen(false)} />
        )}
        {isSettingsOpen && (
          <SettingsModal 
            settings={settings} 
            onSave={(updated) => { setSettings(updated); setIsSettingsOpen(false); }} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        )}
        {isChatOpen && (
          <ChatBot 
            onClose={() => setIsChatOpen(false)} 
            employeesContext={employees} 
            geminiApiKey={settings.geminiApiKey}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
