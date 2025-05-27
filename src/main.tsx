import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { SubmittedProvider } from './context/SubmittedContext';
import { AuthProvider } from './context/AuthContext'; // ✅ 추가

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SubmittedProvider>
        <AuthProvider> {/* ✅ 추가된 AuthProvider */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </SubmittedProvider>
    </ThemeProvider>
  </React.StrictMode>
);
