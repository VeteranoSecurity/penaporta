import { Terminal, Database, FileCode, Layers, Code, Globe, UserCheck, Key, FolderSearch } from 'lucide-react';
import type { Topic } from '../data/mockData';
import { mockTopics } from '../data/mockData';
import headerVideo from '../assets/animeted16-9.mp4';

interface SidebarProps {
  selectedTopicId: string | undefined;
  onSelectTopic: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={18} className="transition-transform group-hover:scale-110" />,
  Database: <Database size={18} className="transition-transform group-hover:scale-110" />,
  FileCode: <FileCode size={18} className="transition-transform group-hover:scale-110" />,
  Code: <Code size={18} className="transition-transform group-hover:scale-110" />,
  Globe: <Globe size={18} className="transition-transform group-hover:scale-110" />,
  UserCheck: <UserCheck size={18} className="transition-transform group-hover:scale-110" />,
  Key: <Key size={18} className="transition-transform group-hover:scale-110" />,
  FolderSearch: <FolderSearch size={18} className="transition-transform group-hover:scale-110" />
};

export function Sidebar({ selectedTopicId, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-64 lg:w-[270px] flex-shrink-0 glass-panel rounded-3xl h-full flex flex-col relative z-20 custom-scrollbar border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
      
      {/* Sleek 16:9 Horizontal Video Brand Header */}
      <div className="relative rounded-t-3xl overflow-hidden border-b border-white/15 h-36 flex flex-shrink-0 items-center justify-center p-0 text-center group bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
        >
          <source src={headerVideo} type="video/mp4" />
        </video>
      </div>

      {/* Categories Navigation */}
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Section Header */}
        <div className="px-2 mb-3">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers size={13} className="text-lime-400" />
            Categorias
          </span>
        </div>
        
        <nav className="flex flex-col space-y-2 w-full">
          {mockTopics.map((topic) => {
            const isSelected = selectedTopicId === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`relative flex items-center w-full text-left px-3.5 py-3 rounded-2xl transition-all duration-300 group overflow-hidden
                  ${isSelected 
                    ? 'bg-gradient-to-r from-lime-500/30 via-lime-500/15 to-transparent text-white border border-lime-500/50 shadow-[0_0_20px_rgba(57,255,20,0.2)] backdrop-blur-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                {/* Active Indicator Glow */}
                {isSelected && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--color-lime-neon)] rounded-r-full shadow-[0_0_12px_rgba(57,255,20,0.9)]"></span>
                )}

                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                    isSelected 
                      ? 'bg-lime-500/20 text-[var(--color-lime-neon)] border border-lime-500/40' 
                      : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                  }`}>
                    {iconMap[topic.icon] || <Terminal size={18} />}
                  </span>
                  <span className="font-medium text-sm truncate tracking-tight flex-1">{topic.title}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* iOS Footer */}
      <div className="p-4 border-t border-white/10 text-center text-[11px] text-gray-500 backdrop-blur-md rounded-b-3xl flex-shrink-0">
        <span className="text-gray-300 font-mono">VantaVidro</span> &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
}
