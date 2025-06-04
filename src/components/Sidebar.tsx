import { Link } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  readonly collapsed: boolean;
  readonly setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItemProps {
  readonly icon: React.ElementType;
  readonly text: string;
  readonly to?: string;
  readonly onClick?: () => void;
  readonly collapsed: boolean;
}

function MenuItem({ icon: Icon, text, to, onClick, collapsed }: MenuItemProps) {
  const baseClassName = "flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 relative group";
  
  const content = (
    <>
      <Icon size={18} />
      {!collapsed && <span>{text}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]">
          {text}
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClassName} title={collapsed ? text : undefined}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left ${baseClassName}`}
        title={collapsed ? text : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClassName} title={collapsed ? text : undefined}>
      {content}
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { user } = useAuth(); // ✅ AuthContext에서 user 정보 가져오기
  const { theme, toggleTheme } = useTheme();

  // ✅ 보안 강화된 외부 링크 열기 함수
  const openFeedbackForm = () => {
    window.open('https://forms.gle/Tsv2qcKeHZZw5Hm49', '_blank', 'noopener,noreferrer');
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
        {!collapsed && user && (
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            👤 {user.userName}({user.userId})
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 relative group"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]">
              사이드바 펼치기
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          )}
        </button>
      </div>

      <div className="space-y-2 text-sm px-1">
        <MenuItem 
          icon={Home} 
          text="홈" 
          to="/home" 
          collapsed={collapsed}
        />
        <MenuItem
          icon={theme === 'dark' ? Sun : Moon}
          text={theme === 'dark' ? '라이트 모드' : '다크 모드'}
          onClick={toggleTheme}
          collapsed={collapsed}
        />
        <MenuItem
          icon={Settings}
          text="상세 설정"
          to="/settings"
          collapsed={collapsed}
        />
        <MenuItem
          icon={Mail}
          text="피드백"
          onClick={openFeedbackForm}
          collapsed={collapsed}
        />
      </div>
    </nav>
  );
}