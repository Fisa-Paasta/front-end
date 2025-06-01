import { StatusType } from '@/types/admin';

interface AdminFilterBarProps {
  filterUserId: string;
  setFilterUserId: (value: string) => void;
  filterStatus: StatusType | string;
  setFilterStatus: (value: StatusType | '') => void;
  filterDate: string;
  setFilterDate: (value: string) => void;
  bulkStatus: StatusType;
  setBulkStatus: (value: StatusType) => void;
  onBulkApply: () => void;
  statusOptions: StatusType[];
}

export default function AdminFilterBar({
  filterUserId,
  setFilterUserId,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  bulkStatus,
  setBulkStatus,
  onBulkApply,
  statusOptions,
}: AdminFilterBarProps) {
  return (
    <div className="flex gap-4 mb-6 items-center whitespace-nowrap overflow-x-auto">
      <input
        type="text"
        placeholder="사번 검색"
        value={filterUserId}
        onChange={(e) => setFilterUserId(e.target.value)}
        className="px-3 py-2 border rounded text-sm min-w-[160px]"
        aria-label="사번으로 검색"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as StatusType | '')}
        className="px-3 py-2 border rounded text-sm min-w-[160px]"
        aria-label="상태별 필터링"
      >
        <option value="">전체 상태</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="px-3 py-2 border rounded text-sm min-w-[160px]"
        aria-label="날짜별 필터링"
      />

      <select
        value={bulkStatus}
        onChange={(e) => setBulkStatus(e.target.value as StatusType)}
        className="px-3 py-2 border rounded text-sm min-w-[180px]"
        aria-label="일괄 변경할 상태 선택"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}로 변경
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onBulkApply}
        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="선택된 항목들을 일괄 상태 변경"
      >
        ✅ 선택 항목 일괄 변경
      </button>
    </div>
  );
}