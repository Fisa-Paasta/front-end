import { useState, useMemo, useRef, useEffect } from 'react';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import ConfirmModal from '../components/ConfirmModal';
import { useSubmitted, SubmittedCard } from '@/context/SubmittedContext';

import {
  Hourglass, CheckCircle, RefreshCcw, ShieldCheck, Hammer,
  PartyPopper, HelpCircle, Pin, FileText, CalendarDays
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

    return () => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
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
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop:bg-black/60"
        aria-labelledby="dashboard-detail-title"
        aria-describedby="dashboard-detail-description"
        onKeyDown={handleKeyDown}
      >
        <div className="relative bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-md shadow-2xl text-foreground-light dark:text-foreground-dark transition-colors duration-500">
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute -top-4 -right-4 z-10 bg-white dark:bg-panel-dark text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md w-9 h-9 flex items-center justify-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="대시보드 상세 정보 모달 닫기"
          >
            ✕
          </button>

          <header>
            {/* 상태 블럭 */}
            <div className={`${statusMeta.color} flex items-start gap-3 rounded-lg px-4 py-3 mb-6`}>
              <div className="w-6 h-6" aria-hidden="true">{statusMeta.icon}</div>
              <div className="flex-1">
                <p id="dashboard-detail-title" className="text-base font-bold leading-tight">{statusMeta.title}</p>
                <p id="dashboard-detail-description" className="text-sm mt-1">{statusMeta.description}</p>
              </div>
            </div>
          </header>

          <main>
            {/* 상세 정보 */}
            <section className="space-y-3 text-sm text-gray-600 dark:text-gray-300" aria-labelledby="detail-info-heading">
              <h2 id="detail-info-heading" className="sr-only">신청서 상세 정보</h2>
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-foreground-light dark:text-white" aria-hidden="true" />
                <span className="font-medium text-foreground-light dark:text-white">제목:</span>
                <span className="truncate">{latestItem.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-foreground-light dark:text-white" aria-hidden="true" />
                <span className="font-medium text-foreground-light dark:text-white">요청사항:</span>
                <span>{latestItem.desc}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-foreground-light dark:text-white" aria-hidden="true" />
                <span className="font-medium text-foreground-light dark:text-white">날짜:</span>
                <span>{latestItem.date}</span>
              </div>
            </section>

            {/* 액션 버튼 */}
            {renderAction() && (
              <section className="mt-6 border-t border-gray-700 pt-4" aria-labelledby="action-section-heading">
                <h2 id="action-section-heading" className="sr-only">사용 가능한 액션</h2>
                {renderAction()}
              </section>
            )}
          </main>
        </div>
      </dialog>

      {/* 승인 이력 모달 */}
      {showHistory && (
        <ConfirmModal
          title="승인 이력"
          onClose={() => setShowHistory(false)}
          viewType="history"
          readOnly
          historyList={latestItem.historyList as HistoryEntry[]}
        />
      )}

      {/* 신청서 상세 모달 */}
      {showDetailModal && selectedCard?.formDataSnapshot ? (
        <ApplicationDetailModal
          item={selectedCard}
          onClose={() => setShowDetailModal(false)}
        />
      ) : showDetailModal && (
        <ConfirmModal
          title="신청서 상세 정보 없음"
          readOnly
          onClose={() => setShowDetailModal(false)}
          viewType="application"
          item={selectedCard}
        />
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
      icon: <RefreshCcw className="w-5 h-5" />,
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