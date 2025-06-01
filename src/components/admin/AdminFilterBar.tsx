// src/components/admin/AdminFilterBar.tsx
import { StatusType } from '@/types/admin';

interface AdminFilterBarProps {
  filterUserId: string;
  setFilterUserId: (value: string) => void;
  // ✅ 수정: string으로 변경 (빈 문자열 포함)
  filterStatus: string;
  setFilterStatus: (value: string) => void;
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
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterUserId(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value); // ✅ 단순 string으로 처리
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleBulkStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBulkStatus(e.target.value as StatusType);
  };

  const handleBulkApplyClick = () => {
    onBulkApply();
  };

  const handleBulkApplyKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onBulkApply();
    }
  };

  return (
    <section className="mb-6" aria-labelledby="filter-section-heading">
      <h2 id="filter-section-heading" className="sr-only">필터링 및 일괄 처리 옵션</h2>
      
      <div className="flex gap-4 items-center whitespace-nowrap overflow-x-auto" role="toolbar" aria-label="신청서 필터링 및 관리 도구">
        <div className="flex flex-col">
          <label htmlFor="user-id-filter" className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            사번 검색
          </label>
          <input
            id="user-id-filter"
            type="text"
            placeholder="사번을 입력하세요"
            value={filterUserId}
            onChange={handleUserIdChange}
            className="px-3 py-2 border rounded text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="user-id-filter-help"
          />
          <p id="user-id-filter-help" className="sr-only">
            사번으로 신청서를 검색할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="status-filter" className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            상태 필터
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 border rounded text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="status-filter-help"
          >
            <option value="">전체 상태</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p id="status-filter-help" className="sr-only">
            신청서를 상태별로 필터링할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="date-filter" className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            날짜 필터
          </label>
          <input
            id="date-filter"
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="px-3 py-2 border rounded text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="date-filter-help"
          />
          <p id="date-filter-help" className="sr-only">
            특정 날짜의 신청서만 표시할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="bulk-status-select" className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            일괄 변경
          </label>
          <select
            id="bulk-status-select"
            value={bulkStatus}
            onChange={handleBulkStatusChange}
            className="px-3 py-2 border rounded text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="bulk-status-help"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}로 변경
              </option>
            ))}
          </select>
          <p id="bulk-status-help" className="sr-only">
            선택된 신청서들을 일괄적으로 변경할 상태를 선택하세요.
          </p>
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={handleBulkApplyClick}
            onKeyDown={handleBulkApplyKeyDown}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary"
            aria-describedby="bulk-apply-help"
          >
            ✅ 선택 항목 일괄 변경
          </button>
          <p id="bulk-apply-help" className="sr-only">
            체크박스로 선택된 신청서들의 상태를 일괄 변경합니다.
          </p>
        </div>
      </div>
    </section>
  );
}