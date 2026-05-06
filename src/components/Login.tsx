import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DuneBackground } from './DuneBackground';

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
    if (username === 'Mohammed' && password === '20112007') {
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
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <div className="bg-[#111]/80 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-red-400">Maximum login attempts reached.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050b16] text-white overflow-hidden">
      {/* Left side: Visualization */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-[#050b16]">
        <DuneBackground />
        
        <div className="relative z-10 p-12 text-center text-white">
            <h1 className="text-5xl font-black tracking-tighter mb-6 text-cyan-50 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]">
                PAYROLL MANAGEMENT <br/> SYSTEM
            </h1>
            <p className="text-cyan-300 font-bold text-lg max-w-sm mx-auto drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
                Secure, efficient, and precise payroll management for your organization.
            </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#000a16]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-6xl font-black mb-2 text-cyan-200 drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]">Welcome</h2>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-cyan-300">Username</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-[#050b16] border border-white/10 rounded-xl px-4 py-3.5 text-cyan-100 placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-cyan-300">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#050b16] border border-white/10 rounded-xl px-4 py-3.5 text-cyan-100 placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                required
                />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#0d3b66] text-cyan-100 font-bold text-lg rounded-xl hover:bg-[#0d3b66]/90 transition-all shadow-[0_0_15px_rgba(13,59,102,0.4)]"
            >
              Sign In
            </button>
          </form>

          {error && <div className="text-cyan-100 text-sm bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30 text-center drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{error}</div>}

        </motion.div>
      </div>
    </div>
  );
}
