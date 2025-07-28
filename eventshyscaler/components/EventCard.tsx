
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { AcademicCapIcon } from "@heroicons/react/24/outline";

<AcademicCapIcon className="h-6 w-6 text-blue-500" />


interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

  return (
    <Link to={`/event/${event._id}`} className="block group">
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-sky-500/20 transition-all duration-300 h-full flex flex-col">
        <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">{event.title}</h3>
          <p className="text-slate-400 text-sm flex-grow">{event.description.substring(0, 100)}...</p>
          <div className="mt-4 text-sm text-slate-300">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
