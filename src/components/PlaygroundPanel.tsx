import { useState, useEffect } from 'react';
import { X, PlayCircle, ShieldAlert, CheckCircle2, Loader2, Globe, Terminal } from 'lucide-react';
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
                    <span className="truncate">{config.url}</span>
                 </div>
              </div>
              <div className="p-4 space-y-4 bg-[#0a0a0a]">
                <p className="text-xs text-gray-400">{config.desc}</p>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-[var(--color-cyan-neon)] font-semibold uppercase">Parâmetro: {config.param}</label>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`${config.placeholder}${vulnerability.payload}`}
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

    if (vulnerability.id === 'sqli-8') {
      return (
        <form onSubmit={handleTest} className="max-w-md mx-auto w-full mt-6 space-y-4">
           <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden flex flex-col">
              <div className="bg-[#1a1a1a] border-b border-[#333] px-3 py-2 flex items-center justify-between">
                 <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">POST Request (JSON Body)</span>
                 <span className="text-xs text-gray-500">api/login</span>
              </div>
              <div className="p-4 bg-[#0a0a0a]">
                <p className="text-xs text-gray-400 mb-3">O WAF não bloqueou o Payload pelo fato de estar trafegando em Formato JSON Raw.</p>
                <div className="bg-black border border-[#333] rounded p-3 font-mono text-sm text-[var(--color-lime-neon)]">
                  <span className="text-gray-500">{"{"}</span>
                  <div className="pl-4">
                    <span className="text-[var(--color-cyan-neon)]">"username"</span><span className="text-gray-500">: "</span>
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={vulnerability.payload}
                      className="bg-transparent border-b border-dashed border-gray-600 focus:border-[var(--color-lime-neon)] outline-none text-[var(--color-lime-neon)] w-24 placeholder-gray-700"
                    />
                    <span className="text-gray-500">",</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[var(--color-cyan-neon)]">"password"</span><span className="text-gray-500">: ""</span>
                  </div>
                  <span className="text-gray-500">{"}"}</span>
                </div>
                {errorMsg && <p className="text-red-500 text-xs opacity-80 mt-3">{errorMsg}</p>}
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue}
                  className="w-full bg-orange-500/10 text-orange-500 border border-orange-500/30 font-bold py-2 px-4 rounded hover:bg-orange-500/20 transition-colors disabled:opacity-50 flex items-center justify-center mt-4"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <PlayCircle size={16} className="mr-2" />}
                  {isLoading ? 'Enviando...' : 'Submeter JSON'}
                </button>
              </div>
           </div>
        </form>
      );
    }

    if (vulnerability.id === 'sqli-9') {
      return (
        <form onSubmit={handleTest} className="max-w-md mx-auto w-full mt-6 space-y-4">
           <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden flex flex-col">
              <div className="bg-[#1a1a1a] border-b border-[#333] px-3 py-2 flex items-center justify-between">
                 <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Painel Secundário - Alterar Perfil</span>
              </div>
              <div className="p-4 bg-[#0a0a0a] space-y-4">
                <p className="text-xs text-gray-400">Você já se cadastrou previamente com o username infectado. Agora, atualize seu e-mail para engatilhar a injeção em background (Second Order).</p>
                
                <div className="space-y-1 opacity-70">
                  <label className="text-xs text-gray-500 uppercase font-semibold">User Logado Atual (Sujo)</label>
                  <input type="text" value={inputValue || "admin'--"} onChange={(e) => setInputValue(e.target.value)} placeholder="admin'--" className="w-full bg-black border border-red-900/50 rounded px-3 py-2 text-red-500 font-mono text-sm focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">Novo E-mail</label>
                  <input type="text" value="attacker@hacker.com" disabled className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-gray-500 cursor-not-allowed font-mono text-sm focus:outline-none" />
                </div>
                
                {errorMsg && <p className="text-red-500 text-xs opacity-80 mt-3">{errorMsg}</p>}
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue}
                  className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold py-2 px-4 rounded hover:bg-blue-500/20 transition-colors disabled:opacity-50 flex items-center justify-center mt-4"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : 'Atualizar Dados (Gatilho)'}
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

  const renderSuccessView = () => {
    if (vulnerability.id === 'cmdi-1' || vulnerability.id === 'cmdi-2') {
      return (
        <div className="flex-1 flex flex-col w-full h-full animate-in fade-in duration-500">
          <div className="bg-[#111] border border-[#333] rounded-lg overflow-hidden flex flex-col w-full shadow-2xl">
            <div className="bg-[#1a1a1a] border-b border-[#333] px-3 py-2 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-gray-500" />
                <span className="text-xs text-gray-400 font-mono">root@server:~</span>
              </div>
            </div>
            <div className="p-4 bg-black font-mono text-sm text-[var(--color-lime-neon)] text-left overflow-y-auto whitespace-pre-wrap flex-1 max-h-[300px]">
              <p className="mb-2 text-gray-400">$ {vulnerability.payload}</p>
              root:x:0:0:root:/root:/bin/bash<br/>
              daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin<br/>
              bin:x:2:2:bin:/bin:/usr/sbin/nologin<br/>
              sys:x:3:3:sys:/dev:/usr/sbin/nologin<br/>
              sync:x:4:65534:sync:/bin:/bin/sync<br/>
              games:x:5:60:games:/usr/games:/usr/sbin/nologin<br/>
              man:x:6:12:man:/var/cache/man:/usr/sbin/nologin<br/>
              www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
            </div>
          </div>
          <button 
            onClick={() => { setIsSuccess(false); setInputValue(''); }}
            className="mt-6 text-sm text-[var(--color-cyan-neon)] hover:underline self-center"
          >
            Testar Novamente
          </button>
        </div>
      );
    }

    if (vulnerability.id === 'cmdi-3') {
      return (
        <div className="flex-1 flex flex-col w-full h-full animate-in fade-in duration-500">
          <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-lg overflow-hidden flex flex-col w-full shadow-2xl">
            <div className="bg-purple-900/20 border-b border-purple-500/30 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-purple-400" />
                <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">OAST Listener</span>
              </div>
            </div>
            <div className="p-4 bg-black font-mono text-sm text-gray-300 text-left overflow-y-auto w-full">
              <div className="mb-4">
                <p className="text-green-400 mb-1 font-bold">✓ DNS/HTTP Ping Recebido!</p>
                <p className="text-xs text-gray-500">200 OK - burpcollaborator.net</p>
              </div>
              <div className="bg-[#111] border border-[#222] p-3 rounded overflow-hidden">
                <span className="text-blue-400 break-all">GET</span> /www-data HTTP/1.1<br/>
                Host: burpcollaborator.net<br/>
                User-Agent: curl/7.81.0<br/>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                A execução do comando <span className="text-purple-400 whitespace-nowrap">`whoami`</span> forçou o servidor alvo a realizar uma requisição para a nossa URL com o próprio username da máquina (<span className="text-red-400">www-data</span>) de forma silenciosa.
              </p>
            </div>
          </div>
          <button 
            onClick={() => { setIsSuccess(false); setInputValue(''); }}
            className="mt-6 text-sm text-[var(--color-cyan-neon)] hover:underline self-center"
          >
            Testar Novamente
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col w-full h-full justify-center items-center text-center animate-in zoom-in-95 duration-500 space-y-4">
        
        {vulnerability.id === 'sqli-4' && (
          <div className="bg-red-950/20 border border-red-900 p-4 rounded-lg w-full text-left font-mono">
             <h2 className="text-red-500 font-bold mb-2">Uncaught DatabaseException:</h2>
             <p className="text-red-400 text-xs break-all">
                SQLSTATE[HY000]: General error: 1105 XPATH syntax error: <br/>
                <span className="text-white font-bold bg-red-900 px-1">'~10.4.22-MariaDB'</span>
             </p>
             <p className="text-gray-500 text-xs mt-4">✓ Você forçou um erro que vazou a versão do servidor.</p>
          </div>
        )}

        {vulnerability.id === 'sqli-5' && (
           <div className="bg-green-900/20 p-4 rounded-lg w-full">
             <h2 className="text-3xl font-bold text-green-400 mb-2">Página Carregada!</h2>
             <p className="text-gray-400 text-sm">A expressão injetada resultou em <span className="text-green-500 font-bold">TRUE</span>. A aplicação não deu erro e retornou o conteúdo normalmente, provando que a primeira letra do DB é 'r'.</p>
           </div>
        )}

        {vulnerability.id === 'sqli-6' && (
           <div className="bg-[#111] border border-[#333] p-4 rounded-lg w-full text-left">
             <h2 className="text-green-500 font-bold text-sm mb-3">Retorno Refletido (Data Leak)</h2>
             <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 border-b border-[#222] pb-2 mb-2 font-bold uppercase tracking-wider">
               <span>P_ID</span><span>P_NAME</span><span>P_DESC</span>
             </div>
             <div className="grid grid-cols-3 gap-2 text-sm text-[var(--color-cyan-neon)] font-mono">
               <span>1</span><span className="text-[var(--color-lime-neon)] font-bold">users_table</span><span>3</span>
             </div>
             <p className="text-gray-500 text-xs mt-4">✓ A injeção UNION mesclou a sua query com a original.</p>
           </div>
        )}

        {vulnerability.id === 'sqli-7' && (
           <div className="bg-[#111] border border-[#333] p-4 rounded-lg w-full text-left">
             <h2 className="text-[var(--color-lime-neon)] font-bold text-sm mb-3">Tabela Ordenada Condicionalmente</h2>
             <div className="text-xs text-gray-400 space-y-2">
               <div className="bg-white/5 p-2 rounded">1. ⚡ admin (ID: 1)</div>
               <div className="bg-white/5 p-2 rounded">2. 👤 john (ID: 5)</div>
               <div className="bg-white/5 p-2 rounded">3. 👤 maria (ID: 9)</div>
             </div>
             <p className="text-gray-500 text-[10px] mt-4">Como a clausula (1=1) foi TRUE, a listagem do aplicativo foi ordenada pelo NOME e não pelas ID's ou Preços normais.</p>
           </div>
        )}

        {vulnerability.id === 'sqli-8' && (
           <div className="bg-[#050505] border border-[var(--color-hacker-border)] p-4 rounded-lg w-full text-left font-mono">
             <p className="text-green-400 mb-2">200 OK</p>
             <pre className="text-[var(--color-lime-neon)] text-xs">
{`{
  "status": "success",
  "message": "Auth ByPassed via JSON injection",
  "token": "eyJhbGciOiJIUzI...w"
}`}
             </pre>
           </div>
        )}

        {vulnerability.id === 'sqli-9' && (
           <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-lg w-full text-left text-blue-400">
             <CheckCircle2 size={32} className="mb-2 text-blue-500" />
             <h2 className="font-bold mb-2">Bomb Logic Executed</h2>
             <p className="text-sm">O sistema foi atualizar os dados do seu usuário: <code className="bg-black px-1 rounded">WHERE user='admin'--'</code>.</p>
             <p className="text-xs text-gray-400 mt-2">A query engoliu a restrição de ID do WHERE via comentário, e atualizou a Senha de TODA a tabela, ou apenas do primeiro Admin!</p>
           </div>
        )}

        {vulnerability.id === 'sqli-10' && (
           <div className="bg-orange-900/10 border border-orange-500/30 p-4 rounded-lg w-full text-left text-orange-400">
             <h2 className="font-bold mb-2 text-orange-500">WAF Bypassed!</h2>
             <p className="text-sm">O firewall visualizou apenas `%55nIoN/**/%53eLeCt` em sua request, não deu match na expressão regular <code>/UNION SELECT/</code> e liberou pra dentro da rede!</p>
             <p className="text-xs text-[var(--color-lime-neon)] mt-3">{"[ Dados Extraídos com Sucesso ]"}</p>
           </div>
        )}

        {/* Fallbacks Formatos Antigos */}
        {(vulnerability.id === 'sqli-1' || vulnerability.id === 'sqli-3') && (
           <>
             <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={48} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
             </div>
             <h2 className="text-2xl font-bold text-green-400">Login Feito com Sucesso!</h2>
             <p className="text-gray-400 text-sm max-w-[250px]">O ambiente vulnerável aceitou seu payload no banco de dados e o acesso como admin foi liberado.</p>
           </>
        )}

        {vulnerability.id === 'sqli-2' && (
           <>
             <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={48} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
             </div>
             <h2 className="text-2xl font-bold text-green-400">Delay Detectado!</h2>
             <p className="text-gray-400 text-sm max-w-[250px]">A requisição demorou os 5 segundos estipulados no SLEEP(). Logo, o banco de dados está vulnerável a Time-Based Blind.</p>
           </>
        )}

        <button 
          onClick={() => { setIsSuccess(false); setInputValue(''); }}
          className="mt-6 text-sm text-[var(--color-cyan-neon)] hover:underline"
        >
          Testar Novamente
        </button>
      </div>
    );
  };

  return (
    <aside className="fixed top-0 right-0 bottom-0 w-full lg:w-[440px] flex-shrink-0 glass-panel border-l border-white/10 h-full overflow-y-auto z-40 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-8 duration-300 custom-scrollbar backdrop-blur-2xl">
      
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
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold text-[var(--color-lime-neon)] tracking-wider bg-lime-500/15 border border-lime-500/30 px-3 py-1 rounded-full inline-block mb-3 font-mono">
             Simulação Ativa
          </span>
          <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">{vulnerability.title}</h4>
          
          {/* Simulation Hint */}
          {vulnerability.hint_simulation && (
             <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl text-sm text-gray-200 mt-3 mb-4 backdrop-blur-md">
               <strong className="text-orange-400 flex items-center text-xs uppercase mb-1.5 tracking-wider font-semibold">
                 <ShieldAlert size={14} className="mr-1.5 text-orange-400" /> Dica de Reconhecimento
               </strong>
               {vulnerability.hint_simulation}
             </div>
          )}
        </div>

        {isSuccess ? renderSuccessView() : renderScenario()}
      </div>

    </aside>
  );
}
