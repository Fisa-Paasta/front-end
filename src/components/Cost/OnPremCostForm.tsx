import { useState } from 'react';
import CostSummaryBox from './CostSummaryBox';

export default function OnPremCostForm() {
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(4);
  const [disk, setDisk] = useState(50);

  const CPU_UNIT_COST = 0.02;
  const RAM_UNIT_COST = 0.01;
  const DISK_UNIT_COST = 0.001;

  const hourly = cpu * CPU_UNIT_COST + ram * RAM_UNIT_COST + disk * DISK_UNIT_COST;
  const monthly = hourly * 24 * 30;

  const formula = `CPU ${cpu} × $${CPU_UNIT_COST}/hr + RAM ${ram}GB × $${RAM_UNIT_COST}/hr + DISK ${disk}GB × $${DISK_UNIT_COST}/hr`;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽: 비용 요약 */}
        <section className="w-full lg:w-1/3 flex" aria-labelledby="cost-summary-heading">
          <div className="flex flex-col flex-grow justify-between w-full h-full bg-panel-light dark:bg-panel-dark p-4 rounded-xl shadow transition-colors duration-500">
            <h2 id="cost-summary-heading" className="sr-only">비용 요약 정보</h2>
            <CostSummaryBox hourly={hourly} monthly={monthly} formula={formula} />
          </div>
        </section>
        
        {/* 오른쪽: 입력 필드 */}
        <section className="w-full lg:w-2/3 flex flex-col justify-between h-full" aria-labelledby="resource-config-heading">
          <h2 id="resource-config-heading" className="sr-only">리소스 설정</h2>
          <div className="flex flex-col w-full h-full justify-between">
            <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-t-lg shadow transition-colors duration-500">
              <label htmlFor="cpu-input" className="block text-sm font-medium mb-1">
                CPU (vCore)
              </label>
              <input
                id="cpu-input"
                type="number"
                min={1}
                value={cpu}
                onChange={(e) => setCpu(Number(e.target.value))}
                className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary"
                aria-describedby="cpu-help"
              />
              <p id="cpu-help" className="text-xs text-gray-500 mt-1">
                가상 CPU 코어 수를 설정하세요. (최소 1개)
              </p>
            </div>

            <div className="bg-panel-light dark:bg-panel-dark p-4 shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
              <label htmlFor="ram-input" className="block text-sm font-medium mb-1">
                RAM (GB)
              </label>
              <input
                id="ram-input"
                type="number"
                min={1}
                value={ram}
                onChange={(e) => setRam(Number(e.target.value))}
                className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary"
                aria-describedby="ram-help"
              />
              <p id="ram-help" className="text-xs text-gray-500 mt-1">
                시스템 메모리 용량을 GB 단위로 설정하세요. (최소 1GB)
              </p>
            </div>

            <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-b-lg shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
              <label htmlFor="disk-input" className="block text-sm font-medium mb-1">
                디스크 크기 (GB)
              </label>
              <input
                id="disk-input"
                type="number"
                min={0}
                value={disk}
                onChange={(e) => setDisk(Number(e.target.value))}
                className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary"
                aria-describedby="disk-help"
              />
              <p id="disk-help" className="text-xs text-gray-500 mt-1">
                스토리지 용량을 GB 단위로 설정하세요. (0 이상)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}