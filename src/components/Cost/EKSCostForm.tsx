import { useState, useEffect } from 'react';
import CostSummaryBox from './CostSummaryBox';
import { ec2Pricing, EC2InstanceType } from '@/types/ec2';

// EKS 클러스터 비용은 시간당 $0.10 (Amazon EKS 공식 요금)
const EKS_CLUSTER_HOURLY = 0.10;

// EBS 볼륨 유형별 가격 (GB당 월별 비용)
const EBS_PRICING = {
  'gp2': 0.10,     // General Purpose SSD (gp2)
  'gp3': 0.08,     // General Purpose SSD (gp3)
  'io1': 0.125,    // Provisioned IOPS SSD (io1)
  'io2': 0.125,    // Provisioned IOPS SSD (io2)
  'st1': 0.045,    // Throughput Optimized HDD (st1)
  'sc1': 0.025,    // Cold HDD (sc1)
};

type EBSVolumeType = keyof typeof EBS_PRICING;

export default function EKSCostForm() {
  // 노드 관련 상태
  const [nodeType, setNodeType] = useState<EC2InstanceType>('t3.medium');
  const [nodeCount, setNodeCount] = useState<number>(2);
  const [, setEc2Hourly] = useState<number>(ec2Pricing['t3.medium']);

  // EBS 볼륨 관련 상태
  const [volumeType, setVolumeType] = useState<EBSVolumeType>('gp3');
  const [volumeSize, setVolumeSize] = useState<number>(50);
  const [volumeCount, setVolumeCount] = useState<number>(2);
  
  // 데이터 전송 비용 (월별 GB)
  const [dataTransfer, setDataTransfer] = useState<number>(100);
  const DATA_TRANSFER_COST_PER_GB = 0.09; // AWS 기본 데이터 전송 비용 (리전에 따라 달라질 수 있음)
  
  // 전체 비용 계산
  const [totalHourly, setTotalHourly] = useState<number>(0);
  const [totalMonthly, setTotalMonthly] = useState<number>(0);
  const [formula, setFormula] = useState<string>('');

  // 비용 계산 로직
  useEffect(() => {
    // EC2 인스턴스(노드) 비용
    const ec2Cost = ec2Pricing[nodeType] * nodeCount;
    
    // EKS 클러스터 비용 (시간당 $0.10)
    const eksClusterCost = EKS_CLUSTER_HOURLY;
    
    // EBS 볼륨 비용 (월별 비용을 시간당으로 변환)
    const ebsHourlyCost = (EBS_PRICING[volumeType] * volumeSize * volumeCount) / 30 / 24;
    
    // 데이터 전송 비용 (월별 비용을 시간당으로 변환)
    const dataTransferHourlyCost = (dataTransfer * DATA_TRANSFER_COST_PER_GB) / 30 / 24;
    
    // 시간당 총 비용
    const hourlyTotal = ec2Cost + eksClusterCost + ebsHourlyCost + dataTransferHourlyCost;
    
    // 월별 총 비용 (시간당 비용 * 24시간 * 30일)
    const monthlyTotal = hourlyTotal * 24 * 30;
    
    setEc2Hourly(ec2Pricing[nodeType]);
    setTotalHourly(hourlyTotal);
    setTotalMonthly(monthlyTotal);
    
    // 계산식 생성
    setFormula(
      `EKS 클러스터 ($${EKS_CLUSTER_HOURLY}/hr) + ` +
      `EC2 노드 (${nodeCount} × $${ec2Pricing[nodeType]}/hr) + ` +
      `EBS 볼륨 (${volumeCount} × ${volumeSize}GB × $${EBS_PRICING[volumeType]}/GB/월 ÷ 30일 ÷ 24시간) + ` +
      `데이터 전송 (${dataTransfer}GB × $${DATA_TRANSFER_COST_PER_GB}/GB/월 ÷ 30일 ÷ 24시간)`
    );
  }, [nodeType, nodeCount, volumeType, volumeSize, volumeCount, dataTransfer]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽: 비용 요약 */}
        <div className="w-full lg:w-1/3 flex">
          <div className="flex-grow bg-panel-light dark:bg-panel-dark p-4 rounded-xl shadow transition-colors duration-500">
            <CostSummaryBox hourly={totalHourly} monthly={totalMonthly} formula={formula} />
          </div>
        </div>
        
        {/* 오른쪽: 설정 패널 */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {/* EKS 클러스터 섹션 */}
          <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-lg shadow transition-colors duration-500">
            <h3 className="text-lg font-semibold mb-3">EKS 클러스터</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Amazon EKS 클러스터 비용: 시간당 $0.10 (월 $73)
            </div>
          </div>
          
          {/* 워커 노드 섹션 */}
          <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-lg shadow transition-colors duration-500">
            <h3 className="text-lg font-semibold mb-3">워커 노드</h3>
            
            {/* ✅ htmlFor 속성 추가 */}
            <label htmlFor="node-type-select" className="block text-sm font-medium mb-1">
              EC2 인스턴스 타입
            </label>
            <select
              id="node-type-select"
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value as EC2InstanceType)}
              className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark mb-4"
            >
              <option value="t3.medium">t3.medium ($0.0416/hr)</option>
              <option value="t3.large">t3.large ($0.0832/hr)</option>
              <option value="m5.large">m5.large ($0.096/hr)</option>
            </select>
            
            {/* ✅ htmlFor 속성 추가 */}
            <label htmlFor="node-count-input" className="block text-sm font-medium mb-1">
              노드 수
            </label>
            <input
              id="node-count-input"
              type="number"
              min="1"
              value={nodeCount}
              onChange={(e) => setNodeCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark"
            />
          </div>
          
          {/* EBS 볼륨 섹션 */}
          <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-lg shadow transition-colors duration-500">
            <h3 className="text-lg font-semibold mb-3">EBS 볼륨</h3>
            
            {/* ✅ htmlFor 속성 추가 */}
            <label htmlFor="volume-type-select" className="block text-sm font-medium mb-1">
              볼륨 타입
            </label>
            <select
              id="volume-type-select"
              value={volumeType}
              onChange={(e) => setVolumeType(e.target.value as EBSVolumeType)}
              className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark mb-4"
            >
              <option value="gp3">General Purpose SSD (gp3) - $0.08/GB/월</option>
              <option value="gp2">General Purpose SSD (gp2) - $0.10/GB/월</option>
              <option value="io1">Provisioned IOPS SSD (io1) - $0.125/GB/월</option>
              <option value="io2">Provisioned IOPS SSD (io2) - $0.125/GB/월</option>
              <option value="st1">Throughput Optimized HDD (st1) - $0.045/GB/월</option>
              <option value="sc1">Cold HDD (sc1) - $0.025/GB/월</option>
            </select>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* ✅ htmlFor 속성 추가 */}
                <label htmlFor="volume-size-input" className="block text-sm font-medium mb-1">
                  볼륨 크기 (GB)
                </label>
                <input
                  id="volume-size-input"
                  type="number"
                  min="1"
                  value={volumeSize}
                  onChange={(e) => setVolumeSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark"
                />
              </div>
              <div>
                {/* ✅ htmlFor 속성 추가 */}
                <label htmlFor="volume-count-input" className="block text-sm font-medium mb-1">
                  볼륨 수
                </label>
                <input
                  id="volume-count-input"
                  type="number"
                  min="1"
                  value={volumeCount}
                  onChange={(e) => setVolumeCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark"
                />
              </div>
            </div>
          </div>
          
          {/* 데이터 전송 섹션 */}
          <div className="bg-panel-light dark:bg-panel-dark p-6 rounded-lg shadow transition-colors duration-500">
            <h3 className="text-lg font-semibold mb-3">데이터 전송</h3>
            
            {/* ✅ htmlFor 속성 추가 */}
            <label htmlFor="data-transfer-input" className="block text-sm font-medium mb-1">
              월간 데이터 전송량 (GB)
            </label>
            <input
              id="data-transfer-input"
              type="number"
              min="0"
              value={dataTransfer}
              onChange={(e) => setDataTransfer(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full p-2 rounded border bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark"
            />
            <p className="text-xs text-gray-500 mt-1">
              AWS 리전에서 인터넷으로의 데이터 전송 비용: $0.09/GB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}