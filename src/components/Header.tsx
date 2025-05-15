// src/components/Header.tsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="w-full bg-background-dark dark:bg-background-dark text-foreground-dark dark:text-foreground-dark shadow-md px-6 py-4 flex items-center justify-between transition-colors duration-500">
  <Link to="/" className="flex items-center space-x-2">
    <img src="src/assets/logo.png" alt="Paasta" className="h-8 w-auto" />
    <span className="text-xl font-bold">Paasta</span>
  </Link>
  <div className="flex items-center space-x-6">
    <nav className="flex space-x-6 text-base font-medium">
      <Link to="/home" className="text-gray-300 hover:text-white">📋 목록</Link>
      <Link to="/survey" className="text-gray-300 hover:text-white"> 🖊️ 신청</Link>
      <Link to="/monitoring" className="text-gray-300 hover:text-white">📊 모니터링</Link>
      <Link to="/cost" className="text-gray-300 hover:text-white">💰 비용산정</Link>
    </nav>
    <Link
      to="/login"
      className="px-5 py-2 text-base bg-primary hover:bg-primary-hover text-white rounded transition font-semibold"
    >로그인</Link>
  </div>
</div>
  );
}
