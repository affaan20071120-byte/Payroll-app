import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

interface ChatBotProps {
  onClose: () => void;
  employeesContext: any[];
  geminiApiKey?: string;
}

interface Message {
  role: 'user' | 'model'; // Changed from 'assistant' to 'model' for compatibility with SDK
  content: string;
}

export function ChatBot({ onClose, employeesContext, geminiApiKey }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'model',
    content: "👋 Hi! I'm PayrollBot, your friendly AI assistant. I know the formulas and basic rules. Ask me anything!"
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
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsTyping(true);
    
    let fullText = "";
    try {
      const rawKey = geminiApiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
      const apiKey = (rawKey || '').trim();
      
      if (!apiKey) {
        throw new Error("API Key is missing for GitHub Hosting! Please go to ⚙️ Settings and paste your Gemini API Key to enable the AI.");
      }

      // CORRECT SDK INITIALIZATION (from gemini-api skill)
      const ai = new GoogleGenAI({ apiKey });
      
      const cleanEmployees = employeesContext?.map((e: any) => ({
        name: e.name || 'Emp',
        job: e.job || 'Job',
        net: e.netSalary || 0
      }));

      const systemInstruction = `You are an AI assistant named PayrollBot. Developer: Mohammed Affaan. 
        Context: The user has employees: ${cleanEmployees?.map(e => `${e.name} (${e.job}) - Net: ${e.net}`).join(', ') || 'None'}.
        
        CRITICAL RULES:
        1. GREETINGS: If the user simply says "hi", "hello", or greets you, you MUST introduce yourself specifically. Say something like: "Hello! I am **PayrollBot**, how may I help you today?" 
        2. SEAMLESS TOPIC SWITCHING: For all other questions (especially outside of payroll), DO NOT introduce yourself and DO NOT connect it back to payroll. Just answer the prompt directly and naturally.
        3. STRICT FORMATTING & LENGTH: You MUST perfectly match the requested length and style. 
           - 'Paragraph': Write a long, detailed, multi-sentence paragraph.
           - Specific Word Counts: Obey the exact word count requested.
           - 'Points': Return a vertical list. Put EACH point on a NEW LINE starting with a number ('1., 2.') or a dash ('-'). NEVER jumble points.
           - 'Short': 1-2 brief sentences.
        4. MANDATORY PINK HIGHLIGHTING: You MUST extensively use Markdown bolding (**like this**) for ALL important keywords.
        5. TONE: Always include tasteful emojis.`;

      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || "" }]
      }));

      // CORRECT CHAT PATTERN (from gemini-api skill)
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        history: history,
        config: { systemInstruction }
      });

      // Prepare message content
      const streamResponse = await chat.sendMessageStream({ message: userMsg });
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', content: "" }]);
      
      for await (const chunk of streamResponse) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullText;
            return newMessages;
          });
        }
      }

    } catch (err: any) {
      setIsTyping(false);
      const errorMsg = err.message || "";
      
      // Suppress annoying JSON/Steam errors if we already got the text successfully
      if (errorMsg.includes('JSON') && fullText.length > 0) {
        console.warn("Stream cleanly cut off ignored", err);
        return;
      }
      
      // Cleanly handle 503 Server Overload / High Demand
      if (errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE')) {
        setMessages(prev => [...prev, { role: 'model', content: "⚠️ **Google AI Servers Busy:** The Gemini AI model is currently experiencing a temporary spike in high demand globally. Please wait a few seconds and try again. 🔄" }]);
        return;
      }
      
      // Cleanly handle 429 Quota Exceeded / Rate Limit
      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
        setMessages(prev => [...prev, { role: 'model', content: "⚠️ **Free Tier Limit Reached:** You have exceeded the free tier quota for the Gemini API key you provided. Please check your billing details or wait for your daily quota to reset. 💸" }]);
        return;
      }

      // Hide the ugly JSON wrapper if Google sends it
      let readableError = errorMsg;
      try {
        if (errorMsg.startsWith('{')) {
           const parsed = JSON.parse(errorMsg);
           if (parsed.error && parsed.error.message) {
             readableError = typeof parsed.error.message === 'string' ? parsed.error.message : JSON.stringify(parsed.error.message);
           }
        }
      } catch (e) {
        // Not JSON, ignore
      }

      setMessages(prev => [...prev, { role: 'model', content: `⚠️ **Error:** ${readableError}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex flex-col bg-[#1a1a2e]/95 backdrop-blur-2xl border-2 border-[#fd79a8] rounded-3xl max-w-[700px] w-full h-[80vh] shadow-[0_0_80px_rgba(253,121,168,0.3)]"
      >
        <div className="flex justify-between items-center p-5 border-b border-[#fd79a8]/30 bg-[#fd79a8]/10 rounded-t-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fd79a8] to-[#e056fd] flex items-center justify-center text-xl shadow-[0_0_15px_#fd79a8]">
              🤖
            </div>
            <div>
              <h2 className="text-[#fd79a8] font-bold text-lg tracking-wide drop-shadow-[0_0_8px_rgba(253,121,168,0.8)] leading-none">PayrollBot</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${((geminiApiKey && geminiApiKey.length > 5) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)) ? 'bg-green-400 animate-pulse shadow-[0_0_5px_#4ade80]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></div>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-tighter">
                  {((geminiApiKey && geminiApiKey.length > 5) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)) ? 'AI Online' : 'AI Offline (No Key)'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#ff3366] hover:bg-[#ff4757]/20 transition-colors font-bold shadow-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 text-[15px] font-medium leading-relaxed prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/20 ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-[#0080ff] to-[#0056d6] text-white rounded-2xl rounded-br-sm shadow-[0_0_20px_rgba(0,128,255,0.6)] [text-shadow:0_0_8px_rgba(255,255,255,0.4)]'
                      : 'bg-gradient-to-br from-[#2a1b32] to-[#1a1a2e] text-[#e2e8f0] border border-[#fd79a8]/50 rounded-2xl rounded-bl-sm shadow-[0_0_30px_rgba(253,121,168,0.3)] [text-shadow:0_0_4px_rgba(253,121,168,0.3)]'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div>{m.content}</div>
                  ) : (
                    <div className="markdown-body">
                       <Markdown
                         components={{
                           strong: ({node, ...props}) => <strong className="text-[#fd79a8] drop-shadow-[0_0_8px_rgba(253,121,168,0.6)] font-bold" {...props} />,
                           ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 my-2 space-y-1" {...props} />,
                           ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 my-2 space-y-1" {...props} />,
                           li: ({node, ...props}) => <li className="text-[#e2e8f0] marker:text-[#fd79a8]" {...props} />,
                           p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                         }}
                       >{m.content}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] p-4 bg-white/5 text-[#fd79a8] border border-[#fd79a8]/30 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-[#fd79a8] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[#fd79a8] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[#fd79a8] rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 border-t border-white/10 bg-black/20 rounded-b-3xl">
          <div className="relative flex items-end bg-[#16213e] border-2 border-[#fd79a8] rounded-2xl shadow-[0_0_30px_rgba(253,121,168,0.7)] focus-within:border-white focus-within:shadow-[0_0_50px_rgba(253,121,168,1)] transition-all overflow-hidden p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask PayrollBot..."
              className="flex-1 bg-transparent px-4 py-3 min-h-[48px] max-h-[140px] text-[16px] font-bold text-white placeholder-white/60 focus:outline-none resize-none custom-scrollbar [text-shadow:0_0_8px_#fd79a8,0_0_15px_#0080ff] transition-all"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`m-2 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                !input.trim() || isTyping 
                  ? 'bg-[#1a1a2e] text-[#fd79a8]/50 border border-[#fd79a8]/30 shadow-[0_0_15px_rgba(253,121,168,0.2)]' // Soft glowing even when disabled
                  : 'bg-[#fd79a8] text-[#1a1a2e] shadow-[0_0_25px_#fd79a8,0_0_15px_#0080ff] hover:bg-white hover:shadow-[0_0_40px_#fff,0_0_25px_#fd79a8]' // Hyper glow when ready
              }`}
            >
              <svg className={`drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-all ${!input.trim() || isTyping ? 'opacity-60' : 'opacity-100 scale-110'}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
          <div className="text-center mt-2 text-[10px] text-white/30">
            PayrollBot can make mistakes. Verify important calculations.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
