import { useState } from 'react';
import { TopicCard } from './components/TopicCard';
import { TopicDetails } from './components/TopicDetails';
import { Sidebar } from './components/Sidebar';
import { PlaygroundPanel } from './components/PlaygroundPanel';
import { mockTopics, type Topic, type Vulnerability } from './data/mockData';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [testingVuln, setTestingVuln] = useState<Vulnerability | null>(null);

  // Genie animation states
  const [animState, setAnimState] = useState<'idle' | 'genie-out' | 'genie-in'>('idle');

  // Trigger Genie minimize / expand transition when topic changes
  const handleSelectTopic = (topic: Topic) => {
    if (selectedTopic?.id === topic.id) return;
    
    setAnimState('genie-out');
    setTimeout(() => {
      setSelectedTopic(topic);
      setTestingVuln(null);
      setAnimState('genie-in');
      setTimeout(() => {
        setAnimState('idle');
      }, 350);
    }, 240);
  };

  const handleBackToGrid = () => {
    setAnimState('genie-out');
    setTimeout(() => {
      setSelectedTopic(null);
      setTestingVuln(null);
      setAnimState('genie-in');
      setTimeout(() => {
        setAnimState('idle');
      }, 350);
    }, 240);
  };

  return (
    <div className="h-screen w-full flex bg-[#050507] text-gray-100 overflow-hidden relative font-sans selection:bg-lime-500/30">
      {/* Liquid Gel ambient glowing orbs */}
      <div className="liquid-orb-1"></div>
      <div className="liquid-orb-2"></div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0"></div>

      {/* 1. Floating Glass Sidebar (iOS Dock style) */}
      <div className="p-4 lg:p-6 z-20 flex">
        <Sidebar 
          selectedTopicId={selectedTopic?.id} 
          onSelectTopic={handleSelectTopic} 
        />
      </div>

      {/* 2. Main Content Area with macOS Genie transition container */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar p-4 lg:p-6 pl-0">
        <div className="max-w-5xl mx-auto h-full flex flex-col">
          
          <div className={`transition-all duration-300 ${
            animState === 'genie-out' ? 'animate-genie-out' : 
            animState === 'genie-in' ? 'animate-genie-in' : ''
          }`}>
            {!selectedTopic ? (
              <div className="py-4">
                {/* Centered iOS-Style Header Banner */}
                <div className="glass-panel rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden text-center flex flex-col items-center justify-center border border-white/10 group">
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-lime-500/20 transition-all duration-700"></div>
                  
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full bg-lime-500/15 text-[var(--color-lime-neon)] border border-lime-500/30 backdrop-blur-md font-mono">
                      Plataforma Hacking & Recon
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    Bases de Conhecimento
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed text-center font-normal">
                    Selecione uma tecnologia na barra lateral ou nos cards abaixo para visualizar roteiros de testes de invasão, payloads práticos e laboratórios guiados de reconhecimento.
                  </p>
                </div>

                {/* Grid of iOS Liquid Gel Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTopics.map(topic => (
                    <TopicCard 
                      key={topic.id} 
                      topic={topic} 
                      onClick={handleSelectTopic} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4">
                <TopicDetails 
                  topic={selectedTopic} 
                  onBack={handleBackToGrid} 
                  onTest={setTestingVuln}
                />
              </div>
            )}
          </div>

        </div>
      </main>

      {/* 3. Interactive Playground (iOS Glass Sheet Drawer) */}
      {testingVuln && (
        <PlaygroundPanel 
          vulnerability={testingVuln}
          onClose={() => setTestingVuln(null)}
        />
      )}
    </div>
  );
}

export default App;
