import { useTheme } from '@/context/ThemeContext';
import Layout from '@/components/Layout';
import {
  Moon,
  Sun,
  User2,
  Settings,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          상세 설정
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          개인 환경 및 UI 테마를 조정할 수 있습니다.
        </p>
      </div>

      <div className="max-w-3xl bg-panel-light dark:bg-panel-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-sm space-y-8">
        {/* ✅ 1. 계정 정보 */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User2 className="w-5 h-5" />
            계정 정보
          </h2>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <span className="text-gray-500 dark:text-gray-400">사번:</span>{' '}
              <strong>12345678</strong>
            </li>
            <li>
              <span className="text-gray-500 dark:text-gray-400">부서:</span>{' '}
              <strong>인프라팀</strong>
            </li>
          </ul>
        </div>

        <div className="border-t border-border-light dark:border-border-dark" />

        {/* ✅ 2. 테마 설정 */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            테마 설정
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              다크 모드 {isDark ? '사용 중' : '해제됨'}
            </span>
            <label htmlFor="dark-mode-toggle" className="inline-flex items-center cursor-pointer">
              <span className="sr-only">다크 모드 토글</span>
              <input
                id="dark-mode-toggle"
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-purple-500 rounded-full relative transition-all duration-300">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-full" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}