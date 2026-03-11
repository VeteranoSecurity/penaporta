import { useState } from 'react';
import { ChevronLeft, Copy, Check, Terminal, PlayCircle, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Topic, Vulnerability } from '../data/mockData';

interface TopicDetailsProps {
  topic: Topic;
  onBack: () => void;
  onTest: (vuln: Vulnerability) => void;
}

export function TopicDetails({ topic, onBack, onTest }: TopicDetailsProps) {
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
          <div key={vuln.id} className="bg-[var(--color-hacker-card)] border border-[var(--color-hacker-border)] rounded-lg overflow-hidden flex flex-col shadow-lg">
            
            {/* Header info */}
            <div className="p-5 border-b border-[var(--color-hacker-border)] bg-[#0d0d0d]">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Terminal size={18} className="mr-2 text-[var(--color-cyan-neon)]" />
                  {vuln.title}
                </h3>
                <button 
                  onClick={() => onTest(vuln)}
                  className="flex items-center text-xs font-bold text-[var(--color-lime-neon)] hover:text-white bg-[var(--color-lime-neon)]/10 hover:bg-[var(--color-lime-neon)]/30 border border-[var(--color-lime-neon)]/50 px-3 py-1.5 rounded transition-all"
                >
                  <PlayCircle size={14} className="mr-1.5" />
                  Testar
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4"><strong>Cenário Básico:</strong> {vuln.scenario}</p>
              
              {/* Example block with React Markdown */}
              {vuln.example && (
                <div className="text-sm text-gray-300 bg-black/40 p-4 rounded-md border-l-2 border-[var(--color-cyan-neon)] prose prose-invert max-w-none prose-sm leading-relaxed mb-4">
                  <ReactMarkdown 
                    components={{
                      code({node, className, children, ...props}: any) {
                        return (
                          <code className="text-[var(--color-lime-neon)] bg-black px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {vuln.example}
                  </ReactMarkdown>
                </div>
              )}

              {/* Recon / Red Flag Section */}
              {vuln.recon_summary && (
                <div className="mt-4 border border-dashed border-orange-500/50 bg-[#140b00] rounded-lg p-5">
                  <h4 className="text-orange-500 font-bold flex items-center mb-2 uppercase tracking-wider text-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                    Identificação do Alvo
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">{vuln.recon_summary}</p>
                  
                  {vuln.visual_pattern && (
                    <div className="bg-black/80 rounded p-3 font-mono text-sm border border-[#333] overflow-x-auto text-gray-400">
                      {vuln.visual_pattern.split('\n').map((line, i) => (
                        <div key={i}>
                          {line.split(/(\[!!!.*?!!!\])/).map((part, j) => {
                            if (part.startsWith('[!!!') && part.endsWith('!!!]')) {
                              const highlight = part.replace(/\[!!!|!!!\]/g, '');
                              return <span key={j} className="text-orange-400 bg-orange-500/10 px-1 py-0.5 rounded font-bold">{highlight}</span>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </div>
                      ))}
                      {/* Attacker Mindset Section */}
              {vuln.mindset_goal && (
                <div className="mt-4 border border-[var(--color-hacker-border)] bg-[#0f0a14] rounded-lg p-5">
                  <h4 className="text-purple-400 font-bold flex items-center mb-3 uppercase tracking-wider text-xs">
                    <Target size={14} className="mr-2" />
                    Guia do Atacante (Mindset)
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-purple-300 text-xs font-semibold mb-1 uppercase opacity-80">Nosso Objetivo:</h5>
                      <p className="text-sm text-gray-300">{vuln.mindset_goal}</p>
                    </div>
                    
                    {vuln.mindset_why && (
                      <div>
                        <h5 className="text-purple-300 text-xs font-semibold mb-1 uppercase opacity-80">Por que testar assim?</h5>
                        <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">
                          "{vuln.mindset_why}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
                  )}
                </div>
              )}
            </div>

            {/* Payload Area */}
            <div className="p-5 bg-black relative group">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Payload Rápido</div>
              <pre className="text-[var(--color-lime-neon)] font-mono text-sm overflow-x-auto p-4 bg-[#050505] rounded border border-[#222]">
                <code>{vuln.payload}</code>
              </pre>
              <button
                onClick={() => handleCopy(vuln.id, vuln.payload)}
                className="absolute top-[44px] right-5 p-2 bg-[var(--color-hacker-border)] hover:bg-gray-700 rounded text-gray-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md"
                title="Copiar Payload"
              >
                {copiedId === vuln.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Markdown Expandable Result */}
            {vuln.result && (
              <details className="group border-t border-[var(--color-hacker-border)] bg-gray-900/40 outline-none">
                <summary className="text-sm font-semibold text-[var(--color-cyan-neon)] cursor-pointer select-none list-none flex items-center p-4 hover:bg-white/5 transition-colors focus:outline-none">
                   <ChevronLeft size={16} className="mr-2 transform group-open:-rotate-90 transition-transform" />
                   Ver Resultado / Resposta Esperada
                </summary>
                <div className="px-5 pb-5 pt-2 border-t border-black/20">
                  <div className="text-sm text-gray-300 bg-[#080808] rounded-md p-4 border border-[#222] shadow-inner prose prose-invert max-w-none prose-sm">
                    <ReactMarkdown 
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <div className="mt-2 mb-2">
                              {match && <div className="text-[10px] text-gray-500 uppercase px-2 py-1 bg-[#1a1a1a] rounded-t-md inline-block border-t border-l border-r border-[#333]">{match[1]}</div>}
                              <pre className={`p-3 bg-[#000] rounded-b-md rounded-tr-md overflow-x-auto border border-[#333] text-gray-300 font-mono block ${!match ? 'rounded-tl-md' : ''}`}>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className="text-gray-200 bg-[#1f1f1f] px-1 py-0.5 rounded font-mono text-xs" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {vuln.result}
                    </ReactMarkdown>
                  </div>
                </div>
              </details>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}
