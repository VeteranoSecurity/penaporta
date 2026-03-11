import { useState } from 'react';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { TopicDetails } from './components/TopicDetails';
import { mockTopics, type Topic } from './data/mockData';

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
        {!selectedTopic ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-white border-l-4 border-[var(--color-lime-neon)] pl-3">
                Categorias de Vulnerabilidades
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTopics.map(topic => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onClick={setSelectedTopic} 
                />
              ))}
            </div>
          </div>
        ) : (
          <TopicDetails 
            topic={selectedTopic} 
            onBack={() => setSelectedTopic(null)} 
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
