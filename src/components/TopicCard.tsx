import { Terminal, Database, FileCode } from 'lucide-react';
import type { Topic } from '../data/mockData';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={40} className="text-[var(--color-cyan-neon)]" />,
  Database: <Database size={40} className="text-[var(--color-cyan-neon)]" />,
  FileCode: <FileCode size={40} className="text-[var(--color-lime-neon)]" />
};

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <div 
      onClick={() => onClick(topic)}
      className="bg-[var(--color-hacker-card)] border border-[var(--color-hacker-border)] rounded-lg p-6 cursor-pointer hover:border-[var(--color-cyan-neon)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] group"
    >
      <div className="mb-4">
        {iconMap[topic.icon] || <Terminal size={40} className="text-[var(--color-cyan-neon)]" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-cyan-neon)] transition-colors">
        {topic.title}
      </h3>
      <p className="text-gray-400 text-sm">
        {topic.description}
      </p>
    </div>
  );
}
