import React from 'react';
import { AdminCardData, StatusType } from '@/types/admin';

interface AdminCardListProps {
  cards: AdminCardData[];
  onSelect: (card: AdminCardData, e: React.MouseEvent) => void;
  selectedIds: Set<string>; // 🔁 number → string
  onToggleSelect: (id: string) => void; // 🔁 number → string
  badgeColors: Record<StatusType, string>;
}

export default function AdminCardList({
  cards,
  onSelect,
  selectedIds,
  onToggleSelect,
  badgeColors
}: AdminCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((item) => {
        const isSelected = selectedIds.has(item.id); // ✅ id: string

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
                onToggleSelect(item.id); // ✅ string
              }}
              className="absolute top-2 right-2 w-5 h-5 accent-primary"
            />

            <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">
              👤 사번: {item.userId !== 'unknown' ? item.userId : '미입력'} <span className="ml-1 text-[11px] text-gray-500">#{item.id}</span>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">{item.date}</div>
            <div className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">{item.title}</div>
            <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">{item.desc}</div>
            <div className={`text-xs mt-1 inline-block px-2 py-1 rounded ${badgeColors[item.status]}`}>
              {item.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
