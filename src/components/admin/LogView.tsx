import { AdminCardData } from '@/types/admin';

interface LogViewProps {
  cards: AdminCardData[];
}

export default function LogView({ cards }: LogViewProps) {
  const logs = cards.flatMap(card =>
    (card.historyList || []).map((log) => ({
      title: card.title,
      userId: card.userId,
      ...log
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">📜 상태 변경 로그</h2>
      {logs.map((log, index) => (
        <div key={index} className="text-sm border-b border-border-light dark:border-border-dark pb-2">
          <p><strong>{log.timestamp}</strong> - <span className="text-primary">{log.status}</span> by <span className="text-gray-700 dark:text-gray-300">{log.approver || '시스템'}</span></p>
          <p className="text-xs text-gray-500">[{log.userId}] {log.title}</p>
          {log.comment && <p className="text-xs italic text-gray-400">"{log.comment}"</p>}
        </div>
      ))}
    </div>
  );
}
