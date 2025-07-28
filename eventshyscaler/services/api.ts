import axios from 'axios';
import { User, Event } from '../types';

const API_URL = 'https://hyscaler-event.onrender.com/api'; // Assumes a proxy is set up for development

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
        const token = JSON.parse(userInfo).token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Auth
export const login = (data: Pick<User, 'email' | 'password'>) => api.post('/auth/login', data);
export const register = (data: Pick<User, 'name' | 'email' | 'password'>) => api.post('/auth/register', data);

// Events
export const getEvents = () => api.get<Event[]>('/events');
export const getEventById = (id: string) => api.get<Event>(`/events/${id}`);
export const createEvent = (eventData: any) => api.post<Event>('/events', eventData);
export const deleteEvent = (id: string) => api.delete(`/events/${id}`);
export const registerForEvent = (id: string) => api.post<Event>(`/events/${id}/register`);
export const addComment = (id: string, commentData: { text: string }) => api.post<Event>(`/events/${id}/comments`, commentData);

// AI
export const generateEventIdeas = (prompt: string) => api.post('/ai/ideas', { prompt });
export const generateEventDescription = (title: string, keywords: string) => api.post<{description: string}>('/ai/description', { title, keywords });
export const generateAIChatResponse = (event: any, comments: any[]) => api.post<Event>('/ai/chat', { event, comments });

export default api;
