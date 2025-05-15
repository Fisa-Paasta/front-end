import React from 'react';

interface AdminSidebarProps {
  onFilter: (status: string, label: string) => void;
  active: string;
}

export default function AdminSidebar({ onFilter, active }: AdminSidebarProps) {
  const menuItems: { label: string; status: string }[] = [
    { label: '전체 요청', status: '' },
    { label: '승인 대기', status: '승인처리중' },
    { label: '구축 진행중', status: '구축중' },
    { label: '완료됨', status: '구축완료' },
    { label: '로그 보기', status: 'LOG_VIEW' } // ✅ 로그 보기 명시적 구분
  ];

  return (
    <aside className="w-64 bg-panel-light dark:bg-panel-dark p-6 border-r border-border-light dark:border-border-dark h-full space-y-6">
      <h2 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">🔧 관리자 메뉴</h2>
      <ul className="space-y-3 text-sm">
        {menuItems.map(({ label, status }) => (
          <li
            key={label}
            onClick={() => onFilter(status, label)}
            className={`cursor-pointer px-2 py-1 rounded transition-colors
              ${active === label ? 'bg-gray-200 dark:bg-gray-700 font-bold text-primary' : 'hover:text-primary'}`}
          >
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
}