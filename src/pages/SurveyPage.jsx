import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarSummary from '@/components/SidebarSummary';
import StepNavigator from '@/components/StepNavigator';
import FormStep from '@/components/FormStep';
import { SurveyProvider } from '@/context/SurveyContext';
import '@/styles/global.css';

export default function SurveyPage() {
  return (
    <SurveyProvider>
      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
        {/* 상단 헤더 */}
        <Header />

        <div className="flex flex-1">
          {/* 좌측 메뉴 */}
          <Sidebar />

          {/* 우측 메인 컨텐츠 */}
          <main className="flex-1 p-10">
            <h1 className="text-2xl font-semibold mb-8">📝 인프라 환경 설문</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 좌측 요약 패널 */}
              <aside className="lg:col-span-1 bg-panel-light dark:bg-panel-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <SidebarSummary />
              </aside>

              {/* 우측 설문 입력 폼 */}
              <section className="lg:col-span-3 bg-panel-light dark:bg-panel-dark p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark space-y-8">
                <StepNavigator />
                <FormStep />
              </section>
            </div>
          </main>
        </div>
      </div>
    </SurveyProvider>
  );
}
