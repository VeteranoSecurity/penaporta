import { useState } from 'react';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { TopicDetails } from './components/TopicDetails';
import { Sidebar } from './components/Sidebar';
import { PlaygroundPanel } from './components/PlaygroundPanel';
import { mockTopics, type Topic, type Vulnerability } from './data/mockData';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [testingVuln, setTestingVuln] = useState<Vulnerability | null>(null);

  // Close playground when topic changes
  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setTestingVuln(null);
  };

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          selectedTopicId={selectedTopic?.id} 
          onSelectTopic={handleSelectTopic} 
        />

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {!selectedTopic ? (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl font-semibold text-white border-l-4 border-[var(--color-lime-neon)] pl-3">
                  Tecnologias Populares
                </h2>
                <p className="text-gray-400 mt-2 text-sm">Selecione uma categoria na barra lateral ou nos cards abaixo.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <TopicDetails 
              topic={selectedTopic} 
              onBack={() => { setSelectedTopic(null); setTestingVuln(null); }} 
              onTest={setTestingVuln}
            />
          )}
        </div>

        {/* Interactive Playground (Right Sidebar) */}
        {testingVuln && (
          <PlaygroundPanel 
            vulnerability={testingVuln}
            onClose={() => setTestingVuln(null)}
          />
        )}
      </main>
      
      <footer className="w-full border-t border-[var(--color-hacker-border)] py-6 text-center text-gray-500 text-sm mt-auto relative z-10">
        <p>Pé na Porta! &copy; {new Date().getFullYear()} - Plataforma Educacional de Cybersecurity</p>
      </footer>
    </div>
  );
}

export default App;
