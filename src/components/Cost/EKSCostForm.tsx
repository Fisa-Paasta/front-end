import React, { useState } from 'react';
import CostSummaryBox from './CostSummaryBox';

export default function EKSCostForm() {
  const [ec2Type, setEc2Type] = useState('t3.medium');
  const [instanceCount, setInstanceCount] = useState(2);
  const [storage, setStorage] = useState(100);
  const [s3, setS3] = useState(0);

  const ec2Pricing = {
    't3.medium': 0.0416,
    't3.large': 0.0832,
    'm5.large': 0.096,
  };

  const ebsPricePerGB = 0.08;
  const s3PricePerGB = 0.023;

  const ec2Hourly = ec2Pricing[ec2Type] * instanceCount;
  const monthlyEBS = storage * ebsPricePerGB;
  const monthlyS3 = s3 * s3PricePerGB;
  const monthly = ec2Hourly * 24 * 30 + monthlyEBS + monthlyS3;

  const formula = `EC2 ${instanceCount} x $${ec2Pricing[ec2Type]}/hr = $${ec2Hourly.toFixed(4)}\n` +
    `EBS ${storage}GB x $${ebsPricePerGB}/mo = $${monthlyEBS.toFixed(2)}\n` +
    `S3 ${s3}GB x $${s3PricePerGB}/mo = $${monthlyS3.toFixed(2)}`;

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6">
      <div className="w-full lg:w-1/3 flex">
        <div className="flex flex-col flex-grow justify-between w-full h-full bg-panel-light dark:bg-panel-dark p-4 rounded-xl shadow transition-colors duration-500">
          <CostSummaryBox hourly={ec2Hourly} monthly={monthly} formula={formula} />
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col justify-between h-full">
        <div className="flex flex-col w-full h-full justify-between">
          <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-t-lg shadow transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">EC2 인스턴스 타입</label>
            <select
              value={ec2Type}
              onChange={(e) => setEc2Type(e.target.value)}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            >
              <option value="t3.medium">t3.medium ($0.0416/hr)</option>
              <option value="t3.large">t3.large ($0.0832/hr)</option>
              <option value="m5.large">m5.large ($0.096/hr)</option>
            </select>
          </div>

          <div className="bg-panel-light dark:bg-panel-dark p-4 shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">인스턴스 개수</label>
            <input
              type="number"
              min={1}
              value={instanceCount}
              onChange={(e) => setInstanceCount(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>

          <div className="bg-panel-light dark:bg-panel-dark p-4 shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">EBS 스토리지 (GB)</label>
            <input
              type="number"
              min={0}
              value={storage}
              onChange={(e) => setStorage(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>

          <div className="bg-panel-light dark:bg-panel-dark p-4 rounded-b-lg shadow border-t border-border-light dark:border-border-dark transition-colors duration-500">
            <label className="block text-sm font-medium mb-1">S3 저장소 사용량 (GB)</label>
            <input
              type="number"
              min={0}
              value={s3}
              onChange={(e) => setS3(Number(e.target.value))}
              className="w-full p-2 rounded bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-foreground-light dark:text-foreground-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}