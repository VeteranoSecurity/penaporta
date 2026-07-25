import { useState } from 'react';
import { Copy, Check, Terminal, PlayCircle, Target, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Topic, Vulnerability } from '../data/mockData';

interface TopicDetailsProps {
  topic: Topic;
  onBack: () => void;
  onTest: (vuln: Vulnerability) => void;
}

export function TopicDetails({
  topic,
  onTest
}: TopicDetailsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCheatsheet, setCopiedCheatsheet] = useState(false);

  const handleCopy = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Iniciante
          </span>
        );
      case 'Intermediário':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Intermediário
          </span>
        );
      case 'Avançado':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Avançado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      
      {/* Action Navigation Bar (Export Cheatsheet Locked) */}
      <div className="flex items-center justify-end flex-wrap gap-4">
        {/* Locked Download Cheatsheet Button with Red Padlock */}
        <button
          onClick={() => {
            setCopiedCheatsheet(true);
            setTimeout(() => setCopiedCheatsheet(false), 2500);
          }}
          className="glass-button inline-flex items-center text-rose-300 hover:text-rose-200 px-4 py-2 rounded-full font-medium text-xs transition-all border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 shadow-md cursor-pointer"
          title="Recurso Bloqueado com Cadeado Vermelho"
        >
          <Lock size={15} className="mr-1.5 text-rose-500" />
          {copiedCheatsheet ? 'Recurso Bloqueado!' : 'Exportar Cheatsheet (.md)'}
        </button>
      </div>

      {/* Centered Header Glass Banner */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden text-center flex flex-col items-center justify-center border border-white/15 shadow-2xl backdrop-blur-2xl">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-[var(--color-lime-neon)] font-semibold mb-3">
          {topic.vulnerabilities.length} módulos disponíveis
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          {topic.title}
        </h2>
        <p className="text-gray-300 text-sm max-w-2xl leading-relaxed text-center">
          {topic.description}
        </p>
      </div>

      {/* Vulnerabilities List Cards */}
      <div className="space-y-6">
        {topic.vulnerabilities.map((vuln, index) => (
          <div 
            key={vuln.id} 
            className="glass-card rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden group border border-white/15 hover:border-lime-500/40 transition-all duration-300 shadow-xl"
          >
            {/* Header: Title + Difficulty Badge + Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-lime-500/20 text-[var(--color-lime-neon)] font-mono font-bold text-sm flex items-center justify-center border border-lime-500/40">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-extrabold text-white tracking-tight">{vuln.title}</h3>
                    {getDifficultyBadge(vuln.difficulty)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{vuln.scenario}</p>
                </div>
              </div>

              <button
                onClick={() => onTest(vuln)}
                className="glass-button glass-button-lime inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-black transition-all shadow-md self-start sm:self-auto"
              >
                <PlayCircle size={15} className="mr-1.5 text-black" />
                Simular no Playground
              </button>
            </div>

            {/* Mindset & Reconnaissance Guide */}
            {vuln.mindset_why && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-lime-500/10 border border-lime-500/25 p-4 rounded-2xl text-xs text-lime-200 backdrop-blur-md">
                  <span className="font-bold text-lime-400 uppercase font-mono tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Target size={14} /> Guia de Mindset do Hacker:
                  </span>
                  <p className="leading-relaxed text-gray-300">{vuln.mindset_why}</p>
                </div>

                {vuln.visual_pattern && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-xs text-gray-300 backdrop-blur-md">
                    <span className="font-bold text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Terminal size={14} /> Padrão Visual no Recon:
                    </span>
                    <p className="leading-relaxed text-gray-300">{vuln.visual_pattern}</p>
                  </div>
                )}
              </div>
            )}

            {/* Payload Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Payload de Exemplo</span>
                <button
                  onClick={() => handleCopy(vuln.id, vuln.payload)}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
                >
                  {copiedId === vuln.id ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar Payload</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-black/80 border border-white/15 p-4 rounded-2xl font-mono text-xs text-[var(--color-lime-neon)] overflow-x-auto shadow-inner">
                <code>{vuln.payload}</code>
              </div>
            </div>

            {/* Example Markdown Details */}
            {vuln.example && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Detalhamento Técnico</span>
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-xs text-gray-300 prose prose-invert prose-xs max-w-none backdrop-blur-md">
                  <ReactMarkdown>{vuln.example}</ReactMarkdown>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
