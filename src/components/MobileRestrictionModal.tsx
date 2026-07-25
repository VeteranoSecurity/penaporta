import { useState, useEffect } from 'react';
import { Monitor, Smartphone, ShieldAlert, MonitorCheck } from 'lucide-react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobileWidth = window.innerWidth < 1024;
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileWidth || mobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function MobileRestrictionModal() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050507]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center overflow-hidden animate-in fade-in duration-500">
      
      {/* Specular Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Liquid Glass Modal */}
      <div className="relative z-10 max-w-md w-full glass-panel rounded-3xl p-8 border border-lime-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col items-center">
        
        {/* Device Icon Badge */}
        <div className="relative mb-6">
          <div className="p-5 rounded-3xl glass-panel border border-lime-500/50 bg-lime-500/15 shadow-[0_0_30px_rgba(57,255,20,0.25)] flex items-center justify-center">
            <Monitor size={48} className="text-[var(--color-lime-neon)]" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-md text-red-400">
            <Smartphone size={20} />
          </div>
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/35 text-red-400 text-xs font-mono font-bold uppercase mb-4 shadow-sm">
          <ShieldAlert size={14} />
          Acesso Restrito no Celular
        </div>

        {/* Main Title */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Dispositivo Não Suportado
        </h2>

        {/* Detailed Explanation */}
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 font-normal">
          O <strong className="text-white font-semibold">VantaVidro • Security Suite</strong> é uma plataforma avançada de simulação de vulnerabilidades desenvolvida exclusivamente para <strong className="text-[var(--color-lime-neon)]">computadores e notebooks</strong>.
        </p>

        {/* Feature Specs Grid */}
        <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2.5 font-mono text-gray-300">
          <div className="flex items-center gap-2">
            <MonitorCheck size={16} className="text-lime-400 flex-shrink-0" />
            <span>Resolução Mínima: <strong>1280px (Desktop)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 flex-shrink-0"></span>
            <span>Navegação 3D Cover Flow & Teclado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 flex-shrink-0"></span>
            <span>Playground Interativo com Simulação</span>
          </div>
        </div>

      </div>
    </div>
  );
}
