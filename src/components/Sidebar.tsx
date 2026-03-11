import { Terminal, Database, FileCode } from 'lucide-react';
import type { Topic } from '../data/mockData';
import { mockTopics } from '../data/mockData';

interface SidebarProps {
  selectedTopicId: string | undefined;
  onSelectTopic: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={20} className="mr-3" />,
  Database: <Database size={20} className="mr-3" />,
  FileCode: <FileCode size={20} className="mr-3" />
};

export function Sidebar({ selectedTopicId, onSelectTopic }: SidebarProps) {
  return (
    <aside className="w-64 lg:w-[280px] flex-shrink-0 bg-[#0a0a0a] border-r border-[#222] h-full overflow-y-auto relative z-20 flex flex-col custom-scrollbar">
      
      {/* Integrated Header */}
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center space-x-3 text-[var(--color-cyan-neon)] mb-2">
          <Terminal size={26} className="opacity-90" />
          <h1 className="text-2xl font-bold tracking-tight glow-text-cyan">
            Pé na Porta!
          </h1>
        </div>
        <p className="text-gray-400 text-xs">
          Selecione uma tecnologia e encontre <span className="text-[var(--color-lime-neon)]">payloads rápidos</span>.
        </p>
      </div>

      <div className="p-4 flex-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-1">
          Categorias
        </h3>
        <nav className="flex flex-col space-y-1">
          {mockTopics.map((topic) => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`flex items-center w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-[var(--color-cyan-neon)]/10 text-[var(--color-cyan-neon)] border-l-2 border-[var(--color-cyan-neon)]' 
                    : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white border-l-2 border-transparent'
                  }`}
              >
                <span className={`transition-colors mr-3 ${isSelected ? 'text-[var(--color-cyan-neon)]' : 'text-gray-500 group-hover:text-white'}`}>
                  {iconMap[topic.icon]}
                </span>
                <span className="font-medium text-sm truncate">{topic.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-[#222] text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} - Plataforma Educacional
      </div>
    </aside>
  );
}
