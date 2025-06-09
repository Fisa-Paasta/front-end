import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ClipboardList,
  Pencil,
  BarChart3,
  DollarSign
} from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/init');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 bg-background-dark dark:bg-background-dark text-foreground-dark dark:text-foreground-dark shadow-md px-6 flex items-center justify-between transition-colors duration-500">
      <Link to="/" className="flex items-center space-x-2">
        {/* ✅ 경로 수정: src/assets/logo.png → /img/logo.png */}
        <img src="/img/logo.png" alt="Paasta" className="h-8 w-auto" />
        <span className="text-xl font-bold">Paasta</span>
      </Link>

      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6 text-base font-medium">
          <Link to="/home" className="flex items-center space-x-1 text-gray-300 hover:text-white">
            <ClipboardList size={18} />
            <span>신청서</span>
          </Link>
          <Link to="/survey" className="flex items-center space-x-1 text-gray-300 hover:text-white">
            <Pencil size={18} />
            <span>신청</span>
          </Link>
          <Link to="/monitoring" className="flex items-center space-x-1 text-gray-300 hover:text-white">
            <BarChart3 size={18} />
            <span>모니터링</span>
          </Link>
          <Link to="/cost" className="flex items-center space-x-1 text-gray-300 hover:text-white">
            <DollarSign size={18} />
            <span>비용산정</span>
          </Link>
        </nav>

        {user ? (
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
    </header>
  );
}