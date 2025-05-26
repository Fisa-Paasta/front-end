// src/components/Sidebar.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Menu,
  ChevronLeft,
  Home,
  Mail,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const MenuItem = ({
    icon: Icon,
    text,
    to,
    onClick
  }: {
    icon: React.ElementType;
    text: string;
    to?: string;
    onClick?: () => void;
  }) => {
    const content = (
      <div
        className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition cursor-pointer"
        title={text}
        onClick={onClick}
      >
        <Icon size={18} />
        {!collapsed && <span>{text}</span>}
      </div>
    );
    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <aside
      className={`
        fixed top-16 left-0 z-40
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        h-[calc(100vh-4rem)]
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-sm
        border-r border-gray-200 dark:border-gray-700
        shadow-md dark:shadow-lg
        text-foreground-light dark:text-foreground-dark
        px-2 py-4
      `}
    >
      <div className="flex items-center justify-between px-2 mb-6">
      {!collapsed && userId && (
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          👤 {userId}
        </div>
      )}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-500 dark:text-gray-400"
      >
        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
      </button>
      </div>

      

      <nav className="space-y-2 text-sm px-1">
        <MenuItem icon={Home} text="홈" to="/home" />
        <MenuItem
          icon={theme === 'dark' ? Sun : Moon}
          text={theme === 'dark' ? '라이트 모드' : '다크 모드'}
          onClick={toggleTheme}
        />
        <MenuItem
          icon={Settings}
          text="상세 설정"
          to="/settings"
        />
        <MenuItem
          icon={Mail}
          text="피드백"
          onClick={() => window.open('https://forms.gle/Tsv2qcKeHZZw5Hm49', '_blank')}
        />
      </nav>
    </aside>
  );
}
