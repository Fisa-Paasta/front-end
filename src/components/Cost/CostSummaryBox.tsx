import { FC } from 'react';
import { CostSummaryProps } from '@/types/cost';

const CostSummaryBox: FC<CostSummaryProps> = ({ hourly, monthly, formula }) => {
  if (!hourly && !monthly) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark p-5 rounded-lg shadow-lg border border-gray-700 mt-6">
      <h3 className="text-lg font-semibold mb-3">💰 비용 요약</h3>

      <div className="text-sm space-y-2">
        <p>
          ⏱️ <strong>시간당:</strong>
          <span className="font-mono ml-1">${hourly?.toFixed(4)} /hr</span>
          <abbr
            title="하드웨어 또는 EC2 인스턴스 기준 시간당 비용"
            className="ml-1 text-gray-400 text-xs cursor-help"
          >
            ⓘ
          </abbr>
        </p>

        <p>
          📆 <strong>월간:</strong>
          <span className="font-mono ml-1">${monthly?.toFixed(2)} /mo</span>
          <abbr
            title="시간당 비용 × 24시간 × 30일 + 스토리지 요금 포함"
            className="ml-1 text-gray-400 text-xs cursor-help"
          >
            ⓘ
          </abbr>
        </p>

        {formula && (
          <div className="text-xs text-gray-400 mt-3 border-t border-gray-600 pt-2">
            <p className="mb-1">📘 <strong>계산식</strong></p>
            <pre className="whitespace-pre-wrap font-mono leading-snug">{formula}</pre>
          </div>
        )}

        <p className="text-[11px] text-gray-500 mt-4">
          ※ 본 계산에는 전력, 인건비, 기존 장비 감가상각 등의 간접비용은 포함되어 있지 않습니다.
        </p>
      </div>
    </div>
  );
};

export default CostSummaryBox;
