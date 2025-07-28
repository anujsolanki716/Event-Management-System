import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        className: '',
        style: {
          background: '#334155', // slate-700
          color: '#f8fafc', // slate-50
          border: '1px solid #475569', // slate-600
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#38bdf8', // sky-400
            secondary: 'white',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#f87171', // red-400
            secondary: 'white',
          },
        },
      }}
    />
  );
};

export default ToastProvider;