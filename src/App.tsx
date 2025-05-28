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
  const { user, isLoading } = useAuth(); // ✅ 로딩 상태 추가

  // ✅ 인증 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/init" replace />} />
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