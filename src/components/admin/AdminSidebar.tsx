interface AdminSidebarProps {
  onFilter: (status: string, label: string) => void;
  active: string;
}

const statusClasses: Record<string, string> = {
  '접수중': 'bg-yellow-500 text-black',
  '접수완료': 'bg-green-600 text-white',
  '승인처리중': 'bg-blue-500 text-white',
  '승인완료': 'bg-blue-700 text-white',
  '구축중': 'bg-purple-500 text-white',
  '구축완료': 'bg-gray-500 text-white',
};

export default function AdminSidebar({ onFilter, active }: AdminSidebarProps) {
  const menuItems: { label: string; status: string }[] = [
    { label: '전체 요청', status: '' },
    { label: '접수중', status: '접수중' },
    { label: '접수완료', status: '접수완료' },
    { label: '승인 대기', status: '승인처리중' },
    { label: '승인완료', status: '승인완료' },
    { label: '구축 진행중', status: '구축중' },
    { label: '완료됨', status: '구축완료' },
    { label: '로그 보기', status: 'LOG_VIEW' }, // 명시적 로그 보기 구분
    { label: '삭제된 요청', status: '삭제됨' },
  ];

  return (
    <aside className="w-64 bg-panel-light dark:bg-panel-dark p-6 border-r border-border-light dark:border-border-dark h-full space-y-6">
      <h2 className="text-lg font-semibold text-foreground-light dark:text-foreground-dark">🔧 관리자 메뉴</h2>
      <ul className="space-y-3 text-sm">
        {menuItems.map(({ label, status }) => {
          const isActive = active === label;
          const statusClass = statusClasses[status] ?? '';
          return (
            <li
              key={label}
              onClick={() => onFilter(status, label)}
              className={`cursor-pointer px-2 py-1 rounded transition-colors 
                ${isActive ? `${statusClass} font-bold` : 'hover:text-primary'}`}
            >
              {label}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
