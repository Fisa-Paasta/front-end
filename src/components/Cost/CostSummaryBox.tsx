import { FC } from 'react';
import { CostSummaryProps } from '@/types/cost';
import { Wallet, Timer, Calendar, BookOpenText, Info } from 'lucide-react';

interface Props extends CostSummaryProps {
  compact?: boolean;
}

const CostSummaryBox: FC<Props> = ({ hourly, monthly, formula, compact = false }) => {
  return (
    <div
      className={`text-sm ${
        compact
          ? 'bg-transparent p-0 border-none text-inherit dark:text-inherit'
          : 'bg-panel-light dark:bg-panel-dark p-5 border border-border-light dark:border-border-dark'
      } rounded-lg shadow-sm space-y-2`}
    >
      <h3 className={`font-semibold mb-2 flex items-center gap-2 ${compact ? 'text-base' : 'text-lg'}`}>
        <Wallet className="w-4 h-4" />
        비용 요약
      </h3>

      <p className="flex items-center gap-2">
        <Timer className="w-4 h-4" />
        <strong>시간당:</strong>
        <span className="font-mono">${hourly.toFixed(4)} /hr</span>
        <span  title="하드웨어 또는 EC2 인스턴스 기준 시간당 비용" > 
          <Info className="w-4 h-4 text-gray-400 cursor-help"/>
        </span>
      </p>

      <p className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <strong>월간:</strong>
        <span className="font-mono">${monthly.toFixed(2)} /mo</span>
        <span title="시간당 비용 × 24시간 × 30일" >
          <Info className="w-4 h-4 text-gray-400 cursor-help"/>
        </span>
      </p>

      {formula && (
        <div className="text-xs text-gray-400 mt-2 border-t border-gray-700 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <BookOpenText className="w-4 h-4" />
            <strong>계산식</strong>
          </div>
          <pre className="whitespace-pre-wrap font-mono leading-snug">{formula}</pre>
        </div>
      )}

      <p className="text-[11px] text-gray-500 mt-3 leading-tight">
        ※ 본 계산에는 전력, 인건비, 기존 장비 감가상각 등의 간접비용은 포함되어 있지 않습니다.
      </p>
    </div>
  );
};

export default CostSummaryBox;
