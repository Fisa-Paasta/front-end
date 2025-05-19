import { Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';

import InitPage from './pages/InitPage';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import CostPage from './pages/CostPage';
import MonitoringPage from './pages/MonitoringPage';
import AdminPage from './pages/AdminPage';

function App() {
  const isAuthenticated = useMemo(() => {
    try {
      return !!localStorage.getItem('token');
    } catch {
      return false;
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<InitPage />} />
      <Route path="/init" element={<InitPage />} />
      <Route path="/cost" element={<CostPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route
        path="/home"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/init" replace />}
      />
      <Route
        path="/survey"
        element={isAuthenticated ? <SurveyPage /> : <Navigate to="/init" replace />}
      />
      <Route
        path="/list"
        element={isAuthenticated ? <ListPage /> : <Navigate to="/init" replace />}
      />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/init"} replace />} />
    </Routes>
  );
}

export default App;
