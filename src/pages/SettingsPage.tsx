import { useTheme } from '@/context/ThemeContext';
import Layout from '@/components/Layout';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">⚙️ 상세 설정</h1>

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
    </Layout>
  );
}
