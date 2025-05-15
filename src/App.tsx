import { Routes, Route, Navigate } from 'react-router-dom';
import InitPage from './pages/InitPage';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import DashboardDetail from './pages/DashboardDetail';
import CostPage from './pages/CostPage';
import MonitoringPage from './pages/MonitoringPage';
import AdminPage from './pages/AdminPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<InitPage />} />
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
      <Route path="/dashboard/:id" element={<DashboardDetail item={{
        id: 0,
        title: '',
        desc: '',
        userId: '',
        date: '',
        status: '접수중',
        starred: false,
        historyList: []
      }} onClose={() => {}} />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;