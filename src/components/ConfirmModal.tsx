import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConfirmModalProps {
  title?: string;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
  historyList?: any[];
}

export default function ConfirmModal({
  //onClose,
  onBack,
  onSubmit,
  historyList = []
}: ConfirmModalProps) {
  const [inputTitle, setInputTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleConfirm = () => {
    onSubmit({ title: inputTitle, description });
    navigate('/home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl transition-colors text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          📋 <span>신청 정보 입력</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">제목</label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="예: 백엔드 클러스터 요청"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">설명</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="요청 목적 또는 세부사항"
            />
          </div>
        </div>

        {historyList.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm">
            {historyList.map((entry, index) => (
              <li
                key={index}
                className="flex flex-col bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                <div><strong>승인자:</strong> {entry.by || '미지정'}</div>
                <div><strong>일시:</strong> {entry.timestamp || '알 수 없음'}</div>
                {entry.note && <div className="text-xs text-gray-500 mt-1">📝 {entry.note}</div>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            이전
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
