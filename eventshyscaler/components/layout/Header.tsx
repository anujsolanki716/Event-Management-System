import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-slate-700 text-sky-300' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <nav className="bg-slate-800/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-bold text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              EventsHyScaler
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClass}>Discover</NavLink>
                {currentUser && (
                  <>
                    <NavLink to="/create" className={navLinkClass}>Create Event</NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/bookings" className={navLinkClass}>My Bookings</NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {currentUser.name}!</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                 <Link
                    to="/login"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                   <Link
                    to="/register"
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;