import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Terminal, Database, FileCode, Code, Globe, UserCheck, Key, FolderSearch, ArrowRight, Layers } from 'lucide-react';
import type { Topic } from '../data/mockData';

interface CategoryCarouselProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal size={48} className="text-[var(--color-lime-neon)]" />,
  Database: <Database size={48} className="text-[var(--color-lime-neon)]" />,
  FileCode: <FileCode size={48} className="text-[var(--color-lime-neon)]" />,
  Code: <Code size={48} className="text-[var(--color-lime-neon)]" />,
  Globe: <Globe size={48} className="text-[var(--color-lime-neon)]" />,
  UserCheck: <UserCheck size={48} className="text-[var(--color-lime-neon)]" />,
  Key: <Key size={48} className="text-[var(--color-lime-neon)]" />,
  FolderSearch: <FolderSearch size={48} className="text-[var(--color-lime-neon)]" />
};

export function CategoryCarousel({ topics, onSelectTopic }: CategoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Keyboard navigation Left / Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex(prev => (prev === 0 ? topics.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex(prev => (prev === topics.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topics.length]);

  if (!topics.length) return null;

  const handleNext = () => {
    setActiveIndex(prev => (prev === topics.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? topics.length - 1 : prev - 1));
  };

  return (
    <div className="w-full flex flex-col items-center relative py-4">
      
      {/* Header Pill Tag */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full bg-lime-500/15 text-[var(--color-lime-neon)] border border-lime-500/30 backdrop-blur-xl font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.15)]">
          <Layers size={13} />
          macOS Liquid Glass Cover Flow
        </span>
      </div>

      {/* Prominent 3D Glass Carousel Stage (Hero Cards) */}
      <div className="relative w-full max-w-5xl h-[460px] flex items-center justify-center perspective-1000 overflow-hidden px-4">
        
        {/* Navigation Buttons (Left & Right Glass Circles) */}
        <button
          onClick={handlePrev}
          className="absolute left-2 lg:left-6 z-30 p-3.5 rounded-full glass-button text-gray-200 hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)] group border border-white/20 hover:border-lime-500/50"
          title="Anterior (Seta Esquerda)"
        >
          <ChevronLeft size={24} className="transform group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 lg:right-6 z-30 p-3.5 rounded-full glass-button text-gray-200 hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)] group border border-white/20 hover:border-lime-500/50"
          title="Próximo (Seta Direita)"
        >
          <ChevronRight size={24} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Carousel Items Render */}
        <div className="relative w-full h-full flex items-center justify-center preserve-3d">
          {topics.map((topic, index) => {
            let offset = index - activeIndex;

            // Handle wrap-around math for carousel offset
            if (offset < -Math.floor(topics.length / 2)) {
              offset += topics.length;
            } else if (offset > Math.floor(topics.length / 2)) {
              offset -= topics.length;
            }

            const isActive = offset === 0;

            // Compute 3D Cover Flow Transform Properties
            const translateX = offset * 310;
            const rotateY = offset * -22;
            const scale = isActive ? 1.08 : Math.max(0.72, 1 - Math.abs(offset) * 0.18);
            const zIndex = 20 - Math.abs(offset) * 5;
            const opacity = Math.abs(offset) > 2 ? 0 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);

            return (
              <div
                key={topic.id}
                onClick={() => {
                  if (isActive) {
                    onSelectTopic(topic);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                style={{
                  transform: `translate3d(${translateX}px, 0, ${isActive ? 80 : -Math.abs(offset) * 110}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className={`absolute w-[340px] md:w-[410px] h-[390px] glass-panel rounded-3xl p-8 flex flex-col justify-between items-center text-center cursor-pointer select-none border transition-all duration-500 ${
                  isActive 
                    ? 'border-lime-500/60 shadow-[0_25px_70px_rgba(57,255,20,0.3)] bg-gradient-to-b from-white/15 via-white/5 to-lime-500/15 backdrop-blur-2xl' 
                    : 'border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-white/40 backdrop-blur-xl'
                }`}
              >
                {/* Specular Liquid Ambient Glow */}
                {isActive && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-56 bg-lime-500/25 rounded-full blur-3xl pointer-events-none"></div>
                )}

                <div className="flex flex-col items-center w-full relative z-10">
                  <div className={`p-4 rounded-3xl mb-5 glass-panel border transition-all duration-300 ${
                    isActive 
                      ? 'bg-lime-500/20 border-lime-500/50 shadow-[0_0_30px_rgba(57,255,20,0.35)]' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    {iconMap[topic.icon] || <Terminal size={48} className="text-[var(--color-lime-neon)]" />}
                  </div>

                  <span className="text-xs font-mono px-4 py-1 rounded-full bg-white/10 border border-white/20 text-lime-300 font-semibold mb-3">
                    {topic.vulnerabilities.length} módulos
                  </span>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2.5 tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {topic.title}
                  </h3>
                  
                  <p className="text-gray-200 text-xs md:text-sm leading-relaxed text-center line-clamp-3">
                    {topic.description}
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-white/15 flex items-center justify-center space-x-2 text-sm font-bold text-lime-400 group relative z-10">
                  <span>Explorar Base</span>
                  <div className="p-1.5 rounded-full bg-lime-500/20 border border-lime-500/40 text-[var(--color-lime-neon)]">
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* macOS Glass Pagination Pills */}
      <div className="flex items-center space-x-2.5 mt-2 glass-panel px-4 py-2 rounded-full border border-white/15 backdrop-blur-xl shadow-lg">
        {topics.map((topic, idx) => (
          <button
            key={topic.id}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex 
                ? 'w-7 h-2.5 bg-[var(--color-lime-neon)] shadow-[0_0_12px_rgba(57,255,20,0.8)]' 
                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
            }`}
            title={topic.title}
          />
        ))}
      </div>

    </div>
  );
}
