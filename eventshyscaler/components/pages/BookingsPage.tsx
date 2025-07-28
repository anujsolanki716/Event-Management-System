import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import EventCard from '../EventCard';

const BookingsPage: React.FC = () => {
  const { currentUser, events } = useAppContext();

  if (!currentUser) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-300">Access Denied</h2>
        <p className="text-slate-500 mt-2">
            Please <Link to="/login" className="text-sky-400 hover:underline font-medium">log in</Link> to view your bookings.
        </p>
      </div>
    );
  }

  const bookedEvents = events.filter(event => event.attendees.some(attendee => attendee._id === currentUser._id));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>
      {bookedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookedEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800 rounded-lg">
          <h3 className="text-2xl font-semibold text-slate-300">You have no upcoming events.</h3>
          <p className="text-slate-500 mt-2">Time to discover something new!</p>
          <Link to="/" className="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md">Discover Events</Link>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
