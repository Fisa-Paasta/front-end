import { useState, useEffect } from 'react';
import CostSummaryBox from './CostSummaryBox';
import { ec2Pricing, EC2InstanceType } from '@/types/ec2';

export default function EKSCostForm() {
  const [ec2Type, setEc2Type] = useState<EC2InstanceType>('t3.medium');
  const [ec2Hourly, setEc2Hourly] = useState<number>(ec2Pricing['t3.medium']);
  const [monthly, setMonthly] = useState<number>(0);
  const [formula, setFormula] = useState<string>('');

  useEffect(() => {
    const price = ec2Pricing[ec2Type]; // ✅ 더 이상 에러 안 남
    setEc2Hourly(price);
    setMonthly(price * 24 * 30);
    setFormula(`${price} * 24시간 * 30일`);
  }, [ec2Type]);

  return (
    <div className="w-full">
      <CostSummaryBox hourly={ec2Hourly} monthly={monthly} formula={formula} />

      <div className="w-full lg:w-2/3 flex flex-col justify-between h-full mt-6">
        <label className="block text-sm font-medium mb-1">EC2 인스턴스 타입</label>
        <select
          value={ec2Type}
          onChange={(e) => setEc2Type(e.target.value as EC2InstanceType)}
          className="w-full p-2 rounded border"
        >
          <option value="t3.medium">t3.medium ($0.0416/hr)</option>
          <option value="t3.large">t3.large ($0.0832/hr)</option>
          <option value="m5.large">m5.large ($0.096/hr)</option>
        </select>
      </div>
    </div>
  );
}
