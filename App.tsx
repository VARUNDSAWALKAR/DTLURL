import React, { useState, useRef, useEffect } from 'react';
import { Message, DashboardStats } from './types';
import { getCareerGuidanceStream } from './geminiService';
import ChatMessage from './components/ChatMessage';

const QUICK_ACTIONS = [
  { label: "Analyze Resume", icon: "description", prompt: "Can you help me analyze my resume for a senior role?" },
  { label: "Skill Gap Analysis", icon: "psychology", prompt: "Perform a skill gap analysis for a transition into Cloud Architecture." },
  { label: "Roadmap Generator", icon: "route", prompt: "Generate a 4-week roadmap for mastering Distributed Systems." }
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm **Bruhaspathi**. I've analyzed your career profile. Based on current market trends, I've outlined a strategic roadmap for your growth. How can I assist your transition today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('coach');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [stats] = useState<DashboardStats>({
    readiness: 78,
    marketValue: "$125k",
    activeRoadmap: "Cloud Arch",
    skillsProgress: 78
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMsg]);

    try {
      let fullText = '';
      const stream = getCareerGuidanceStream([...messages, userMsg]);
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full max-w-[430px] mx-auto flex-col overflow-hidden shadow-2xl border-x border-white/5 bg-background-dark text-white">
      {/* Top Bar */}
      <header className="glass-header sticky top-0 z-50 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-[16px] font-bold leading-tight">Bruhaspathi</h1>
            <p className="text-primary text-[10px] font-bold uppercase tracking-wider">NLP Based Career Guidance System</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50">
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Navigation Tabs */}
        <div className="sticky top-0 bg-background-dark/95 backdrop-blur-md z-40 border-b border-white/5 shrink-0">
          <div className="flex px-4 gap-8">
            {['coach', 'roadmap', 'analytics'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] pt-4 pb-[11px] px-1 transition-all capitalize text-[14px] font-bold tracking-wide ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic View */}
        <div className="flex-1 p-4 pb-40 space-y-6">
          {activeTab === 'coach' ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 animate-slideIn">
                <div className="flex flex-col gap-1 rounded-2xl p-4 border border-white/5 bg-surface-dark/40 shadow-sm transition-transform active:scale-95">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Readiness</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white text-2xl font-bold">{stats.readiness}%</p>
                    <p className="text-green-500 text-[10px] font-bold">+5%</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl p-4 border border-white/5 bg-surface-dark/40 shadow-sm transition-transform active:scale-95">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Market Value</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white text-2xl font-bold">{stats.marketValue}</p>
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Component */}
              <div className="flex flex-col gap-3 rounded-2xl p-4 border border-white/5 bg-surface-dark/40 shadow-sm animate-slideIn [animation-delay:0.1s]">
                <div className="flex justify-between items-center">
                  <p className="text-white text-[13px] font-semibold tracking-tight">Skill: {stats.activeRoadmap}</p>
                  <p className="text-primary text-[10px] font-bold">12/15 Credits</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${stats.skillsProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="pt-2 animate-slideIn [animation-delay:0.2s]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    Guidance Session
                  </h3>
                  <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">ACTIVE</span>
                </div>
                
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  
                  {isLoading && messages[messages.length - 1].content === '' && (
                    <div className="flex gap-3 max-w-[90%] items-end">
                      <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-lg animate-pulse">psychology</span>
                      </div>
                      <div className="bg-surface-dark/60 p-3 px-4 rounded-2xl rounded-bl-none flex items-center gap-1.5 border border-white/5 shadow-sm">
                        <div className="size-1.5 rounded-full bg-primary/60 animate-bounce"></div>
                        <div className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 animate-slideIn">
              <span className="material-symbols-outlined text-6xl opacity-20">construction</span>
              <p className="text-sm font-medium">Coming soon in the next update</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="absolute bottom-0 left-0 w-full bg-background-dark/95 backdrop-blur-xl border-t border-white/5 pt-3 pb-6 px-4 z-50">
        {/* Quick Actions Scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar items-center">
          {QUICK_ACTIONS.map((action, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(action.prompt)}
              className="whitespace-nowrap bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-4 py-2 rounded-full text-[11px] font-bold text-white transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm text-primary">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-surface-dark/80 border border-white/10 rounded-2xl p-1.5 pl-4 shadow-2xl focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Bruhaspathi about your career..." 
            className="flex-1 bg-transparent border-none text-[14px] text-white focus:ring-0 placeholder:text-white/20 py-2" 
          />
          <div className="flex items-center gap-1">
             <button className="p-2 text-white/30 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading 
                  ? 'bg-primary text-background-dark shadow-lg shadow-primary/30 scale-100' 
                  : 'bg-white/5 text-white/20 scale-95 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined font-bold">arrow_upward</span>
            </button>
          </div>
        </div>

        {/* Bottom Tab Bar Icons */}
        <div className="flex justify-around items-center mt-4">
          <button onClick={() => setActiveTab('coach')} className={`flex flex-col items-center gap-1 ${activeTab === 'coach' ? 'text-primary' : 'text-slate-500'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'coach' ? 'fill-1' : ''}`}>chat_bubble</span>
            <span className="text-[10px] font-bold">Coach</span>
          </button>
          <button onClick={() => setActiveTab('roadmap')} className={`flex flex-col items-center gap-1 ${activeTab === 'roadmap' ? 'text-primary' : 'text-slate-500'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'roadmap' ? 'fill-1' : ''}`}>map</span>
            <span className="text-[10px] font-bold">Plan</span>
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-primary' : 'text-slate-500'}`}>
            <span className={`material-symbols-outlined ${activeTab === 'analytics' ? 'fill-1' : ''}`}>auto_graph</span>
            <span className="text-[10px] font-bold">Growth</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;