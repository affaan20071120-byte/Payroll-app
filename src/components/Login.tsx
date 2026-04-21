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
    <div className="flex items-center justify-center min-h-screen">
      <RobotTechBackground />
      <div className="bg-gradient-to-br from-[#1a1a2e]/95 to-[#16213e]/95 backdrop-blur-xl border-4 border-[#00ffcc] shadow-[0_0_60px_#00ffcc60] rounded-[30px] p-10 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#00ff88] mb-3 drop-shadow-[0_0_10px_#00ff88]">🚀 PAYROLL SYSTEM</h1>
          <p className="text-[#00ffff] font-bold text-lg drop-shadow-[0_0_5px_#00ffff]">✨ Secure Access Portal</p>
        </div>

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
