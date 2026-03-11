import { useState } from 'react';
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
    <div className="h-screen w-full flex bg-[#050505] text-white overflow-hidden relative font-sans">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* 1. Left Sidebar (Fixed) */}
      <Sidebar 
        selectedTopicId={selectedTopic?.id} 
        onSelectTopic={handleSelectTopic} 
      />

      {/* 2. Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="p-8 md:p-12 max-w-5xl">
          {!selectedTopic ? (
            <div className="animate-in fade-in duration-500">
              <div className="mb-10 text-left">
                <h2 className="text-3xl font-bold text-white border-l-4 border-[var(--color-lime-neon)] pl-4">
                  Bases de Conhecimento
                </h2>
                <p className="text-gray-400 mt-3 text-sm max-w-2xl">
                  Selecione uma tecnologia na barra lateral ou nos cards abaixo para visualizar roteiros de testes de invasão, payloads práticos e laboratórios guiados de reconhecimento.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </main>

      {/* 3. Interactive Playground (Right Drawer) */}
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
