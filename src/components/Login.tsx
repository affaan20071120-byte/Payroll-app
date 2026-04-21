import React, { useState } from 'react';
import { GlowButton } from './GlowButton';
import { RobotTechBackground } from './RobotTechBackground';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(5);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '12345') {
      onLogin();
    } else {
      const remaining = attempts - 1;
      setAttempts(remaining);
      if (remaining > 0) {
        setError(`Invalid credentials! You have ${remaining} attempt(s) remaining.`);
        setUsername('');
        setPassword('');
      } else {
        setError('Maximum login attempts reached! Access Denied.');
      }
    }
  };

  if (attempts <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RobotTechBackground />
        <div className="bg-[#16213e]/80 backdrop-blur-xl border-4 border-red-500 rounded-[25px] p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-red-400">Maximum login attempts reached. Please refresh to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen font-sans overflow-hidden">
      <RobotTechBackground />
      
      {/* Decorative AI scanning lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 w-full h-[2px] bg-[#00ffcc] opacity-20 animate-[scan_4s_linear_infinite]" />
        <div className="absolute top-1/4 w-full h-[1px] bg-[#00ff88] opacity-10 animate-[scan_6s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10 bg-gradient-to-br from-[#0a0a1a]/95 to-[#16213e]/95 backdrop-blur-2xl border-[3px] border-[#00ffcc50] shadow-[0_0_80px_rgba(0,255,204,0.3)] rounded-[35px] p-10 max-w-md w-full transition-all duration-500 hover:shadow-[0_0_100px_rgba(0,255,204,0.4)]">
        
        {/* AI Scanner Section */}
        <div className="flex flex-col items-center mb-8 relative">
           <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#00ffcc] flex items-center justify-center p-3 animate-[spin_10s_linear_infinite] mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00ffcc] to-transparent opacity-20" />
           </div>
           <div className="absolute top-6">
              <div className="w-12 h-12 bg-[#00ffcc]/20 rounded-lg flex items-center justify-center border border-[#00ffcc] animate-pulse">
                 <span className="text-3xl">🤖</span>
              </div>
           </div>
           <div className="text-center">
              <h1 className="text-3xl font-black text-[#00ff88] tracking-tighter uppercase mb-1 drop-shadow-[0_0_15px_#00ff8880]">
                 AI IDENTITY SCAN
              </h1>
              <div className="flex items-center justify-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                 <p className="text-[10px] text-[#00ffff] font-mono tracking-[0.2em] uppercase opacity-70">Unauthorized access prohibited</p>
              </div>
           </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00ffcc50] to-transparent mb-8" />

        {error ? (
          <div className="text-center mb-6 text-[#ff6b81] font-bold text-sm bg-[#ff6b81]/20 p-4 rounded-xl border border-[#ff6b81]/50 shadow-[0_0_15px_#ff6b8140]">
            {error}
          </div>
        ) : (
          <div className="text-center mb-6 text-[#ffa502] font-bold text-sm drop-shadow-[0_0_5px_#ffa502]">
            Attempts remaining: {attempts}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[#00ffcc] font-bold text-sm tracking-widest uppercase drop-shadow-[0_0_5px_#00ffcc]">👤 Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-[#05050f]/60 backdrop-blur-md border-[2px] border-[#00ffcc] rounded-2xl px-5 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:border-[3px] focus:shadow-[0_0_20px_#00ffcc50] focus:bg-[#00ffcc]/10 transition-all font-sans"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[#00ffcc] font-bold text-sm tracking-widest uppercase drop-shadow-[0_0_5px_#00ffcc]">🔑 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#05050f]/60 backdrop-blur-md border-[2px] border-[#00ffcc] rounded-2xl px-5 py-4 text-white text-lg placeholder-white/40 focus:outline-none focus:border-[3px] focus:shadow-[0_0_20px_#00ffcc50] focus:bg-[#00ffcc]/10 transition-all font-sans"
              required
            />
          </div>

          <div className="mt-10">
            <GlowButton
              type="submit"
              color="#00ff88"
              glowColor="#00ff88"
              enableZoom={true}
              className="w-full px-8 py-5 text-xl tracking-widest uppercase shadow-[0_0_20px_#00ff8860]"
            >
              Login
            </GlowButton>
          </div>
          
          <div className="text-xs text-center text-[#00ffcc]/70 mt-6 tracking-wide italic">
             Access Restricted
          </div>
        </form>
      </div>
    </div>
  );
}
