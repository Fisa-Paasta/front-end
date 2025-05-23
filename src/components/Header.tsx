import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // JWT 토큰 유효성 검사 함수
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenValid(token)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/init');
  };

  return (
    <div className="w-full bg-background-dark dark:bg-background-dark text-foreground-dark dark:text-foreground-dark shadow-md px-6 py-4 flex items-center justify-between transition-colors duration-500">
      <Link to="/" className="flex items-center space-x-2">
        <img src="src/assets/logo.png" alt="Paasta" className="h-8 w-auto" />
        <span className="text-xl font-bold">Paasta</span>
      </Link>
      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6 text-base font-medium">
          <Link to="/home" className="text-gray-300 hover:text-white">📋 목록</Link>
          <Link to="/survey" className="text-gray-300 hover:text-white">🖊️ 신청</Link>
          <Link to="/monitoring" className="text-gray-300 hover:text-white">📊 모니터링</Link>
          <Link to="/cost" className="text-gray-300 hover:text-white">💰 비용산정</Link>
        </nav>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-base bg-red-600 hover:bg-red-700 text-white rounded transition font-semibold"
          >
            로그아웃
          </button>
        ) : (
          <Link
            to="/init"
            className="px-5 py-2 text-base bg-primary hover:bg-primary-hover text-white rounded transition font-semibold"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}