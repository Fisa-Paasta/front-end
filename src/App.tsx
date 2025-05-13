// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import InitPage from './pages/InitPage';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import ListPage from './pages/ListPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* 로그인 페이지는 누구나 접근 가능 */}
      <Route path="/" element={<InitPage />} />

      {/* 인증된 사용자만 홈 접근 가능 */}
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

      {/* 기타 경로는 /init 으로 리디렉션 */}
      <Route path="*" element={<Navigate to="/init" replace />} />
    </Routes>
  );
}

export default App;
