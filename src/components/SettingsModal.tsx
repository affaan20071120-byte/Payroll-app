import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { PayrollSettings } from '../types';

interface SettingsModalProps {
  settings: PayrollSettings;
  onSave: (newSettings: PayrollSettings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<PayrollSettings>(settings);

  const handleChange = (key: keyof PayrollSettings, value: string) => {
    const num = parseFloat(value);
    setLocalSettings(prev => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num / 100 // Convert percentage to decimal
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  const InputField = ({ label, valueKey }: { label: string; valueKey: keyof PayrollSettings }) => {
    const [draftValue, setDraftValue] = useState(Math.round((localSettings[valueKey] as number) * 100).toString());

    const handleBlur = () => {
      const num = parseFloat(draftValue);
      handleChange(valueKey, isNaN(num) ? '0' : num.toString());
    };

    return (
      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10 group hover:border-[#fc5c65]/50 transition-colors">
        <label className="text-white/80 text-sm group-hover:text-white transition-colors">{label}</label>
        <div className="flex items-center gap-1 shadow-[0_0_10px_rgba(252,92,101,0.2)]">
          <input
            type="number"
            step="1"
            value={draftValue}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={handleBlur}
            className="w-16 bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-[#fc5c65] focus:ring-1 focus:ring-[#fc5c65] transition-all"
          />
          <span className="text-white/50">%</span>
        </div>
      </div>
    );
  };

  const LabelInputField = ({ labelKey }: { labelKey: string }) => {
    const [draftValue, setDraftValue] = useState(localSettings[`${labelKey}Label` as keyof PayrollSettings] as string);

    const handleBlur = () => {
        setLocalSettings(prev => ({ ...prev, [`${labelKey}Label`]: draftValue }));
    };

    return (
        <input
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={handleBlur}
            className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#fc5c65] focus:ring-1 focus:ring-[#fc5c65] shadow-[0_0_5px_rgba(252,92,101,0.2)] transition-all"
            placeholder={labelKey.toUpperCase()}
        />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[#16213e]/95 backdrop-blur-xl border-2 rounded-3xl p-6 max-w-[600px] w-full"
        style={{ borderColor: "#fc5c65", boxShadow: "0 10px 40px #fc5c6530" }}
        onClick={(e) => e.stopPropagation()}
      >
         <h2 className="text-xl font-bold text-center mb-4 text-[#fc5c65]">
           ⚙️ Payroll Settings
         </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          <div className="space-y-2">
            <h3 className="text-[#00ffcc] font-semibold mb-2 border-b border-white/10 pb-1">Officer Rates</h3>
            <InputField label="DA Rate" valueKey="daOfficer" />
            <InputField label="HRA Rate" valueKey="hraOfficer" />
            <InputField label="Tax Rate" valueKey="taxOfficer" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-[#00ffcc] font-semibold mb-2 border-b border-white/10 pb-1">Manager Rates</h3>
            <InputField label="DA Rate" valueKey="daManager" />
            <InputField label="HRA Rate" valueKey="hraManager" />
            <InputField label="Tax Rate" valueKey="taxManager" />
          </div>

          <div className="space-y-2">
            <h3 className="text-[#00ffcc] font-semibold mb-2 border-b border-white/10 pb-1">Teacher Rates</h3>
            <InputField label="DA Rate" valueKey="daTeacher" />
            <InputField label="HRA Rate" valueKey="hraTeacher" />
            <InputField label="Tax Rate" valueKey="taxTeacher" />
          </div>

          <div className="space-y-2">
            <h3 className="text-[#00ffcc] font-semibold mb-2 border-b border-white/10 pb-1">Default (Others)</h3>
            <InputField label="DA Rate" valueKey="daDefault" />
            <InputField label="HRA Rate" valueKey="hraDefault" />
            <InputField label="Tax Rate" valueKey="taxDefault" />
          </div>
          
          <div className="space-y-4 col-span-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-1">
              <h3 className="text-[#f9ca24] font-semibold text-sm uppercase tracking-wider">Add Dynamic Columns</h3>
              <button 
                onClick={() => {
                  const id = `extra_${Date.now()}`;
                  setLocalSettings(prev => ({
                    ...prev,
                    customAllowances: [...(prev.customAllowances || []), { id, label: '', rate: 0.05 }]
                  }));
                }}
                className="text-xs bg-[#f9ca24]/20 hover:bg-[#f9ca24]/40 text-[#f9ca24] px-3 py-1.5 rounded-lg border border-[#f9ca24]/30 shadow-[0_0_10px_rgba(249,202,36,0.2)] hover:shadow-[0_0_20px_rgba(249,202,36,0.4)] transition-all font-bold uppercase tracking-tighter"
              >
                + Add Column
              </button>
            </div>
            
            <div className="space-y-3">
              {(localSettings.customAllowances || []).map((ca, idx) => (
                <div key={ca.id} className="flex gap-2 items-center bg-white/5 p-2 rounded-xl group relative border border-white/5 hover:border-white/10 transition-colors">
                  <input
                    type="text"
                    value={ca.label}
                    onChange={(e) => {
                      const newList = [...localSettings.customAllowances];
                      newList[idx].label = e.target.value;
                      setLocalSettings(prev => ({ ...prev, customAllowances: newList }));
                    }}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#fc5c65] focus:ring-1 focus:ring-[#fc5c65] shadow-[0_0_5px_rgba(252,92,101,0.1)] outline-none transition-all placeholder:text-white/20"
                    placeholder="Enter column name"
                  />
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-2 py-2 focus-within:border-[#fc5c65] focus-within:ring-1 focus-within:ring-[#fc5c65] transition-all min-w-[70px]">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={(ca.rate === 0 && ca.label === "") || (ca.rate === 0 && !ca.label) ? "" : Math.round(ca.rate * 100)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const newList = [...localSettings.customAllowances];
                        newList[idx].rate = val === "" ? 0 : parseInt(val) / 100;
                        setLocalSettings(prev => ({ ...prev, customAllowances: newList }));
                      }}
                      className="w-full bg-transparent text-white text-right text-sm outline-none font-mono"
                      placeholder="0"
                    />
                    <span className="text-[#fc5c65] text-xs font-bold">%</span>
                  </div>
                  <button
                    onClick={() => {
                      setLocalSettings(prev => ({
                        ...prev,
                        customAllowances: prev.customAllowances.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="p-2 text-red-400 opacity-50 hover:opacity-100 transition-opacity"
                    title="Delete Column"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {(localSettings.customAllowances || []).length === 0 && (
                <div className="text-center py-4 text-white/30 text-xs italic">
                  No extra allowance columns added. Click "+ Add Column" to create one.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 col-span-2">
            <h3 className="text-[#f9ca24] font-semibold mb-2 border-b border-white/10 pb-1">Column Labels</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['empNo', 'name', 'job', 'basic', 'da', 'hra', 'allowance', 'gross', 'tax', 'health', 'car', 'net'] as const).map(key => (
                  <LabelInputField key={key} labelKey={key}/>
              ))}
            </div>
          </div>
          <div className="space-y-2 col-span-2">
            <h3 className="text-[#f9ca24] font-semibold mb-2 border-b border-white/10 pb-1">Global Additions</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Allowance" valueKey="allowanceRate" />
              <InputField label="Health Ins." valueKey="healthRate" />
              <InputField label="Car Ins." valueKey="carRate" />
            </div>
          </div>

          <div className="space-y-3 col-span-2">
            <h3 className="text-[#00ffcc] font-semibold mb-1 border-b border-white/10 pb-1">AI Assistant Settings</h3>
            <div className="bg-[#fd79a8]/5 p-4 rounded-2xl border-2 border-[#fd79a8]/30 shadow-[0_0_20px_rgba(253,121,168,0.1)]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[#fd79a8] text-[10px] uppercase font-black tracking-widest">Gemini AI Key</label>
                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${localSettings.geminiApiKey?.length ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {localSettings.geminiApiKey?.length ? 'Key Present' : 'Key Missing'}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={localSettings.geminiApiKey || ''}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                  className="flex-1 bg-black/60 border border-[#fd79a8]/40 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#fd79a8] focus:ring-2 focus:ring-[#fd79a8]/50 transition-all font-mono"
                  placeholder="Paste GEMINI_API_KEY here..."
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!localSettings.geminiApiKey) {
                      alert("Please paste a key first!");
                      return;
                    }
                    try {
                      alert("⏳ Testing Key with Bulletproof Method... Please wait.");
                      // Step 1: Nuclear Sanitization (ASCII Only)
                      const cleanKey = localSettings.geminiApiKey.trim().replace(/[^\x21-\x7E]/g, '');
                      
                      // Step 2: Bypass Header Validation using URL Parameter
                      // This avoids the "Failed to execute 'append' on 'Headers'" error entirely.
                      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;
                      
                      const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [{ parts: [{ text: "hi" }] }]
                        })
                      });
                      
                      const data = await response.json();
                      
                      if (data.error) {
                        throw new Error(data.error.message || "Invalid API Key");
                      }
                      
                      if (data.candidates && data.candidates[0]) {
                        alert("✅ SUCCESS! The AI responded. Your key is now validated and sanitized.");
                        // Save the cleaned key
                        setLocalSettings(prev => ({ ...prev, geminiApiKey: cleanKey }));
                      } else {
                        throw new Error("API returned an empty response. Check your key permissions.");
                      }
                    } catch (e: any) {
                      console.error("Nuclear Test Error:", e);
                      alert("❌ Error: " + e.message);
                    }
                  }}
                  className="bg-[#fd79a8]/20 hover:bg-[#fd79a8]/40 text-[#fd79a8] px-4 py-2 rounded-xl border border-[#fd79a8]/40 font-bold text-[10px] uppercase transition-all"
                >
                  Test
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-3 italic leading-relaxed">
                <strong className="text-[#fd79a8]">IMPORTANT:</strong> GitHub Hosting cannot see AI Studio secrets. You MUST paste the key <span className="underline uppercase font-bold">HERE</span> in the app settings, not in the sidebar menu.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSave}
            className="bg-[#fc5c65] hover:bg-[#ff7e85] text-[#1a1a2e] rounded-xl font-bold text-sm px-8 py-2.5 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="bg-transparent border border-[#fc5c65] text-[#fc5c65] hover:bg-[#fc5c65]/10 rounded-xl font-bold text-sm px-8 py-2.5 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
          <button 
            onClick={() => {
              if (confirm("⚠️ Warning: This will delete ALL employees and reset ALL settings. Proceed?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-[10px] text-red-500/50 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
          >
            Clear All Data & Reset App
          </button>
        </div>
      </motion.div>
    </div>
  );
}
