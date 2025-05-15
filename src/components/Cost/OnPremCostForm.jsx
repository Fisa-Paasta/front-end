import React, { useState } from 'react';
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
    <div className="flex flex-col lg:flex-row w-full gap-6">
      <div className="w-full lg:w-1/3 flex">
        <div className="flex flex-col flex-grow justify-between w-full h-full bg-panel-light dark:bg-panel-dark p-4 rounded-xl shadow transition-colors duration-500">
          <CostSummaryBox hourly={hourly} monthly={monthly} formula={formula} />
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col justify-between h-full">
        <div className="flex flex-col w-full h-full justify-between">
          <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-t-lg shadow transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">CPU (vCore)</label>
            <input
              type="number"
              min={1}
              value={cpu}
              onChange={(e) => setCpu(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>

          <div className="bg-panel-light dark:bg-panel-dark p-4 shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">RAM (GB)</label>
            <input
              type="number"
              min={1}
              value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>

          <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-b-lg shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">디스크 크기 (GB)</label>
            <input
              type="number"
              min={0}
              value={disk}
              onChange={(e) => setDisk(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}