import { FC } from 'react';
import { CostSummaryProps } from '@/types/cost';
import { Wallet, Timer, Calendar, BookOpenText, Info } from 'lucide-react';

const CostSummaryBox: FC<CostSummaryProps> = ({ hourly, monthly, formula }) => {
  return (
    <div className="w-full bg-panel-light dark:bg-panel-dark text-foreground-light dark:text-foreground-dark p-5 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        비용 요약
      </h3>

      <div className="text-sm space-y-2">
        <p className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          <strong>시간당:</strong>
          <span className="font-mono">${hourly.toFixed(4)} /hr</span>
          <span title="하드웨어 또는 EC2 인스턴스 기준 시간당 비용">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </span>
        </p>

        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <strong>월간:</strong>
          <span className="font-mono">${monthly.toFixed(2)} /mo</span>
          <span title="시간당 비용 × 24시간 × 30일">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </span>
        </p>

        {formula && (
          <div className="text-xs text-gray-400 mt-3 border-t border-gray-700 pt-2">
            <div className="flex items-center gap-2 mb-1">
              <BookOpenText className="w-4 h-4" />
              <strong>계산식</strong>
            </div>
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
