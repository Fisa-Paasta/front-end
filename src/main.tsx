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
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider> {/* ✅ AuthProvider가 가장 바깥쪽에 위치 */}
          <SubmittedProvider>
            <App />
          </SubmittedProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);