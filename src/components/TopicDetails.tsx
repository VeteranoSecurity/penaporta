import { useState } from 'react';
import { ChevronLeft, Copy, Check, Terminal, PlayCircle, Target, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Topic, Vulnerability } from '../data/mockData';

interface TopicDetailsProps {
  topic: Topic;
  onBack: () => void;
  onTest: (vuln: Vulnerability) => void;
}

export function TopicDetails({
  topic,
  onBack,
  onTest
}: TopicDetailsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCheatsheet, setCopiedCheatsheet] = useState(false);

  const handleCopy = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate & Download Markdown Cheatsheet
  const handleExportCheatsheet = () => {
    let md = `# Cheatsheet: ${topic.title}\n\n${topic.description}\n\n`;
    topic.vulnerabilities.forEach((v, index) => {
      md += `## ${index + 1}. ${v.title} (${v.difficulty || 'Geral'})\n`;
      md += `**Cenário:** ${v.scenario}\n\n`;
      md += `\`\`\`bash\n${v.payload}\n\`\`\`\n\n`;
      if (v.mindset_why) {
        md += `> **Mindset:** ${v.mindset_why}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cheatsheet_${topic.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedCheatsheet(true);
    setTimeout(() => setCopiedCheatsheet(false), 3000);
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
      
      {/* Action Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button 
          onClick={onBack}
          className="glass-button glass-button-lime inline-flex items-center text-lime-300 px-5 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 group shadow-lg"
        >
          <ChevronLeft size={16} className="mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
          Voltar para Categorias
        </button>

        {/* Download Cheatsheet Button */}
        <button
          onClick={handleExportCheatsheet}
          className="glass-button inline-flex items-center text-gray-200 hover:text-white px-4 py-2 rounded-full font-medium text-xs transition-all border border-white/15 hover:border-lime-500/40 shadow-md"
          title="Baixar todos os payloads em arquivo Markdown"
        >
          {copiedCheatsheet ? (
            <>
              <Check size={15} className="mr-1.5 text-emerald-400" />
              Cheatsheet Baixado!
            </>
          ) : (
            <>
              <Download size={15} className="mr-1.5 text-lime-400" />
              Exportar Cheatsheet (.md)
            </>
          )}
        </button>
      </div>

      {/* Centered Header Glass Banner */}
      <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-b from-lime-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2.5 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center">
          {topic.title}
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-2xl text-center">{topic.description}</p>
      </div>

      {/* Vulnerabilities List in iOS Glass Cards */}
      <div className="space-y-6">
        {topic.vulnerabilities.map((vuln: Vulnerability) => {
          return (
            <div 
              key={vuln.id} 
              className="glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
            >
              
              {/* Header info */}
              <div className="p-6 md:p-7 border-b border-white/10 bg-white/[0.01]">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center tracking-tight">
                    <span className="p-2 rounded-xl bg-lime-500/15 border border-lime-500/30 text-[var(--color-lime-neon)] mr-3">
                      <Terminal size={20} />
                    </span>
                    {vuln.title}
                  </h3>

                  <div className="flex items-center space-x-3">
                    {getDifficultyBadge(vuln.difficulty)}

                    <button 
                      onClick={() => onTest(vuln)}
                      className="glass-button glass-button-lime flex items-center text-xs font-bold text-emerald-300 px-4 py-2 rounded-full transition-all"
                    >
                      <PlayCircle size={15} className="mr-1.5" />
                      Testar
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  <strong className="text-white font-semibold">Cenário Básico:</strong> {vuln.scenario}
                </p>
                
                {/* Example block with React Markdown */}
                {vuln.example && (
                  <div className="text-sm text-gray-200 bg-black/60 p-4 rounded-2xl border border-white/10 prose prose-invert max-w-none prose-sm leading-relaxed mb-4 backdrop-blur-md">
                    <ReactMarkdown 
                      components={{
                        code({node, className, children, ...props}: any) {
                          return (
                            <code className="text-[var(--color-lime-neon)] bg-black/80 px-2 py-0.5 rounded-lg text-xs font-mono border border-lime-500/30" {...props}>
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

                {/* Educational Sections (Collapsible iOS Accordion) */}
                {(vuln.recon_summary || vuln.mindset_goal) && (
                  <div className="mt-4 flex flex-col gap-3">
                    {/* Recon / Red Flag Section */}
                    {vuln.recon_summary && (
                      <details className="group border border-amber-500/30 bg-amber-950/20 rounded-2xl outline-none [&_summary::-webkit-details-marker]:hidden backdrop-blur-md">
                        <summary className="text-amber-400 font-bold flex items-center justify-between p-4 cursor-pointer select-none rounded-2xl hover:bg-amber-500/10 transition-colors">
                          <div className="flex items-center uppercase tracking-wider text-xs">
                            <span className="relative flex h-2.5 w-2.5 mr-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                            Identificação do Alvo
                          </div>
                          <ChevronLeft size={16} className="transform group-open:-rotate-90 transition-transform text-amber-400" />
                        </summary>
                        <div className="px-5 pb-5 pt-1 border-t border-amber-500/20 mt-1">
                          <p className="text-sm text-gray-300 mb-4 mt-3">{vuln.recon_summary}</p>
                          
                          {vuln.visual_pattern && (
                            <div className="bg-black/80 rounded-xl p-4 font-mono text-sm border border-white/10 overflow-x-auto text-gray-300">
                              {vuln.visual_pattern.split('\n').map((line, i) => (
                                <div key={i}>
                                  {line.split(/(\[!!!.*?!!!\])/).map((part, j) => {
                                    if (part.startsWith('[!!!') && part.endsWith('!!!]')) {
                                      const highlight = part.replace(/\[!!!|!!!\]/g, '');
                                      return <span key={j} className="text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded-md font-bold">{highlight}</span>;
                                    }
                                    return <span key={j}>{part}</span>;
                                  })}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </details>
                    )}

                    {/* Attacker Mindset Section */}
                    {vuln.mindset_goal && (
                      <details className="group border border-emerald-500/30 bg-emerald-950/20 rounded-2xl outline-none [&_summary::-webkit-details-marker]:hidden backdrop-blur-md">
                        <summary className="text-emerald-300 font-bold flex items-center justify-between p-4 cursor-pointer select-none rounded-2xl hover:bg-emerald-900/30 transition-colors">
                          <div className="flex items-center uppercase tracking-wider text-xs">
                            <Target size={15} className="mr-2 text-emerald-400" />
                            <span>Guia do Iniciante (Mindset)</span>
                          </div>
                          <ChevronLeft size={16} className="transform group-open:-rotate-90 transition-transform text-emerald-400" />
                        </summary>
                        <div className="px-5 pb-5 pt-1 border-t border-emerald-500/20 mt-1">
                          <div className="space-y-4 mt-3">
                            <div>
                              <h5 className="text-emerald-300 text-xs font-semibold mb-1 uppercase opacity-90">Nosso Objetivo:</h5>
                              <p className="text-sm text-gray-300">{vuln.mindset_goal}</p>
                            </div>
                            
                            {vuln.mindset_why && (
                              <div>
                                <h5 className="text-emerald-300 text-xs font-semibold mb-1 uppercase opacity-90">Por que testar assim?</h5>
                                <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-emerald-500/40 pl-3">
                                  "{vuln.mindset_why}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>

              {/* Payload Area with Gel Glass Box */}
              <div className="p-6 bg-black/70 relative group backdrop-blur-md">
                <div className="text-xs text-gray-400 mb-2.5 uppercase tracking-wider font-semibold">Payload Rápido</div>
                <pre className="text-[var(--color-lime-neon)] font-mono text-sm overflow-x-auto p-4 bg-black/90 rounded-2xl border border-white/10 shadow-inner">
                  <code>{vuln.payload}</code>
                </pre>
                <button
                  onClick={() => handleCopy(vuln.id, vuln.payload)}
                  className="absolute top-[48px] right-8 p-2.5 glass-button rounded-xl text-gray-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg"
                  title="Copiar Payload"
                >
                  {copiedId === vuln.id ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>

              {/* Markdown Expandable Result */}
              {vuln.result && (
                <details className="group border-t border-white/10 bg-white/[0.01] outline-none">
                  <summary className="text-sm font-semibold text-[var(--color-lime-neon)] cursor-pointer select-none list-none flex items-center p-5 hover:bg-white/5 transition-colors">
                     <ChevronLeft size={16} className="mr-2 transform group-open:-rotate-90 transition-transform" />
                     Ver Resultado / Resposta Esperada
                  </summary>
                  <div className="px-6 pb-6 pt-2 border-t border-white/10">
                    <div className="text-sm text-gray-200 bg-black/80 rounded-2xl p-5 border border-white/10 shadow-inner prose prose-invert max-w-none prose-sm backdrop-blur-md">
                      <ReactMarkdown 
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <div className="mt-2 mb-2">
                                {match && <div className="text-[10px] text-gray-400 uppercase px-3 py-1 bg-white/10 rounded-t-xl inline-block border-t border-l border-r border-white/10 font-mono">{match[1]}</div>}
                                <pre className={`p-4 bg-black/95 rounded-b-2xl rounded-tr-2xl overflow-x-auto border border-white/10 text-gray-200 font-mono block ${!match ? 'rounded-tl-2xl' : ''}`}>
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code className="text-gray-200 bg-white/10 px-2 py-0.5 rounded-md font-mono text-xs border border-white/10" {...props}>
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
          );
        })}
      </div>
    </div>
  );
}
