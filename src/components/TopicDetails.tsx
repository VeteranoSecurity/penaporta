import { useState } from 'react';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import type { Topic, Vulnerability } from '../data/mockData';

interface TopicDetailsProps {
  topic: Topic;
  onBack: () => void;
}

export function TopicDetails({ topic, onBack }: TopicDetailsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-[var(--color-cyan-neon)] mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Voltar para os Tópicos
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">{topic.title}</h2>
        <p className="text-gray-400">{topic.description}</p>
      </div>

      <div className="space-y-6">
        {topic.vulnerabilities.map((vuln: Vulnerability) => (
          <div key={vuln.id} className="bg-[var(--color-hacker-card)] border border-[var(--color-hacker-border)] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[var(--color-hacker-border)] bg-[#0d0d0d]">
              <h3 className="text-xl font-semibold text-white mb-1">{vuln.title}</h3>
              <p className="text-sm text-gray-400">Cenário: {vuln.scenario}</p>
            </div>
            <div className="p-4 bg-black relative group">
              <pre className="text-[var(--color-lime-neon)] font-mono text-sm overflow-x-auto p-2 rounded">
                <code>{vuln.payload}</code>
              </pre>
              <button
                onClick={() => handleCopy(vuln.id, vuln.payload)}
                className="absolute top-4 right-4 p-2 bg-[var(--color-hacker-border)] hover:bg-gray-700 rounded text-gray-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copiar Payload"
              >
                {copiedId === vuln.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
