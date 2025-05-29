import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';

// ✅ 타입 정의
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// ✅ Context 생성 시 타입과 기본값 명시
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ✅ Provider 컴포넌트에 children 타입 명시
export function ThemeProvider({ children }: { children: ReactNode }) {
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') ?? getSystemTheme()
  );

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ 사용 훅에 에러 보호 추가
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
