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
  readonly collapsed: boolean;
  readonly setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItemProps {
  readonly icon: React.ElementType;
  readonly text: string;
  readonly to?: string;
  readonly onClick?: () => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const MenuItem = ({ icon: Icon, text, to, onClick }: MenuItemProps) => {
    if (to) {
      // Link 요소인 경우
      return (
        <Link 
          to={to}
          className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={text}
        >
          <Icon size={18} />
          {!collapsed && <span>{text}</span>}
        </Link>
      );
    }

    if (onClick) {
      // 버튼인 경우
      return (
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
          title={text}
        >
          <Icon size={18} />
          {!collapsed && <span>{text}</span>}
        </button>
      );
    }

    // 기본 div (상호작용 없음)
    return (
      <div className="flex items-center space-x-3 p-2" title={text}>
        <Icon size={18} />
        {!collapsed && <span>{text}</span>}
      </div>
    );
  };

  return (
    <nav
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
      aria-label="주요 네비게이션"
    >
      <div className="flex items-center justify-between px-2 mb-6">
        {!collapsed && userId && (
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            👤 {userId}
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="space-y-2 text-sm px-1">
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
      </div>
    </nav>
  );
}