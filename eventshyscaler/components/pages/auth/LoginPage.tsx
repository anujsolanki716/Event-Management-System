import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../hooks/useAppContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, currentUser } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            await login({email, password});
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
           // Error is already handled by toast in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center text-sky-400">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                            required 
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" 
                            required 
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition duration-300 disabled:opacity-50">
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
