import { useState } from 'react';
import { Heart, Check, Copy, X } from 'lucide-react';
import pixImage from '../assets/pix-free.png';

const PIX_PAYLOAD_STRING = "00020101021126580014BR.GOV.BCB.PIX0136517d6a27-31aa-43a9-91d9-286ebef6a26d5204000053039865802BR5908Veterano6009SAO PAULO62080504daqr630496A0";

export function PixFloatingCard() {
  const [copiedPix, setCopiedPix] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_PAYLOAD_STRING);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-[255px] z-30 glass-button glass-button-lime p-3.5 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(57,255,20,0.3)] border border-lime-500/50 text-[var(--color-lime-neon)] animate-in zoom-in duration-300"
        title="Apoie o Projeto via PIX"
      >
        <Heart size={20} className="fill-lime-400/40 animate-pulse" />
        <span className="text-xs font-bold font-mono">PIX Apoio</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-[310px] z-30 w-64 glass-panel rounded-3xl p-4 border border-lime-500/40 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-in slide-in-from-bottom-6 duration-400 select-none group">

      {/* Background Liquid Ambient Glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-lime-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-lime-500/30 transition-all duration-500"></div>

      {/* Minimize Button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors z-20"
        title="Minimizar card PIX"
      >
        <X size={15} />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/35 text-[var(--color-lime-neon)] text-[10px] font-mono font-bold uppercase mb-2 shadow-sm">
          <Heart size={12} className="text-lime-400 fill-lime-400/30" />
          Apoie o VantaVidro
        </div>

        <p className="text-[11px] text-gray-200 leading-relaxed mb-2 font-sans font-normal">
          Contribua com qualquer valor para que o projeto dê segmento ao desenvolvimento.
        </p>

        {/* QR Code Glass Frame */}
        <div
          onClick={handleCopyPix}
          className="p-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-inner mb-2.5 group-hover:scale-105 transition-all duration-300 cursor-pointer relative"
          title="Clique para copiar a chave PIX Copia e Cola"
        >
          <img
            src={pixImage}
            alt="QR Code PIX VantaVidro"
            className="w-28 h-28 object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Copy PIX Button */}
        <button
          onClick={handleCopyPix}
          className="w-full glass-button glass-button-lime py-2 px-3 rounded-xl text-[11px] font-bold text-black flex items-center justify-center gap-1.5 transition-all shadow-md"
        >
          {copiedPix ? (
            <>
              <Check size={14} className="text-black" />
              <span>Chave Copiada!</span>
            </>
          ) : (
            <>
              <Copy size={14} className="text-black" />
              <span>Copiar PIX Copia e Cola</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
