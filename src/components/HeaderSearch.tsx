import { useEffect, useRef } from 'react';
import { Search, X, Home } from 'lucide-react';

interface HeaderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGoHome: () => void;
  isHome: boolean;
}

export function HeaderSearch({
  searchQuery,
  onSearchChange,
  onGoHome,
  isHome
}: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey Ctrl+K / Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 z-20 flex items-center gap-3">
      
      {/* Real Glass Home Button Next to Search Input */}
      <button
        onClick={onGoHome}
        className={`glass-button flex items-center justify-center p-3.5 rounded-2xl transition-all duration-300 shadow-xl group border ${
          isHome 
            ? 'glass-button-lime text-[var(--color-lime-neon)] border-lime-500/50 shadow-[0_0_20px_rgba(57,255,20,0.25)]' 
            : 'text-gray-300 hover:text-white border-white/20 hover:border-lime-500/40'
        }`}
        title="Página Inicial (Início)"
      >
        <Home size={22} className="transform group-hover:scale-110 transition-transform" />
      </button>

      {/* Hero macOS Translucent Frosted Glass Search Bar */}
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-lime-neon)] transition-colors duration-300">
          <Search size={20} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por vulnerabilidade, payload ou palavra-chave... (Ctrl + K)"
          className="w-full pl-12 md:pl-14 pr-14 md:pr-16 py-3.5 md:py-4 glass-input rounded-2xl text-sm md:text-base text-white placeholder-gray-400 focus:outline-none font-sans shadow-2xl"
        />

        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 md:pr-5 flex items-center text-gray-400 hover:text-white transition-colors"
            title="Limpar busca"
          >
            <X size={18} className="p-1 rounded-full bg-white/10 hover:bg-white/20" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-4 md:pr-5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono text-gray-300 bg-white/10 border border-white/20 rounded-lg shadow-sm">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

    </div>
  );
}
