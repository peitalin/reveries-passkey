import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Navbar } from './components/Navbar';
import { PasskeyProvider } from '@web3authn/passkey/react';
import { Toaster } from 'react-hot-toast';

import './index.css';
import '@web3authn/passkey/react/styles';

// Simple App component to manage layout and potentially shared state later
function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <PasskeyProvider
          config={{
            // web2authn server for optimistic (fast) auth
            // otherwise client must use contract auth (slower)
            serverUrl: 'http://localhost:3001'
          }}
        >
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#222222',
                color: '#ffffff', // Default white text
              },
              success: {
                style: {
                  background: '#222222',
                  color: '#eaeaea',
                },
                iconTheme: {
                  primary: '#4ade80', // Bright green
                  secondary: '#222222',
                },
              },
              error: {
                style: {
                  background: '#222222',
                  color: '#eaeaea',
                },
                iconTheme: {
                  primary: '#f87171', // Bright red
                  secondary: '#222222',
                },
              },
              loading: {
                style: {
                  background: '#222222',
                  color: '#eaeaea',
                },
                iconTheme: {
                  primary: '#60a5fa', // Bright blue
                  secondary: '#222222',
                },
              },
            }}
          />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </PasskeyProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
