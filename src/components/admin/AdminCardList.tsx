// src/components/admin/AdminCardList.tsx
import React from 'react';
import { AdminCardData } from '@/types/admin';

interface AdminCardListProps {
  cards: AdminCardData[];
  onSelect: (card: AdminCardData, e: React.MouseEvent) => void;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
}


export default function AdminCardList({ cards, onSelect, selectedIds, onToggleSelect }: AdminCardListProps) {
  return (
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
            {/* 선택 체크박스 */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onToggleSelect(item.id);
              }}
              className="absolute top-2 right-2 w-5 h-5 accent-primary"
            />

            <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">{item.date}</div>
            <div className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">{item.title}</div>
            <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">{item.desc}</div>
            <div className="text-xs text-gray-500 mt-1">사번: {item.userId}</div>
            <div className="text-xs text-gray-500">상태: {item.status}</div>
          </div>
        );
      })}
    </div>
  );
}
