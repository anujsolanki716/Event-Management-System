import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Spinner from '../common/Spinner';
import { Event } from '../../types';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { currentUser, registerForEvent, addComment, addAiComment, fetchEventById, events } = useAppContext();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Use local event state that is updated from context
  const contextEvent = events.find(e => e._id === eventId);
  useEffect(() => {
    if (contextEvent) {
        setEvent(contextEvent);
    }
  }, [contextEvent]);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      fetchEventById(eventId).then((fetchedEvent) => {
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        }
        setLoading(false);
      });
    }
  }, [eventId, fetchEventById]);
  
  const handleRegister = () => {
    if (eventId) {
      registerForEvent(eventId);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !eventId) return;
    await addComment(eventId, commentText);
    setCommentText('');
  };
  
  const triggerAiResponse = useCallback(async () => {
      if (!event || !event.comments.length || event.comments[event.comments.length-1].user.id === 'user-ai-responder') {
          return;
      }
      setIsAiTyping(true);
      await addAiComment(event, event.comments);
      setIsAiTyping(false);
  }, [event, addAiComment]);

  useEffect(() => {
    if (event && event.comments.length > 0) {
      const lastCommenter = event.comments[event.comments.length - 1].user;
      if (currentUser && lastCommenter.id === currentUser._id) {
          const timer = setTimeout(triggerAiResponse, 1500);
          return () => clearTimeout(timer);
      }
    }
  }, [event, event?.comments, currentUser, triggerAiResponse]);


  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>
  }

  if (!event) {
    return <div className="text-center text-white text-2xl py-10">Event not found.</div>;
  }
  
  const isRegistered = currentUser ? event.attendees.some(a => a._id === currentUser._id) : false;

  return (
    <div className="max-w-5xl mx-auto text-white">
      <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden">
        <img className="w-full h-96 object-cover" src={event.imageUrl} alt={event.title} />
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">{event.title}</h1>
          <p className="text-sm text-slate-400 mt-2">by {event.creator.name}</p>
          
          <div className="mt-6 flex flex-wrap gap-6 text-lg">
             <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {new Date(event.date).toDateString()} at {event.time}</div>
             <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {event.location}</div>
          </div>

          <p className="mt-6 text-slate-300 leading-relaxed">{event.description}</p>

          <div className="mt-8 border-t border-slate-700 pt-8">
            <h2 className="text-2xl font-bold text-sky-400">Tickets</h2>
            {event.tickets.map(ticket => (
              <div key={ticket.type} className="mt-4 flex justify-between items-center bg-slate-700 p-4 rounded-lg">
                <div>
                  <p className="font-semibold">{ticket.type}</p>
                  <p className="text-slate-400">Rs - {ticket.price.toFixed(2)}</p>
                </div>
                {currentUser && (
                    isRegistered ? 
                    <span className="text-green-400 font-bold">Registered!</span> :
                    <button onClick={handleRegister} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-md">Register</button>
                )}
                 {!currentUser && <p className="text-slate-400">Login to register</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* <div className="mt-10 bg-slate-800 rounded-lg shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-sky-400 mb-6">Live Discussion</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
          {event.comments.map(comment => (
            <div key={comment._id} className={`flex items-start gap-3 ${comment.user.id === (currentUser?._id) ? 'justify-end' : ''}`}>
               {comment.user.id !== (currentUser?._id) && <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shrink-0">{comment.user.name.substring(0, 2)}</div>}
               <div className={`rounded-lg p-3 ${comment.user.id === (currentUser?._id) ? 'bg-sky-600' : 'bg-slate-700'}`}>
                <p className="text-sm text-white">{comment.text}</p>
                <p className="text-xs text-slate-400 mt-1 text-right">{new Date(comment.timestamp).toLocaleTimeString()}</p>
               </div>
            </div>
          ))}
          {isAiTyping && <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shrink-0">AI</div><div className="rounded-lg p-3 bg-slate-700"><Spinner /></div></div>}
        </div>
        
        {currentUser && (
          <form onSubmit={handleCommentSubmit} className="mt-6 flex gap-4">
            <input 
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ask a question or share your thoughts..."
              className="flex-grow bg-slate-700 text-white border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md">Send</button>
          </form>
        )}
      </div> */}
    </div>
  );
};

export default EventDetailPage;
