import { Terminal, Database, FileCode, Shield, Layers } from 'lucide-react';
import type { Topic } from '../data/mockData';
import { mockTopics } from '../data/mockData';

interface SidebarProps {
  selectedTopicId: string | undefined;
  onSelectTopic: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={18} className="transition-transform group-hover:scale-110" />,
  Database: <Database size={18} className="transition-transform group-hover:scale-110" />,
  FileCode: <FileCode size={18} className="transition-transform group-hover:scale-110" />
};

export function Sidebar({ selectedTopicId, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-64 lg:w-[270px] flex-shrink-0 glass-panel rounded-3xl h-full flex flex-col relative z-20 custom-scrollbar border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      
      {/* iOS Floating Brand Header (Centered iOS Style) */}
      <div className="p-6 border-b border-white/10 text-center flex flex-col items-center">
        <div className="p-3 rounded-2xl bg-lime-500/10 border border-lime-500/30 glass-panel mb-3 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
          <Shield size={24} className="text-[var(--color-lime-neon)]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white glow-text-lime">
          Pé na Porta!
        </h1>
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400/80 mt-1">
          v1.0 • Security Suite
        </span>
      </div>

      {/* Categories Navigation with iOS Pill Selection */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers size={13} className="text-lime-400" />
            Categorias
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
            {mockTopics.length}
          </span>
        </div>
        
        <nav className="flex flex-col space-y-2">
          {mockTopics.map((topic) => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`relative flex items-center justify-between w-full text-left px-3.5 py-3 rounded-2xl transition-all duration-300 group
                  ${isSelected 
                    ? 'bg-gradient-to-r from-lime-500/20 via-lime-500/10 to-transparent text-white border border-lime-500/40 shadow-[0_0_20px_rgba(57,255,20,0.15)] backdrop-blur-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                {/* Active Indicator Glow */}
                {isSelected && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--color-lime-neon)] rounded-r-full shadow-[0_0_12px_rgba(57,255,20,0.9)]"></span>
                )}

                <div className="flex items-center min-w-0 space-x-3">
                  <span className={`p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-lime-500/20 text-[var(--color-lime-neon)] border border-lime-500/40' 
                      : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    {iconMap[topic.icon]}
                  </span>
                  <span className="font-medium text-sm truncate tracking-tight">{topic.title}</span>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all ${
                  isSelected 
                    ? 'bg-lime-500/30 text-lime-200 border border-lime-500/50' 
                    : 'bg-black/40 text-gray-500 group-hover:text-gray-300'
                }`}>
                  {topic.vulnerabilities.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* iOS Floating Footer */}
      <div className="p-4 border-t border-white/10 text-center text-[11px] text-gray-500 backdrop-blur-md rounded-b-3xl">
        <span className="text-gray-300 font-mono">Pé na Porta</span> &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
}
