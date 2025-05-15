import { useSurvey } from '@/context/SurveyContext';

export default function StepNavigator() {
  const { currentStep, steps } = useSurvey();

  return (
    <div className="w-full flex justify-between items-center px-2 sm:px-4 mb-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <div key={idx} className="flex flex-col items-center relative flex-1">
            {/* 동그라미 */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10
                ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-400 text-white dark:bg-gray-600'}
              `}
            >
              {idx + 1}
            </div>

            {/* 제목 */}
            <span className={`mt-2 text-xs sm:text-sm font-medium text-center
              ${isCompleted 
                ? 'text-green-400 dark:text-green-400' 
                : isActive 
                ? 'text-indigo-500 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400'}`}>
              {step.title}
            </span>

            {/* 진행 라인 */}
            {idx !== steps.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-500 z-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
