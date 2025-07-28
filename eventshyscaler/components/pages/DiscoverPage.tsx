import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { generateEventIdeas } from '../../services/api';
import EventCard from '../EventCard';
import Spinner from '../common/Spinner';
import toast from 'react-hot-toast';

const DiscoverPage: React.FC = () => {
  const { events, currentUser, addEvent, loading: contextLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const filteredEvents = useMemo(() => {
  if (!Array.isArray(events)) return [];

  return events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [events, searchTerm]);


  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setError('');
    try {
      const { data: ideas } = await generateEventIdeas(aiPrompt);
      if (ideas.length === 0) {
        setError("AI couldn't generate ideas. Try a different prompt.");
      }
      
      const creationPromises = ideas.map((idea: any) => addEvent({
            title: idea.title || 'Untitled AI Event',
            description: idea.description || 'No description provided.',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '18:00',
            location: idea.location || 'To be determined',
            imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/600`,
            tickets: [{type: 'General Admission', price: 0}]
        }));
      
      await Promise.all(creationPromises);
      toast.success(`${ideas.length} new event ideas generated!`);

    } catch (err) {
      setError("An error occurred while generating ideas.");
      toast.error("An error occurred while generating ideas.");
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight text-center">Discover Events</h1>
        {/* <p className="mt-2 text-lg text-slate-400">Find your next experience or get inspired by AI.</p> */}
      </div>

      {/* {currentUser && (
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-sky-400 mb-4">Need Inspiration?</h2>
          <form onSubmit={handleGenerateIdeas} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'summer coding bootcamps for teens'"
              className="flex-grow bg-slate-700 text-white border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              disabled={isGenerating}
            />
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-md flex items-center justify-center disabled:opacity-50" disabled={isGenerating}>
              {isGenerating ? <Spinner /> : 'Generate Ideas with AI'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )} */}

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search events by title, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      
       {contextLoading ? (
        <div className="flex justify-center py-16">
            <Spinner />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-slate-300">No Events Found</h3>
          <p className="text-slate-500 mt-2">Try a different search term or generate some new ideas with AI!</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
