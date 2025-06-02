import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Pencil } from 'lucide-react';
import { AdminCardData } from '@/types/admin';

interface ConfirmModalProps {
  title?: string;
  onClose: () => void;
  onSubmit?: (data: { title: string; description: string }) => void;
  historyList?: any[];
  readOnly?: boolean;
  viewType?: 'history' | 'application';
  item?: AdminCardData | null;
  onBack?: () => void;
}

export default function ConfirmModal({
  title = '신청 정보 입력',
  onClose,
  onSubmit,
  historyList = [],
  readOnly = false,
  viewType = 'history',
  item,
  onBack,
}: ConfirmModalProps) {
  const [inputTitle, setInputTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      
      // 포커스 관리
      const firstInteractive = dialog.querySelector('input, button') as HTMLElement;
      if (firstInteractive) {
        firstInteractive.focus();
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

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ title: inputTitle, description });
      navigate('/home');
    }
  };
  
  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
    onClose();
  };

  const handleBack = () => {
    if (onBack) {
      const dialog = dialogRef.current;
      if (dialog) {
        dialog.close();
      }
      onBack();
    }
  };

  const renderContent = () => {
    if (readOnly) {
      if (viewType === 'application' && item) {
        return (
          <main className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mt-4">
            <div><span className="font-semibold">제목:</span> {item.title}</div>
            <div><span className="font-semibold">설명:</span> {item.desc}</div>
            <div><span className="font-semibold">신청일:</span> {item.date}</div>
            <div><span className="font-semibold">상태:</span> {item.status}</div>
          </main>
        );
      }

      if (viewType === 'history' && historyList.length > 0) {
        return (
          <main className="mt-6" aria-labelledby="history-list-heading">
            <h3 id="history-list-heading" className="sr-only">승인 이력 목록</h3>
            <ul className="space-y-2 text-sm" role="log" aria-label="승인 이력">
              {historyList.map((entry, index) => (
                <li
                  key={`history-entry-${entry.timestamp ?? Date.now()}-${index}`}
                  className="flex flex-col bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  <div><strong>작성자:</strong> {entry.by ?? '미지정'}</div>
                  <div>
                    <strong>일시:</strong> 
                    <time dateTime={entry.timestamp}>
                      {entry.timestamp?.split('T')[0] ?? '알 수 없음'}
                    </time>
                  </div>
                  {entry.note && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Pencil className="w-3 h-3" aria-hidden="true" />
                      <span>{entry.note}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </main>
        );
      }

      return (
        <main className="mt-4">
          <p className="text-gray-500">표시할 내용이 없습니다.</p>
        </main>
      );
    }

    return (
      <main className="space-y-4">
        <div>
          <label htmlFor="title-input" className="block text-sm font-semibold mb-1">
            제목 <span className="text-red-500" aria-label="필수 입력">*</span>
          </label>
          <input
            id="title-input"
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="예: 백엔드 클러스터 요청"
            required
            aria-describedby="title-help"
          />
          <p id="title-help" className="text-xs text-gray-500 mt-1">
            신청하실 인프라의 제목을 입력해주세요.
          </p>
        </div>
        <div>
          <label htmlFor="description-input" className="block text-sm font-semibold mb-1">
            요청사항
          </label>
          <textarea
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="요청 또는 세부사항을 입력해주세요"
            rows={3}
            aria-describedby="description-help"
          />
          <p id="description-help" className="text-xs text-gray-500 mt-1">
            추가적인 요청사항이나 특별한 설정이 필요하시면 입력해주세요.
          </p>
        </div>
      </main>
    );
  };

  return (
    <dialog 
      ref={dialogRef}
      className="fixed inset-0 z-50 w-full h-full bg-black bg-opacity-60 flex items-center justify-center backdrop:bg-black/60"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ 
        padding: 0, 
        margin: 0, 
        maxWidth: '100vw', 
        maxHeight: '100vh',
        border: 'none',
        background: 'rgba(0, 0, 0, 0.6)'
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl transition-colors text-gray-900 dark:text-white">
        <header>
          <h2 id="modal-title" className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" aria-hidden="true" />
            <span>{title}</span>
          </h2>
          {!readOnly && (
            <p id="modal-description" className="sr-only">
              신청서 제출을 위한 제목과 요청사항을 입력하는 양식입니다.
            </p>
          )}
        </header>

        {renderContent()}

        <footer className="mt-6 flex justify-end space-x-2">
          {!readOnly && onBack && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              이전
            </button>
          )}
          <button
            type="button"
            onClick={readOnly ? handleClose : handleSubmit}
            disabled={!readOnly && (!inputTitle.trim() || !description.trim())}
            className="px-4 py-2 text-sm rounded-md bg-[#5A3EBA] text-white hover:bg-[#4932A0] disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {readOnly ? '확인' : '제출'}
          </button>
        </footer>
      </div>
    </dialog>
  );
}