import { useState, useMemo } from 'react';
import { TopicCard } from './components/TopicCard';
import { TopicDetails } from './components/TopicDetails';
import { Sidebar } from './components/Sidebar';
import { PlaygroundPanel } from './components/PlaygroundPanel';
import { HeaderSearch } from './components/HeaderSearch';
import { CategoryCarousel } from './components/CategoryCarousel';
import { mockTopics, type Topic, type Vulnerability } from './data/mockData';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [testingVuln, setTestingVuln] = useState<Vulnerability | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter topics and vulnerabilities based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return mockTopics;
    const query = searchQuery.toLowerCase();

    return mockTopics.filter(t => {
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description.toLowerCase().includes(query);
      const matchVulns = t.vulnerabilities.some(v => 
        v.title.toLowerCase().includes(query) ||
        v.scenario.toLowerCase().includes(query) ||
        v.payload.toLowerCase().includes(query) ||
        (v.recon_summary && v.recon_summary.toLowerCase().includes(query))
      );

      return matchTitle || matchDesc || matchVulns;
    });
  }, [searchQuery]);

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
        <div className="max-w-5xl mx-auto h-full flex flex-col items-center">
          
          {/* Top Bar: Home Button + Translucent Frosted Glass Search Bar */}
          <HeaderSearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onGoHome={handleBackToGrid}
            isHome={!selectedTopic}
          />

          <div className={`w-full transition-all duration-300 ${
            animState === 'genie-out' ? 'animate-genie-out' : 
            animState === 'genie-in' ? 'animate-genie-in' : ''
          }`}>
            {!selectedTopic ? (
              <div className="py-2 w-full flex flex-col items-center">
                {/* Sleek Compact Header Title (Proportional & Non-Intrusive) */}
                <div className="text-center mb-4 flex flex-col items-center">
                  <div className="inline-flex items-center space-x-2 mb-2">
                    <span className="px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest rounded-full bg-lime-500/15 text-[var(--color-lime-neon)] border border-lime-500/30 backdrop-blur-xl font-mono shadow-[0_0_15px_rgba(57,255,20,0.15)]">
                      Plataforma Hacking & Recon
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    Bases de Conhecimento
                  </h2>
                  <p className="text-gray-300 text-xs md:text-sm max-w-xl leading-relaxed text-center font-normal">
                    Selecione uma tecnologia no carrossel ou use a busca rápida para explorar roteiros de invasão e payloads práticos.
                  </p>
                </div>

                {/* Search result indicator */}
                {searchQuery.trim() && (
                  <div className="mb-4 text-sm text-gray-400 font-mono text-center">
                    Encontrado(s) <strong className="text-[var(--color-lime-neon)]">{filteredTopics.length}</strong> módulo(s) para "{searchQuery}"
                  </div>
                )}

                {/* Interactive macOS Liquid Glass 3D Carousel or Search Grid */}
                {!searchQuery.trim() ? (
                  <CategoryCarousel 
                    topics={filteredTopics}
                    onSelectTopic={handleSelectTopic}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {filteredTopics.map(topic => (
                      <TopicCard 
                        key={topic.id} 
                        topic={topic} 
                        onClick={handleSelectTopic}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-2 w-full">
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
