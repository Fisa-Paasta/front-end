import React, { useEffect, useState, useRef } from 'react';
import { AdminCardData, StatusType } from '../../types/admin';

interface AdminCardDetailProps {
  item: AdminCardData;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: StatusType) => Promise<void>;
}

const STATUS_OPTIONS: StatusType[] = [
  '접수중',
  '접수완료',
  '승인처리중',
  '승인완료',
  '구축중',
  '구축완료',
  '삭제됨',
];

const STATUS_COLORS: Record<StatusType, string> = {
  접수중: 'bg-yellow-500 text-black',
  접수완료: 'bg-green-600 text-white',
  승인처리중: 'bg-blue-500 text-white',
  승인완료: 'bg-blue-700 text-white',
  구축중: 'bg-purple-500 text-white',
  구축완료: 'bg-gray-500 text-white',
  삭제됨: 'bg-red-500 text-white',
};

export default function AdminCardDetail({
  item,
  onClose,
  onStatusChange
}: AdminCardDetailProps) {
  const [status, setStatus] = useState<StatusType>(item.status);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ✅ item.status가 변경될 때마다 로컬 상태도 업데이트
  useEffect(() => {
    setStatus(item.status);
  }, [item.status]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      
      // 포커스 관리
      const firstButton = dialog.querySelector('button, select');
      if (firstButton) {
        (firstButton as HTMLElement).focus();
      }
    }

    // ESC 키 핸들링을 위한 document 레벨 이벤트
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      if (dialog) {
        dialog.close();
      }
    };
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as StatusType;
    
    if (newStatus === status) return; // 같은 상태면 무시
    
    console.log(`🎯 모달에서 상태 변경 시도: ${item.id} ${status} → ${newStatus}`);
    
    setIsLoading(true);
    
    try {
      // ✅ 먼저 UI 상태 업데이트 (즉시 반영)
      setStatus(newStatus);
      
      // ✅ 부모 컴포넌트에 변경사항 전달 (서버 요청)
      await onStatusChange(item.id, newStatus);
      
      console.log(`✅ 모달 상태 변경 성공: ${item.id} → ${newStatus}`);
      
    } catch (error) {
      console.error('❌ 모달 상태 변경 실패:', error);
      
      // ✅ 실패 시 원래 상태로 롤백
      setStatus(item.status);
      
      // 사용자에게 에러 메시지 표시
      alert(`상태 변경에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
    onClose();
  };

  if (!item) return null;

  return (
    <dialog 
      ref={dialogRef}
      className="fixed inset-0 z-50 w-full h-full bg-black bg-opacity-60 flex items-center justify-center backdrop:bg-black/60"
      aria-labelledby="card-detail-title"
      aria-describedby="card-detail-description"
      style={{ 
        padding: 0, 
        margin: 0, 
        maxWidth: '100vw', 
        maxHeight: '100vh',
        border: 'none',
        background: 'rgba(0, 0, 0, 0.6)'
      }}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl text-gray-900 dark:text-white">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="모달 닫기"
          disabled={isLoading}
        >
          ×
        </button>

        <header className="mb-6">
          <h2 id="card-detail-title" className="text-xl font-bold mb-2 flex items-center gap-2">
            📋 요청 상세
          </h2>
          <p id="card-detail-description" className="sr-only">
            요청의 상세 정보를 확인하고 상태를 변경할 수 있습니다.
          </p>
        </header>
        
        <main className="space-y-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="font-semibold text-gray-700 dark:text-gray-300">제목:</span>
            <p className="mt-1 text-gray-900 dark:text-white">{item.title}</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="font-semibold text-gray-700 dark:text-gray-300">요청사항:</span>
            <p className="mt-1 text-gray-900 dark:text-white">{item.desc}</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="font-semibold text-gray-700 dark:text-gray-300">날짜:</span>
            <p className="mt-1 text-gray-900 dark:text-white">{item.date}</p>
          </div>
        </main>

        {/* 상태 변경 섹션 */}
        <section className="mb-6">
          <label htmlFor="status-select" className="block font-semibold mb-3 text-gray-900 dark:text-white">
            상태 변경
          </label>
          <select
            id="status-select"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-base"
            value={status}
            onChange={handleChange}
            disabled={isLoading}
            aria-label={`현재 상태: ${status}. 새로운 상태를 선택하세요.`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="py-2">
                {s}
              </option>
            ))}
          </select>
          
          {isLoading && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              {/* ✅ 소나큐브 수정: span 태그 사이 공백 제거 */}
              상태를 변경하는 중...
            </p>
          )}
        </section>

        {/* 현재 상태 표시 */}
        <div className={`mb-6 px-4 py-3 rounded-lg text-center font-semibold ${STATUS_COLORS[status]}`}>
          현재 상태: {status}
        </div>

        {/* 상태 변경 이력 */}
        {item.historyList && item.historyList.length > 0 && (
          <section className="mt-6 max-h-48 overflow-y-auto" aria-labelledby="history-heading">
            <h3 id="history-heading" className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              📜 상태 변경 이력
            </h3>
            <div className="space-y-2" role="log" aria-label="상태 변경 이력">
              {item.historyList.map((entry, idx) => (
                <div 
                  key={`history-${item.id}-${entry.timestamp ?? Date.now()}-${idx}`} 
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entry.by ?? '시스템'}
                    </span>
                    <time 
                      dateTime={entry.timestamp}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ''}
                    </time>
                  </div>
                  {entry.note && (
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {entry.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </dialog>
  );
}