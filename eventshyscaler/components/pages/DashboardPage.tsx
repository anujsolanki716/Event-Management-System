import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';

const DashboardPage: React.FC = () => {
  const { currentUser, events, deleteEvent } = useAppContext();

  if (!currentUser) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-300">Access Denied</h2>
        <p className="text-slate-500 mt-2">
            Please <Link to="/login" className="text-sky-400 hover:underline font-medium">log in</Link> to view your dashboard.
        </p>
      </div>
    );
  }

  const myEvents = events.filter(event => event.creator._id === currentUser._id);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-sky-400 mb-4">My Created Events</h2>
        {myEvents.length > 0 ? (
          <div className="space-y-4">
            {myEvents.map(event => (
              <div key={event._id} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <Link to={`/event/${event._id}`} className="font-semibold text-lg text-white hover:text-sky-300">{event.title}</Link>
                  <p className="text-sm text-slate-400">{event.location} - {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-slate-300">{event.attendees.length} attendees</p>
                    <button onClick={() => deleteEvent(event._id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">You haven't created any events yet.</p>
            <Link to="/create" className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md">Create Your First Event</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
