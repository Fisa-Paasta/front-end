import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <Header />
      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />

        <main className="flex-1 p-10">
          <h1 className="text-2xl font-semibold mb-6">⚙️ 설정</h1>

          <section className="max-w-xl bg-white dark:bg-[#1e1e30] text-gray-800 dark:text-gray-100 shadow-md rounded-xl p-8 transition-colors duration-500">
            <p className="text-lg mb-4">
              현재 테마: <strong>{theme === 'dark' ? '🌙 다크 모드' : '☀️ 라이트 모드'}</strong>
            </p>

            <button
              onClick={toggleTheme}
              className="px-5 py-2 rounded-md bg-primary hover:bg-primary-hover text-white transition-colors duration-300"
            >
              테마 전환
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
