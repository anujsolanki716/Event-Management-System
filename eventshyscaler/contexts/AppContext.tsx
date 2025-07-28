import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User, Event, Comment } from '../types';
import * as api from '../services/api';
import toast from 'react-hot-toast';

export interface AppContextType {
  currentUser: User | null;
  events: Event[];
  loading: boolean;
  error: string | null;
  login: (data: Pick<User, 'email' | 'password'>) => Promise<void>;
  register: (data: Pick<User, 'name' | 'email' | 'password'>) => Promise<void>;
  logout: () => void;
  addEvent: (eventData: any) => Promise<Event | null>;
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  addComment: (eventId: string, text: string) => Promise<void>;
  addAiComment: (event: Event, comments: Comment[]) => Promise<void>;
  fetchEvents: () => void;
  fetchEventById: (id: string) => Promise<Event | undefined>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.getEvents();
      setEvents(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      toast.error(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: string): Promise<Event | undefined> => {
      try {
          const { data } = await api.getEventById(id);
          setEvents(prev => {
              const eventExists = prev.some(e => e._id === data._id);
              if (eventExists) {
                  return prev.map(e => e._id === data._id ? data : e);
              }
              return [...prev, data];
          });
          return data;
      } catch(err: any) {
          toast.error(err.response?.data?.message || 'Failed to fetch event details');
          return undefined;
      }
  }, []);


  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAuth = (userData: User) => {
    const userToStore = { ...userData };
    setCurrentUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
  }

  const login = async (loginData: Pick<User, 'email' | 'password'>) => {
    try {
      const { data } = await api.login(loginData);
      handleAuth(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };
  
  const register = async (registerData: Pick<User, 'name' | 'email' | 'password'>) => {
    try {
      const { data } = await api.register(registerData);
      handleAuth(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addEvent = async (eventData: any): Promise<Event | null> => {
    try {
      const { data } = await api.createEvent(eventData);
      setEvents(prevEvents => [data, ...prevEvents]);
      toast.success('Event created successfully!');
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event');
      return null;
    }
  };
  
  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(event => event._id === updatedEvent._id ? updatedEvent : event));
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await api.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };
  
  const registerForEvent = async (eventId: string) => {
    if (!currentUser) return;
    try {
        const { data } = await api.registerForEvent(eventId);
        updateEvent(data);
        toast.success("Successfully registered for the event!");
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to register for event');
    }
  };

  const addComment = async (eventId: string, text: string) => {
    if (!currentUser) return;
    try {
      const { data } = await api.addComment(eventId, { text });
      updateEvent(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const addAiComment = async (event: Event, comments: Comment[]) => {
    try {
        const { data: updatedEvent } = await api.generateAIChatResponse(event, comments);
        updateEvent(updatedEvent);
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'AI failed to respond');
    }
  };

  const value = {
    currentUser,
    events,
    loading,
    error,
    login,
    register,
    logout,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    addComment,
    addAiComment,
    fetchEvents,
    fetchEventById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
