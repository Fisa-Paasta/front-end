// src/components/Sidebar.tsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark p-6 transition-colors duration-500">
  <div className="text-sm mb-4 uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">메뉴</div>
  <nav className="space-y-4 text-base">
    <Link to="/home" className="block hover:text-primary font-medium">🏠 홈</Link>
    <Link to="/settings" className="block hover:text-primary font-medium">⚙️ 설정</Link>
    <a
      href="https://forms.gle/Tsv2qcKeHZZw5Hm49"
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:text-primary font-medium"
    >📩 피드백</a>
  </nav>
    </aside>
  );
}
