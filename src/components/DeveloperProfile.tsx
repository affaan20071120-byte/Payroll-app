import React from 'react';
import { motion } from 'motion/react';
import { X, Github, Mail, Disc } from 'lucide-react';

interface TabProps {
  onClose: () => void;
}

export function DeveloperProfile({ onClose }: TabProps) {
  const skills = [
    { name: 'Python', level: '4 Years', icon: '🐍' },
    { name: 'MySQL', level: 'Grade 12+', icon: '🗄️' },
    { name: 'Blender', level: '6 Months', icon: '🎨' },
    { name: 'CSS3', level: 'Intermediate', icon: '🎨' },
    { name: 'HTML', level: 'Expert (Grade 8+)', icon: '🌐' },
  ];

  const projects = [
    { title: 'Snake Game', desc: 'Modern glowing snake with score counter.', icon: '🐍' },
    { title: 'Scientific Calculator', desc: 'Neon-styled calculator with scientific functions.', icon: '🔢' },
    { title: 'Payroll System', desc: 'Advanced system with database integration.', icon: '💰' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative max-w-4xl w-full bg-[#16213e]/95 border-2 border-[#00d2ff] rounded-[30px] overflow-hidden shadow-[0_0_100px_rgba(0,210,255,0.3)] flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Photo/Intro */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-[#00d2ff]/20 to-[#0080ff]/20 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-[#00d2ff]/30">
          <div className="w-32 h-32 rounded-full bg-[#05050f] border-4 border-[#00d2ff] flex items-center justify-center text-5xl mb-6 shadow-[0_0_30px_rgba(0,210,255,0.5)]">
            👨‍💻
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-[0_0_8px_rgba(0,210,255,0.8)] leading-tight">Mohammed Affaan Delvi</h2>
          <p className="text-[#00d2ff] font-medium text-sm mb-6 uppercase tracking-wider">Computer Science Student</p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3 bg-[#05050f]/50 p-3 rounded-xl border border-[#00d2ff]/20 text-sm">
              <Mail className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-white/80 truncate">affaan20071120@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 bg-[#05050f]/50 p-3 rounded-xl border border-[#00d2ff]/20 text-sm">
              <Disc className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-white/80">dragongaming11</span>
            </div>
            <div className="flex items-center gap-3 bg-[#05050f]/50 p-3 rounded-xl border border-[#00d2ff]/20 text-sm">
              <Github className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-white/80">Affaan.github.io</span>
            </div>
          </div>

          <div className="mt-auto pt-8 text-[11px] text-white/40 italic">
            "Turning ideas into beautiful products."
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <section className="mb-10">
            <h3 className="text-[#00d2ff] font-bold text-lg mb-4 flex items-center gap-2">
               <span className="text-xl">✨</span> About Me
            </h3>
            <p className="text-white/80 leading-relaxed">
              I'm Mohammed Affaan Delvi — an aspiring Computer Science student who loves coding, problem‑solving and turning ideas into beautiful, working products. I focus on learning fast, building real projects, and improving every day. I love learning more languages and currently I am 18 years old.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-[#00d2ff] font-bold text-lg mb-6 flex items-center gap-2">
               <span className="text-xl">🚀</span> Tech Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill.name} className="bg-[#05050f]/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-[#00d2ff]/50 transition-colors group">
                  <div className="text-2xl group-hover:scale-125 transition-transform">{skill.icon}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{skill.name}</div>
                    <div className="text-white/50 text-[11px] uppercase tracking-tighter">{skill.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[#00d2ff] font-bold text-lg mb-6 flex items-center gap-2">
               <span className="text-xl">⚒️</span> Core Projects
            </h3>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.title} className="bg-gradient-to-r from-[#00d2ff]/10 to-transparent p-5 rounded-2xl border-l-[3px] border-[#00d2ff] group hover:from-[#00d2ff]/20 transition-all cursor-default">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <span>{project.icon}</span> {project.title}
                      </h4>
                      <p className="text-white/60 text-sm mt-1">{project.desc}</p>
                    </div>
                    {project.title === 'Payroll System' && (
                      <span className="bg-[#00d2ff]/20 text-[#00d2ff] text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest border border-[#00d2ff]/30">Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
