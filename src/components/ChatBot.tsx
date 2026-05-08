import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { HARDCODED_GEMINI_KEY } from '../config';

interface ChatBotProps {
  onClose: () => void;
  employeesContext: any[];
  geminiApiKey?: string;
  persistentMessages: Message[];
  setPersistentMessages: (msgs: Message[]) => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function ChatBot({ onClose, employeesContext, geminiApiKey, persistentMessages, setPersistentMessages }: ChatBotProps) {
  // DISPLAY messages (what the user sees - resets every time chat is opened)
  const [displayMessages, setDisplayMessages] = useState<Message[]>([{
    role: 'model',
    content: "👋 Hi! I'm PayrollBot, your friendly AI assistant. Ask me anything!"
  }]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [displayMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    const newUserMsg: Message = { role: 'user', content: userMsg };
    setInput('');
    setDisplayMessages(prev => [...prev, newUserMsg]);
    
    setIsTyping(true);
    
    let fullText = "";
    try {
      const rawKey = geminiApiKey || HARDCODED_GEMINI_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
      const apiKey = (rawKey || '').trim();
      
      if (!apiKey) {
        setDisplayMessages(prev => [...prev, { role: 'model', content: "❌ **API Key Missing!** Please go to Settings (⚙️) and paste your Gemini API Key." }]);
        setIsTyping(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const cleanEmployees = employeesContext?.map((e: any) => ({
        name: e.name || 'Emp',
        job: e.job || 'Job',
        net: e.netSalary || 0
      }));

      const systemInstruction = `You are a super-intelligent, max-level genius AI assistant named PayrollBot. 
        Current Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
        Date Awareness: You are fully aware of all dates in the 21st century and beyond. Use the current date provided above for all time-relative calculations.
        Context: The user has employees: ${cleanEmployees?.map(e => `${e.name} (${e.job}) - Net: ${e.net}`).join(', ') || 'None'}.
        
        HIDDEN MEMORY MODE: The user has asked that older messages from this session stay "hidden" from the UI but remain in your memory. 
        If they ask about something they said earlier in this session, answer using your memory history.

        CRITICAL RULES:
        1. COMPREHENSIVE KNOWLEDGE & ACCURACY: You MUST answer ALL questions correctly. Whether the question is about payroll, general knowledge, math, science, programming, or anything else, you must provide a highly accurate, deep, and brilliant answer. You are a max-level genius.
        2. GREETINGS: Warmly respond with an attractive, professional greeting. Example: "Hello! 👋 I am **PayrollBot**. How can I assist you today?"
        3. DEVELOPER: Developed by **Mohammed Affaan**.
        4. APP AWARENESS: You are an expert on this Payroll App.
        5. FORMULAS: Monthly = Daily * 26. Daily = Monthly / 26. Annual = Monthly * 12.
        6. SEAMLESS TOPIC SWITCHING: Answer any question brilliantly.
        7. MANDATORY HIGHLIGHTING: You MUST extensively use Markdown bolding (**like this**) for ALL important keywords.
        8. TONE: Always use a polite, helpful, attractive tone, and include tasteful emojis.`;

      // HIDDEN MEMORY LOGIC:
      // We combine persistent background history + current session visible messages
      const fullKnowledge = [...persistentMessages, ...displayMessages.slice(1)];
      const recentHistory = fullKnowledge.slice(-40);
      
      const history = recentHistory.filter(msg => msg.role !== 'model' || !msg.content.includes("Hi! I'm PayrollBot")).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || "" }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        history: history,
        config: { systemInstruction }
      });

      let streamResponse;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          streamResponse = await chat.sendMessageStream({ message: userMsg });
          break;
        } catch (err: any) {
          const isBusy = err.message.includes('503') || err.message.includes('high demand') || err.message.includes('UNAVAILABLE');
          if (isBusy && retries < maxRetries - 1) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
            continue;
          }
          throw err;
        }
      }
      
      setIsTyping(false);
      setDisplayMessages(prev => [...prev, { role: 'model', content: "" }]);
      
      if (!streamResponse) throw new Error("Failed to get response.");

