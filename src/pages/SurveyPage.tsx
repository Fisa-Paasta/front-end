import SidebarSummary from '@/components/SidebarSummary';
import StepNavigator from '@/components/StepNavigator';
import FormStep from '@/components/FormStep';
import Layout from '@/components/Layout';
import { SurveyProvider } from '@/context/SurveyContext';
import '@/styles/global.css';
import { FileText } from 'lucide-react';

export default function SurveyPage() {
  return (
    <SurveyProvider>
      <Layout>
        <h1 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <FileText size={20} />
          인프라 환경 설문
        </h1>


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽 요약 */}
          <aside className="lg:col-span-1 bg-panel-light dark:bg-panel-dark p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
            <SidebarSummary />
          </aside>

          {/* 오른쪽 설문 */}
          <section className="lg:col-span-3 bg-panel-light dark:bg-panel-dark p-8 rounded-2xl shadow-sm border border-border-light dark:border-border-dark space-y-8">
            <StepNavigator />
            <FormStep />
          </section>
        </div>
      </Layout>
    </SurveyProvider>
  );
}
