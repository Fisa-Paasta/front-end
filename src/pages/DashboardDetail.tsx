import { useState, useMemo } from 'react';
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

  const { submittedCards } = useSubmitted();
  const latestItem = useMemo(
    () => submittedCards.find((card) => card.id === item.id) ?? item,
    [submittedCards, item.id]
  );

  if (!latestItem) return null;

  const statusMeta = getStatusMeta(latestItem.status);

  // ✅ backdrop click과 keyboard 이벤트를 dialog 요소에서 직접 처리
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ✅ keyboard 이벤트를 dialog 요소에서 직접 처리
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      onClose();
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
            <label htmlFor="progress-bar" className="sr-only">구축 진행률</label>
            <progress 
              id="progress-bar"
              className="w-full h-2" 
              value={70} 
              max={100}
              aria-label="구축 진행률 70%"
            >
              70%
            </progress>
          </div>
        );
      case '구축완료':
        return (
          <a
            href="http://your-dashboard-url"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline hover:text-blue-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            대시보드 접속
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
      aria-labelledby="dashboard-detail-title"
      onClick={handleDialogClick}
      onKeyDown={handleDialogKeyDown}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-md shadow-2xl text-foreground-light dark:text-foreground-dark transition-colors duration-500"
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 bg-white dark:bg-panel-dark text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full shadow-md w-9 h-9 flex items-center justify-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="모달 닫기"
        >
          ✕
        </button>

        {/* 상태 블럭 */}
        <div className={`${statusMeta.color} flex items-start gap-3 rounded-lg px-4 py-3 mb-6`}>
          <div className="w-6 h-6" aria-hidden="true">{statusMeta.icon}</div>
          <div className="flex-1">
            <p id="dashboard-detail-title" className="text-base font-bold leading-tight">{statusMeta.title}</p>
            <p className="text-sm mt-1">{statusMeta.description}</p>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
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
        </div>

        {/* 액션 버튼 */}
        {renderAction() && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            {renderAction()}
          </div>
        )}

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
      </div>
    </dialog>
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