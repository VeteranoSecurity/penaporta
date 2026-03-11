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
    <aside className="w-full md:w-64 flex-shrink-0 bg-[var(--color-hacker-card)] border border-[var(--color-hacker-border)] rounded-lg p-4 h-fit sticky top-28">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-[var(--color-hacker-border)] pb-2 flex items-center">
        <Terminal size={14} className="mr-2 text-[var(--color-lime-neon)]" />
        Categorias
      </h3>
      <nav className="flex flex-col space-y-2">
        {mockTopics.map((topic) => {
          const isSelected = selectedTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`flex items-center w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 group
                ${isSelected 
                  ? 'bg-[var(--color-cyan-neon)]/10 text-[var(--color-cyan-neon)] border-l-2 border-[var(--color-cyan-neon)]' 
                  : 'text-gray-300 hover:bg-[#222] hover:text-white border-l-2 border-transparent'
                }`}
            >
              <span className={`transition-colors ${isSelected ? 'text-[var(--color-cyan-neon)]' : 'text-gray-400 group-hover:text-white'}`}>
                {iconMap[topic.icon]}
              </span>
              <span className="font-medium text-sm truncate">{topic.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
