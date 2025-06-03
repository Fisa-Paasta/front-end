import { useState, useMemo, useRef, useEffect } from 'react';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import { useSubmitted, SubmittedCard } from '@/context/SubmittedContext';

import {
  Hourglass, CheckCircle, RefreshCw, ShieldCheck, Hammer,
  PartyPopper, HelpCircle
} from 'lucide-react';

interface DashboardDetailProps {
  readonly item: SubmittedCard;
  readonly onClose: () => void;
}

interface HistoryEntry {
  by?: string;
  timestamp?: string;
  note?: string;
}

export default function DashboardDetail({ item, onClose }: DashboardDetailProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SubmittedCard | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { submittedCards } = useSubmitted();
  const latestItem = useMemo(
    () => submittedCards.find((card) => card.id === item.id) ?? item,
    [submittedCards, item.id]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      
      // 포커스 관리 - 첫 번째 버튼에 포커스
      const firstButton = dialog.querySelector('button');
      if (firstButton) {
        firstButton.focus();
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

  if (!latestItem) return null;

  const statusMeta = getStatusMeta(latestItem.status);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
    onClose();
  };

  // ✅ 고유 키 생성 함수
  const generateHistoryKey = (entry: HistoryEntry, index: number): string => {
    // timestamp가 있으면 timestamp + index 조합 사용
    if (entry.timestamp) {
      return `history-${entry.timestamp}-${index}`;
    }
    
    // timestamp가 없으면 by + note + index 조합 사용
    const by = entry.by ?? 'unknown';
    const note = entry.note ?? 'no-note';
    return `history-${by}-${note.slice(0, 10)}-${index}`;
  };

  const renderAction = () => {
    switch (item.status) {
      case '승인처리중':
        return (
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowHistory(true)}
          >
            승인 이력 보기
          </button>
        );
      case '승인완료':
      case '삭제됨':
        return (
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              item.status === '삭제됨'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            } text-white transition focus:outline-none focus:ring-2`}
            onClick={() => {
              setSelectedCard(latestItem);
              setShowDetailModal(true);
            }}
          >
            {item.status === '삭제됨' ? '삭제된 신청서 내역 보기' : '신청서 내역 보기'}
          </button>
        );
      case '구축중':
        return (
          <div>
            <label htmlFor="progress-bar" className="block text-sm font-medium mb-2">구축 진행률</label>
            <progress 
              id="progress-bar"
              className="w-full h-2" 
              value={70} 
              max={100}
              aria-label="구축 진행률 70%"
            >
              70%
            </progress>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">현재 70% 완료</p>
          </div>
        );
      case '구축완료':
        return (
          <a
            href="http://your-dashboard-url"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            대시보드 접속
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ✅ 메인 모달 - AdminCardDetail.tsx 스타일 참고 */}
      <div className="fixed inset-0 z-50 w-full h-full bg-black bg-opacity-60 flex items-center justify-center" style={{ 
        padding: 0, 
        margin: 0, 
        maxWidth: '100vw', 
        maxHeight: '100vh',
        border: 'none',
        background: 'rgba(0, 0, 0, 0.6)'
      }}>
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl text-gray-900 dark:text-white">
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="모달 닫기"
          >
            ×
          </button>

          <header className="mb-6">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              📋 신청서 상세
            </h2>
          </header>

          {/* 상태 블럭 */}
          <div className={`${statusMeta.color} flex items-start gap-3 rounded-lg px-4 py-4 mb-6`}>
            <div className="w-6 h-6" aria-hidden="true">{statusMeta.icon}</div>
            <div className="flex-1">
              <p className="text-lg font-bold leading-tight">{statusMeta.title}</p>
              <p className="text-sm mt-2">{statusMeta.description}</p>
            </div>
          </div>

          <main className="space-y-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">제목:</span>
              <p className="mt-1 text-gray-900 dark:text-white">{latestItem.title}</p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">요청사항:</span>
              <p className="mt-1 text-gray-900 dark:text-white">{latestItem.desc}</p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">날짜:</span>
              <p className="mt-1 text-gray-900 dark:text-white">{latestItem.date}</p>
            </div>
          </main>

          {/* 액션 버튼 */}
          {renderAction() && (
            <section className="mb-6" aria-labelledby="action-section-heading">
              <h2 id="action-section-heading" className="sr-only">사용 가능한 액션</h2>
              {renderAction()}
            </section>
          )}
        </div>
      </div>

      {/* ✅ 신청서 상세 모달 - z-70 (승인 이력보다 위) */}
      {showDetailModal && selectedCard?.formDataSnapshot && (
        <div className="fixed inset-0 z-[70] bg-black bg-opacity-80 flex items-center justify-center p-4">
          <ApplicationDetailModal
            item={selectedCard}
            onClose={() => setShowDetailModal(false)}
          />
        </div>
      )}

      {/* 승인 이력 모달 - z-60 (신청서 상세 모달보다 아래) */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl transition-colors text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">📜 승인 이력</h2>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xl focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                aria-label="승인 이력 모달 닫기"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(latestItem.historyList as HistoryEntry[] ?? []).length > 0 ? (
                (latestItem.historyList as HistoryEntry[] ?? []).map((entry, index) => (
                  <div key={generateHistoryKey(entry, index)} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{entry.by ?? '시스템'}</span>
                      <span className="text-xs text-gray-500">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : ''}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{entry.note}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  📭 아직 승인 이력이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const getStatusMeta = (status: string) => {
  const base = {
    '접수중': {
      icon: <Hourglass className="w-5 h-5" />,
      color: 'bg-yellow-500 text-black',
      title: '신청 접수 중',
      description: '현재 인프라 신청이 접수되어 대기 중입니다.',
    },
    '접수완료': {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-600 text-white',
      title: '접수 완료',
      description: '신청이 정상적으로 접수되었습니다.',
    },
    '승인처리중': {
      icon: <RefreshCw className="w-5 h-5" />,
      color: 'bg-blue-500 text-white',
      title: '승인 처리 중',
      description: '관리자가 요청을 검토 중입니다.',
    },
    '승인완료': {
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'bg-blue-700 text-white',
      title: '승인 완료',
      description: '승인이 완료되어 곧 구축이 시작됩니다.',
    },
    '구축중': {
      icon: <Hammer className="w-5 h-5" />,
      color: 'bg-purple-500 text-white',
      title: '구축 중',
      description: '인프라 자동화 작업이 실행 중입니다.',
    },
    '구축완료': {
      icon: <PartyPopper className="w-5 h-5" />,
      color: 'bg-gray-500 text-white',
      title: '구축 완료',
      description: '서비스 배포가 완료되었습니다.',
    },
    '삭제됨': {
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'bg-red-600 text-white',
      title: '삭제됨',
      description: '이 요청은 삭제 처리되었습니다.',
    },
  };

  return base[status as keyof typeof base] ?? {
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'bg-white text-black',
    title: '알 수 없음',
    description: '상태 정보가 없습니다.',
  };
};