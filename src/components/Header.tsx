import { Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-[var(--color-hacker-border)] bg-[var(--color-hacker-bg)]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center justify-center space-y-2 text-center">
        <div className="flex items-center space-x-3 text-[var(--color-cyan-neon)]">
          <Terminal size={32} className="opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight glow-text-cyan">
            Pé na Porta!
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-lg">
          Selecione uma tecnologia e encontre <span className="text-[var(--color-lime-neon)]">payloads rápidos</span> para o seu pentest.
        </p>
      </div>
    </header>
  );
}
