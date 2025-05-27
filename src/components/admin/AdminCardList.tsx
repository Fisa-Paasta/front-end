import React, { useState } from 'react';
import { AdminCardData, StatusType } from '@/types/admin';

interface AdminCardListProps {
  cards: AdminCardData[];
  onSelect: (card: AdminCardData, e: React.MouseEvent) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  badgeColors: Record<StatusType, string>;
  onDelete: (id: string, comment?: string) => void;
  onEdit: (id: string, newTitle: string, newDesc: string) => void;
}

export default function AdminCardList({
  cards,
  onSelect,
  selectedIds,
  onToggleSelect,
  badgeColors,
  onDelete,
  onEdit
}: AdminCardListProps) {
  const [modalOpenId, setModalOpenId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AdminCardData | null>(null);
  const [deleteComment, setDeleteComment] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item) => {
          const isSelected = selectedIds.has(item.id);

          return (
            <div
              key={item.id}
              className={`relative bg-panel-light dark:bg-panel-dark rounded-xl p-4 border cursor-pointer transition
                ${isSelected ? 'border-primary ring-2 ring-primary' : 'border-border-light dark:border-border-dark'}`}
              onClick={(e) => onSelect(item, e)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(item.id);
                }}
                className="absolute top-2 right-2 w-5 h-5 accent-primary"
              />

              <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">
                👤 사번: {item.userId !== 'unknown' ? item.userId : '미입력'}{' '}
                <span className="ml-1 text-[11px] text-gray-500">#{item.id}</span>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">{item.date}</div>
              <div className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">
                {item.title}
              </div>
              <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">{item.desc}</div>

              <div className="flex justify-between items-center mt-3">
                <div className={`text-xs inline-block px-2 py-1 rounded ${badgeColors[item.status]}`}>
                  {item.status}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTarget(item);
                      setEditTitle(item.title);
                      setEditDesc(item.desc);
                    }}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpenId(item.id);
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ 삭제 확인 모달 */}
      {modalOpenId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-96 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-center text-zinc-800 dark:text-white">
        해당 요청을 삭제하시겠습니까?
      </h3>
      <textarea
        value={deleteComment}
        onChange={(e) => setDeleteComment(e.target.value)}
        placeholder="삭제 사유를 입력하세요 (선택)"
        className="w-full mb-4 px-3 py-2 rounded border dark:bg-zinc-700 dark:text-white"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setModalOpenId(null);
            setDeleteComment('');
          }}
          className="px-4 py-2 text-sm rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          취소
        </button>
        <button
          onClick={() => {
            onDelete(modalOpenId, deleteComment);
            setModalOpenId(null);
            setDeleteComment('');
          }}
          className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
)}


      {/* ✅ 수정 모달 */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center text-zinc-800 dark:text-white">
              요청 수정
            </h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border dark:bg-zinc-700 dark:text-white"
              placeholder="제목"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border dark:bg-zinc-700 dark:text-white"
              placeholder="설명"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTarget(null)}
                className="px-4 py-2 text-sm rounded-md bg-gray-300 dark:bg-zinc-700 dark:text-white"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onEdit(editTarget.id, editTitle, editDesc);
                  setEditTarget(null);
                }}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
