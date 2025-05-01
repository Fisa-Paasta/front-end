import SidebarSummary from '@/components/SidebarSummary';
import StepNavigator from '@/components/StepNavigator';
import FormStep from '@/components/FormStep';
import { SurveyProvider } from '@/context/SurveyContext';
import '@/styles/global.css';

export default function SurveyPage() {
  return (
    <SurveyProvider>
      <div className="formbold-main-wrapper split-layout">
        {/* 좌측 요약 영역 */}
        <SidebarSummary />

        {/* 우측 설문 폼 영역 */}
        <div className="formbold-form-wrapper">
          <StepNavigator />
          <FormStep />
        </div>
      </div>
    </SurveyProvider>
  );
}
