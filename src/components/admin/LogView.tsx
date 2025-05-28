import { AdminCardData } from '@/types/admin';

interface LogViewProps {
  cards: AdminCardData[];
}

interface HistoryEntry {
  by?: string;
  timestamp?: string;
  note?: string;
}

interface LogItem {
  title: string;
  userId: string;
  by: string;
  timestamp: string;
  note: string;
}

export default function LogView({ cards }: LogViewProps) {
  const logs: LogItem[] = cards
    .flatMap((card): LogItem[] =>
      (card.historyList as HistoryEntry[] || []).map((log): LogItem => ({
        title: card.title,
        userId: card.userId || 'unknown',
        by: log.by || 'unknown',
        timestamp: log.timestamp || '',
        note: log.note || '',
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">📜 상태 변경 로그</h2>
      {logs.map((log, index) => (
        <div key={index} className="text-sm border-b border-border-light dark:border-border-dark pb-2">
          <p>
            <strong>{log.timestamp.split('T')[0]}</strong> - <span className="text-primary">{log.note}</span> by{' '}
            <span className="text-gray-700 dark:text-gray-300">{log.by}</span>
          </p>
          <p className="text-xs text-gray-500">[{log.userId}] {log.title}</p>
        </div>
      ))}
    </div>
  );
}
