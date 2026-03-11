import { useState, useEffect } from 'react';
import { X, PlayCircle, ShieldAlert, CheckCircle2, Loader2, Globe } from 'lucide-react';
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
        delay = 5000;
    }

    setTimeout(() => {
      setIsLoading(false);
      
      // Strict exact match for success
      if (inputValue === vulnerability.payload) {
        setIsSuccess(true);
      } else {
        // If wrong, check if we should display the recon hint
        if (vulnerability.hint_simulation) {
           setErrorMsg(`Quase lá, mas verifique se você está injetando no parâmetro correto destacado na dica: ${vulnerability.hint_simulation}`);
        } else {
           setErrorMsg('Falha na autenticação ou payload inválido. Tente novamente.');
        }
      }
    }, delay);
  };

  const renderScenario = () => {
    if (vulnerability.id === 'sqli-1' || vulnerability.id === 'sqli-3') {
      return (
        <form onSubmit={handleTest} className="space-y-4 max-w-sm mx-auto w-full mt-6 bg-[#0a0a0a] p-6 rounded-lg border border-[var(--color-hacker-border)] shadow-2xl">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-white mb-1">Painel Administrativo</h4>
            <p className="text-xs text-gray-400">Restrito a funcionários</p>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase font-semibold">Usuário</label>
            <input 
              type="text" 
              value="admin" 
              disabled 
              className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-gray-500 cursor-not-allowed font-mono text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-red-500 uppercase font-semibold flex items-center">
              Senha (Ponto de injeção) <ShieldAlert size={12} className="ml-1" />
            </label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ex: ${vulnerability.payload}`}
              className="w-full bg-[#050505] border border-red-900/50 rounded px-3 py-2 text-[var(--color-lime-neon)] font-mono text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-700"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isLoading || !inputValue}
            className="w-full bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center mt-6"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      );
    }

    if (vulnerability.id === 'sqli-2') {
      return (
        <form onSubmit={handleTest} className="max-w-md mx-auto w-full mt-6 space-y-4">
           <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden flex flex-col">
              <div className="bg-[#1a1a1a] border-b border-[#333] px-3 py-2 flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>
                 <div className="flex-1 bg-black/50 border border-[#333] rounded px-2 py-1 text-xs text-gray-400 font-mono flex items-center overflow-hidden">
                    <Globe size={12} className="mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate">https://loja-fake.com/api/items?category=</span>
                 </div>
              </div>
              <div className="p-4 space-y-4 bg-[#0a0a0a]">
                <p className="text-xs text-gray-400">Teste o atraso do banco de dados injetando comandos SLEEP no parâmetro da URL.</p>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-[var(--color-cyan-neon)] font-semibold uppercase">Parâmetro: category</label>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`shoes${vulnerability.payload}`}
                    className="w-full bg-black border border-[#333] rounded px-3 py-2 text-[var(--color-lime-neon)] font-mono text-sm focus:border-[var(--color-cyan-neon)] focus:outline-none transition-all placeholder-gray-700"
                  />
                </div>
                {errorMsg && <p className="text-red-500 text-xs opacity-80">{errorMsg}</p>}
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue}
                  className="w-full bg-[var(--color-cyan-neon)]/10 text-[var(--color-cyan-neon)] border border-[var(--color-cyan-neon)]/30 font-bold py-2 px-4 rounded hover:bg-[var(--color-cyan-neon)]/20 transition-colors disabled:opacity-50 flex items-center justify-center mt-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <PlayCircle size={16} className="mr-2" />}
                  {isLoading ? 'Aguardando Servidor...' : 'Enviar Requisição'}
                </button>
              </div>
           </div>
        </form>
      );
    }

    // Generic Playground for others
    return (
       <form onSubmit={handleTest} className="space-y-4 max-w-sm mx-auto w-full mt-6 bg-[#0a0a0a] p-6 rounded-lg border border-[var(--color-hacker-border)]">
          <p className="text-sm text-gray-400 text-center mb-4">Envie o payload para o ambiente simulado.</p>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={vulnerability.payload}
            className="w-full bg-black border border-[#333] rounded px-3 py-2 text-[var(--color-lime-neon)] font-mono text-sm focus:border-gray-500 focus:outline-none transition-all"
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue}
            className="w-full bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Executar Payload
          </button>
       </form>
    );
  };

  return (
    <aside className="w-full lg:w-96 flex-shrink-0 bg-[#050505] border-l md:border-l-0 lg:border-l lg:border-t-0 border-[#222] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 z-20 flex flex-col overflow-y-auto animate-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className="p-4 border-b border-[#222] flex items-center justify-between bg-black sticky top-0 z-10">
        <h3 className="font-bold text-white flex items-center">
          <PlayCircle size={18} className="mr-2 text-[var(--color-cyan-neon)]" />
          Playground
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold text-[var(--color-cyan-neon)] tracking-wider bg-[var(--color-cyan-neon)]/10 px-2 py-1 rounded inline-block mb-2 flex-auto w-max">
             Simulação Ativa
          </span>
          <h4 className="text-xl font-bold text-white mb-2">{vulnerability.title}</h4>
          
          {/* Simulation Hint */}
          {vulnerability.hint_simulation && (
             <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded text-sm text-gray-300 mt-2 mb-4">
               <strong className="text-orange-500 flex items-center text-xs uppercase mb-1">
                 <ShieldAlert size={14} className="mr-1" /> Dica de Reconhecimento
               </strong>
               {vulnerability.hint_simulation}
             </div>
          )}
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 space-y-4">
             <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={48} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
             </div>
             
             {vulnerability.id === 'sqli-2' ? (
               <>
                 <h2 className="text-2xl font-bold text-green-400">Delay Detectado!</h2>
                 <p className="text-gray-400 text-sm max-w-[250px]">A requisição demorou os 5 segundos estipulados no SLEEP(). Logo, o banco de dados está vulnerável a Time-Based Blind.</p>
               </>
             ) : vulnerability.id === 'sqli-1' || vulnerability.id === 'sqli-3' ? (
               <>
                 <h2 className="text-2xl font-bold text-green-400">Login Feito com Sucesso!</h2>
                 <p className="text-gray-400 text-sm max-w-[250px]">O ambiente vulnerável aceitou seu payload no banco de dados e o acesso como admin foi liberado.</p>
               </>
             ) : (
               <>
                 <h2 className="text-2xl font-bold text-green-400">Payload Executado!</h2>
                 <p className="text-gray-400 text-sm max-w-[250px]">O ambiente executou a injeção com sucesso no processo alvo.</p>
               </>
             )}

             <button 
               onClick={() => { setIsSuccess(false); setInputValue(''); }}
               className="mt-6 text-sm text-[var(--color-cyan-neon)] hover:underline"
             >
               Testar Novamente
             </button>
          </div>
        ) : (
          renderScenario()
        )}
      </div>

    </aside>
  );
}
