import React from 'react';

export default function ConfirmModal({
  title = '제목 없음',
  onClose,
  onSubmit,
  historyList = []
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div
        className="bg-panel-light dark:bg-panel-dark rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors duration-500 text-foreground-light dark:text-foreground-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 제목 */}
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          🗂️ <span>{title || '제목 없음'}</span>
        </h2>

        {/* 승인 이력 */}
        {historyList.length === 0 ? (
          <div className="text-sm text-gray-400 flex items-center gap-2 mt-2">
            💬 승인 이력이 없습니다
          </div>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {historyList.map((entry, index) => (
              <li
                key={index}
                className="flex flex-col bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
              >
                <div><strong>승인자:</strong> {entry.by || '미지정'}</div>
                <div><strong>일시:</strong> {entry.timestamp || '알 수 없음'}</div>
                {entry.note && (
                  <div className="text-xs text-gray-500 mt-1">📝 {entry.note}</div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* 버튼 영역 */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            닫기
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
