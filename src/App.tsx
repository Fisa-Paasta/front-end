import { Routes, Route, Navigate } from 'react-router-dom';

import InitPage from './pages/InitPage';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import ListPage from './pages/ListPage';
import SettingsPage from './pages/SettingsPage';
import CostPage from './pages/CostPage';
import MonitoringPage from './pages/MonitoringPage';
import AdminPage from './pages/AdminPage';

import PrivateRoute from './routes/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth(); // ✅ AuthContext에서 유저 정보 가져오기

  return (
    <Routes>
      <Route path="/" element={<InitPage />} />
      <Route path="/init" element={<InitPage />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/survey"
        element={
          <PrivateRoute>
            <SurveyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/list"
        element={
          <PrivateRoute>
            <ListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/cost"
        element={
          <PrivateRoute>
            <CostPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/monitoring"
        element={
          <PrivateRoute>
            <MonitoringPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? '/home' : '/init'} replace />}
      />
    </Routes>
  );
}

export default App;
