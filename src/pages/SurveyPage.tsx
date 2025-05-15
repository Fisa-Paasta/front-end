import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarSummary from '@/components/SidebarSummary';
import StepNavigator from '@/components/StepNavigator';
import FormStep from '@/components/FormStep';
import { SurveyProvider } from '@/context/SurveyContext';
import '@/styles/global.css';

export default function SurveyPage() {
  return (
    <SurveyProvider> {/* ✅ 이거 하나만 있어야 함 */}
      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
        <Header />

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-10">
            <h1 className="text-2xl font-semibold mb-8">📝 인프라 환경 설문</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 bg-panel-light dark:bg-panel-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
                <SidebarSummary />
              </aside>

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
