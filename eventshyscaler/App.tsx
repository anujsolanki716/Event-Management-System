import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import DiscoverPage from './components/pages/DiscoverPage';
import CreateEventPage from './components/pages/CreateEventPage';
import DashboardPage from './components/pages/DashboardPage';
import BookingsPage from './components/pages/BookingsPage';
import EventDetailPage from './components/pages/EventDetailPage';
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';
import ToastProvider from './components/common/Toast';
import Footer from './components/layout/Footer';

const App: React.FC = () => {
  return (
    <AppProvider> 
      <HashRouter>
        <ToastProvider />
        <Layout>
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
          </Routes>
        </Layout>
        <Footer />
      </HashRouter>
    </AppProvider>
  );
};

export default App;