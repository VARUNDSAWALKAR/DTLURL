import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mt-4 mb-2 text-primary">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-5 mb-3 text-white">{line.replace('## ', '')}</h2>;
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-slate-300 mb-2">{line.trim().substring(2)}</li>;
      }
      
      const bolded = line.split('**').map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="text-primary font-bold">{part}</strong> : part
      );

      return <p key={i} className="mb-2 leading-relaxed text-slate-200">{bolded}</p>;
    });
  };

  return (
    <div className={`flex w-full animate-slideIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 border ${
          isUser 
            ? 'bg-slate-700 border-white/10' 
            : 'bg-primary/20 border-primary/30'
        }`}>
          <span className={`material-symbols-outlined text-lg ${isUser ? 'text-white' : 'text-primary'}`}>
            {isUser ? 'person' : 'psychology'}
          </span>
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-4 py-3 rounded-2xl shadow-xl text-[14px] transition-all ${
            isUser 
              ? 'bg-primary text-background-dark rounded-tr-none font-medium' 
              : 'bg-surface-dark border border-white/5 rounded-tl-none shadow-primary/5'
          }`}>
            <div className="whitespace-pre-wrap">
              {formatContent(message.content)}
            </div>
          </div>
          <span className="text-[9px] mt-1.5 text-slate-500 font-bold uppercase tracking-widest opacity-60">
            {isUser ? 'Sent' : 'Bruhaspathi'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;