import { Terminal, Database, FileCode, ArrowRight } from 'lucide-react';
import type { Topic } from '../data/mockData';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={32} className="text-[var(--color-lime-neon)]" />,
  Database: <Database size={32} className="text-[var(--color-lime-neon)]" />,
  FileCode: <FileCode size={32} className="text-[var(--color-lime-neon)]" />
};

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <div 
      onClick={() => onClick(topic)}
      className="glass-card rounded-3xl p-7 cursor-pointer relative overflow-hidden group flex flex-col justify-between items-center text-center h-full border border-white/10"
    >
      {/* Specular Liquid Ambient Glow Effect on Hover */}
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-lime-500/25 transition-all duration-500"></div>

      <div className="flex flex-col items-center w-full">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 glass-panel shadow-[0_4px_20px_rgba(0,0,0,0.4)] group-hover:border-lime-500/40 group-hover:bg-lime-500/10 transition-all duration-300 mb-5">
          {iconMap[topic.icon] || <Terminal size={32} className="text-[var(--color-lime-neon)]" />}
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:text-lime-300 group-hover:border-lime-500/30 transition-all mb-3">
          {topic.vulnerabilities.length} módulos
        </span>

        <h3 className="text-2xl font-bold text-white mb-2.5 group-hover:text-[var(--color-lime-neon)] transition-colors tracking-tight text-center">
          {topic.title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-6 text-center">
          {topic.description}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2 w-full pt-4 border-t border-white/10 text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
        <span className="group-hover:text-[var(--color-lime-neon)] transition-colors">Explorar roteiros</span>
        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-lime-500/20 group-hover:text-[var(--color-lime-neon)] transition-all">
          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