      for await (const chunk of streamResponse) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setDisplayMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullText;
            return newMessages;
          });
        }
      }

      // Sync to shared memory in background
      setPersistentMessages([...persistentMessages, newUserMsg, { role: 'model', content: fullText }]);

    } catch (err: any) {
      setIsTyping(false);
      const errorMsg = err.message || "";
      if (errorMsg.includes('JSON') && fullText.length > 0) return;
      
      let readableError = errorMsg;
      try {
        if (errorMsg.startsWith('{')) {
           const parsed = JSON.parse(errorMsg);
           if (parsed.error && parsed.error.message) {
             readableError = parsed.error.message;
           }
        }
      } catch (e) {}

      setDisplayMessages(prev => [...prev, { role: 'model', content: `⚠️ **Error:** ${readableError}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex flex-col bg-[#1a1a2e]/95 backdrop-blur-2xl border-2 border-[#fd79a8] rounded-3xl max-w-[700px] w-full h-[80vh] shadow-[0_0_120px_rgba(253,121,168,0.6),inset_0_0_30px_rgba(253,121,168,0.3)] animate-pulse-glow"
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-[#fd79a8] bg-[#fd79a8]/10 rounded-t-3xl shadow-[0_5px_20px_rgba(253,121,168,0.3)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd79a8] to-[#e056fd] flex items-center justify-center text-xl shadow-[0_0_20px_#fd79a8,inset_0_0_5px_white]">
              🤖
            </div>
            <div>
              <h2 className="text-[#fd79a8] font-black text-3xl tracking-tighter neon-text-pink leading-none mb-1">PayrollBot</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                <span className="text-[11px] text-green-400 font-black uppercase tracking-[0.15em] neon-text-green">AI Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (confirm("Clear ALL background memory and current chat?")) {
                  setDisplayMessages([{
                    role: 'model',
                    content: "👋 Brain wiped! I've forgotten everything from this session."
                  }]);
                  setPersistentMessages([]);
                }
              }}
              className="text-[10px] bg-white/20 hover:bg-[#fd79a8]/40 text-white font-black px-3 py-1.5 rounded-lg border-2 border-white/30 uppercase tracking-tighter shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_#fd79a8] transition-all"
            >
              Wipe Memory
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-[#ff3366] hover:bg-[#ff4757]/20 transition-all font-black shadow-[0_0_15px_rgba(255,51,102,0.5)] hover:shadow-[0_0_25px_#ff3366] active:scale-90 text-lg border-2 border-[#ff3366]/40">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {displayMessages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 text-[15px] font-black leading-relaxed prose prose-invert ${m.role === 'user' ? 'bg-[#0080ff] rounded-2xl rounded-br-sm shadow-[0_0_35px_rgba(0,128,255,0.6)] text-white neon-text-blue border-[1.5px] border-white/20' : 'bg-[#1a1a2e]/80 backdrop-blur-xl border-2 border-[#fd79a8] rounded-2xl rounded-bl-sm shadow-[0_0_40px_rgba(253,121,168,0.5)] text-white neon-text-pink'}`}>
                  {m.role === 'user' ? <div>{m.content}</div> : <div className="markdown-body"><Markdown components={{ strong: ({node, ...props}) => <strong className="text-[#fd79a8] drop-shadow-[0_0_12px_#fd79a8] font-black underline underline-offset-4 decoration-[#fd79a8]/50 text-lg" {...props} /> }}>{m.content}</Markdown></div>}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-4 bg-white/5 text-[#fd79a8] border border-[#fd79a8]/30 rounded-2xl rounded-bl-sm flex gap-1 shadow-[0_0_15px_rgba(253,121,168,0.2)]">
                   <div className="w-2 h-2 bg-[#fd79a8] rounded-full animate-bounce shadow-[0_0_8px_#fd79a8]" />
                   <div className="w-2 h-2 bg-[#fd79a8] rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_8px_#fd79a8]" />
                   <div className="w-2 h-2 bg-[#fd79a8] rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_8px_#fd79a8]" />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t-2 border-[#fd79a8]/40 bg-black/30 rounded-b-3xl">
          <div className="relative flex items-end bg-[#16213e]/90 backdrop-blur-xl border-2 border-[#fd79a8] rounded-2xl p-1 overflow-hidden shadow-[0_0_40px_rgba(253,121,168,0.6)] focus-within:shadow-[0_0_70px_rgba(253,121,168,0.9)] focus-within:border-white transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Message PayrollBot..."
              className="flex-1 bg-transparent px-4 py-3 min-h-[50px] max-h-[140px] text-white text-[16px] focus:outline-none resize-none placeholder:text-white/30 font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              rows={1}
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping} className="m-1.5 w-11 h-11 bg-[#fd79a8] text-[#1a1a2e] rounded-xl flex items-center justify-center shadow-[0_0_25px_#fd79a8] hover:shadow-[0_0_45px_#fd79a8] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
