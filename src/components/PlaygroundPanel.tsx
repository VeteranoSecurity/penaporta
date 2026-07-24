import { useState, useEffect } from 'react';
import { X, PlayCircle, ShieldAlert, CheckCircle2, Loader2, Globe, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Vulnerability } from '../data/mockData';

interface PlaygroundPanelProps {
  vulnerability: Vulnerability | null;
  onClose: () => void;
}

export function PlaygroundPanel({ vulnerability, onClose }: PlaygroundPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when vulnerability changes
  useEffect(() => {
    setInputValue('');
    setIsSuccess(false);
    setIsLoading(false);
    setErrorMsg('');
  }, [vulnerability]);

  if (!vulnerability) return null;

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    let delay = 800;
    
    // Simulate SQLi #2 (Time-Blind) delay
    if (vulnerability.id === 'sqli-2' && inputValue.includes('SLEEP')) {
      delay = 4000;
    }

    setTimeout(() => {
      setIsLoading(false);
      
      const userClean = inputValue.trim().toLowerCase();
      const expectedClean = vulnerability.payload.trim().toLowerCase();
      
      // Flexible matching for success:
      // Accepts exact match, trimmed match, contains match, or non-empty attempt
      if (
        userClean === expectedClean ||
        userClean.includes(expectedClean) ||
        expectedClean.includes(userClean) ||
        userClean.length > 3
      ) {
        setIsSuccess(true);
      } else {
        if (vulnerability.hint_simulation) {
          setErrorMsg(`Dica: Verifique se o seu payload reflete o exemplo recomendado: ${vulnerability.payload}`);
        } else {
          setErrorMsg('Payload inválido. Tente novamente ou use o botão de cópia do payload.');
        }
      }
    }, delay);
  };

  const renderScenario = () => {
    if (vulnerability.id === 'sqli-1' || vulnerability.id === 'sqli-3') {
      return (
        <form onSubmit={handleTest} className="space-y-4 max-w-sm mx-auto w-full mt-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-white mb-1 tracking-tight">Painel Administrativo</h4>
            <p className="text-xs text-gray-400">Restrito a funcionários autorizados</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase font-semibold">Usuário</label>
            <input 
              type="text" 
              value="admin" 
              disabled 
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-400 cursor-not-allowed font-mono text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--color-lime-neon)] uppercase font-semibold flex items-center gap-1">
              <ShieldAlert size={13} /> Senha (Ponto de injeção)
            </label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ex: ${vulnerability.payload}`}
              className="w-full bg-black/80 border border-lime-500/40 rounded-xl px-3.5 py-2.5 text-[var(--color-lime-neon)] font-mono text-sm focus:border-[var(--color-lime-neon)] focus:outline-none focus:ring-1 focus:ring-[var(--color-lime-neon)] transition-all placeholder-gray-600"
            />
          </div>

          {errorMsg && <p className="text-rose-400 text-xs text-center font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isLoading || !inputValue}
            className="w-full glass-button glass-button-lime font-bold py-3 px-4 rounded-xl text-black transition-all disabled:opacity-50 flex items-center justify-center mt-6 shadow-lg text-sm"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin text-black" /> : 'Entrar no Sistema'}
          </button>
        </form>
      );
    }

    const urlScenarios: Record<string, { url: string, param: string, placeholder: string, desc: string }> = {
      'sqli-2': { url: 'https://loja-fake.com/api/items?category=', param: 'category', placeholder: 'shoes', desc: 'Teste o atraso do banco de dados injetando comandos SLEEP no parâmetro da URL.' },
      'sqli-4': { url: 'https://loja-fake.com/product?id=', param: 'id', placeholder: '5', desc: 'Injete funções que quebram o XML do MySQL para forçar um erro na tela.' },
      'sqli-5': { url: 'https://loja-fake.com/search?q=', param: 'q', placeholder: '5', desc: 'Teste condições Booleanas invisíveis (AND 1=1 vs AND 1=2).' },
      'sqli-6': { url: 'https://loja-fake.com/profile?id=', param: 'id', placeholder: '-1', desc: 'Use UNION SELECT para equilibrar colunas e vazar tabelas do information_schema.' },
      'sqli-7': { url: 'https://loja-fake.com/users?sort=', param: 'sort', placeholder: 'ASC', desc: 'Injete um CASE WHEN na ordenação para bypassar a restrição de SELECTs diretos.' },
      'sqli-10': { url: 'https://loja-fake.com/api/data?q=', param: 'q', placeholder: '', desc: 'Bypass o WAF enviando URL Encoding e /**/ no lugar dos espaços limpos bloqueados.' }
    };

    if (urlScenarios[vulnerability.id]) {
      const config = urlScenarios[vulnerability.id];
      return (
        <form onSubmit={handleTest} className="max-w-md mx-auto w-full mt-4 space-y-4">
           <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              <div className="bg-black/50 border-b border-white/10 px-4 py-3 flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>
                 <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 font-mono flex items-center overflow-hidden">
                    <Globe size={13} className="mr-2 text-lime-400 flex-shrink-0" />
                    <span className="truncate">{config.url}</span>
                 </div>
              </div>
              <div className="p-5 space-y-4 bg-black/40">
                <p className="text-xs text-gray-300 leading-relaxed">{config.desc}</p>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-[var(--color-lime-neon)] font-semibold uppercase font-mono">Parâmetro: {config.param}</label>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`${config.placeholder}${vulnerability.payload}`}
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-[var(--color-lime-neon)] font-mono text-sm focus:border-[var(--color-lime-neon)] focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>
                {errorMsg && <p className="text-rose-400 text-xs font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{errorMsg}</p>}
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue}
                  className="w-full glass-button glass-button-lime font-bold py-3 px-4 rounded-xl text-black transition-all disabled:opacity-50 flex items-center justify-center mt-2 text-sm shadow-lg"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin mr-2 text-black" /> : <PlayCircle size={16} className="mr-2" />}
                  {isLoading ? 'Aguardando Resposta...' : 'Enviar Requisição'}
                </button>
              </div>
           </div>
        </form>
      );
    }

    // Generic Interactive Playground for ALL vulnerabilities
    return (
       <form onSubmit={handleTest} className="space-y-4 max-w-md mx-auto w-full mt-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl">
          <p className="text-sm text-gray-300 text-center mb-2">Submeta o payload para acionar o ambiente simulado.</p>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase font-semibold font-mono">Input do Payload</label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={vulnerability.payload}
              className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-[var(--color-lime-neon)] font-mono text-sm focus:border-[var(--color-lime-neon)] focus:outline-none transition-all placeholder-gray-600"
            />
          </div>

          {errorMsg && <p className="text-rose-400 text-xs font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isLoading || !inputValue}
            className="w-full glass-button glass-button-lime font-bold py-3 px-4 rounded-xl text-black transition-all disabled:opacity-50 flex items-center justify-center mt-4 text-sm shadow-lg"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin mr-2 text-black" /> : <PlayCircle size={18} className="mr-2" />}
            {isLoading ? 'Executando...' : 'Executar Payload'}
          </button>
       </form>
    );
  };

  // Universal Glass Success Screen for ALL 80 Vulnerabilities
  const renderSuccessView = () => {
    return (
      <div className="flex-1 flex flex-col w-full h-full items-center justify-between animate-in zoom-in-95 duration-500 space-y-5 py-2">
        
        {/* Animated Glowing Success Badge & Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-lime-500/20 border border-lime-500/40 flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(57,255,20,0.35)] animate-bounce">
            <CheckCircle2 size={44} className="text-[var(--color-lime-neon)]" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-[var(--color-lime-neon)] text-xs font-mono font-bold tracking-wider uppercase mb-2 flex items-center gap-1.5 shadow-sm">
            <Sparkles size={13} />
            Exploração Bem-Sucedida!
          </span>

          <h3 className="text-2xl font-extrabold text-white mb-1 tracking-tight text-center">
            {vulnerability.title}
          </h3>
          <p className="text-gray-300 text-xs md:text-sm text-center max-w-sm leading-relaxed">
            O payload foi aceito pelo ambiente simulado e a vulnerabilidade foi explorada com êxito!
          </p>
        </div>

        {/* Executed Payload Display */}
        <div className="w-full bg-black/80 border border-white/10 p-4 rounded-2xl text-left font-mono text-xs backdrop-blur-md shadow-inner space-y-1.5">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider font-mono">Payload Executado:</span>
          <div className="text-[var(--color-lime-neon)] font-mono break-all bg-black/90 p-2.5 rounded-xl border border-lime-500/30">
            {inputValue || vulnerability.payload}
          </div>
        </div>

        {/* Expected Server Result Display */}
        {vulnerability.result && (
          <div className="w-full glass-panel border border-lime-500/30 p-4 rounded-2xl text-left text-xs backdrop-blur-md shadow-lg space-y-2">
            <span className="text-lime-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 font-mono">
              <Globe size={12} /> Resposta do Servidor Alvo:
            </span>
            <div className="text-gray-200 max-h-[140px] overflow-y-auto custom-scrollbar prose prose-invert prose-xs">
              <ReactMarkdown>{vulnerability.result}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Test Again Button */}
        <button 
          onClick={() => { setIsSuccess(false); setInputValue(''); }}
          className="glass-button glass-button-lime px-6 py-3 rounded-full text-xs font-bold text-black transition-all shadow-xl hover:scale-105"
        >
          Testar Novamente
        </button>

      </div>
    );
  };

  return (
    <aside className="fixed top-0 right-0 bottom-0 w-full lg:w-[460px] flex-shrink-0 glass-panel border-l border-white/15 h-full overflow-y-auto z-40 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.85)] animate-in slide-in-from-right-8 duration-300 custom-scrollbar backdrop-blur-2xl">
      
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <h3 className="font-bold text-white flex items-center text-lg tracking-tight">
          <span className="p-1.5 rounded-lg bg-lime-500/20 text-[var(--color-lime-neon)] mr-2.5 border border-lime-500/30">
            <PlayCircle size={18} />
          </span>
          Playground Interativo
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold text-[var(--color-lime-neon)] tracking-wider bg-lime-500/15 border border-lime-500/30 px-3 py-1 rounded-full inline-block mb-3 font-mono">
               Simulação Ativa
            </span>
            <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">{vulnerability.title}</h4>
            
            {/* Simulation Hint */}
            {vulnerability.hint_simulation && !isSuccess && (
               <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 mt-3 backdrop-blur-md leading-relaxed">
                 <strong className="text-amber-400 flex items-center text-xs uppercase mb-1.5 tracking-wider font-semibold font-mono">
                   <ShieldAlert size={14} className="mr-1.5 text-amber-400" /> Dica de Reconhecimento
                 </strong>
                 {vulnerability.hint_simulation}
               </div>
            )}
          </div>
        </div>

        {isSuccess ? renderSuccessView() : renderScenario()}
      </div>

    </aside>
  );
}
