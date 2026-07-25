import { useState, useRef, useEffect } from 'react';
import { Volume2, Play } from 'lucide-react';
import introVideo from '../assets/intro.mp4';

interface IntroOverlayProps {
  onComplete: () => void;
}

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [isFading, setIsFading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  const handleStartAudioVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().then(() => {
        setHasStarted(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
        setHasStarted(true);
      });
    } else {
      setHasStarted(true);
    }
  };

  // Attempt autoplay if browser already granted audio permission
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().then(() => {
        setHasStarted(true);
      }).catch(() => {
        // Browser requires click gesture for unmuted audio
        setHasStarted(false);
      });
    }
  }, []);

  return (
    <div 
      onClick={!hasStarted ? handleStartAudioVideo : undefined}
      className={`fixed inset-0 z-50 bg-[#050507] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Intro Video */}
      <video
        ref={videoRef}
        src={introVideo}
        muted={false}
        playsInline
        onEnded={handleFinish}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Futuristic Specular Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none"></div>

      {/* Start Audio Button (Unmutes Audio 100% Reliably for Browser Autoplay Policy) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <button
            onClick={handleStartAudioVideo}
            className="glass-button glass-button-lime px-8 py-4 rounded-full text-sm md:text-base font-extrabold font-mono tracking-wider uppercase text-black flex items-center gap-3 shadow-[0_0_40px_rgba(57,255,20,0.5)] transition-all hover:scale-105 cursor-pointer"
          >
            <Volume2 size={22} className="text-black" />
            <span>Iniciar VantaVidro com Som</span>
            <Play size={18} className="fill-black" />
          </button>
          <span className="text-xs text-gray-400 font-mono mt-3">
            Clique em qualquer lugar para reproduzir com áudio ativo
          </span>
        </div>
      )}

      {/* Bottom Loading Progress Tag */}
      {hasStarted && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[var(--color-lime-neon)] animate-ping"></span>
            <span className="text-[11px] font-mono text-gray-300 font-semibold uppercase tracking-widest">
              Inicializando VantaVidro...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
